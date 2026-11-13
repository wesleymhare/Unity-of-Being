import * as maplibregl from 'maplibre-gl';

/** The fields the label engine needs from a polity or civilization feature. */
export interface LabelProps {
  n: string;
  s: number;
  e: number;
  lx: number;
  ly: number;
  /** Free width at the anchor, degrees on a Mercator map. */
  cw?: number;
  /** Free height at the anchor, degrees on a Mercator map. */
  ch?: number;
  /** Size score: square root of the drawn area in degrees. */
  sz: number;
  /** Realm group (label only, never filled). */
  g?: number;
  k: number;
  /** Pixel offset of the label above or below its anchor, and an extra CSS class. */
  oy?: number;
  lcls?: string;
}

interface Placed {
  marker: maplibregl.Marker;
  el: HTMLDivElement;
  sig: string;
}

interface Layout {
  lines: string[];
  width: number;
  height: number;
}

const FONT_FAMILY = 'Georgia, "Times New Roman", serif';
const REALM_SPACING = 1.4;
const MIN_FONT = 10;

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

const measureCtx = document.createElement('canvas').getContext('2d');
const widthCache = new Map<string, number>();

function measure(text: string, font: number, realm: boolean): number {
  const key = `${realm ? 'r' : 'n'}|${font}|${text}`;
  const hit = widthCache.get(key);
  if (hit !== undefined) return hit;
  let width: number;
  if (measureCtx) {
    measureCtx.font = `700 ${font}px ${FONT_FAMILY}`;
    width = measureCtx.measureText(realm ? text.toUpperCase() : text).width;
  } else {
    width = text.length * font * 0.58;
  }
  if (realm) width += text.length * REALM_SPACING;
  if (widthCache.size > 20000) widthCache.clear();
  widthCache.set(key, width);
  return width;
}

/** Wrap into at most `maxLines` lines, as narrow as the words allow. */
function wrap(name: string, font: number, realm: boolean, maxLines: number): Layout {
  const words = name.split(/\s+/).filter(Boolean);
  const widths = words.map((word) => measure(word, font, realm));
  const space = measure(' ', font, realm);

  const greedy = (limit: number): string[] | null => {
    const lines: string[] = [];
    let line = '';
    let lineWidth = 0;
    for (let i = 0; i < words.length; i++) {
      const next = line ? lineWidth + space + widths[i] : widths[i];
      if (line && next > limit) {
        lines.push(line);
        if (lines.length >= maxLines) return null;
        line = words[i];
        lineWidth = widths[i];
      } else {
        line = line ? `${line} ${words[i]}` : words[i];
        lineWidth = next;
      }
    }
    lines.push(line);
    return lines.length <= maxLines ? lines : null;
  };

  const widest = Math.max(...widths);
  const total = widths.reduce((sum, w) => sum + w, 0) + space * (words.length - 1);
  let lo = widest;
  let hi = total;
  let best = greedy(hi) ?? [name];
  for (let i = 0; i < 12 && hi - lo > 1; i++) {
    const mid = (lo + hi) / 2;
    const attempt = greedy(mid);
    if (attempt) {
      best = attempt;
      hi = mid;
    } else {
      lo = mid;
    }
  }
  const width = Math.max(...best.map((line) => measure(line, font, realm)));
  return { lines: best, width: Math.ceil(width), height: Math.ceil(best.length * font * 1.18) };
}

function ellipsize(text: string, font: number, realm: boolean, limit: number): string {
  let value = text;
  while (value.length > 1 && measure(`${value}…`, font, realm) > limit) value = value.slice(0, -1);
  return `${value.trimEnd()}…`;
}

/**
 * HTML labels with collision handling. Each name is fitted inside its own
 * shape (using the free width and height computed when the data is built), so a
 * name that cannot fit stays hidden until the map is zoomed in far enough.
 */
export class LabelLayer<T extends LabelProps> {
  private readonly map: maplibregl.Map;
  private readonly onClick: (feature: T) => void;
  /** How far a name may overhang the free width and height of its shape (1 = stay inside). */
  private readonly slack: number;
  private all: T[] = [];
  private active: T[] = [];
  private year = 0;
  private selectedKey = -1;
  private readonly placed = new Map<number, Placed>();
  private raf = 0;
  private enabled = true;
  /** Labels stay hidden below this zoom. */
  minZoom = 0;
  /** Shapes smaller than this many pixels (square root of area) get no label unless selected. */
  minScore = 26;
  /** Hide individual labels (used to drop a polity's name once its provinces are labelled). */
  suppress: ((feature: T) => boolean) | null = null;

  constructor(map: maplibregl.Map, onClick: (feature: T) => void, slack = 1) {
    this.map = map;
    this.onClick = onClick;
    this.slack = slack;
  }

  setFeatures(features: T[]): void {
    this.all = features;
    this.refreshActive();
  }

  setYear(year: number, render = true): void {
    this.year = year;
    this.refreshActive();
    if (render && this.enabled) this.update();
  }

  setSelected(key: number): void {
    this.selectedKey = key;
    for (const [k, item] of this.placed) item.el.classList.toggle('selected', k === key);
  }

  clear(): void {
    for (const item of this.placed.values()) item.marker.remove();
    this.placed.clear();
  }

  /** A layer that is not on screen (another lens is active) never draws, even if a frame was already queued. */
  setEnabled(on: boolean): void {
    this.enabled = on;
    if (!on) {
      if (this.raf) cancelAnimationFrame(this.raf);
      this.raf = 0;
      this.clear();
    }
  }

  schedule(): void {
    if (!this.enabled || this.raf) return;
    this.raf = requestAnimationFrame(() => {
      this.raf = 0;
      this.update();
    });
  }

  private refreshActive(): void {
    const year = this.year;
    this.active = this.all.filter((f) => f.s <= year && f.e >= year);
  }

  update(): void {
    if (!this.enabled) {
      this.clear();
      return;
    }
    const canvas = this.map.getCanvas();
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (!this.active.length || !width || !height) {
      this.clear();
      return;
    }

    if (this.map.getZoom() < this.minZoom) {
      this.clear();
      return;
    }
    const ppd = (512 * Math.pow(2, this.map.getZoom())) / 360;
    const bounds = this.map.getBounds();
    const small = width < 720;
    const maxLabels = small ? 30 : 90;
    const margin = 14;

    interface Candidate { f: T; x: number; y: number; score: number; rank: number }
    const candidates: Candidate[] = [];
    for (const f of this.active) {
      if (!Number.isFinite(f.lx) || !Number.isFinite(f.ly) || !Number.isFinite(f.sz)) continue;
      if (this.suppress?.(f)) continue;
      const score = f.sz * ppd;
      const isSelected = f.k === this.selectedKey;
      if (score < this.minScore && !isSelected) continue;
      if (!bounds.contains([f.lx, f.ly])) continue;
      const point = this.map.project([f.lx, f.ly]);
      if (point.x < margin || point.x > width - margin || point.y < margin || point.y > height - margin) {
        continue;
      }
      candidates.push({
        f, x: point.x, y: point.y, score,
        rank: (isSelected ? 1e9 : 0) + score * (f.g ? 1.25 : 1),
      });
    }
    candidates.sort((a, b) => b.rank - a.rank);

    const boxes: { x: number; y: number; w: number; h: number }[] = [];
    const keep = new Set<number>();
    const names = new Set<string>();

    for (const c of candidates) {
      if (keep.size >= maxLabels) break;
      const { f } = c;
      const isSelected = f.k === this.selectedKey;
      if (names.has(f.n) && !isSelected) continue;

      const realm = !!f.g;
      const freeW = (f.cw ?? f.sz) * ppd * this.slack;
      const freeH = (f.ch ?? f.sz) * ppd * this.slack;
      const fontMax = clamp(8.5 + Math.log10(Math.max(10, c.score)) * (realm ? 3.1 : 2.8), 11, realm ? 21 : 19);

      // Try every font size and line count; prefer a bigger font, but pay a
      // small penalty per extra line so names stay on one or two lines.
      let layout: Layout | null = null;
      let font = 0;
      let bestScore = -Infinity;
      for (let size = Math.round(fontMax); size >= MIN_FONT; size--) {
        for (let lines = 1; lines <= 3; lines++) {
          const trial = wrap(f.n, size, realm, lines);
          if (trial.lines.length !== lines && lines > 1) continue;
          if (trial.width > freeW * 0.94 || trial.height > freeH * 0.9) continue;
          const score = size - 2.4 * (lines - 1);
          if (score > bestScore) {
            bestScore = score;
            layout = trial;
            font = size;
          }
        }
      }
      if (!layout) {
        if (!isSelected) continue;
        font = 12;
        const cap = Math.max(90, Math.min(220, freeW));
        layout = wrap(f.n, font, realm, 2);
        if (layout.width > cap) {
          layout = {
            lines: layout.lines.map((line) => ellipsize(line, font, realm, cap)),
            width: cap,
            height: layout.height,
          };
        }
      }

      const pad = 5;
      const box = {
        x: c.x - layout.width / 2 - pad,
        y: c.y + (f.oy ?? 0) - layout.height / 2 - pad,
        w: layout.width + pad * 2,
        h: layout.height + pad * 2,
      };
      const clash = boxes.some((o) => !(
        box.x + box.w < o.x || o.x + o.w < box.x || box.y + box.h < o.y || o.y + o.h < box.y
      ));
      if (clash && !isSelected) continue;

      boxes.push(box);
      keep.add(f.k);
      names.add(f.n);
      this.show(f, layout, font, realm);
    }

    for (const [key, item] of this.placed) {
      if (!keep.has(key)) {
        item.marker.remove();
        this.placed.delete(key);
      }
    }
  }

  private show(f: T, layout: Layout, font: number, realm: boolean): void {
    const sig = `${layout.lines.join('\n')}|${font}|${realm}`;
    const existing = this.placed.get(f.k);
    if (existing) {
      if (existing.sig !== sig) {
        existing.sig = sig;
        existing.el.textContent = layout.lines.join('\n');
        existing.el.style.fontSize = `${font}px`;
        existing.el.style.width = `${layout.width + 8}px`;
      }
      existing.el.classList.toggle('selected', f.k === this.selectedKey);
      return;
    }

    const el = document.createElement('div');
    el.className = (realm ? 'poly-label realm' : 'poly-label') + (f.lcls ? ` ${f.lcls}` : '');
    el.textContent = layout.lines.join('\n');
    el.title = f.n;
    el.style.fontSize = `${font}px`;
    el.style.width = `${layout.width + 8}px`;
    if (f.k === this.selectedKey) el.classList.add('selected');
    el.addEventListener('click', (event) => {
      event.stopPropagation();
      this.onClick(f);
    });
    const marker = new maplibregl.Marker({ element: el, anchor: 'center', offset: [0, f.oy ?? 0] })
      .setLngLat([f.lx, f.ly])
      .addTo(this.map);
    this.placed.set(f.k, { marker, el, sig });
  }
}
