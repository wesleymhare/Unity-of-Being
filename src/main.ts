import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url';
import './style.css';
import { BiomeModel, CLASSES, GROUPS, climateShift, type EcoMeta, type EcoPatch } from './biomes';
import { LabelLayer, type LabelProps } from './labels';
import {
  getArticlePhoto,
  getInfobox,
  getLeaderHistory,
  getSubdivisions,
  getSummary,
  getWikidata,
  imageAtYear,
  leadersAtYear,
  looksLikeMap,
  subdivisionsAtYear,
  commonsFilePath,
  commonsPageForImage,
  commonsPageUrl,
  type InfoboxSection,
  type Subdivision,
  searchArticles,
  wikiSearchUrl,
  wikiTitle,
  wikiUrl,
  type Leader,
  type WikiFact,
  type WikiFacts,
  type WikiSummary,
} from './wiki';

maplibregl.setWorkerUrl(workerUrl);

const BASE = import.meta.env.BASE_URL;
/** Zoom at which local civilization identities (level 3) fade in. */
const LOCAL_ZOOM = 3.6;
/** Hub label keys start here; network keys are small indexes. */
const SOC_HUB_K = 10_000;
const MIN_YEAR = -3400;
const MAX_YEAR = 2026;

/** Properties of one polity, realm group or civilization (see data/*.py). */
interface Props extends LabelProps {
  w: string;
  q: string;
  /** Realm this polity belongs to. */
  m?: string;
  /** Colour. */
  c: string;
  /** Realm-level outline. */
  r?: number;
  /** Civilizations: what kind of community, its languages, and its family group. */
  kind?: string;
  fam?: string;
  fg?: string;
  /** Civilizations: level (1 broad sphere, 2 people, 3 local identity), lineage id, one-line note. */
  lv?: number;
  ln?: string;
  nt?: string;
  /** Provinces: parent polity name, its Wikidata id, and the era the province list describes. */
  p?: string;
  pq?: string;
  era?: string;
  /** Societies: the network a hub label belongs to, and its main hubs as text. */
  ent?: number;
  hubs?: string;
  /** Societies: the sphere or group a network belongs to (sets its colour). */
  grp?: string;
}

interface MapFeature {
  type: string;
  geometry: unknown;
  properties: Props;
}

interface SocietyData {
  type: string;
  features: MapFeature[];
  entities: Props[];
  labels: Props[];
  groups: Record<string, string>;
  kinds: Record<string, string>;
}

interface FeatureCollection {
  type: string;
  features: MapFeature[];
}

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

const fmtYear = (value: number): string =>
  value < 0 ? `${-value} BCE` : `${value === 0 ? 1 : value} CE`;

const fmtRange = (start: number, end: number): string =>
  start === end ? fmtYear(start) : `${fmtYear(start)} – ${fmtYear(end)}`;

/** Societies symbols: crossed swords (frontier or conflict) and a handshake (trade or syncretism). */
const MARK_SVG = {
  c: '<svg class="mk" viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4 19 18M19 4 5 18M14.4 17.6l4.2-4.2M9.6 17.6 5.4 13.4"/></g></svg>',
  x: '<svg class="mk" viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M2 7.5h4v9H2zM18 7.5h4v9h-4zM6 9l5-1.5 3 1.5 4-.5M6 15l4 2.5 2-1.5 2 1.5 4-2.5M10 12l2 1.5M12.5 11.5l1.8 1.5"/></g></svg>',
};

function svgImage(svg: string, size: number): Promise<HTMLImageElement> {
  const text = svg
    .replace('class="mk"', `xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"`)
    .replace(/currentColor/g, '#ffffff');
  const img = new Image(size, size);
  return new Promise((resolve, reject) => {
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(text)}`;
  });
}

const signed = (value: number): string =>
  `${value < 0 ? '−' : '+'}${Math.abs(value).toFixed(1)}`;

// ---- State from the URL hash ------------------------------------------------
type Lens = 'polities' | 'civilizations' | 'societies' | 'biomes';
const LENSES: Lens[] = ['polities', 'civilizations', 'societies', 'biomes'];

const params = new URLSearchParams(location.hash.replace(/^#/, ''));
const num = (key: string, fallback: number): number => {
  const value = Number.parseFloat(params.get(key) ?? '');
  return Number.isFinite(value) ? value : fallback;
};
let year = clamp(Math.round(num('year', 150)), MIN_YEAR, MAX_YEAR);
const requestedLens = params.get('lens') as Lens | null;
let activeLens: Lens = requestedLens && LENSES.includes(requestedLens) ? requestedLens : 'polities';
let selectedKey = -1;
let selectedProps: Props | null = null;

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
const mapVeil = $('map-veil');
const mapVeilText = $('map-veil-text');
const eraNote = $('era-note');
const legend = $('legend');
const legendTitle = $('legend-title');
const legendBody = $('legend-body');
const legendToggle = $<HTMLButtonElement>('legend-toggle');

const pName = $('p-name');
const pYears = $('p-years');
const pNote = $('p-note');
const pOthers = $('p-others');
const pOthersList = $('p-others-list');
const pOthersHead = $('p-others-head');
const pLineage = $('p-lineage');
const pLineageList = $<HTMLOListElement>('p-lineage-list');
const pKind = $('p-kind');
const pSource = $('p-source');
const pFine = $('p-fine');
const pSwatch = $('p-swatch');
const pLeaders = $('p-leaders');
const pLeadersHead = $('p-leaders-head');
const pLeadersList = $<HTMLUListElement>('p-leaders-list');
const pLeadersHistory = $('p-leaders-history');
const pLeadersHistoryList = $<HTMLOListElement>('p-leaders-history-list');
const pSummary = $<HTMLParagraphElement>('p-summary');
const pFallback = $('p-fallback');
const pFigure = $('p-figure');
const pImage = $<HTMLImageElement>('p-image');
const pFigureKind = $('p-figure-kind');
const pFigureLink = $<HTMLAnchorElement>('p-figure-link');
const pInfobox = $('p-infobox');
const pSubs = $('p-subs');
const pFacts = $<HTMLDListElement>('p-facts');
const pOsm = $('p-osm');
const pOsmFrame = $<HTMLIFrameElement>('p-osm-frame');
const pOsmLink = $<HTMLAnchorElement>('p-osm-link');
const pLink = $<HTMLAnchorElement>('p-link');
const pWdLink = $<HTMLAnchorElement>('p-wd-link');
const helpBtn = $<HTMLButtonElement>('help-btn');
const helpBox = $('help');
const lensButtons = [...document.querySelectorAll<HTMLButtonElement>('.lens-btn')];

function setHelp(open: boolean): void {
  helpBox.hidden = !open;
  helpBtn.setAttribute('aria-expanded', String(open));
}
helpBtn.addEventListener('click', (event) => {
  event.stopPropagation();
  if (helpBox.hidden) $('soon').hidden = true;
  setHelp(helpBox.hidden === true);
});
$('help-close').addEventListener('click', () => setHelp(false));

// Placeholders for planned features: deep time, tile view (Tier 2) and edit mode.
const SOON: Record<string, { title: string; body: string }> = {
  deep: {
    title: 'Deep time: Earth before civilization',
    body: 'A planned view for everything before 3400 BCE: drifting continents, ice ages and sea level, the spread of life and the first humans, on a slider that reaches back millions of years.',
  },
  tiles: {
    title: 'Tile view (Tier 2)',
    body: 'A planned zoom from the political map down to terrain and tiles for the place and year you are looking at: relief, settlements and, later, tile and hex dioramas.',
  },
  edit: {
    title: 'Edit mode: worldbuilding',
    body: 'A planned mode for drawing and changing polities, civilizations, societies and biomes, keeping your own timelines and, later, sharing them.',
  },
};
const soonBox = $('soon');
const soonButtons = [...document.querySelectorAll<HTMLButtonElement>('.soon-btn')];
function setSoon(key: string | null): void {
  const entry = key ? SOON[key] : null;
  soonBox.hidden = !entry;
  for (const button of soonButtons) button.setAttribute('aria-pressed', String(button.dataset.soon === key));
  if (!entry) return;
  $('soon-title').textContent = entry.title;
  $('soon-body').textContent = entry.body;
  setHelp(false);
}
for (const button of soonButtons) {
  button.addEventListener('click', (event) => {
    event.stopPropagation();
    setSoon(button.getAttribute('aria-pressed') === 'true' ? null : (button.dataset.soon ?? null));
  });
}
$('soon-close').addEventListener('click', () => setSoon(null));
document.addEventListener('click', (event) => {
  if (!soonBox.hidden && !soonBox.contains(event.target as Node)) setSoon(null);
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !soonBox.hidden) setSoon(null);
});
document.addEventListener('click', (event) => {
  if (!helpBox.hidden && !helpBox.contains(event.target as Node)) setHelp(false);
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !helpBox.hidden) setHelp(false);
});

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
if (import.meta.env.DEV) {
  Object.assign(window, { __map: map, __biome: () => biomeModel });
}

// Keep the canvas in sync when the map container changes size (mobile panels,
// browser resize, and embedded previews do not always emit a window resize).
new ResizeObserver(() => {
  map.resize();
  activeLabels()?.schedule();
}).observe($('map'));

type Filter = maplibregl.ExpressionSpecification;
type GeoData = maplibregl.GeoJSONSourceSpecification['data'];

const yearFilter = (value: number): Filter => [
  'all', ['<=', ['get', 's'], value], ['>=', ['get', 'e'], value],
];
/** Shapes that are filled: everything except label-only realm groups. */
const leafFilter = (value: number): Filter => ['all', yearFilter(value), ['!', ['has', 'g']]];
/** Outlines of realms: groups and polities that are not part of a realm. */
const realmFilter = (value: number): Filter => ['all', yearFilter(value), ['has', 'r']];
const highlightFilter = (value: number, key: number): Filter => [
  'all', yearFilter(value), ['==', ['get', 'k'], key],
];
/** Lakes may carry their own years (the Aral Sea shrank, Lake Texcoco was drained). */
const lakeFilter = (value: number): Filter => [
  'all',
  ['<=', ['coalesce', ['get', 's'], -9999], value],
  ['>=', ['coalesce', ['get', 'e'], 9999], value],
];

/** Opacity that is `full` everywhere, except local identities (level 3), which fade in with zoom. */
const localFade = (full: number): maplibregl.ExpressionSpecification => [
  'interpolate', ['linear'], ['zoom'],
  LOCAL_ZOOM - 0.6, ['case', ['==', ['get', 'lv'], 3], 0, full],
  LOCAL_ZOOM + 0.4, full,
];
const NO_FEATURE: Filter = ['==', ['get', 'k'], -1];

/** Societies: kinds switched off in the legend (kind name), and the colour of each kind. */
const hiddenKinds = new Set<string>();
let socKinds: Record<string, string> = {};
/** Year, element type and the legend's hidden kinds, as one filter. */
const socFilter = (value: number, type: string, ...extra: Filter[]): Filter => {
  const hidden = [...hiddenKinds].map((kind) => socKinds[kind]).filter(Boolean);
  return [
    'all', yearFilter(value), ['==', ['get', 't'], type], ...extra,
    ...(hidden.length ? [['!', ['in', ['get', 'c'], ['literal', hidden]]] as Filter] : []),
  ];
};

const YEAR_FILTERS: Record<string, (value: number) => Filter> = {
  'lake-fill': lakeFilter,
  'lake-line': lakeFilter,
  'polity-fill': leafFilter,
  'polity-line': leafFilter,
  'polity-realm-casing': realmFilter,
  'polity-realm-line': realmFilter,
  'sub-fill': (value) => ['all', yearFilter(value), ['!', ['has', 'bd']]],
  'sub-line': (value) => ['all', yearFilter(value), ['has', 'bd']],
  'civilization-fill': yearFilter,
  'civilization-casing': yearFilter,
  'civilization-line': yearFilter,
  'soc-zone-fill': (value) => socFilter(value, 'z'),
  'soc-zone-line': (value) => socFilter(value, 'z'),
  'soc-route-casing': (value) => socFilter(value, 'r'),
  'soc-route': (value) => socFilter(value, 'r', ['!', ['has', 'sea']]),
  'soc-route-sea': (value) => socFilter(value, 'r', ['has', 'sea']),
  'soc-node': (value) => socFilter(value, 'n'),
  'soc-mark-badge': (value) => socFilter(value, 'm'),
  'soc-mark': (value) => socFilter(value, 'm'),
};

const LENS_LAYERS: Record<Lens, string[]> = {
  polities: ['polity-fill', 'polity-line', 'polity-realm-casing', 'polity-realm-line', 'polity-hl', 'sub-fill', 'sub-line', 'sub-hl'],
  civilizations: ['civilization-fill', 'civilization-casing', 'civilization-line', 'civilization-hl'],
  societies: ['soc-zone-fill', 'soc-zone-line', 'soc-route-casing', 'soc-route', 'soc-route-sea', 'soc-node', 'soc-mark-badge', 'soc-mark', 'soc-hl-route', 'soc-hl-zone', 'soc-hl-node'],
  biomes: ['biome-raster', 'eco-lines', 'ocean-mask'],
};

const fillLayerOf = (lens: Lens): string | null =>
  lens === 'polities' ? 'polity-fill' : lens === 'civilizations' ? 'civilization-fill' : null;
const highlightLayerOf = (lens: Lens): string | null =>
  lens === 'polities' ? 'polity-hl' : lens === 'civilizations' ? 'civilization-hl' : null;

/** Province shapes carry keys from here up, so they never clash with polity keys. */
const SUB_K = 1_000_000;
/** From this zoom, internal borders and province names replace the parent polity's name. */
const SUB_ZOOM = 3.4;
let subProps: Props[] = [];
let subParents = new Set<string>();
let polityProps: Props[] = [];
let civilizationProps: Props[] = [];
/** Societies: one record per network, and the label items (titles and hubs). */
let societyProps: Props[] = [];
let biomeModel: BiomeModel | null = null;

const polityLabels = new LabelLayer<Props>(map, (p) => {
  // A polity with provinces lists them.
  overlapSet = [p, ...subProps.filter((item) => item.p === p.n && activeAt(item))].slice(0, 60);
  openPanel(p);
});
const activeAt = (item: Props): boolean => item.s <= year && item.e >= year;
const subLabels = new LabelLayer<Props>(map, (p) => {
  // Offer the parent polity next to the province.
  overlapSet = [p, ...polityProps.filter((item) => item.n === p.p && !item.g && activeAt(item)).slice(0, 1)];
  openPanel(p);
}, 1);
subLabels.minZoom = SUB_ZOOM;
polityLabels.suppress = (f) => map.getZoom() >= SUB_ZOOM && subParents.has(f.n);
const civilizationLabels = new LabelLayer<Props>(map, (p) => {
  const stack = standingAt(p.lx, p.ly, year);
  overlapSet = stack.some((item) => item.k === p.k) ? stack : [p, ...stack];
  openPanel(p);
});
const societyLabels = new LabelLayer<Props>(map, (p) => {
  const entity = societyProps[p.ent ?? p.k];
  if (!entity) return;
  // A hub shared by several networks lists them all.
  const stack = p.k >= SOC_HUB_K
    ? societyProps.filter((item) => item.s <= year && item.e >= year && item.hubs?.split(', ').includes(p.n))
    : [entity];
  overlapSet = [entity, ...stack.filter((item) => item.k !== entity.k)];
  openPanel(entity);
}, 3);
societyLabels.suppress = (f) => [...hiddenKinds].some((kind) => socKinds[kind] === f.c);
// Ecoregion patches are often thin strips with long names, so let names overhang them.
const biomeLabels = new LabelLayer<EcoPatch>(map, (patch) => openBiomePanel(patch.lx, patch.ly), 2.2);

function activeLabels(): { schedule(): void } | null {
  if (activeLens === 'polities') {
    return { schedule: () => { polityLabels.schedule(); subLabels.schedule(); } };
  }
  if (activeLens === 'civilizations') return civilizationLabels;
  if (activeLens === 'societies') return societyLabels;
  return biomeLabels;
}

function lensProps(lens: Lens): Props[] {
  return lens === 'polities' ? polityProps : lens === 'civilizations' ? civilizationProps : lens === 'societies' ? societyProps : [];
}

// ---- Hash -------------------------------------------------------------------
let hashTimer = 0;
function writeHash(): void {
  const center = map.getCenter();
  history.replaceState(
    null,
    '',
    `#year=${year}&lng=${center.lng.toFixed(2)}&lat=${center.lat.toFixed(2)}` +
      `&z=${map.getZoom().toFixed(2)}&lens=${activeLens}`,
  );
}
function scheduleHash(): void {
  if (hashTimer) window.clearTimeout(hashTimer);
  hashTimer = window.setTimeout(writeHash, 350);
}

// ---- Legend -----------------------------------------------------------------
function renderEraNote(): void {
  eraNote.hidden = activeLens !== 'biomes';
  if (activeLens !== 'biomes') return;
  const shift = climateShift(year);
  eraNote.textContent =
    `${shift.era}.${shift.events.length ? ` ${shift.events.join('; ')}.` : ''} Rough regional model, not a reconstruction.`;
}

function renderLegend(): void {
  renderEraNote();
  legendBody.replaceChildren();
  if (activeLens !== 'civilizations' && activeLens !== 'societies') {
    legend.hidden = true;
    return;
  }
  legend.hidden = false;

  if (activeLens === 'societies') {
    legendTitle.textContent = 'Spheres and groups · click to filter';
    const present = new Map<string, { colour: string; count: number }>();
    for (const p of societyProps) {
      if (p.s > year || p.e < year || !p.grp) continue;
      const entry = present.get(p.grp);
      if (entry) entry.count++;
      else present.set(p.grp, { colour: p.c, count: 1 });
    }
    // Hidden groups stay listed (dimmed) even when none is active this year.
    for (const kind of hiddenKinds) if (!present.has(kind)) present.set(kind, { colour: socKinds[kind] ?? '#888', count: 0 });
    for (const [name, { colour, count }] of [...present].sort((a, b) => b[1].count - a[1].count || a[0].localeCompare(b[0]))) {
      const row = document.createElement('button');
      row.type = 'button';
      row.className = 'legend-row legend-pick' + (hiddenKinds.has(name) ? ' off' : '');
      row.setAttribute('aria-pressed', String(!hiddenKinds.has(name)));
      const chip = document.createElement('i');
      chip.style.background = colour;
      const label = document.createElement('span');
      label.textContent = name;
      const total = document.createElement('em');
      total.textContent = String(count);
      row.append(chip, label, total);
      row.addEventListener('click', () => toggleKind(name));
      legendBody.append(row);
    }
    if (hiddenKinds.size) {
      const all = document.createElement('button');
      all.type = 'button';
      all.className = 'legend-all';
      all.textContent = 'Show all groups';
      all.addEventListener('click', () => {
        hiddenKinds.clear();
        applySocietyKinds();
      });
      legendBody.append(all);
    }
    if (!present.size) legendBody.textContent = 'No networks are mapped for this year.';
    const key = document.createElement('div');
    key.className = 'legend-key';
    key.innerHTML =
      '<span><i class="k-line"></i>logistical route</span>' +
      '<span><i class="k-dot"></i>hub</span>' +
      `<span>${MARK_SVG.c}frontier or conflict</span>` +
      `<span>${MARK_SVG.x}trade or syncretism</span>`;
    legendBody.append(key);
    return;
  }

  if (activeLens === 'civilizations') {
    legendTitle.textContent = 'Language family or sphere';
    const present = new Map<string, { colour: string; count: number }>();
    for (const p of civilizationProps) {
      if (p.s > year || p.e < year || !p.fg) continue;
      const entry = present.get(p.fg);
      if (entry) entry.count++;
      else present.set(p.fg, { colour: p.c, count: 1 });
    }
    for (const [name, { colour, count }] of [...present].sort((a, b) => b[1].count - a[1].count)) {
      const row = document.createElement('div');
      row.className = 'legend-row';
      const chip = document.createElement('i');
      chip.style.background = colour;
      const label = document.createElement('span');
      label.textContent = name;
      const total = document.createElement('em');
      total.textContent = String(count);
      row.append(chip, label, total);
      legendBody.append(row);
    }
    if (!present.size) legendBody.textContent = 'No civilizations are mapped for this year.';
  }
}

function toggleKind(kind: string): void {
  if (hiddenKinds.has(kind)) hiddenKinds.delete(kind);
  else hiddenKinds.add(kind);
  applySocietyKinds();
}

/** Re-filter the Societies layers and labels after the legend changes. */
function applySocietyKinds(): void {
  for (const id of Object.keys(YEAR_FILTERS)) {
    if (id.startsWith('soc-') && map.getLayer(id)) map.setFilter(id, YEAR_FILTERS[id](year));
  }
  societyLabels.setYear(year, true);
  renderLegend();
}

legendToggle.addEventListener('click', () => {
  const collapsed = legend.classList.toggle('collapsed');
  legendToggle.setAttribute('aria-expanded', String(!collapsed));
  legendToggle.textContent = collapsed ? '+' : '–';
});
if (window.innerWidth < 760) {
  legend.classList.add('collapsed');
  legendToggle.setAttribute('aria-expanded', 'false');
  legendToggle.textContent = '+';
}

// ---- Year -------------------------------------------------------------------
let yearRaf = 0;
let lastYearApply = 0;
const YEAR_APPLY_MS = 70;
function setYear(next: number): void {
  year = clamp(Math.round(next), MIN_YEAR, MAX_YEAR);

  if (selectedProps && (selectedProps.s > year || selectedProps.e < year)) {
    // A province keeps its identity across the shape-runs it is stored in; follow it.
    const sel = selectedProps;
    const next = sel.k >= SUB_K
      ? subProps.find((item) => item.n === sel.n && item.p === sel.p && item.s <= year && item.e >= year)
      : undefined;
    if (next) openPanel(next);
    else closePanel();
  }

  if (yearRaf) return;
  // Re-filtering the big layers is heavy, so while the year is being dragged or played, apply at most
  // every YEAR_APPLY_MS; the last value always lands because the work reads `year` when it runs.
  const wait = Math.max(0, YEAR_APPLY_MS - (performance.now() - lastYearApply));
  const start = (): void => {
    yearRaf = requestAnimationFrame(applyYear);
  };
  const applyYear = (): void => {
    lastYearApply = performance.now();
    yearRaf = 0;
    slider.value = String(year);
    yearLabel.textContent = fmtYear(year);

    for (const [id, make] of Object.entries(YEAR_FILTERS)) {
      if (map.getLayer(id)) map.setFilter(id, make(year));
    }
    setHighlight(selectedKey >= 0 ? selectedProps : null);

    if (activeLens === 'biomes') renderBiomes();
    subParents = new Set(subProps.filter((item) => item.s <= year && item.e >= year).map((item) => item.p as string));
    polityLabels.setYear(year, activeLens === 'polities');
    subLabels.setYear(year, activeLens === 'polities');
    civilizationLabels.setYear(year, activeLens === 'civilizations');
    societyLabels.setYear(year, activeLens === 'societies');
    renderLegend();
    if (activeLens === 'biomes' && !panel.hidden && biomePoint) scheduleBiomePanel();
    if (!panel.hidden && panelQid && activeLens === 'polities') scheduleLeaderRefresh();
    scheduleHash();
  };
  if (wait > 0) yearRaf = window.setTimeout(start, wait);
  else start();
}

let biomeLabelTimer = 0;
function scheduleBiomeLabels(delay = 220): void {
  if (biomeLabelTimer) window.clearTimeout(biomeLabelTimer);
  biomeLabelTimer = window.setTimeout(() => {
    biomeLabelTimer = 0;
    if (!biomeModel || activeLens !== 'biomes') return;
    biomeLabels.setFeatures(biomeModel.patches());
    biomeLabels.setYear(year, true);
  }, delay);
}

/** Recompute the shifted climate for the year; redraw and relabel only if it changed. */
function renderBiomes(force = false): void {
  if (!biomeModel) return;
  const source = map.getSource('biome') as maplibregl.ImageSource | undefined;
  if (!source) return;
  const changed = biomeModel.update(year);
  if (changed) {
    biomeModel.draw();
    source.updateImage({ image: biomeModel.canvas });
  }
  if (changed || force) scheduleBiomeLabels(force ? 0 : 220);
}

// ---- Panel ------------------------------------------------------------------
let panelTicket = 0;
let panelAbort: AbortController | null = null;
let panelQid: string | null = null;
let leaderAbort: AbortController | null = null;
let leaderTimer = 0;

function renderSummary(summary: WikiSummary): void {
  pSummary.classList.remove('muted', 'error');
  pSummary.textContent = summary.extract;
  pLink.href = summary.url;
  pLink.textContent = 'Read on Wikipedia';
  pLink.title = summary.title;
}

function renderFacts(facts: WikiFacts | null, extraFacts: WikiFact[] = []): void {
  const rows = [...extraFacts, ...(facts?.facts ?? [])];
  pFacts.replaceChildren();
  for (const fact of rows) {
    const dt = document.createElement('dt');
    dt.textContent = fact.label;
    const dd = document.createElement('dd');
    dd.textContent = fact.value;
    pFacts.append(dt, dd);
  }
  pFacts.hidden = rows.length === 0;

  pWdLink.hidden = !facts;
  if (facts) pWdLink.href = `https://www.wikidata.org/wiki/${facts.qid}`;
}

function renderFallback(name: string, hits: { title: string; snippet: string }[]): void {
  pSummary.classList.remove('error');
  pSummary.classList.add('muted');
  const label = activeLens === 'civilizations' ? 'civilization' : activeLens === 'biomes' ? 'ecoregion' : 'polity';
  pSummary.textContent = hits.length
    ? `No single Wikipedia article matches this ${label}. Closest matches are below.`
    : `No single Wikipedia article matches this ${label}.`;

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

function renderOsm(lng: number, lat: number, span: number, label: string): void {
  if (!Number.isFinite(lng) || !Number.isFinite(lat)) return;
  const half = clamp(span * 1.15, 1.2, 24);
  const west = lng - half;
  const east = lng + half;
  const south = clamp(lat - half * 0.72, -85, 85);
  const north = clamp(lat + half * 0.72, -85, 85);
  const bbox = `${west},${south},${east},${north}`;
  const zoom = half < 4 ? 6 : half < 10 ? 4 : 3;

  pOsmFrame.src =
    `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}` +
    `&layer=mapnik&marker=${lat},${lng}`;
  pOsmFrame.title = `Modern location of ${label} on OpenStreetMap`;
  pOsmLink.href = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=${zoom}/${lat}/${lng}`;
  pOsm.hidden = false;
}

function fmtReign(leader: Leader): string {
  const start = fmtYear(leader.start);
  return leader.end === undefined ? `from ${start}` : `${start} – ${fmtYear(leader.end)}`;
}

function leaderKey(leader: Leader): string {
  return `${leader.name}|${leader.office ?? ''}|${leader.start}`;
}

function renderLeaders(leaders: Leader[], panelYear: number, history: Leader[]): void {
  pLeadersList.replaceChildren();
  pLeadersHistoryList.replaceChildren();
  pLeadersHistory.hidden = true;

  if (leaders.length) {
    pLeadersHead.textContent =
      `${leaders.length === 1 ? 'Ruler' : 'Rulers'} in ${fmtYear(panelYear)}`;
    for (const leader of leaders) {
      const item = document.createElement('li');
      const name = document.createElement('strong');
      name.textContent = leader.name;
      const meta = document.createElement('span');
      meta.textContent = [leader.office, `r. ${fmtReign(leader)}`].filter(Boolean).join(' · ');
      item.append(name, meta);
      pLeadersList.append(item);
    }
  } else {
    pLeadersHead.textContent = `Reigns around ${fmtYear(panelYear)}`;
  }

  const dated = history
    .filter((leader) => leader.end !== undefined)
    .sort((a, b) => a.start - b.start || a.name.localeCompare(b.name));
  if (dated.length) {
    const currentKeys = new Set(leaders.map(leaderKey));
    let index = dated.findIndex((leader) => currentKeys.has(leaderKey(leader)));
    if (index < 0) {
      index = dated.findIndex((leader) => leader.start > panelYear);
      if (index < 0) index = dated.length - 1;
    }
    const first = Math.max(0, index - 2);
    for (const leader of dated.slice(first, first + 6)) {
      const item = document.createElement('li');
      if (currentKeys.has(leaderKey(leader))) item.classList.add('current');
      const name = document.createElement('span');
      name.className = 'ruler-name';
      name.textContent = leader.name;
      const years = document.createElement('span');
      years.className = 'ruler-years';
      years.textContent = fmtReign(leader);
      item.append(name, years);
      pLeadersHistoryList.append(item);
    }
    pLeadersHistory.hidden = false;
  }

  pLeaders.hidden = !leaders.length && pLeadersHistory.hidden;
}

async function loadLeaders(qid: string, panelYear: number, ticket: number): Promise<void> {
  if (activeLens !== 'polities' || ticket !== panelTicket) {
    pLeaders.hidden = true;
    return;
  }
  leaderAbort?.abort();
  const controller = new AbortController();
  leaderAbort = controller;
  try {
    const history = await getLeaderHistory(qid, controller.signal);
    if (ticket !== panelTicket || controller.signal.aborted) return;
    renderLeaders(leadersAtYear(history, panelYear), panelYear, history);
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') return;
    console.error(error);
    if (ticket === panelTicket) pLeaders.hidden = true;
  }
}

function scheduleLeaderRefresh(): void {
  if (!panelQid || panel.hidden || activeLens !== 'polities') return;
  applyPolityFlag();
  renderSubdivisions();
  const ticket = panelTicket;
  const qid = panelQid;
  if (leaderTimer) window.clearTimeout(leaderTimer);
  leaderTimer = window.setTimeout(() => {
    if (ticket === panelTicket) void loadLeaders(qid, year, ticket);
  }, 220);
}

// ---- Panel figure, infobox, subdivisions ---------------------------------------
let panelFacts: WikiFacts | null = null;
let panelSubs: Subdivision[] = [];

function hideFigure(): void {
  pFigure.hidden = true;
  pImage.removeAttribute('src');
}

function showFigure(src: string, kind: 'flag' | 'photo', label: string, page: string | null, alt: string): void {
  pFigure.className = `figure ${kind}`;
  pImage.onerror = hideFigure;
  pImage.alt = alt;
  pImage.src = src;
  pFigureKind.textContent = label;
  pFigureLink.hidden = !page;
  if (page) pFigureLink.href = page;
  pFigure.hidden = false;
}

/** Polities get a flag (or coat of arms) for the year, not Wikipedia's map thumbnail. */
function applyPolityFlag(): void {
  const facts = panelFacts;
  if (!facts) return;
  const flag = imageAtYear(facts.flags, year);
  const arms = flag ? undefined : imageAtYear(facts.arms, year);
  const file = flag ?? arms;
  if (!file) {
    hideFigure();
    return;
  }
  showFigure(commonsFilePath(file, 480), 'flag', flag ? 'Flag' : 'Coat of arms', commonsPageUrl(file), `${pName.textContent ?? ''} ${flag ? 'flag' : 'coat of arms'}`);
}

function applyArticleImage(summary: WikiSummary | null, facts: WikiFacts | null): void {
  panelFacts = facts;
  if (activeLens === 'biomes') return;
  if (activeLens === 'polities' && !(selectedProps && selectedProps.k >= SUB_K)) {
    applyPolityFlag();
    return;
  }
  const thumb = summary?.thumbnail?.source;
  if (thumb && !looksLikeMap(thumb)) {
    showFigure(thumb, 'photo', 'Wikipedia', commonsPageForImage(thumb), pName.textContent ?? '');
    return;
  }
  if (facts?.image && !looksLikeMap(facts.image)) {
    showFigure(commonsFilePath(facts.image, 640), 'photo', 'Wikidata image', commonsPageUrl(facts.image), pName.textContent ?? '');
    return;
  }
  hideFigure();
}

async function loadBiomeImage(titles: string[], ticket: number, signal: AbortSignal): Promise<void> {
  for (const title of titles) {
    try {
      const file = await getArticlePhoto(title, signal);
      if (ticket !== panelTicket) return;
      if (file) {
        showFigure(commonsFilePath(file, 640), 'photo', title, commonsPageUrl(file), `${title}`);
        return;
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
    }
  }
}

function fillInfoboxCell(target: HTMLElement, source: Node): void {
  target.append(source.cloneNode(true));
}

function renderInfobox(sections: InfoboxSection[] | null): void {
  pInfobox.replaceChildren();
  if (!sections?.length) {
    pInfobox.hidden = true;
    return;
  }
  const head = document.createElement('div');
  head.className = 'infobox-head';
  head.textContent = 'From the Wikipedia infobox';
  pInfobox.append(head);
  sections.forEach((section, index) => {
    const details = document.createElement('details');
    details.open = section.rows.length <= 10 && (index < 4 || section.rows.length <= 4);
    const summary = document.createElement('summary');
    summary.textContent = section.title || 'Overview';
    if (section.rows.length > 4) {
      const count = document.createElement('span');
      count.textContent = String(section.rows.length);
      summary.append(count);
    }
    details.append(summary);
    const list = document.createElement('dl');
    list.className = 'ib';
    for (const row of section.rows) {
      if (row.label) {
        const dt = document.createElement('dt');
        fillInfoboxCell(dt, row.label);
        list.append(dt);
      }
      const dd = document.createElement('dd');
      if (!row.label) dd.className = 'wide';
      fillInfoboxCell(dd, row.value);
      list.append(dd);
    }
    details.append(list);
    pInfobox.append(details);
  });
  pInfobox.hidden = false;
}

async function loadInfobox(title: string | null, ticket: number, signal: AbortSignal): Promise<void> {
  if (!title) return;
  try {
    const sections = await getInfobox(title, signal);
    if (ticket !== panelTicket) return;
    renderInfobox(sections);
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') return;
  }
}

function renderSubdivisions(): void {
  pSubs.replaceChildren();
  const list = activeLens === 'polities' ? subdivisionsAtYear(panelSubs, year) : [];
  if (!list.length) {
    pSubs.hidden = true;
    return;
  }
  const details = document.createElement('details');
  details.open = list.length <= 14;
  const summary = document.createElement('summary');
  summary.textContent = 'Administrative subdivisions';
  const count = document.createElement('span');
  count.textContent = `${list.length} with Wikipedia articles`;
  summary.append(count);
  details.append(summary);
  const ul = document.createElement('ul');
  for (const item of list) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = wikiUrl(item.title);
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.textContent = item.name;
    li.append(a);
    if (item.lng !== undefined && item.lat !== undefined) {
      const lng = item.lng;
      const lat = item.lat;
      const pin = document.createElement('button');
      pin.type = 'button';
      pin.textContent = '⌖';
      pin.title = `Show ${item.name} on the map`;
      pin.addEventListener('click', () => map.easeTo({ center: [lng, lat], zoom: Math.max(map.getZoom(), 5), duration: 700 }));
      li.append(pin);
    }
    ul.append(li);
  }
  details.append(ul);
  pSubs.append(details);
  pSubs.hidden = false;
}

async function loadSubdivisions(qid: string, ticket: number, signal: AbortSignal): Promise<void> {
  try {
    const list = await getSubdivisions(qid, signal);
    if (ticket !== panelTicket) return;
    panelSubs = list;
    renderSubdivisions();
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') return;
  }
}

async function loadPanel(
  rawTitle: string | null,
  qid: string | null,
  name: string,
  ticket: number,
  signal: AbortSignal,
  extraFacts: WikiFact[] = [],
): Promise<void> {
  try {
    const factsPromise = qid ? getWikidata(qid, signal) : Promise.resolve(null);
    let summary = rawTitle ? await getSummary(rawTitle, signal) : null;
    if (ticket !== panelTicket) return;

    if (summary) {
      renderSummary(summary);
      const facts = await factsPromise;
      if (ticket !== panelTicket) return;
      renderFacts(facts, extraFacts);
      applyArticleImage(summary, facts);
      void loadInfobox(summary.title, ticket, signal);
      return;
    }

    const facts = await factsPromise;
    if (ticket !== panelTicket) return;

    if (facts?.enwikiTitle && facts.enwikiTitle !== rawTitle) {
      summary = await getSummary(facts.enwikiTitle, signal);
      if (ticket !== panelTicket) return;
      if (summary) {
        renderSummary(summary);
        renderFacts(facts, extraFacts);
        applyArticleImage(summary, facts);
        void loadInfobox(summary.title, ticket, signal);
        return;
      }
    }

    renderFacts(facts, extraFacts);
    applyArticleImage(null, facts);
    const hits = await searchArticles(name, signal);
    if (ticket !== panelTicket) return;
    renderFallback(name, hits);
  } catch (error) {
    if (ticket !== panelTicket) return;
    if (error instanceof DOMException && error.name === 'AbortError') return;
    console.error(error);
    pSummary.classList.remove('muted');
    pSummary.classList.add('error');
    pSummary.textContent = 'Could not reach Wikipedia. You can still search for this entry.';
    pFallback.hidden = true;
    pLink.href = wikiSearchUrl(name);
    pLink.textContent = 'Search Wikipedia';
  }
}

function resetPanel(): number {
  panelTicket++;
  panelAbort?.abort();
  panelAbort = new AbortController();
  leaderAbort?.abort();
  pFallback.hidden = true;
  pFallback.replaceChildren();
  pFacts.hidden = true;
  pFacts.replaceChildren();
  hideFigure();
  pInfobox.hidden = true;
  pInfobox.replaceChildren();
  pSubs.hidden = true;
  pSubs.replaceChildren();
  panelFacts = null;
  panelSubs = [];
  pLeaders.hidden = true;
  pLeadersList.replaceChildren();
  pLeadersHistory.hidden = true;
  pLeadersHistoryList.replaceChildren();
  pOsm.hidden = true;
  pOsmFrame.src = 'about:blank';
  pOsmLink.href = '#';
  pWdLink.hidden = true;
  pLink.title = '';
  pSummary.classList.remove('muted', 'error');
  pNote.hidden = true;
  pLineage.hidden = true;
  pOthers.hidden = true;
  return panelTicket;
}

function showPanel(): void {
  panel.hidden = false;
  panel.scrollTop = 0;
  const ticket = panelTicket;
  requestAnimationFrame(() => {
    if (panelTicket === ticket) panel.scrollTop = 0;
  });
}

function setHighlight(p: Props | null): void {
  for (const id of ['polity-hl', 'civilization-hl', 'sub-hl', 'soc-hl-route', 'soc-hl-zone', 'soc-hl-node']) {
    if (map.getLayer(id)) map.setFilter(id, NO_FEATURE);
  }
  if (!p) return;
  if (activeLens === 'societies') {
    const mine = (type: string): Filter => ['all', yearFilter(year), ['==', ['get', 'k'], p.k], ['==', ['get', 't'], type]];
    if (map.getLayer('soc-hl-route')) map.setFilter('soc-hl-route', mine('r'));
    if (map.getLayer('soc-hl-zone')) map.setFilter('soc-hl-zone', mine('z'));
    if (map.getLayer('soc-hl-node')) map.setFilter('soc-hl-node', mine('n'));
    return;
  }
  const id = p.k >= SUB_K ? 'sub-hl' : highlightLayerOf(activeLens);
  if (id && map.getLayer(id)) map.setFilter(id, highlightFilter(year, p.k));
}

function updateSelection(): void {
  subLabels.setSelected(selectedKey);
  polityLabels.setSelected(selectedKey);
  civilizationLabels.setSelected(selectedKey);
  societyLabels.setSelected(activeLens === 'societies' ? selectedKey : -1);
}

/** Everything under the last click, so overlapping shapes can all be reached. */
let overlapSet: Props[] = [];

// ---- Where you stand (civilizations) -------------------------------------------
// Civilizations are not nested like polities. A person stands inside several peer
// identities at once (a region, a people, a wider sphere) with no centre above
// them, so every identity active at the clicked point is found by geometry,
// whatever is drawn on top, how far the map is zoomed, or how faint a shape is.
interface Footprint {
  box: [number, number, number, number];
  polys: number[][][][];
}
let civilizationFootprints: Footprint[] = [];

function buildFootprints(features: MapFeature[]): Footprint[] {
  return features.map((feature) => {
    const geometry = feature.geometry as { type?: string; coordinates?: unknown } | null;
    let polys: number[][][][] = [];
    if (geometry?.type === 'Polygon') polys = [geometry.coordinates as number[][][]];
    else if (geometry?.type === 'MultiPolygon') polys = geometry.coordinates as number[][][][];
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const poly of polys) {
      for (const [x, y] of poly[0] ?? []) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
    return { box: [minX, minY, maxX, maxY], polys };
  });
}

function inRing(ring: number[][], x: number, y: number): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

/** Every civilization active in `atYear` whose footprint contains the point, local first. */
function standingAt(lng: number, lat: number, atYear: number): Props[] {
  const found: Props[] = [];
  civilizationFootprints.forEach((foot, index) => {
    const p = civilizationProps[index];
    if (!p || p.s > atYear || p.e < atYear) return;
    const [minX, minY, maxX, maxY] = foot.box;
    if (lng < minX || lng > maxX || lat < minY || lat > maxY) return;
    for (const poly of foot.polys) {
      if (!poly[0] || !inRing(poly[0], lng, lat)) continue;
      let hole = false;
      for (let r = 1; r < poly.length; r++) {
        if (inRing(poly[r], lng, lat)) {
          hole = true;
          break;
        }
      }
      if (!hole) {
        found.push(p);
        return;
      }
    }
  });
  return found.sort((a, b) => (b.lv ?? 2) - (a.lv ?? 2) || a.sz - b.sz);
}

/** The identity to open first: the one that matches the scale the map is showing. */
function pickStanding(stack: Props[]): Props {
  const local = map.getZoom() >= LOCAL_ZOOM - 0.2;
  const wanted = local ? 3 : 2;
  return stack.find((item) => (item.lv ?? 2) === wanted) ??
    stack.find((item) => (item.lv ?? 2) < wanted) ?? stack[0];
}

const TIER_NAMES: Record<number, string> = { 3: 'Local identity', 2: 'People', 1: 'Wider sphere' };

function renderOthers(current: Props): void {
  pOthersList.replaceChildren();
  const others = overlapSet.filter((item) => item.k !== current.k);
  pOthers.hidden = others.length === 0;
  const civilizations = activeLens === 'civilizations';
  const provinces = !civilizations && others.length > 0 && current.k < SUB_K && others.every((item) => item.k >= SUB_K);
  pOthersHead.textContent = activeLens === 'societies' ? 'Networks here' : civilizations ? 'Where you stand · peer identities' : provinces ? 'Provinces (approximate)' : 'Also here';
  let tier = -1;
  for (const item of others) {
    const level = item.lv ?? 2;
    if (civilizations && level !== tier) {
      tier = level;
      const heading = document.createElement('span');
      heading.className = 'others-tier';
      heading.textContent = TIER_NAMES[level] ?? 'Identity';
      pOthersList.append(heading);
    }
    const button = document.createElement('button');
    button.type = 'button';
    const dot = document.createElement('i');
    dot.style.background = item.c;
    const label = document.createElement('span');
    label.textContent = item.k >= SUB_K ? `${item.n} · province of ${item.p}` : `${item.n} · ${fmtRange(item.s, item.e)}`;
    button.title = label.textContent;
    button.append(dot, label);
    button.addEventListener('click', () => openPanel(item));
    pOthersList.append(button);
  }
}

let lineages = new Map<string, Props[]>();

function buildLineages(): void {
  lineages = new Map();
  for (const p of civilizationProps) {
    if (!p.ln) continue;
    const list = lineages.get(p.ln);
    if (list) list.push(p);
    else lineages.set(p.ln, [p]);
  }
  for (const list of lineages.values()) list.sort((a, b) => a.s - b.s || b.e - a.e);
}

function renderLineage(p: Props): void {
  pLineageList.replaceChildren();
  const stages = p.ln ? lineages.get(p.ln) : undefined;
  pNote.hidden = !p.nt;
  pNote.textContent = p.nt ?? '';
  if (activeLens !== 'civilizations' || !stages || stages.length < 2) {
    pLineage.hidden = true;
    return;
  }
  pLineage.hidden = false;
  for (const stage of stages) {
    const li = document.createElement('li');
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = stage.n;
    const years = document.createElement('span');
    years.textContent = fmtRange(stage.s, stage.e);
    button.append(years);
    if (stage.k === p.k) {
      li.className = 'current';
      button.setAttribute('aria-current', 'true');
    } else {
      button.addEventListener('click', () => {
        // Jump to the middle of the stage (clamped to the slider) and open it.
        const mid = Math.round(clamp((Math.max(stage.s, MIN_YEAR) + Math.min(stage.e, MAX_YEAR)) / 2, MIN_YEAR, MAX_YEAR));
        setYear(mid);
        map.easeTo({ center: [stage.lx, stage.ly], duration: 700 });
        overlapSet = [];
        openPanel(stage);
      });
    }
    li.append(button);
    pLineageList.append(li);
  }
}

function openPanel(p: Props): void {
  if (activeLens === 'biomes') return;
  const name = p.n;
  const rawTitle = wikiTitle(p.w);
  const qid = /^Q\d+$/.test(p.q) ? p.q : null;

  selectedKey = p.k;
  selectedProps = p;
  panelQid = qid;
  biomePoint = null;
  hideBiomePin();
  const ticket = resetPanel();
  const controller = panelAbort as AbortController;

  const civilizations = activeLens === 'civilizations';
  const societies = activeLens === 'societies';
  const province = p.k >= SUB_K;
  pName.textContent = name;
  pName.title = name;
  pYears.textContent = province ? `Part of ${p.p} · ${p.era}` : fmtRange(p.s, p.e);
  pKind.textContent = province ? 'Province' : civilizations ? 'Civilization' : societies ? 'Society' : p.g ? 'Realm' : 'Polity';
  pSource.textContent = province ? 'Approximate borders' : civilizations || societies ? 'Curated' : 'Cliopatria';
  pFine.textContent = province
    ? 'Province borders: approximated from Natural Earth (public domain) inside Cliopatria shapes (CC BY 4.0) · Text: Wikipedia (CC BY-SA) · Modern map: OpenStreetMap (ODbL)'
    : societies
    ? 'Routes, hubs and areas: curated and schematic, see docs/SOCIETIES.md · Text: Wikipedia (CC BY-SA) · Modern map: OpenStreetMap (ODbL)'
    : civilizations
    ? 'Footprints: curated approximations, see docs/CIVILIZATIONS.md · Text: Wikipedia (CC BY-SA) · Modern map: OpenStreetMap (ODbL)'
    : 'Borders: Cliopatria (CC BY 4.0) · Text: Wikipedia (CC BY-SA) · Facts: Wikidata (CC0) · Modern map: OpenStreetMap (ODbL)';
  pSwatch.style.background = p.c;
  pSummary.textContent = 'Loading Wikipedia…';
  pLink.href = wikiSearchUrl(name);
  pLink.textContent = 'Search Wikipedia';

  showPanel();
  renderLineage(p);
  renderOthers(p);
  document.title = `${name} · Unity of Being`;

  setHighlight(p);
  updateSelection();
  renderOsm(p.lx, p.ly, p.sz, name);

  const extraFacts: WikiFact[] = [];
  if (societies) {
    if (p.grp) extraFacts.push({ label: 'Sphere', value: p.grp });
    if (p.kind) extraFacts.push({ label: 'Type', value: p.kind });
    if (p.hubs) {
      const list = p.hubs.split(', ');
      extraFacts.push({ label: 'Connects', value: list.slice(0, 10).join(', ') + (list.length > 10 ? ' …' : '') });
    }
  } else if (civilizations) {
    if (p.grp) extraFacts.push({ label: 'Sphere', value: p.grp });
    if (p.kind) extraFacts.push({ label: 'Type', value: p.kind });
    if (p.fam) extraFacts.push({ label: 'Languages', value: p.fam });
    if (p.fg) extraFacts.push({ label: 'Family group', value: p.fg });
  } else if (province) {
    extraFacts.push({ label: 'Part of', value: p.p ?? '' });
  } else if (p.m) {
    extraFacts.push({ label: 'Realm', value: p.m });
  }
  if (qid && !civilizations && !societies && !p.g) void loadLeaders(qid, year, ticket);
  if (qid && !civilizations && !societies) void loadSubdivisions(qid, ticket, controller.signal);
  void loadPanel(rawTitle, qid, name, ticket, controller.signal, extraFacts);
}

// ---- Biome panel ------------------------------------------------------------
let biomePoint: { lng: number; lat: number } | null = null;
let biomePin: maplibregl.Marker | null = null;
let biomeTimer = 0;

function hideBiomePin(): void {
  biomePin?.remove();
  biomePin = null;
}

function scheduleBiomePanel(): void {
  if (biomeTimer) window.clearTimeout(biomeTimer);
  biomeTimer = window.setTimeout(() => {
    if (activeLens === 'biomes' && biomePoint && !panel.hidden) {
      openBiomePanel(biomePoint.lng, biomePoint.lat, false);
    }
  }, 160);
}

function openBiomePanel(lng: number, lat: number, movePin = true): void {
  if (!biomeModel) return;
  const klass = CLASSES[biomeModel.classAt(lng, lat)];
  if (!klass) {
    closePanel();
    return;
  }
  const ecoId = biomeModel.ecoAt(lng, lat);
  const meta = biomeModel.meta;
  const ecoEntry = ecoId > 0 ? meta.eco[ecoId - 1] : null;
  const ecoName = ecoEntry ? ecoEntry[0] : null;
  const shift = climateShift(year);
  biomePoint = { lng, lat };
  selectedKey = -1;
  selectedProps = null;
  panelQid = null;
  const ticket = resetPanel();
  const controller = panelAbort as AbortController;

  const title = ecoName ? `${klass.code} ${ecoName}` : `${klass.code} ${klass.name}`;
  pName.textContent = title;
  pName.title = title;
  pYears.textContent = `${fmtYear(year)} · ${shift.era}`;
  pKind.textContent = ecoName ? 'Ecoregion' : 'Climate';
  pSource.textContent = 'WWF ecoregions × Köppen–Geiger';
  pFine.textContent =
    'Ecoregions: RESOLVE Ecoregions 2017 (Dinerstein et al., CC BY 4.0), a revision of WWF’s · Climate: Köppen–Geiger (Rubel et al. 2017, 1951–2000) moved by a schematic climate-shift model · Text: Wikipedia (CC BY-SA)';
  pSwatch.style.background = klass.colour;
  pSummary.textContent = ecoName ? 'Loading Wikipedia…' :
    `${GROUPS[klass.group]} climate. Typical vegetation: ${klass.veg.toLowerCase()}.`;
  pLink.href = ecoName ? wikiSearchUrl(ecoName) : wikiUrl(klass.wiki);
  pLink.textContent = ecoName ? 'Search Wikipedia' : 'Read on Wikipedia';

  const rows: WikiFact[] = [];
  if (ecoEntry) {
    rows.push({ label: 'Ecoregion', value: ecoEntry[0] });
    rows.push({ label: 'Biome', value: meta.biomes[ecoEntry[1]] });
    rows.push({ label: 'Realm', value: meta.realms[ecoEntry[2]] });
  }
  rows.push(
    { label: 'Climate', value: `${klass.code} · ${klass.name}` },
    { label: 'Temperature', value: klass.temp },
    { label: 'Rainfall', value: klass.rain },
    { label: 'Vegetation', value: klass.veg },
    { label: 'Climate age', value: shift.events.length ? `${shift.era}. ${shift.events.join('; ')}` : shift.era },
    {
      label: 'Position',
      value: `${Math.abs(lat).toFixed(1)}° ${lat >= 0 ? 'N' : 'S'}, ${Math.abs(lng).toFixed(1)}° ${lng >= 0 ? 'E' : 'W'}`,
    },
  );

  showPanel();
  document.title = `${title} · Unity of Being`;
  const photoTitles = [
    ...(ecoName ? [ecoName] : []),
    ...(ecoEntry ? [meta.biomes[ecoEntry[1]]] : []),
    klass.wiki,
  ];
  void loadBiomeImage(photoTitles, ticket, controller.signal);
  if (ecoName) {
    renderFacts(null, rows);
    void loadPanel(ecoName, null, ecoName, ticket, controller.signal, rows);
  } else {
    renderFacts(null, rows);
  }
  if (movePin) {
    hideBiomePin();
    const dot = document.createElement('div');
    dot.className = 'biome-pin';
    biomePin = new maplibregl.Marker({ element: dot, anchor: 'center' }).setLngLat([lng, lat]).addTo(map);
  }
}

function closePanel(): void {
  if (panel.hidden) return;
  panelTicket++;
  panelAbort?.abort();
  panelAbort = null;
  panel.hidden = true;
  overlapSet = [];
  panelQid = null;
  leaderAbort?.abort();
  leaderAbort = null;
  pLeaders.hidden = true;
  pLeadersHistory.hidden = true;
  pOsmFrame.src = 'about:blank';
  selectedKey = -1;
  selectedProps = null;
  biomePoint = null;
  hideBiomePin();
  setHighlight(null);
  document.title = 'Unity of Being';
  updateSelection();
}

function setLensVisibility(): void {
  for (const lens of LENSES) {
    const visibility = lens === activeLens ? 'visible' : 'none';
    for (const id of LENS_LAYERS[lens]) {
      if (map.getLayer(id)) map.setLayoutProperty(id, 'visibility', visibility);
    }
  }
}

function updateLensButtons(): void {
  for (const button of lensButtons) {
    const active = button.dataset.lens === activeLens;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  }
}

function setLens(next: Lens): void {
  if (next === activeLens) return;
  if (next === 'civilizations' && !civilizationProps.length) return;
  if (next === 'societies' && !societyProps.length) return;
  if (next === 'biomes' && !biomeModel) return;
  closePanel();
  activeLens = next;
  syncLabelLayers();
  setLensVisibility();
  updateLensButtons();
  if (next === 'biomes') renderBiomes(true);
  setYear(year);
  activeLabels()?.schedule();
  scheduleHash();
  // Veil only while the new lens really has nothing to show; otherwise make sure no old one lingers.
  const source = activeSourceId();
  if (map.getSource(source) && !map.isSourceLoaded(source)) {
    showVeil(next === 'civilizations' ? 'Drawing civilizations…' : next === 'societies' ? 'Drawing networks…' : next === 'biomes' ? 'Drawing climate…' : 'Drawing borders…');
  } else if (dataReady) {
    finishLoading();
  }
}

/** Only the active lens's label layers may draw; the others are cleared and refuse queued frames. */
function syncLabelLayers(): void {
  polityLabels.setEnabled(activeLens === 'polities');
  subLabels.setEnabled(activeLens === 'polities');
  civilizationLabels.setEnabled(activeLens === 'civilizations');
  societyLabels.setEnabled(activeLens === 'societies');
  biomeLabels.setEnabled(activeLens === 'biomes');
}

for (const button of lensButtons) {
  button.addEventListener('click', () => setLens(button.dataset.lens as Lens));
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
async function getResponse(
  url: string,
  onProgress?: (loaded: number, total: number) => void,
): Promise<Blob> {
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
  return new Blob(chunks as BlobPart[]);
}

async function getJson<T = unknown>(
  url: string,
  onProgress?: (loaded: number, total: number) => void,
): Promise<T> {
  return JSON.parse(await (await getResponse(url, onProgress)).text()) as T;
}

let loadingDone = false;
let loadingHideTimer = 0;
let dataReady = false;
function finishLoading(): void {
  if (loadingDone || !dataReady) return;
  loadingDone = true;
  loading.classList.add('hide');
  mapVeil.hidden = true;
  if (loadingHideTimer) window.clearTimeout(loadingHideTimer);
  loadingHideTimer = window.setTimeout(() => {
    loadingHideTimer = 0;
    loading.hidden = true;
  }, 260);
}
function failLoading(message: string): void {
  mapVeil.hidden = false;
  mapVeilText.textContent = message;
  loadingText.textContent = message;
  loading.classList.add('error');
  loadingProgress.style.width = '0%';
}

function activeSourceId(): string {
  return activeLens === 'polities' ? 'polities' : activeLens === 'civilizations' ? 'civilizations' : activeLens === 'societies' ? 'societies' : 'ocean';
}

/** Show the veil while a lens that has not drawn yet is being tiled. */
function showVeil(message: string): void {
  // A fade-out from an earlier lens switch must not hide this veil.
  if (loadingHideTimer) window.clearTimeout(loadingHideTimer);
  loadingHideTimer = 0;
  loadingDone = false;
  loading.hidden = false;
  loading.classList.remove('hide', 'error');
  loadingText.textContent = message;
  loadingProgress.style.width = '100%';
  mapVeil.hidden = false;
  mapVeilText.textContent = message;
}

/** Hide the loader once the active lens has real pixels to show. */
function checkSources(): void {
  if (!dataReady || loadingDone) return;
  const source = activeSourceId();
  if (map.getSource(source) && map.isSourceLoaded(source)) finishLoading();
}

map.on('load', async () => {
  try {
    const [land, polityData, civilizationData, societyData, rivers, lakes, koppen, ecoBin, ecoMeta, ecoLines, ocean, subData] = await Promise.all([
      getJson(`${BASE}data/land.geojson`),
      getJson<FeatureCollection>(`${BASE}data/polities.geojson`, (loaded, total) => {
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
      getJson<FeatureCollection>(`${BASE}data/civilizations.geojson`).catch((error) => {
        console.error('Civilizations data:', error);
        return null;
      }),
      getJson<SocietyData>(`${BASE}data/societies.geojson`).catch((error) => {
        console.error('Societies data:', error);
        return null;
      }),
      getJson(`${BASE}data/rivers.geojson`).catch(() => null),
      getJson(`${BASE}data/lakes.geojson`).catch(() => null),
      getResponse(`${BASE}data/koppen.bin`).then((blob) => blob.arrayBuffer()).catch((error) => {
        console.error('Biome data:', error);
        return null;
      }),
      getResponse(`${BASE}data/ecoregions.bin`).then((blob) => blob.arrayBuffer()).catch(() => null),
      getJson<EcoMeta>(`${BASE}data/ecoregions.json`).catch(() => null),
      getJson(`${BASE}data/ecoregion-lines.geojson`).catch(() => null),
      getJson(`${BASE}data/ocean.geojson`).catch(() => null),
      getJson<FeatureCollection>(`${BASE}data/subdivisions.geojson`).catch(() => null),
    ]);

    loadingText.textContent = 'Building map…';
    loadingProgress.style.width = '100%';

    const polityFeatures = polityData.features;
    const civilizationFeatures = civilizationData?.features ?? [];
    polityFeatures.forEach((feature, index) => {
      feature.properties.k = index;
    });
    civilizationFeatures.forEach((feature, index) => {
      feature.properties.k = index;
    });
    // Provinces: polygons get keys from SUB_K up; internal border lines (bd) carry none.
    const subFeatures = subData?.features ?? [];
    subProps = [];
    for (const feature of subFeatures) {
      const props = feature.properties as Props & { bd?: number };
      if (props.bd) continue;
      props.k = SUB_K + subProps.length;
      props.q = '';
      props.nt = `Provinces as in ${props.era}; borders are approximated from modern boundaries, so edges are rough.`;
      subProps.push(props);
    }
    polityProps = polityFeatures.map((feature) => feature.properties);
    civilizationProps = civilizationFeatures.map((feature) => feature.properties);
    civilizationFootprints = buildFootprints(civilizationFeatures);
    societyProps = societyData?.entities ?? [];
    socKinds = societyData?.groups ?? societyData?.kinds ?? {};
    societyLabels.setFeatures(societyData?.labels ?? []);
    buildLineages();
    polityLabels.setFeatures(polityProps);
    subLabels.setFeatures(subProps);
    civilizationLabels.setFeatures(civilizationProps);

    if (koppen && ecoBin && ecoMeta && ocean) {
      try {
        biomeModel = new BiomeModel(koppen, ecoBin, ecoMeta);
      } catch (error) {
        console.error('Biome model:', error);
      }
    }
    const disable = (lens: Lens, message: string): void => {
      const button = lensButtons.find((item) => item.dataset.lens === lens);
      if (button) {
        button.disabled = true;
        button.title = message;
      }
    };
    if (!civilizationProps.length) disable('civilizations', 'Civilizations data unavailable');
    if (!societyProps.length) disable('societies', 'Societies data unavailable');
    if (!biomeModel) disable('biomes', 'Biome data unavailable');
    if (activeLens === 'civilizations' && !civilizationProps.length) activeLens = 'polities';
    if (activeLens === 'societies' && !societyProps.length) activeLens = 'polities';
    if (activeLens === 'biomes' && !biomeModel) activeLens = 'polities';

    map.on('sourcedata', checkSources);
    map.on('idle', checkSources);

    try {
      map.addImage('mark-c', await svgImage(MARK_SVG.c, 48), { pixelRatio: 2 });
      map.addImage('mark-x', await svgImage(MARK_SVG.x, 48), { pixelRatio: 2 });
    } catch (error) {
      console.error('Societies symbols:', error);
    }

    map.addSource('land', { type: 'geojson', data: land as GeoData });
    map.addSource('polities', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: polityFeatures } as GeoData,
    });
    map.addSource('civilizations', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: civilizationFeatures } as GeoData,
    });
    map.addSource('societies', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: societyData?.features ?? [] } as GeoData,
    });
    map.addSource('subdivisions', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: subFeatures } as GeoData,
    });

    const visible = (lens: Lens): 'visible' | 'none' => (activeLens === lens ? 'visible' : 'none');
    const roundLines = { 'line-join': 'round', 'line-cap': 'round' } as const;

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
      filter: leafFilter(year),
      paint: { 'fill-color': ['get', 'c'], 'fill-opacity': 0.84 },
      layout: { visibility: visible('polities') },
    });
    map.addLayer({
      id: 'civilization-fill',
      type: 'fill',
      source: 'civilizations',
      filter: yearFilter(year),
      paint: {
        'fill-color': ['get', 'c'],
        'fill-opacity': localFade(0.62),
      },
      layout: { visibility: visible('civilizations') },
    });

    if (biomeModel && ocean) {
      map.addSource('biome', {
        type: 'image',
        coordinates: BiomeModel.bounds,
      } as maplibregl.ImageSourceSpecification);
      map.addSource('ocean', { type: 'geojson', data: ocean as GeoData });
      if (ecoLines) map.addSource('ecolines', { type: 'geojson', data: ecoLines as GeoData });
      map.addLayer({
        id: 'biome-raster',
        type: 'raster',
        source: 'biome',
        paint: { 'raster-opacity': 0.9, 'raster-resampling': 'linear', 'raster-fade-duration': 0 },
        layout: { visibility: visible('biomes') },
      });
      if (ecoLines) {
        map.addLayer({
          id: 'eco-lines',
          type: 'line',
          source: 'ecolines',
          paint: {
            'line-color': '#1d1710',
            'line-width': ['interpolate', ['linear'], ['zoom'], 1, 0.35, 4, 0.7, 9, 1.4],
            'line-opacity': 0.62,
          },
          layout: { 'line-join': 'round', 'line-cap': 'round', visibility: visible('biomes') },
        });
      }
      map.addLayer({
        id: 'ocean-mask',
        type: 'fill',
        source: 'ocean',
        paint: { 'fill-color': '#2f4756', 'fill-opacity': 1, 'fill-antialias': false },
        layout: { visibility: visible('biomes') },
      });
    }

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
      map.addSource('lakes', { type: 'geojson', data: lakes as GeoData });
      map.addLayer({
        id: 'lake-fill',
        type: 'fill',
        source: 'lakes',
        filter: lakeFilter(year),
        paint: { 'fill-color': '#35505f', 'fill-opacity': 0.95 },
      });
      map.addLayer({
        id: 'lake-line',
        type: 'line',
        source: 'lakes',
        filter: lakeFilter(year),
        paint: { 'line-color': '#6f5f3d', 'line-width': 0.6, 'line-opacity': 0.6 },
      });
    }
    if (rivers) {
      map.addSource('rivers', { type: 'geojson', data: rivers as GeoData });
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

    // Polities: thin lines inside a realm, heavier outlines around whole realms.
    map.addLayer({
      id: 'polity-line',
      type: 'line',
      source: 'polities',
      filter: leafFilter(year),
      paint: {
        'line-color': '#2a2118',
        'line-width': ['interpolate', ['linear'], ['zoom'], 1, 0.3, 4, 0.55, 9, 1.1],
        'line-opacity': 0.55,
      },
      layout: { ...roundLines, visibility: visible('polities') },
    });
    map.addLayer({
      id: 'polity-realm-casing',
      type: 'line',
      source: 'polities',
      filter: realmFilter(year),
      paint: {
        'line-color': '#201811',
        'line-width': ['interpolate', ['linear'], ['zoom'], 1, 1.4, 4, 2.2, 9, 3.4],
        'line-opacity': 0.32,
      },
      layout: { ...roundLines, visibility: visible('polities') },
    });
    map.addLayer({
      id: 'polity-realm-line',
      type: 'line',
      source: 'polities',
      filter: realmFilter(year),
      paint: {
        'line-color': '#2a2118',
        'line-width': ['interpolate', ['linear'], ['zoom'], 1, 0.5, 4, 0.9, 9, 1.7],
        'line-opacity': 0.88,
      },
      layout: { ...roundLines, visibility: visible('polities') },
    });
    map.addLayer({
      id: 'polity-hl',
      type: 'line',
      source: 'polities',
      filter: NO_FEATURE,
      paint: { 'line-color': '#f6e7b8', 'line-width': 2.4, 'line-opacity': 0.95 },
      layout: { 'line-join': 'round', visibility: visible('polities') },
    });

    // Provinces inside big polities: same colour as the parent, so only their borders show.
    map.addLayer({
      id: 'sub-fill',
      type: 'fill',
      source: 'subdivisions',
      filter: ['all', yearFilter(year), ['!', ['has', 'bd']]],
      paint: { 'fill-color': ['get', 'c'], 'fill-opacity': 0.02 },
      layout: { visibility: visible('polities') },
    });
    map.addLayer({
      id: 'sub-line',
      type: 'line',
      source: 'subdivisions',
      filter: ['all', yearFilter(year), ['has', 'bd']],
      paint: {
        'line-color': '#2a2118',
        'line-opacity': ['interpolate', ['linear'], ['zoom'], SUB_ZOOM - 1.2, 0, SUB_ZOOM + 0.2, 0.85],
        'line-width': ['interpolate', ['linear'], ['zoom'], 2, 0.7, 6, 1.7],
        'line-dasharray': [2.5, 1.5],
      },
      layout: { ...roundLines, visibility: visible('polities') },
    });
    map.addLayer({
      id: 'sub-hl',
      type: 'line',
      source: 'subdivisions',
      filter: NO_FEATURE,
      paint: { 'line-color': '#f6e7b8', 'line-width': 2.2, 'line-opacity': 0.95 },
      layout: { 'line-join': 'round', visibility: visible('polities') },
    });

    map.addLayer({
      id: 'civilization-casing',
      type: 'line',
      source: 'civilizations',
      filter: yearFilter(year),
      paint: {
        'line-color': '#201811',
        'line-width': ['interpolate', ['linear'], ['zoom'], 1, 0.9, 4, 1.4, 9, 2.4],
        'line-opacity': localFade(0.26),
      },
      layout: { ...roundLines, visibility: visible('civilizations') },
    });
    map.addLayer({
      id: 'civilization-line',
      type: 'line',
      source: 'civilizations',
      filter: yearFilter(year),
      paint: {
        'line-color': '#2a2118',
        'line-width': ['interpolate', ['linear'], ['zoom'], 1, 0.35, 4, 0.65, 9, 1.3],
        'line-opacity': localFade(0.6),
      },
      layout: { ...roundLines, visibility: visible('civilizations') },
    });
    map.addLayer({
      id: 'civilization-hl',
      type: 'line',
      source: 'civilizations',
      filter: NO_FEATURE,
      paint: { 'line-color': '#f6e7b8', 'line-width': 2.2, 'line-opacity': 0.95 },
      layout: { 'line-join': 'round', visibility: visible('civilizations') },
    });

    // Societies: areas of presence, routes (solid on land, dashed at sea) and hubs.
    const socYear = (type: string): Filter => ['all', yearFilter(year), ['==', ['get', 't'], type]];
    map.addLayer({
      id: 'soc-zone-fill', type: 'fill', source: 'societies', filter: socYear('z'),
      paint: { 'fill-color': ['get', 'c'], 'fill-opacity': 0.22 },
      layout: { visibility: visible('societies') },
    });
    map.addLayer({
      id: 'soc-zone-line', type: 'line', source: 'societies', filter: socYear('z'),
      paint: { 'line-color': ['get', 'c'], 'line-width': 1.6, 'line-dasharray': [3, 2], 'line-opacity': 0.95 },
      layout: { ...roundLines, visibility: visible('societies') },
    });
    map.addLayer({
      id: 'soc-route-casing', type: 'line', source: 'societies', filter: socYear('r'),
      paint: {
        'line-color': '#1d1710',
        'line-width': ['interpolate', ['linear'], ['zoom'], 1, 3, 5, 4.4, 9, 6],
        'line-opacity': 0.55,
      },
      layout: { ...roundLines, visibility: visible('societies') },
    });
    map.addLayer({
      id: 'soc-route', type: 'line', source: 'societies',
      filter: ['all', yearFilter(year), ['==', ['get', 't'], 'r'], ['!', ['has', 'sea']]],
      paint: { 'line-color': ['get', 'c'], 'line-width': ['interpolate', ['linear'], ['zoom'], 1, 1.6, 5, 2.6, 9, 4], 'line-opacity': 0.96 },
      layout: { ...roundLines, visibility: visible('societies') },
    });
    map.addLayer({
      id: 'soc-route-sea', type: 'line', source: 'societies',
      filter: ['all', yearFilter(year), ['==', ['get', 't'], 'r'], ['has', 'sea']],
      paint: {
        'line-color': ['get', 'c'], 'line-width': ['interpolate', ['linear'], ['zoom'], 1, 1.6, 5, 2.6, 9, 4],
        'line-opacity': 0.96, 'line-dasharray': [2, 1.6],
      },
      layout: { 'line-join': 'round', visibility: visible('societies') },
    });
    map.addLayer({
      id: 'soc-node', type: 'circle', source: 'societies', filter: socYear('n'),
      paint: {
        'circle-color': ['get', 'c'],
        'circle-radius': ['interpolate', ['linear'], ['zoom'], 1, ['case', ['has', 'm'], 3.2, 2], 6, ['case', ['has', 'm'], 6.5, 4.2]],
        'circle-stroke-color': '#1d1710', 'circle-stroke-width': 1.4,
      },
      layout: { visibility: visible('societies') },
    });
    map.addLayer({
      id: 'soc-mark-badge', type: 'circle', source: 'societies', filter: socYear('m'),
      paint: {
        'circle-color': '#1d1710',
        'circle-radius': ['interpolate', ['linear'], ['zoom'], 1, 8, 6, 12],
        'circle-stroke-color': ['get', 'c'], 'circle-stroke-width': 2.2,
      },
      layout: { visibility: visible('societies') },
    });
    map.addLayer({
      id: 'soc-mark', type: 'symbol', source: 'societies', filter: socYear('m'),
      layout: {
        'icon-image': ['case', ['==', ['get', 'ic'], 'c'], 'mark-c', 'mark-x'],
        'icon-size': ['interpolate', ['linear'], ['zoom'], 1, 0.55, 6, 0.85],
        'icon-allow-overlap': true, 'icon-ignore-placement': true,
        visibility: visible('societies'),
      },
    });
    map.addLayer({
      id: 'soc-hl-zone', type: 'line', source: 'societies', filter: NO_FEATURE,
      paint: { 'line-color': '#f6e7b8', 'line-width': 2.6, 'line-opacity': 0.95 },
      layout: { 'line-join': 'round', visibility: visible('societies') },
    });
    map.addLayer({
      id: 'soc-hl-route', type: 'line', source: 'societies', filter: NO_FEATURE,
      paint: { 'line-color': '#f6e7b8', 'line-width': ['interpolate', ['linear'], ['zoom'], 1, 4, 5, 6, 9, 8], 'line-opacity': 0.5 },
      layout: { ...roundLines, visibility: visible('societies') },
    });
    map.addLayer({
      id: 'soc-hl-node', type: 'circle', source: 'societies', filter: NO_FEATURE,
      paint: {
        'circle-color': 'rgba(0,0,0,0)', 'circle-stroke-color': '#f6e7b8', 'circle-stroke-width': 2.2,
        'circle-radius': ['interpolate', ['linear'], ['zoom'], 1, ['case', ['has', 'm'], 6, 4.5], 6, ['case', ['has', 'm'], 10, 7.5]],
      },
      layout: { visibility: visible('societies') },
    });

    map.on('click', (event) => {
      if (activeLens === 'biomes') {
        openBiomePanel(event.lngLat.lng, event.lngLat.lat);
        return;
      }
      if (activeLens === 'civilizations') {
        const stack = standingAt(event.lngLat.lng, event.lngLat.lat, year);
        if (!stack.length) {
          closePanel();
          return;
        }
        overlapSet = stack;
        openPanel(pickStanding(stack));
        return;
      }
      if (activeLens === 'societies') {
        const pad = 7;
        const box: [maplibregl.PointLike, maplibregl.PointLike] = [
          [event.point.x - pad, event.point.y - pad], [event.point.x + pad, event.point.y + pad],
        ];
        const found = map.queryRenderedFeatures(box, {
          layers: ['soc-mark', 'soc-node', 'soc-route', 'soc-route-sea', 'soc-zone-fill'],
        });
        // Nodes first, then routes, then zones; one entry per network.
        const rank: Record<string, number> = { m: 0, n: 0, r: 1, z: 2 };
        found.sort((a, b) => rank[(a.properties as { t: string }).t] - rank[(b.properties as { t: string }).t]);
        const stack: Props[] = [];
        for (const hit of found) {
          const entity = societyProps[(hit.properties as { k: number }).k];
          if (entity && !stack.includes(entity)) stack.push(entity);
        }
        if (!stack.length) {
          closePanel();
          return;
        }
        overlapSet = stack;
        openPanel(stack[0]);
        return;
      }
      const fill = fillLayerOf(activeLens);
      const hits = fill ? map.queryRenderedFeatures(event.point, { layers: [fill] }) : [];
      if (!hits.length) {
        closePanel();
        return;
      }
      // Smaller shapes are drawn last, so the last hit is the one on top. Keep every
      // distinct shape under the click so overlapped ones can still be opened.
      const all = lensProps(activeLens);
      const seen = new Set<number>();
      const stack: Props[] = [];
      for (let i = hits.length - 1; i >= 0; i--) {
        const key = (hits[i].properties as { k?: number }).k;
        if (typeof key !== 'number' || seen.has(key) || !all[key]) continue;
        seen.add(key);
        stack.push(all[key]);
      }
      // Provinces under the click: listed first when zoomed in, after the polity otherwise.
      const subHits = map.getLayer('sub-fill')
        ? map.queryRenderedFeatures(event.point, { layers: ['sub-fill'] })
        : [];
      const subs: Props[] = [];
      for (const hit of subHits) {
        const key = (hit.properties as { k?: number }).k;
        const item = typeof key === 'number' ? subProps[key - SUB_K] : undefined;
        if (item && !subs.includes(item)) subs.push(item);
      }
      const ordered = map.getZoom() >= SUB_ZOOM - 0.2 ? [...subs, ...stack] : [...stack, ...subs];
      overlapSet = ordered;
      if (ordered.length) openPanel(ordered[0]);
    });
    for (const layer of ['soc-node', 'soc-route', 'soc-route-sea', 'soc-zone-fill']) {
      map.on('mousemove', layer, () => {
        if (activeLens === 'societies') map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', layer, () => {
        if (activeLens === 'societies') map.getCanvas().style.cursor = '';
      });
    }
    for (const lens of ['polities', 'civilizations'] as Lens[]) {
      const layer = fillLayerOf(lens) as string;
      map.on('mousemove', layer, () => {
        if (lens === activeLens) map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', layer, () => {
        if (lens === activeLens) map.getCanvas().style.cursor = '';
      });
    }
    const relabel = (): void => activeLabels()?.schedule();
    map.on('move', relabel);
    map.on('zoom', relabel);
    map.on('resize', relabel);
    map.on('moveend', () => {
      relabel();
      scheduleHash();
    });
    map.on('zoomend', () => {
      relabel();
      scheduleHash();
    });

    updateLensButtons();
    syncLabelLayers();
    setLensVisibility();
    if (activeLens === 'biomes') renderBiomes(true);
    setYear(year);
    relabel();
    dataReady = true;
    checkSources();
    window.setTimeout(finishLoading, 60000);
    window.setTimeout(() => {
      if (!loadingDone) loadingText.textContent = 'Still building the map…';
    }, 20000);
  } catch (error) {
    console.error(error);
    failLoading(`Could not load map data (${(error as Error).message}). Please reload.`);
  }
});
