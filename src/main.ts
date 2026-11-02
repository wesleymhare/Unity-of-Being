import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url';
import './style.css';
import {
  commonsFilePath,
  commonsPageForImage,
  commonsPageUrl,
  getSummary,
  getWikidata,
  searchArticles,
  wikiSearchUrl,
  wikiTitle,
  wikiUrl,
  type WikiFacts,
  type WikiSummary,
} from './wiki';

maplibregl.setWorkerUrl(workerUrl);

const BASE = import.meta.env.BASE_URL;
const MIN_YEAR = -3400;
const MAX_YEAR = 2024;

// Muted palette; each polity gets a stable colour from a hash of its name.
const PALETTE = [
  '#a9504d', '#c9a24a', '#7c9a62', '#6785a8', '#58a29d', '#9a6f9c', '#b8794a',
  '#7d8f4f', '#5d7ea3', '#b5646f', '#4f8f7a', '#a58a4f', '#8a6f5d', '#6c8fb0',
];

const hash = (value: string): number => {
  let h = 2166136261;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

interface Props {
  n: string;
  s: number;
  e: number;
  w: string;
  q: string;
  m: string;
  lx: number;
  ly: number;
  sz: number;
  c: string;
  k: number;
}

interface PolityFeature {
  type: string;
  geometry: unknown;
  properties: Props;
}

interface Polities {
  type: string;
  features: PolityFeature[];
}

interface LabelMarker {
  marker: maplibregl.Marker;
  el: HTMLDivElement;
  name: string;
  font: number;
}

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

const fmtYear = (value: number): string =>
  value < 0 ? `${-value} BCE` : `${value === 0 ? 1 : value} CE`;

const fmtRange = (start: number, end: number): string =>
  start === end ? fmtYear(start) : `${fmtYear(start)} – ${fmtYear(end)}`;

/** Strip the wrapping parentheses Cliopatria uses for descriptive names. */
const cleanName = (raw: string): string => {
  let name = raw.trim().replace(/\s+/g, ' ');
  if (name.startsWith('(') && name.endsWith(')')) name = name.slice(1, -1).trim();
  if (/^[a-z]/.test(name)) name = name[0].toUpperCase() + name.slice(1);
  return name || raw;
};

// ---- State from the URL hash ------------------------------------------------
const params = new URLSearchParams(location.hash.replace(/^#/, ''));
const num = (key: string, fallback: number): number => {
  const value = Number.parseFloat(params.get(key) ?? '');
  return Number.isFinite(value) ? value : fallback;
};
let year = clamp(Math.round(num('year', 150)), MIN_YEAR, MAX_YEAR);
let selectedKey = -1;
let selectedFeature: PolityFeature | null = null;

// ---- DOM --------------------------------------------------------------------
const $ = <T extends HTMLElement>(id: string): T => document.getElementById(id) as T;
const slider = $<HTMLInputElement>('year');
const yearLabel = $('year-label');
const playBtn = $<HTMLButtonElement>('play');
const speedSel = $<HTMLSelectElement>('speed');
const panel = $('panel');
const loading = $('loading');
const loadingText = $('loading-text');
const loadingProgress = $<HTMLElement>('loading-progress');

const pName = $('p-name');
const pYears = $('p-years');
const pSwatch = $('p-swatch');
const pSummary = $<HTMLParagraphElement>('p-summary');
const pFallback = $('p-fallback');
const pFacts = $<HTMLDListElement>('p-facts');
const pFigure = $('p-figure');
const pImage = $<HTMLImageElement>('p-image');
const pCaption = $('p-caption');
const pOsm = $('p-osm');
const pOsmFrame = $<HTMLIFrameElement>('p-osm-frame');
const pOsmLink = $<HTMLAnchorElement>('p-osm-link');
const pLink = $<HTMLAnchorElement>('p-link');
const pWdLink = $<HTMLAnchorElement>('p-wd-link');

slider.value = String(year);
yearLabel.textContent = fmtYear(year);

for (const tickYear of [-3000, -2000, -1000, 1, 1000, 2000]) {
  const tick = document.createElement('span');
  tick.textContent = fmtYear(tickYear);
  const percent = ((tickYear - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100;
  tick.style.left = `${percent}%`;
  if (percent < 3) tick.style.transform = 'none';
  if (percent > 97) tick.style.transform = 'translateX(-100%)';
  $('ticks').append(tick);
}

// ---- Map --------------------------------------------------------------------
const map = new maplibregl.Map({
  container: 'map',
  style: {
    version: 8,
    sources: {},
    layers: [{ id: 'sea', type: 'background', paint: { 'background-color': '#2f4756' } }],
  },
  center: [num('lng', 20), num('lat', 38)],
  zoom: num('z', 3),
  minZoom: 1,
  maxZoom: 9,
  dragRotate: false,
  attributionControl: false,
});
map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-left');
map.addControl(new maplibregl.ScaleControl({ maxWidth: 110, unit: 'metric' }), 'bottom-left');
map.touchZoomRotate.disableRotation();
map.on('error', (event) => console.error('Map error:', event.error));

// Keep the canvas in sync when the map container changes size (mobile panels,
// browser resize, and embedded previews do not always emit a window resize).
new ResizeObserver(() => {
  map.resize();
  scheduleLabels();
}).observe($('map'));

const yearFilter = (value: number): maplibregl.ExpressionSpecification => [
  'all', ['<=', ['get', 's'], value], ['>=', ['get', 'e'], value],
];
const highlightFilter = (
  value: number,
  key: number,
): maplibregl.ExpressionSpecification => [
  'all', yearFilter(value), ['==', ['get', 'k'], key],
];

let features: PolityFeature[] = [];
const markers = new Map<number, LabelMarker>();

// ---- Labels -----------------------------------------------------------------
const measureCanvas = document.createElement('canvas');
const measureCtx = measureCanvas.getContext('2d');

function textWidth(text: string, font: number): number {
  if (!measureCtx) return text.length * font * 0.56;
  measureCtx.font = `700 ${font}px Georgia, "Times New Roman", serif`;
  return measureCtx.measureText(text).width;
}

function truncate(text: string, font: number, maxWidth: number): string {
  let value = text;
  while (value.length > 1 && textWidth(`${value}…`, font) > maxWidth) {
    value = value.slice(0, -1);
  }
  return `${value.trimEnd()}…`;
}

function layoutLabel(
  name: string,
  font: number,
  maxWidth: number,
): { text: string; width: number; height: number } {
  const words = name.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = '';
  let index = 0;

  while (index < words.length && lines.length < 2) {
    const word = words[index];
    const trial = line ? `${line} ${word}` : word;
    if (line && textWidth(trial, font) > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = trial;
    }
    index++;
  }
  if (lines.length < 2 && line) lines.push(line);

  if (lines.length === 2 && index < words.length) {
    lines[1] = truncate(lines[1], font, maxWidth);
  }
  for (let i = 0; i < lines.length; i++) {
    if (textWidth(lines[i], font) > maxWidth) lines[i] = truncate(lines[i], font, maxWidth);
  }

  const width = Math.min(
    maxWidth,
    Math.max(1, ...lines.map((value) => textWidth(value, font))),
  );
  return {
    text: lines.join('\n'),
    width: Math.ceil(width),
    height: Math.ceil(lines.length * font * 1.16),
  };
}

let labelRaf = 0;
function scheduleLabels(): void {
  if (labelRaf) return;
  labelRaf = requestAnimationFrame(() => {
    labelRaf = 0;
    updateLabels();
  });
}

function updateLabels(): void {
  if (!features.length) return;
  const canvas = map.getCanvas();
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  if (!width || !height) return;

  const zoom = map.getZoom();
  const pxPerDegree = (512 * Math.pow(2, zoom)) / 360;
  const bounds = map.getBounds();
  const maxLabels = width < 720 ? 32 : 80;
  const maxWidth = width < 720 ? 132 : 184;

  const candidates: { feature: PolityFeature; x: number; y: number; score: number }[] = [];
  for (const feature of features) {
    const p = feature.properties;
    if (p.s > year || p.e < year) continue;
    const score = p.sz * pxPerDegree;
    if (score < 16) continue;
    if (!bounds.contains([p.lx, p.ly])) continue;
    const point = map.project([p.lx, p.ly]);
    if (point.x < 48 || point.x > width - 48 || point.y < 16 || point.y > height - 16) continue;
    candidates.push({ feature, x: point.x, y: point.y, score });
  }

  candidates.sort((a, b) => b.score - a.score);
  const selected = candidates.find((item) => item.feature.properties.k === selectedKey);
  if (selected) {
    candidates.splice(candidates.indexOf(selected), 1);
    candidates.unshift(selected);
  }

  const placed: { x: number; y: number; w: number; h: number }[] = [];
  const keep = new Set<number>();

  for (const candidate of candidates) {
    if (keep.size >= maxLabels) break;
    const p = candidate.feature.properties;
    const name = cleanName(p.n);
    const font = clamp(9 + Math.log10(Math.max(1, candidate.score)) * 2.1, 11, 16);
    const layout = layoutLabel(name, font, maxWidth);
    const box = {
      x: candidate.x - (layout.width + 10) / 2,
      y: candidate.y - (layout.height + 4) / 2,
      w: layout.width + 10,
      h: layout.height + 4,
    };
    const collides = placed.some((other) => !(
      box.x + box.w < other.x ||
      other.x + other.w < box.x ||
      box.y + box.h < other.y ||
      other.y + other.h < box.y
    ));
    if (collides) continue;

    placed.push(box);
    keep.add(p.k);

    const existing = markers.get(p.k);
    if (existing) {
      if (existing.name !== name || existing.font !== font) {
        existing.name = name;
        existing.font = font;
        existing.el.textContent = layout.text;
        existing.el.style.fontSize = `${font}px`;
        existing.el.style.maxWidth = `${maxWidth}px`;
      }
      existing.el.title = p.n;
      existing.el.classList.toggle('selected', p.k === selectedKey);
      continue;
    }

    const el = document.createElement('div');
    el.className = 'poly-label';
    el.textContent = layout.text;
    el.title = p.n;
    el.style.fontSize = `${font}px`;
    el.style.maxWidth = `${maxWidth}px`;
    if (p.k === selectedKey) el.classList.add('selected');
    el.addEventListener('click', (event) => {
      event.stopPropagation();
      openPanel(p);
    });

    const marker = new maplibregl.Marker({ element: el, anchor: 'center' })
      .setLngLat([p.lx, p.ly])
      .addTo(map);
    markers.set(p.k, { marker, el, name, font });
  }

  for (const [key, item] of markers) {
    if (!keep.has(key)) {
      item.marker.remove();
      markers.delete(key);
    }
  }
}

// ---- Hash -------------------------------------------------------------------
let hashTimer = 0;
function writeHash(): void {
  const center = map.getCenter();
  history.replaceState(
    null,
    '',
    `#year=${year}&lng=${center.lng.toFixed(2)}&lat=${center.lat.toFixed(2)}` +
      `&z=${map.getZoom().toFixed(2)}`,
  );
}
function scheduleHash(): void {
  if (hashTimer) window.clearTimeout(hashTimer);
  hashTimer = window.setTimeout(writeHash, 350);
}

// ---- Year -------------------------------------------------------------------
let yearRaf = 0;
function setYear(next: number): void {
  year = clamp(Math.round(next), MIN_YEAR, MAX_YEAR);

  if (selectedFeature) {
    const p = selectedFeature.properties;
    if (p.s > year || p.e < year) closePanel();
  }

  if (yearRaf) return;
  yearRaf = requestAnimationFrame(() => {
    yearRaf = 0;
    slider.value = String(year);
    yearLabel.textContent = fmtYear(year);
    if (map.getLayer('polity-fill')) {
      for (const id of ['polity-fill', 'polity-line', 'polity-casing']) {
        map.setFilter(id, yearFilter(year));
      }
    }
    if (map.getLayer('polity-hl')) {
      map.setFilter(
        'polity-hl',
        selectedKey >= 0 ? highlightFilter(year, selectedKey) : ['==', ['get', 'k'], -1],
      );
    }
    updateLabels();
    scheduleHash();
  });
}

// ---- Panel ------------------------------------------------------------------
let panelTicket = 0;
let panelAbort: AbortController | null = null;

function showImage(
  name: string,
  source: string,
  pageUrl: string | null,
  credit: string,
): void {
  pImage.onerror = () => {
    pFigure.hidden = true;
  };
  pImage.src = source;
  pImage.alt = `Image related to ${name}`;
  pCaption.replaceChildren();
  pCaption.append(document.createTextNode('Image: '));
  if (pageUrl) {
    const link = document.createElement('a');
    link.href = pageUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = credit;
    pCaption.append(link);
  } else {
    pCaption.append(document.createTextNode(credit));
  }
  pFigure.hidden = false;
}

function renderSummary(name: string, summary: WikiSummary): void {
  pSummary.classList.remove('muted', 'error');
  pSummary.textContent = summary.extract;
  pLink.href = summary.url;
  pLink.textContent = 'Read on Wikipedia';
  pLink.title = summary.title;

  const image = summary.thumbnail?.source ?? summary.originalimage?.source;
  if (image) {
    showImage(name, image, commonsPageForImage(image), 'Wikimedia Commons');
  }
}

function renderFacts(facts: WikiFacts): void {
  pFacts.replaceChildren();
  for (const fact of facts.facts) {
    const dt = document.createElement('dt');
    dt.textContent = fact.label;
    const dd = document.createElement('dd');
    dd.textContent = fact.value;
    pFacts.append(dt, dd);
  }
  pFacts.hidden = facts.facts.length === 0;

  pWdLink.hidden = false;
  pWdLink.href = `https://www.wikidata.org/wiki/${facts.qid}`;

  if (pFigure.hidden && facts.image) {
    showImage(
      cleanName(currentName),
      commonsFilePath(facts.image, 720),
      commonsPageUrl(facts.image),
      'Wikimedia Commons',
    );
  }
}

function renderFallback(
  name: string,
  hits: { title: string; snippet: string }[],
): void {
  pSummary.classList.remove('error');
  pSummary.classList.add('muted');
  pSummary.textContent = hits.length
    ? 'No single Wikipedia article matches this polity. Closest matches are below.'
    : 'No single Wikipedia article matches this polity.';

  pFallback.replaceChildren();
  if (hits.length) {
    const intro = document.createElement('p');
    intro.textContent = 'Closest articles:';
    pFallback.append(intro);

    const list = document.createElement('ul');
    for (const hit of hits) {
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = wikiUrl(hit.title);
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = hit.title;
      item.append(link);
      if (hit.snippet) {
        const snippet = document.createElement('span');
        snippet.className = 'snippet';
        snippet.textContent = hit.snippet;
        item.append(snippet);
      }
      list.append(item);
    }
    pFallback.append(list);
    pFallback.hidden = false;
  }

  pLink.href = wikiSearchUrl(name);
  pLink.textContent = 'Search Wikipedia';
}

function renderOsm(p: Props): void {
  if (!Number.isFinite(p.lx) || !Number.isFinite(p.ly)) return;
  const span = clamp(p.sz * 1.15, 1.2, 24);
  const west = p.lx - span;
  const east = p.lx + span;
  const south = clamp(p.ly - span * 0.72, -85, 85);
  const north = clamp(p.ly + span * 0.72, -85, 85);
  const bbox = `${west},${south},${east},${north}`;
  const zoom = span < 4 ? 6 : span < 10 ? 4 : 3;

  pOsmFrame.src =
    `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}` +
    `&layer=mapnik&marker=${p.ly},${p.lx}`;
  pOsmFrame.title = `Modern location of ${cleanName(p.n)} on OpenStreetMap`;
  pOsmLink.href =
    `https://www.openstreetmap.org/?mlat=${p.ly}&mlon=${p.lx}#map=${zoom}/${p.ly}/${p.lx}`;
  pOsm.hidden = false;
}

let currentName = '';

async function loadPanel(
  rawTitle: string | null,
  qid: string | null,
  name: string,
  ticket: number,
  signal: AbortSignal,
): Promise<void> {
  try {
    const factsPromise = qid ? getWikidata(qid, signal) : Promise.resolve(null);
    let summary = rawTitle ? await getSummary(rawTitle, signal) : null;
    if (ticket !== panelTicket) return;

    if (summary) {
      renderSummary(name, summary);
      const facts = await factsPromise;
      if (ticket !== panelTicket) return;
      if (facts) renderFacts(facts);
      return;
    }

    const facts = await factsPromise;
    if (ticket !== panelTicket) return;

    if (facts?.enwikiTitle && facts.enwikiTitle !== rawTitle) {
      summary = await getSummary(facts.enwikiTitle, signal);
      if (ticket !== panelTicket) return;
      if (summary) {
        renderSummary(name, summary);
        renderFacts(facts);
        return;
      }
    }

    if (facts) renderFacts(facts);
    const hits = await searchArticles(name, signal);
    if (ticket !== panelTicket) return;
    renderFallback(name, hits);
  } catch (error) {
    if (ticket !== panelTicket) return;
    if (error instanceof DOMException && error.name === 'AbortError') return;
    console.error(error);
    pSummary.classList.remove('muted');
    pSummary.classList.add('error');
    pSummary.textContent = 'Could not reach Wikipedia. You can still search for this polity.';
    pFallback.hidden = true;
    pLink.href = wikiSearchUrl(name);
    pLink.textContent = 'Search Wikipedia';
  }
}

function updateSelection(): void {
  for (const [key, item] of markers) {
    item.el.classList.toggle('selected', key === selectedKey);
  }
}

function openPanel(p: Props): void {
  const name = cleanName(p.n);
  const rawTitle = wikiTitle(p.w);
  const qid = /^Q\d+$/.test(p.q) ? p.q : null;

  currentName = p.n;
  selectedKey = p.k;
  selectedFeature = features[p.k] ?? null;
  panelTicket++;
  panelAbort?.abort();
  const controller = new AbortController();
  panelAbort = controller;
  const ticket = panelTicket;

  pName.textContent = name;
  pName.title = name;
  pYears.textContent = fmtRange(p.s, p.e);
  pSwatch.style.background = p.c;
  pSummary.textContent = 'Loading Wikipedia…';
  pSummary.classList.remove('muted', 'error');
  pFallback.hidden = true;
  pFallback.replaceChildren();
  pFacts.hidden = true;
  pFacts.replaceChildren();
  pFigure.hidden = true;
  pImage.removeAttribute('src');
  pCaption.textContent = '';
  pOsm.hidden = true;
  pOsmFrame.src = 'about:blank';
  pOsmLink.href = '#';
  pWdLink.hidden = true;
  pLink.href = wikiSearchUrl(name);
  pLink.textContent = 'Search Wikipedia';
  pLink.title = '';

  panel.hidden = false;
  panel.scrollTop = 0;
  requestAnimationFrame(() => {
    if (panelTicket === ticket) panel.scrollTop = 0;
  });
  document.title = `${name} · Unity of Being`;

  if (map.getLayer('polity-hl')) {
    map.setFilter('polity-hl', highlightFilter(year, selectedKey));
  }
  updateSelection();
  renderOsm(p);
  void loadPanel(rawTitle, qid, name, ticket, controller.signal);
}

function closePanel(): void {
  if (panel.hidden) return;
  panelTicket++;
  panelAbort?.abort();
  panelAbort = null;
  panel.hidden = true;
  pOsmFrame.src = 'about:blank';
  selectedKey = -1;
  selectedFeature = null;
  if (map.getLayer('polity-hl')) {
    map.setFilter('polity-hl', ['==', ['get', 'k'], -1]);
  }
  document.title = 'Unity of Being';
  updateSelection();
}

$('panel-close').addEventListener('click', closePanel);
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !panel.hidden) closePanel();
});

// ---- Timeline controls ------------------------------------------------------
slider.addEventListener('input', () => setYear(Number(slider.value)));

let playing = false;
let lastTime = 0;
let fractionalYear = 0;

function stopPlaying(): void {
  playing = false;
  playBtn.textContent = '▶';
  playBtn.setAttribute('aria-label', 'Play');
  writeHash();
}

function tick(time: number): void {
  if (!playing) return;
  const delta = Math.min(0.12, (time - lastTime) / 1000);
  lastTime = time;
  fractionalYear += Number(speedSel.value) * delta;
  if (fractionalYear >= MAX_YEAR) {
    setYear(MAX_YEAR);
    stopPlaying();
    return;
  }
  setYear(fractionalYear);
  requestAnimationFrame(tick);
}

playBtn.addEventListener('click', () => {
  if (playing) {
    stopPlaying();
    return;
  }
  if (year >= MAX_YEAR) setYear(MIN_YEAR);
  playing = true;
  fractionalYear = year;
  lastTime = performance.now();
  playBtn.textContent = '❚❚';
  playBtn.setAttribute('aria-label', 'Pause');
  requestAnimationFrame(tick);
});

// ---- Data -------------------------------------------------------------------
async function getJson(
  url: string,
  onProgress?: (loaded: number, total: number) => void,
): Promise<any> {
  const response = await fetch(url);
  if (!response.ok || !response.body) throw new Error(`${url}: ${response.status}`);
  const total = Number(response.headers.get('content-length') ?? 0);
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let loaded = 0;

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    loaded += value.length;
    onProgress?.(loaded, total);
  }

  return JSON.parse(await new Blob(chunks as BlobPart[]).text()) as unknown;
}

let loadingDone = false;
function finishLoading(): void {
  if (loadingDone || !map.isSourceLoaded('polities')) return;
  loadingDone = true;
  loading.classList.add('hide');
  window.setTimeout(() => {
    loading.hidden = true;
  }, 260);
}
function failLoading(message: string): void {
  loadingText.textContent = message;
  loading.classList.add('error');
  loadingProgress.style.width = '0%';
}

function checkSources(): void {
  if (map.isSourceLoaded('polities') && map.isSourceLoaded('land')) finishLoading();
}

map.on('load', async () => {
  try {
    const [land, polities, rivers, lakes] = await Promise.all([
      getJson(`${BASE}data/land.geojson`),
      getJson(`${BASE}data/polities.geojson`, (loaded, total) => {
        const megabytes = loaded / 1048576;
        const percent = total > 0 ? Math.min(100, (loaded / total) * 100) : 0;
        loadingText.textContent = total > 0
          ? `Downloading borders… ${Math.round(percent)}%`
          : `Downloading borders… ${megabytes.toFixed(1)} MB`;
        if (total > 0) loadingProgress.style.width = `${percent}%`;
        if (total > 0 && loaded >= total) {
          loadingText.textContent = 'Building map…';
          loadingProgress.style.width = '100%';
        }
      }),
      getJson(`${BASE}data/rivers.geojson`).catch(() => null),
      getJson(`${BASE}data/lakes.geojson`).catch(() => null),
    ]);

    loadingText.textContent = 'Building map…';
    loadingProgress.style.width = '100%';

    const data = polities as Polities;
    features = data.features;
    features.forEach((feature, index) => {
      feature.properties.k = index;
      feature.properties.c = PALETTE[hash(feature.properties.n) % PALETTE.length];
    });

    map.on('sourcedata', checkSources);

    map.addSource('land', { type: 'geojson', data: land });
    map.addSource('polities', { type: 'geojson', data: polities });
    map.addLayer({
      id: 'land-fill',
      type: 'fill',
      source: 'land',
      paint: { 'fill-color': '#d8cba7', 'fill-opacity': 0.96 },
    });
    map.addLayer({
      id: 'polity-fill',
      type: 'fill',
      source: 'polities',
      filter: yearFilter(year),
      paint: { 'fill-color': ['get', 'c'], 'fill-opacity': 0.82 },
    });
    map.addLayer({
      id: 'land-coast',
      type: 'line',
      source: 'land',
      paint: {
        'line-color': '#6f5f3d',
        'line-width': ['interpolate', ['linear'], ['zoom'], 1, 0.5, 9, 1.5],
        'line-opacity': 0.75,
      },
    });
    if (lakes) {
      map.addSource('lakes', { type: 'geojson', data: lakes });
      map.addLayer({
        id: 'lake-fill',
        type: 'fill',
        source: 'lakes',
        paint: { 'fill-color': '#35505f', 'fill-opacity': 0.95 },
      });
      map.addLayer({
        id: 'lake-line',
        type: 'line',
        source: 'lakes',
        paint: {
          'line-color': '#6f5f3d',
          'line-width': 0.6,
          'line-opacity': 0.6,
        },
      });
    }
    if (rivers) {
      map.addSource('rivers', { type: 'geojson', data: rivers });
      map.addLayer({
        id: 'river-line',
        type: 'line',
        source: 'rivers',
        paint: {
          'line-color': '#6f9ab0',
          'line-width': ['interpolate', ['linear'], ['zoom'], 1, 0.4, 5, 0.8, 9, 1.5],
          'line-opacity': 0.48,
        },
      });
    }
    map.addLayer({
      id: 'polity-casing',
      type: 'line',
      source: 'polities',
      filter: yearFilter(year),
      paint: {
        'line-color': '#201811',
        'line-width': ['interpolate', ['linear'], ['zoom'], 1, 1.2, 4, 1.8, 9, 3],
        'line-opacity': 0.42,
      },
      layout: { 'line-join': 'round', 'line-cap': 'round' },
    });
    map.addLayer({
      id: 'polity-line',
      type: 'line',
      source: 'polities',
      filter: yearFilter(year),
      paint: {
        'line-color': '#2a2118',
        'line-width': ['interpolate', ['linear'], ['zoom'], 1, 0.45, 4, 0.8, 9, 1.6],
        'line-opacity': 0.8,
      },
      layout: { 'line-join': 'round', 'line-cap': 'round' },
    });
    map.addLayer({
      id: 'polity-hl',
      type: 'line',
      source: 'polities',
      filter: ['==', ['get', 'k'], -1],
      paint: {
        'line-color': '#f6e7b8',
        'line-width': 2.4,
        'line-opacity': 0.95,
      },
      layout: { 'line-join': 'round' },
    });

    map.on('click', (event) => {
      const hits = map.queryRenderedFeatures(event.point, { layers: ['polity-fill'] });
      if (!hits.length) {
        closePanel();
        return;
      }
      const properties = hits[hits.length - 1].properties as unknown as Props;
      if (typeof properties.k === 'number') openPanel(properties);
    });
    map.on('mousemove', 'polity-fill', () => {
      map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'polity-fill', () => {
      map.getCanvas().style.cursor = '';
    });
    map.on('moveend', () => {
      scheduleLabels();
      scheduleHash();
    });
    map.on('zoomend', () => {
      scheduleLabels();
      scheduleHash();
    });
    map.on('resize', scheduleLabels);

    setYear(year);
    scheduleLabels();
    checkSources();
    map.once('idle', finishLoading);
    window.setTimeout(() => {
      if (!loadingDone && !map.isSourceLoaded('polities')) {
        loadingText.textContent = 'Still building the map…';
      }
    }, 20000);
  } catch (error) {
    console.error(error);
    failLoading(`Could not load map data (${(error as Error).message}). Please reload.`);
  }
});