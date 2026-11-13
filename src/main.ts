import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url';
import './style.css';
import { BiomeModel, CLASSES, GROUPS, climateShift, type EcoMeta, type EcoPatch } from './biomes';
import { LabelLayer, type LabelProps } from './labels';
import { controlOf, ideologyOf, worldviewOf, type Theme, type Verdict } from './thematic';
import { organiseInfobox, type OrganisedInfobox } from './infobox-map';
import { effectiveYears, recordKey, subKey, type Override } from './edit';
import { initEditUi } from './edit-ui';
import { buildGenericSheet, buildSheet, emptySheet, fmtReign, getCurated, getMaddison, getProfileData, getWorldBank, maddisonCode, type Curated, type MaddisonCountry, type ProfileData, type ProfileGroup, type ProfileRow, type WorldBank } from './profile';
import {
  getArticlePhoto,
  getInfobox,
  getLeaderHistory,
  getSubdivisions,
  getSummary,
  getWikidata,
  imageAtYear,
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
/** Absolute base for the vector tiles MapLibre's worker loads itself (a worker cannot resolve a page-relative path). */
const dataBase = new URL(BASE, location.href).href;
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
  /** Edit mode: this province is drawn as a polity of its own because its polity was split. */
  split?: number;
  /** Provinces: parent polity name, its Wikidata id, and the era the province list describes. */
  p?: string;
  pq?: string;
  era?: string;
  /** Societies: the network a hub label belongs to, and its main hubs as text. */
  ent?: number;
  hubs?: string;
  /** Societies: the sphere or group a network belongs to (sets its colour). */
  grp?: string;
  /** Societies: 'network' (1,000 km or more) or 'faction' (smaller, or a single hub or area). */
  sc?: string;
  /** Societies: power types it wields, and the lineage of its sphere. */
  pw?: string;
  lin?: string;
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
type Lens = 'polities' | 'peoples' | 'societies' | 'ideologies' | 'worldviews' | 'biomes';
const LENSES: Lens[] = ['polities', 'peoples', 'societies', 'ideologies', 'worldviews', 'biomes'];
/** Lenses that recolour the polity shapes by a rule-based class (src/thematic.ts). */
type ThemeLens = 'societies' | 'ideologies' | 'worldviews';
const isThemeLens = (lens: Lens): lens is ThemeLens => lens === 'ideologies' || lens === 'worldviews' || lens === 'societies';
/** Each thematic lens: its fill layer and the feature-state key that holds its colour. */
const THEME_FILLS: [ThemeLens, string, string][] = [
  ['ideologies', 'ideo-fill', 'ideo'],
  ['worldviews', 'world-fill', 'world'],
  ['societies', 'ctrl-fill', 'ctrl'],
];

const params = new URLSearchParams(location.hash.replace(/^#/, ''));
const num = (key: string, fallback: number): number => {
  const value = Number.parseFloat(params.get(key) ?? '');
  return Number.isFinite(value) ? value : fallback;
};
let year = clamp(Math.round(num('year', 150)), MIN_YEAR, MAX_YEAR);
// Old links used lens=civilizations; the lens is called Peoples since 13 Nov 2026.
const requestedLens = (params.get('lens') === 'civilizations' ? 'peoples' : params.get('lens')) as Lens | null;
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
const pSummary = $<HTMLParagraphElement>('p-summary');
const pFallback = $('p-fallback');
const pFigure = $('p-figure');
const pImage = $<HTMLImageElement>('p-image');
const pFigureKind = $('p-figure-kind');
const pFigureLink = $<HTMLAnchorElement>('p-figure-link');
const pProfile = $('p-profile');
const pSubs = $('p-subs');
const pStack = $('p-stack');
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

/** Real polity records that edit mode hides or redraws from the edit source (by record index k). */
let editExcluded: number[] = [];
const rawYearFilter = (value: number): Filter => [
  'all', ['<=', ['get', 's'], value], ['>=', ['get', 'e'], value],
];
const yearFilter = (value: number): Filter => editExcluded.length
  ? ['all', rawYearFilter(value), ['!', ['in', ['get', 'k'], ['literal', editExcluded]]]]
  : rawYearFilter(value);
/** Polities drawn from the edit source: no exclusion, and never realm-only groups. */
const editLayerFilter = (value: number): Filter => ['all', rawYearFilter(value), ['!', ['has', 'g']]];
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

/**
 * The land is a pale tan (brightness about 203 of 255). Civilization fills lighter than these caps
 * sit too close to it to be seen (Tocharians, steppe peoples, broad washes), so they are darkened
 * toward black until they stand out. Hue is kept.
 */
const MAX_FILL_LIGHTNESS = 145;
const MAX_WASH_LIGHTNESS = 160;
function capLightness(hex: string, max: number): string {
  const m = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!m) return hex;
  const n = Number.parseInt(m[1], 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  const lightness = 0.299 * r + 0.587 * g + 0.114 * b;
  if (lightness <= max) return hex;
  const f = max / lightness;
  const part = (v: number): string => Math.round(v * f).toString(16).padStart(2, '0');
  return `#${part(r)}${part(g)}${part(b)}`;
}

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
  'edit-fill': editLayerFilter,
  'edit-line': editLayerFilter,
  'polity-fill': leafFilter,
  'polity-line': leafFilter,
  'polity-realm-casing': realmFilter,
  'polity-realm-line': realmFilter,
  'sub-fill': (value) => ['all', yearFilter(value), ['!', ['has', 'bd']]],
  'sub-line': (value) => ['all', yearFilter(value), ['has', 'bd'], ...(editExcludedParents.length ? [['!', ['in', ['get', 'p'], ['literal', editExcludedParents]]] as Filter] : [])],
  'subedit-fill': editLayerFilter,
  'subedit-line': editLayerFilter,
  'ideo-fill': leafFilter,
  'ideo-line': leafFilter,
  'world-fill': leafFilter,
  'world-line': leafFilter,
  'ctrl-fill': leafFilter,
  'ctrl-line': leafFilter,
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
  polities: ['polity-fill', 'polity-line', 'polity-realm-casing', 'polity-realm-line', 'polity-hl', 'edit-fill', 'edit-line', 'edit-hl', 'subedit-fill', 'subedit-line', 'subedit-hl', 'sub-fill', 'sub-line', 'sub-hl'],
  peoples: ['civilization-fill', 'civilization-casing', 'civilization-line', 'civilization-hl'],
  societies: ['ctrl-fill', 'ctrl-line', 'ctrl-hl', 'soc-zone-fill', 'soc-zone-line', 'soc-route-casing', 'soc-route', 'soc-route-sea', 'soc-node', 'soc-mark-badge', 'soc-mark', 'soc-hl-route', 'soc-hl-zone', 'soc-hl-node'],
  ideologies: ['ideo-fill', 'ideo-line', 'ideo-hl'],
  worldviews: ['world-fill', 'world-line', 'world-hl'],
  biomes: ['biome-raster', 'eco-lines', 'ocean-mask'],
};

const fillLayerOf = (lens: Lens): string | null =>
  lens === 'polities' ? 'polity-fill' : lens === 'peoples' ? 'civilization-fill'
    : lens === 'ideologies' ? 'ideo-fill' : lens === 'worldviews' ? 'world-fill' : null;
const highlightLayerOf = (lens: Lens): string | null =>
  lens === 'polities' ? 'polity-hl' : lens === 'peoples' ? 'civilization-hl'
    : lens === 'ideologies' ? 'ideo-hl' : lens === 'worldviews' ? 'world-hl' : null;

/** Province shapes carry keys from here up, so they never clash with polity keys. */
const SUB_K = 1_000_000;
/** From this zoom, internal borders and province names replace the parent polity's name. */
const SUB_ZOOM = 3.4;
/** From this zoom the dashed province borders start to fade in, so a click inside one picks the province. */
const SUB_PICK_ZOOM = SUB_ZOOM - 1.2;
let subProps: Props[] = [];
let subParents = new Set<string>();
let polityProps: Props[] = [];
/** The real polity records and their shapes by index k; edit mode never changes these. */
let basePolityProps: Props[] = [];
/** Shapes of real polities and provinces, fetched in small chunks only when an edit needs one. */
const SHAPE_CHUNK = 150;
const shapeChunks = new Map<string, Promise<unknown[]>>();
function realShape(k: number): Promise<unknown> {
  const isSub = k >= SUB_K;
  const index = isSub ? k - SUB_K : k;
  const chunk = Math.floor(index / SHAPE_CHUNK);
  const url = `${BASE}data/${isSub ? 'subdivision' : 'polity'}-shapes/${chunk}.json`;
  let loading = shapeChunks.get(url);
  if (!loading) {
    loading = getJson<unknown[]>(url);
    shapeChunks.set(url, loading);
    loading.catch(() => shapeChunks.delete(url));
  }
  return loading.then((list) => list[index - chunk * SHAPE_CHUNK]);
}
/** The real province records (by k - SUB_K), the provinces of each polity name, and polity records by name. */
let baseSubProps: Props[] = [];
let subsByParent = new Map<string, Props[]>();
let polityIdsByName = new Map<string, number[]>();
/** Colours for the provinces of a split polity (each province becomes a polity of its own). */
const SPLIT_PALETTE = ['#b5574f', '#d08a45', '#cdb050', '#8fa655', '#5f9e6e', '#4f9f95', '#5a9bb8', '#6b86c2', '#8878b8', '#a76fa4', '#c46f8d', '#9a6b52'];
const overlaps = (a: { s: number; e: number }, b: { s: number; e: number }): boolean => a.s <= b.e && a.e >= b.s;
/** Provinces belonging to a real polity record (same name, overlapping years). */
const provincesOfPolity = (k: number): Props[] => {
  const real = basePolityProps[k];
  return real ? (subsByParent.get(real.n) ?? []).filter((item) => overlaps(item, real)) : [];
};
/** Parent names whose province border lines are hidden (a polity removed or split in the edited world). */
let editExcludedParents: string[] = [];
let editSeq = 0;
let editActive = false;
let editUi: ReturnType<typeof initEditUi> | null = null;
let civilizationProps: Props[] = [];
/** Societies: one record per network, and the label items (titles and hubs). */
let societyProps: Props[] = [];
let biomeModel: BiomeModel | null = null;

const polityLabels = new LabelLayer<Props>(map, (p) => {
  if (activeLens === 'ideologies' || activeLens === 'worldviews') {
    openThemePanel(p);
    return;
  }
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
}, 2.8);
// Names may overhang their shape (as for societies and ecoregions); collisions still decide what
// shows. Fitting inside the shape hid every small identity until it was clicked.
civilizationLabels.minScore = 14;
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
  if (activeLens === 'ideologies' || activeLens === 'worldviews') return polityLabels;
  if (activeLens === 'peoples') return civilizationLabels;
  if (activeLens === 'societies') return societyLabels;
  return biomeLabels;
}

function lensProps(lens: Lens): Props[] {
  return lens === 'polities' || lens === 'ideologies' || lens === 'worldviews' ? polityProps
    : lens === 'peoples' ? civilizationProps : lens === 'societies' ? societyProps : [];
}

// ---- Thematic lenses: Ideologies, Worldviews, and de facto control under Societies -------------
/** Realm colours from the realm-group shapes, so each dynastic realm keeps its own colour. */
let realmColours = new Map<string, string>();
/** The class each active polity got for the current year and lens, for clicks and the legend. */
let themeVerdicts = new Map<number, Verdict>();
/** What has been written into feature state, per lens, so unchanged shapes are not touched again. */
const themeApplied: Record<ThemeLens, Map<number, string>> = { ideologies: new Map(), worldviews: new Map(), societies: new Map() };

function classify(lens: ThemeLens, p: Props, atYear: number): Verdict {
  if (lens === 'ideologies') return ideologyOf(p, atYear);
  if (lens === 'worldviews') return worldviewOf(p, atYear);
  return controlOf(p, atYear);
}

/** Fill colour and opacity for a verdict: self-governing polities keep a faint wash of their own colour. */
function themePaint(lens: ThemeLens, verdict: Verdict, p: Props): { colour: string; opacity: number } {
  if (lens !== 'societies') return { colour: verdict.theme.colour, opacity: verdict.theme.id === 'unclassified' ? 0.35 : 0.82 };
  if (verdict.theme.id === 'self') return { colour: p.c, opacity: 0.16 };
  if (verdict.theme.id.startsWith('realm:')) return { colour: realmColours.get(verdict.theme.name) ?? verdict.theme.colour, opacity: 0.6 };
  return { colour: verdict.theme.colour, opacity: 0.62 };
}

/** Classify every polity shape active this year and write its colour into feature state. */
function applyThemes(): void {
  if (!isThemeLens(activeLens) || !map.getSource('polities')) return;
  const lens = activeLens;
  const state = THEME_FILLS.find(([l]) => l === lens)?.[2] as string;
  const applied = themeApplied[lens];
  themeVerdicts = new Map();
  for (const p of basePolityProps) {
    if (p.g || p.s > year || p.e < year) continue;
    const verdict = classify(lens, p, year);
    themeVerdicts.set(p.k, verdict);
    const { colour, opacity } = themePaint(lens, verdict, p);
    const sig = `${colour}|${opacity}`;
    if (applied.get(p.k) === sig) continue;
    applied.set(p.k, sig);
    map.setFeatureState({ source: 'polities', sourceLayer: 'polities', id: p.k }, { [state]: colour, [`${state}Op`]: opacity });
  }
}

/** The themes present this year with how many polities each covers, most common first. */
function themeCounts(): { theme: Theme; colour: string; count: number }[] {
  const counts = new Map<string, { theme: Theme; colour: string; count: number }>();
  for (const [k, verdict] of themeVerdicts) {
    const lens = activeLens as ThemeLens;
    const p = basePolityProps[k];
    if (lens === 'societies' && verdict.theme.id === 'self') continue;
    const colour = p ? themePaint(lens, verdict, p).colour : verdict.theme.colour;
    const entry = counts.get(verdict.theme.id);
    if (entry) entry.count++;
    else counts.set(verdict.theme.id, { theme: verdict.theme, colour, count: 1 });
  }
  return [...counts.values()].sort((a, b) => b.count - a.count || a.theme.name.localeCompare(b.theme.name));
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

/** Legend rows for the thematic classes active this year (Ideologies, Worldviews, or control under Societies). */
function themeLegendRows(limit: number): HTMLElement[] {
  const rows: HTMLElement[] = [];
  for (const { theme, colour, count } of themeCounts().slice(0, limit)) {
    const row = document.createElement('div');
    row.className = 'legend-row';
    row.title = theme.blurb;
    const chip = document.createElement('i');
    chip.style.background = colour;
    const label = document.createElement('span');
    label.textContent = theme.name;
    const total = document.createElement('em');
    total.textContent = String(count);
    row.append(chip, label, total);
    rows.push(row);
  }
  return rows;
}

function renderLegend(): void {
  renderEraNote();
  legendBody.replaceChildren();
  if (activeLens !== 'peoples' && activeLens !== 'societies' && activeLens !== 'ideologies' && activeLens !== 'worldviews') {
    legend.hidden = true;
    return;
  }
  legend.hidden = false;

  if (activeLens === 'ideologies' || activeLens === 'worldviews') {
    legendTitle.textContent = activeLens === 'ideologies' ? 'How it was governed' : 'Faith and philosophy';
    const rows = themeLegendRows(40);
    if (rows.length) legendBody.append(...rows);
    else legendBody.textContent = 'No polities are mapped for this year.';
    const fine = document.createElement('p');
    fine.className = 'legend-fine';
    fine.textContent = 'This project’s first-pass rules (named regimes, then region and era). Click a place to see why.';
    legendBody.append(fine);
    return;
  }

  if (activeLens === 'societies') {
    // De facto control first: who actually ran each place, under the networks.
    const head = document.createElement('div');
    head.className = 'legend-sub';
    head.textContent = 'De facto control';
    legendBody.append(head);
    const control = themeLegendRows(14);
    if (control.length) legendBody.append(...control);
    const self = document.createElement('p');
    self.className = 'legend-fine';
    self.textContent = control.length
      ? 'Faint wash: self-governing. Click a place for who ran it and why.'
      : 'Every polity here governed itself this year (faint wash). Click a place for details.';
    legendBody.append(self);
    const nets = document.createElement('div');
    nets.className = 'legend-sub';
    nets.textContent = 'Networks · click to filter';
    legendBody.append(nets);
    legendTitle.textContent = 'Who actually ran things';
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
    if (!present.size) {
      const none = document.createElement('p');
      none.className = 'legend-fine';
      none.textContent = 'No networks are mapped for this year.';
      legendBody.append(none);
    }
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

  if (activeLens === 'peoples') {
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

    applyYearFilters();
    applyThemes();

    if (activeLens === 'biomes') renderBiomes();
    subParents = new Set(subProps.filter((item) => item.s <= year && item.e >= year).map((item) => item.p as string));
    polityLabels.setYear(year, activeLens === 'polities' || activeLens === 'ideologies' || activeLens === 'worldviews');
    subLabels.setYear(year, activeLens === 'polities');
    civilizationLabels.setYear(year, activeLens === 'peoples');
    societyLabels.setYear(year, activeLens === 'societies');
    renderLegend();
    if (activeLens === 'biomes' && !panel.hidden && biomePoint) scheduleBiomePanel();
    if (!panel.hidden && panelQid && activeLens === 'polities') refreshPanelForYear();
    if (!panel.hidden && themePanelFor) refreshThemePanel();
    if (!panel.hidden) renderSheet();
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

function renderSummary(summary: WikiSummary): void {
  pSummary.classList.remove('muted', 'error');
  pSummary.textContent = summary.extract;
  pLink.href = summary.url;
  pLink.textContent = 'Read on Wikipedia';
  pLink.title = summary.title;
}

/** Feeds the entity sheet: this project's own facts and Wikidata's. The sheet is redrawn from them. */
function renderFacts(facts: WikiFacts | null, extraFacts: WikiFact[] = []): void {
  panelSheet = { own: extraFacts, wikidata: facts?.facts ?? [] };
  renderSheet();

  pWdLink.hidden = !facts;
  if (facts) pWdLink.href = `https://www.wikidata.org/wiki/${facts.qid}`;
}

function renderFallback(name: string, hits: { title: string; snippet: string }[]): void {
  pSummary.classList.remove('error');
  pSummary.classList.add('muted');
  const label = activeLens === 'peoples' ? 'people' : activeLens === 'biomes' ? 'ecoregion' : 'polity';
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

/** The flag and the province list follow the year; the stat sheet is redrawn right after. */
function refreshPanelForYear(): void {
  if (!panelQid || panel.hidden || activeLens !== 'polities') return;
  applyPolityFlag();
  renderSubdivisions();
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

async function loadInfobox(title: string | null, ticket: number, signal: AbortSignal): Promise<void> {
  if (!title) return;
  try {
    const sections = await getInfobox(title, signal);
    if (ticket !== panelTicket) return;
    panelInfobox = organiseInfobox(sections);
    renderSheet();
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

// ---- Polity stat sheet (fixed rows, fixed order; see src/profile.ts) ----------------------------
let profileActive = false;
let panelInfobox: OrganisedInfobox | null = null;
let panelSheet: { own: WikiFact[]; wikidata: WikiFact[] } | null = null;
let panelProfile: { data: ProfileData | null; wb: WorldBank | null; maddison?: MaddisonCountry; curated: Curated[string] | undefined; realm?: string; leaders?: Leader[] } | null = null;

let rulersOpen = false;

/** Every ruler on record in order, with the ones in office this year highlighted. */
function rulerTimeline(history: Leader[], current: Leader[]): HTMLElement {
  const details = document.createElement('details');
  details.className = 'prof-timeline';
  details.open = rulersOpen;
  details.addEventListener('toggle', () => {
    rulersOpen = details.open;
  });
  const summary = document.createElement('summary');
  summary.textContent = `Rulers through time (${history.length})`;
  details.append(summary);
  const keys = new Set(current.map((l) => `${l.name}|${l.office ?? ''}|${l.start}`));
  const ol = document.createElement('ol');
  for (const leader of [...history].sort((a, b) => a.start - b.start || a.name.localeCompare(b.name))) {
    const li = document.createElement('li');
    if (keys.has(`${leader.name}|${leader.office ?? ''}|${leader.start}`)) li.className = 'current';
    const name = document.createElement('span');
    name.textContent = leader.office && /government/i.test(leader.office) ? `${leader.name} (head of government)` : leader.name;
    const years = document.createElement('span');
    years.className = 'years';
    years.textContent = fmtReign(leader);
    li.append(name, years);
    ol.append(li);
  }
  details.append(ol);
  return details;
}

/** Values longer than this fold behind a "more" button so one row cannot push the sheet off screen. */
const FOLD_AT = 240;

/** A value as plain text, or as safe DOM with its Wikipedia links when the source had them. */
function valueSpan(text: string, node?: Node): HTMLElement {
  const span = document.createElement('span');
  span.className = 'val';
  if (node) span.append(node.cloneNode(true));
  else span.textContent = text;
  if (text.length <= FOLD_AT) return span;
  span.classList.add('clamp');
  const more = document.createElement('button');
  more.type = 'button';
  more.className = 'more';
  more.textContent = 'more';
  more.addEventListener('click', () => {
    const folded = span.classList.toggle('clamp');
    more.textContent = folded ? 'more' : 'less';
  });
  const holder = document.createElement('span');
  holder.append(span, ' ', more);
  return holder;
}

/** The other sources' readings of a row, folded under it. */
function altsBlock(alts: NonNullable<ProfileRow['alts']>): HTMLElement {
  const details = document.createElement('details');
  details.className = 'alts';
  const summary = document.createElement('summary');
  summary.textContent = `Also reported · ${alts.length}`;
  details.append(summary);
  for (const alt of alts) {
    const line = document.createElement('div');
    line.className = 'alt';
    const source = document.createElement('b');
    source.textContent = alt.source;
    line.append(source, ' ', valueSpan(alt.text, alt.node));
    if (alt.note) {
      const note = document.createElement('small');
      note.textContent = alt.note;
      line.append(' ', note);
    }
    details.append(line);
  }
  return details;
}

function drawSheet(groups: ProfileGroup[], fineText: string): void {
  pProfile.replaceChildren();
  for (const group of groups) {
    const section = document.createElement('section');
    section.className = 'prof-sec';
    const title = document.createElement('h4');
    title.textContent = group.title;
    const list = document.createElement('dl');
    list.className = 'prof';
    for (const row of group.rows) {
      const dt = document.createElement('dt');
      dt.textContent = row.label;
      if (row.extra) {
        dt.className = 'wp';
        dt.title = 'From the Wikipedia infobox';
      }
      const dd = document.createElement('dd');
      if (row.value === '—' || row.value === '…') {
        dd.className = 'empty';
        dd.textContent = row.value;
      } else {
        dd.append(valueSpan(row.value, row.node));
      }
      if (row.note) {
        const note = document.createElement('small');
        note.textContent = row.note;
        if (row.far) note.className = 'far';
        dd.append(' ', note);
      }
      if (row.alts?.length) dd.append(altsBlock(row.alts));
      if (row.source) dd.title = `Source: ${row.source}`;
      list.append(dt, dd);
    }
    section.append(title, list);
    if (group.timeline) section.append(rulerTimeline(group.timeline.history, group.timeline.current));
    pProfile.append(section);
  }
  const fine = document.createElement('p');
  fine.className = 'prof-fine';
  fine.textContent = fineText;
  pProfile.append(fine);
  pProfile.hidden = false;
}

const POLITY_FINE =
  'Dashes mean no figure is on record. Years in grey are the nearest year with data. “Also reported” lists what other sources say; rows in a dimmer label come straight from the Wikipedia infobox. Sources: curated figures, World Bank (CC BY 4.0, modern states), Maddison Project (CC BY 4.0, from 1 CE), Wikidata (CC0), Wikipedia infobox (CC BY-SA).';
const GENERIC_FINE =
  'Only rows with data are listed. “Also reported” lists what other sources say; every Wikipedia infobox row is kept. Sources: this project’s curated data, Wikidata (CC0), Wikipedia infobox (CC BY-SA).';

/** Redraws the one sheet: the fixed polity sheet, or the shared sheet for every other entity. */
function renderSheet(): void {
  if (profileActive) {
    if (!panelProfile) return; // the dash skeleton stays up until the data arrives
    drawSheet(buildSheet({
      year,
      data: panelProfile.data,
      wb: panelProfile.wb,
      maddison: panelProfile.maddison,
      curated: panelProfile.curated,
      realm: panelProfile.realm,
      infobox: panelInfobox ?? undefined,
      leaders: panelProfile.leaders,
    }), POLITY_FINE);
    return;
  }
  if (!panelSheet) return;
  drawSheet(buildGenericSheet({
    year,
    kind: pKind.textContent ?? 'Details',
    own: panelSheet.own,
    wikidata: panelSheet.wikidata,
    infobox: panelInfobox ?? undefined,
  }), GENERIC_FINE);
}

async function loadProfile(qid: string | null, realm: string | undefined, ticket: number, signal: AbortSignal): Promise<void> {
  profileActive = true;
  panelProfile = null;
  drawSheet(emptySheet(), POLITY_FINE);
  try {
    const rulers = qid ? getLeaderHistory(qid, signal).catch((error) => {
      if (error instanceof DOMException && error.name === 'AbortError') throw error;
      return [] as Leader[];
    }) : Promise.resolve([] as Leader[]);
    const [data, curatedAll] = await Promise.all([qid ? getProfileData(qid, signal) : Promise.resolve(null), getCurated(BASE)]);
    if (ticket !== panelTicket) return;
    const [wb, maddisonAll] = await Promise.all([getWorldBank(data?.iso, signal), getMaddison(BASE)]);
    if (ticket !== panelTicket) return;
    const code = maddisonCode(qid ?? undefined, data?.iso);
    panelProfile = { data, wb, maddison: code ? maddisonAll[code] : undefined, curated: qid ? curatedAll[qid] : undefined, realm };
    renderSheet();
    const leaders = await rulers;
    if (ticket !== panelTicket) return;
    panelProfile = { ...panelProfile, leaders };
    renderSheet();
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') return;
    if (ticket !== panelTicket) return;
    panelProfile = { data: null, wb: null, curated: undefined, realm, leaders: [] };
    renderSheet();
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
  pFallback.hidden = true;
  pFallback.replaceChildren();
  hideFigure();
  pProfile.hidden = true;
  pProfile.replaceChildren();
  panelProfile = null;
  profileActive = false;
  panelInfobox = null;
  panelSheet = null;
  pSubs.hidden = true;
  pSubs.replaceChildren();
  pStack.hidden = true;
  pStack.replaceChildren();
  themePanelFor = null;
  themePanelTheme = '';
  panelFacts = null;
  panelSubs = [];
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

/**
 * Draw a world on top of the real polities. Changed records are taken out of the base layers and
 * drawn from their own small source; hidden ones are just taken out. The real data is untouched.
 */
async function applyEdits(ops: Map<number, Override>): Promise<number> {
  const seq = ++editSeq;
  // Which shapes does this world need? Edited polities and provinces, and every province of a split polity.
  const wanted = new Set<number>();
  for (const [k, o] of ops) {
    const real = k >= SUB_K ? baseSubProps[k - SUB_K] : basePolityProps[k];
    if (!real) continue;
    if (k < SUB_K && o.split) {
      for (const prov of provincesOfPolity(k)) if (!ops.get(prov.k)?.hide) wanted.add(prov.k);
    } else if (!o.hide) wanted.add(k);
  }
  const shapes = new Map<number, unknown>();
  let failed = 0;
  await Promise.all([...wanted].map(async (k) => {
    try {
      shapes.set(k, await realShape(k));
    } catch {
      failed++;
    }
  }));
  if (seq !== editSeq) return failed; // a newer change superseded this one

  const polyFeatures: unknown[] = [];
  const subFeatures: unknown[] = [];
  const hiddenPolities = new Set<number>();
  const hiddenSubs = new Set<number>();
  const splitSubs = new Set<number>();
  editExcluded = [];
  editExcludedParents = [];
  polityProps = basePolityProps.slice();
  subProps = baseSubProps.slice();
  const splitLabels: Props[] = [];

  // Province edits first, so a split polity's provinces pick up their own renames and colours.
  const subEdit = (prov: Props): Props | null => {
    const o = ops.get(prov.k);
    if (o?.hide) return null;
    const years = effectiveYears(prov, o);
    return { ...prov, n: o?.name ?? prov.n, c: o?.colour ?? prov.c, s: years.s, e: years.e };
  };
  for (const [k, o] of ops) {
    if (k >= SUB_K) {
      const real = baseSubProps[k - SUB_K];
      if (!real) continue;
      editExcluded.push(k);
      if (o.hide) { hiddenSubs.add(k); continue; }
      const geometry = shapes.get(k);
      if (!geometry) { editExcluded.pop(); continue; } // shape unavailable: leave the real province showing
      const props = subEdit(real) as Props;
      subProps[k - SUB_K] = props;
      subFeatures.push({ type: 'Feature', properties: props, geometry });
      continue;
    }
    const real = basePolityProps[k];
    if (!real) continue;
    if (o.hide || o.split) {
      editExcluded.push(k);
      hiddenPolities.add(k);
      const provs = provincesOfPolity(k);
      for (const prov of provs) editExcluded.push(prov.k);
      editExcludedParents.push(real.n);
      if (o.split) {
        provs.forEach((prov, i) => {
          const props = subEdit(prov);
          if (!props) return;
          const geometry = shapes.get(prov.k);
          if (!geometry) return;
          const own = ops.get(prov.k);
          const shown: Props = { ...props, c: own?.colour ?? SPLIT_PALETTE[i % SPLIT_PALETTE.length] };
          shown.split = 1;
          subProps[prov.k - SUB_K] = shown;
          splitSubs.add(prov.k);
          subFeatures.push({ type: 'Feature', properties: shown, geometry });
          splitLabels.push(shown);
        });
      }
      continue;
    }
    const geometry = shapes.get(k);
    if (!geometry) continue; // shape unavailable: leave the real polity showing rather than lose it
    editExcluded.push(k);
    const years = effectiveYears(real, o);
    const props: Props = { ...real, n: o.name ?? real.n, c: o.colour ?? real.c, s: years.s, e: years.e };
    polityProps[k] = props;
    polyFeatures.push({ type: 'Feature', properties: props, geometry });
  }

  (map.getSource('polities-edit') as maplibregl.GeoJSONSource | undefined)?.setData({ type: 'FeatureCollection', features: polyFeatures } as GeoData);
  (map.getSource('subs-edit') as maplibregl.GeoJSONSource | undefined)?.setData({ type: 'FeatureCollection', features: subFeatures } as GeoData);
  // Labels: split provinces are named like polities (at every zoom); other provinces keep their zoomed-in labels.
  const hiddenProvinceOfPolity = new Set<number>();
  for (const k of hiddenPolities) for (const prov of provincesOfPolity(k)) hiddenProvinceOfPolity.add(prov.k);
  polityLabels.setFeatures([...polityProps.filter((_, k) => !hiddenPolities.has(k)), ...splitLabels]);
  subLabels.setFeatures(subProps.filter((item) => !hiddenSubs.has(item.k) && !hiddenProvinceOfPolity.has(item.k) && !splitSubs.has(item.k)));
  subParents = new Set(subProps.filter((item) => item.s <= year && item.e >= year && !hiddenProvinceOfPolity.has(item.k)).map((item) => item.p as string));
  if (selectedKey >= 0) selectedProps = (selectedKey >= SUB_K ? subProps[selectedKey - SUB_K] : polityProps[selectedKey]) ?? selectedProps;
  applyYearFilters();
  polityLabels.setYear(year, activeLens === 'polities');
  subLabels.setYear(year, activeLens === 'polities');
  return failed;
}

/** Re-run every year filter (the year changed, or edit mode changed what is hidden). */
function applyYearFilters(): void {
  for (const [id, make] of Object.entries(YEAR_FILTERS)) {
    if (map.getLayer(id)) map.setFilter(id, make(year));
  }
  setHighlight(selectedKey >= 0 ? selectedProps : null);
}

function setHighlight(p: Props | null): void {
  for (const id of ['subedit-hl', 'edit-hl', 'polity-hl', 'civilization-hl', 'sub-hl', 'soc-hl-route', 'soc-hl-zone', 'soc-hl-node', 'ideo-hl', 'world-hl', 'ctrl-hl']) {
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
  if (id === 'polity-hl' && map.getLayer('edit-hl')) {
    map.setFilter('edit-hl', ['all', rawYearFilter(year), ['==', ['get', 'k'], p.k]]);
  }
  if (id === 'sub-hl' && map.getLayer('subedit-hl')) {
    map.setFilter('subedit-hl', ['all', rawYearFilter(year), ['==', ['get', 'k'], p.k]]);
  }
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

pOthersHead.addEventListener('click', () => {
  if (pOthers.classList.contains('foldable')) pOthers.classList.toggle('folded');
});

function renderOthers(current: Props): void {
  pOthersList.replaceChildren();
  const others = overlapSet.filter((item) => item.k !== current.k);
  pOthers.hidden = others.length === 0;
  const civilizations = activeLens === 'peoples';
  const provinces = !civilizations && others.length > 0 && current.k < SUB_K && others.every((item) => item.k >= SUB_K);
  pOthersHead.textContent = activeLens === 'societies' ? 'Networks here' : civilizations ? 'Where you stand · peer identities' : provinces ? `Provinces (approximate) · ${others.length}` : 'Also here';
  // A long list of provinces would push the stat sheet off the screen: fold it up until asked for.
  const foldable = provinces && others.length > 4;
  pOthers.classList.toggle('foldable', foldable);
  pOthers.classList.toggle('folded', foldable);
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
  if (activeLens !== 'peoples' || !stages || stages.length < 2) {
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

// ---- Theme panel (Ideologies, Worldviews, de facto control) ----------------------------------
/** The polity whose class the panel shows, while a thematic panel is open. */
let themePanelFor: Props | null = null;
let themePanelTheme = '';

/** Several Wikipedia articles, one after another, for a theme (for example deism, then skepticism). */
async function loadStack(titles: string[], ticket: number, signal: AbortSignal): Promise<void> {
  pStack.replaceChildren();
  pStack.hidden = false;
  const head = document.createElement('div');
  head.className = 'stack-head';
  head.textContent = titles.length > 1 ? `From Wikipedia · ${titles.length} articles` : 'From Wikipedia';
  pStack.append(head);
  const blocks = titles.map((title) => {
    const block = document.createElement('section');
    block.className = 'stack-item';
    const h = document.createElement('h4');
    const a = document.createElement('a');
    a.href = wikiUrl(title);
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.textContent = title;
    h.append(a);
    const text = document.createElement('p');
    text.className = 'muted';
    text.textContent = 'Loading…';
    block.append(h, text);
    pStack.append(block);
    return { block, a, text, title };
  });
  await Promise.all(blocks.map(async ({ a, text, title }) => {
    try {
      const summary = await getSummary(title, signal);
      if (ticket !== panelTicket) return;
      if (!summary) {
        a.href = wikiSearchUrl(title);
        text.textContent = 'No article with this exact title; the link searches Wikipedia.';
        return;
      }
      a.href = summary.url;
      a.textContent = summary.title;
      text.classList.remove('muted');
      const extract = summary.extract ?? '';
      text.textContent = extract.length > 700 ? `${extract.slice(0, 680).replace(/\s+\S*$/, '')}…` : extract;
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      if (ticket !== panelTicket) return;
      a.href = wikiSearchUrl(title);
      text.textContent = 'Could not reach Wikipedia.';
    }
  }));
}

const THEME_KIND: Record<ThemeLens, string> = { ideologies: 'Ideology', worldviews: 'Worldview', societies: 'De facto control' };

/** Open the class a polity has in the active thematic lens: its articles, the reason, and a way back to the polity. */
function openThemePanel(p: Props): void {
  if (!isThemeLens(activeLens)) return;
  const lens = activeLens;
  const verdict = classify(lens, p, year);
  selectedKey = p.k;
  selectedProps = p;
  panelQid = null;
  themePanelFor = p;
  themePanelTheme = verdict.theme.id;
  const ticket = resetPanel();
  themePanelFor = p;
  themePanelTheme = verdict.theme.id;
  const controller = panelAbort as AbortController;
  const { colour } = themePaint(lens, verdict, p);

  pName.textContent = verdict.theme.name;
  pName.title = verdict.theme.name;
  pKind.textContent = THEME_KIND[lens];
  pSource.textContent = 'Project rules';
  pSwatch.style.background = colour;
  pYears.textContent = `${p.n} · ${fmtYear(year)}`;
  pNote.hidden = verdict.why === verdict.theme.blurb;
  pNote.textContent = `Why: ${verdict.why}`;
  pSummary.textContent = verdict.theme.blurb;
  pLink.href = wikiUrl(verdict.theme.articles[0] ?? p.n);
  pLink.textContent = 'Read on Wikipedia';
  pFine.textContent = 'Classes and reasons: this project’s first-pass rules (src/thematic.ts, docs/THEMATIC-LENSES.md), not a published dataset · Text: Wikipedia (CC BY-SA)';

  // A way back to the polity itself, and to the others in the same class this year.
  pOthersList.replaceChildren();
  pOthersHead.textContent = 'This polity';
  pOthers.classList.remove('foldable', 'folded');
  const back = document.createElement('button');
  back.type = 'button';
  const dot = document.createElement('i');
  dot.style.background = p.c;
  const label = document.createElement('span');
  label.textContent = `${p.n} · open as a polity`;
  back.append(dot, label);
  back.addEventListener('click', () => {
    setLens('polities');
    openPanel(p);
  });
  pOthersList.append(back);
  pOthers.hidden = false;

  showPanel();
  document.title = `${verdict.theme.name} · Unity of Being`;
  const hl = THEME_FILLS.find(([l]) => l === lens)?.[1].replace('-fill', '-hl');
  setHighlight(null);
  if (hl && map.getLayer(hl)) map.setFilter(hl, highlightFilter(year, p.k));
  updateSelection();
  // The articles first (their placeholders are added synchronously), then the other polities in the class.
  void loadStack(verdict.theme.articles, ticket, controller.signal);
  const peers = [...themeVerdicts].filter(([k, v]) => k !== p.k && v.theme.id === verdict.theme.id && verdict.theme.id !== 'self' && verdict.theme.id !== 'unclassified');
  if (peers.length) {
    const box = document.createElement('div');
    box.className = 'others stack-peers';
    const head = document.createElement('div');
    head.className = 'others-head';
    head.textContent = `Also ${verdict.theme.name} in ${fmtYear(year)} · ${peers.length}`;
    const list = document.createElement('div');
    list.className = 'others-list';
    box.append(head, list);
    pStack.append(box);
    for (const [k] of peers.slice(0, 40)) {
      const other = basePolityProps[k];
      if (!other) continue;
      const button = document.createElement('button');
      button.type = 'button';
      const chip = document.createElement('i');
      chip.style.background = colour;
      const name = document.createElement('span');
      name.textContent = other.n;
      button.append(chip, name);
      button.addEventListener('click', () => {
        map.easeTo({ center: [other.lx, other.ly], duration: 700 });
        openThemePanel(other);
      });
      list.append(button);
    }
  }
}

/** On a year change, reopen the panel if the polity's class changed (the polity may have ended). */
function refreshThemePanel(): void {
  const p = themePanelFor;
  if (!p || !isThemeLens(activeLens)) return;
  if (p.s > year || p.e < year) return;
  const verdict = classify(activeLens, p, year);
  if (verdict.theme.id !== themePanelTheme) openThemePanel(p);
  else pYears.textContent = `${p.n} · ${fmtYear(year)}`;
}

function openPanel(p: Props): void {
  if (activeLens === 'biomes') return;
  if (activeLens === 'ideologies' || activeLens === 'worldviews') {
    openThemePanel(p);
    return;
  }
  if (editActive && activeLens === 'polities') {
    // Edit mode: selecting a polity or province opens the toolbar's editor instead of the article.
    selectedKey = p.k;
    selectedProps = p;
    editUi?.select(p.k);
    updateSelection();
    return;
  }
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

  const civilizations = activeLens === 'peoples';
  const societies = activeLens === 'societies';
  const province = p.k >= SUB_K;
  pName.textContent = name;
  pName.title = name;
  pYears.textContent = province ? `Part of ${p.p} · ${p.era}` : fmtRange(p.s, p.e);
  pKind.textContent = province ? 'Province' : civilizations ? 'People' : societies ? 'Society' : p.g ? 'Realm' : 'Polity';
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
    if (p.lin && p.lin.includes(' > ')) extraFacts.push({ label: 'Lineage', value: p.lin.replace(/ > /g, ' → ') });
    if (p.pw) extraFacts.push({ label: 'Power', value: p.pw });
    if (p.kind) extraFacts.push({ label: 'Type', value: p.kind });
    if (p.sc) extraFacts.push({ label: 'Scale', value: p.sc === 'faction' ? 'Faction or local movement (under 1,000 km, or one hub or area)' : 'Network (1,000 km or more)' });
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
  }
  if (qid && !civilizations && !societies) void loadSubdivisions(qid, ticket, controller.signal);
  if (activeLens === 'polities' && !province) void loadProfile(qid, p.m, ticket, controller.signal);
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
  pOsmFrame.src = 'about:blank';
  selectedKey = -1;
  selectedProps = null;
  themePanelFor = null;
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
    // On phones the lens bar scrolls sideways; keep the chosen lens in view.
    const bar = button.parentElement;
    if (active && bar && bar.scrollWidth > bar.clientWidth) {
      bar.scrollTo({ left: button.offsetLeft - (bar.clientWidth - button.offsetWidth) / 2, behavior: 'smooth' });
    }
  }
}

function setLens(next: Lens): void {
  if (next === activeLens) return;
  if (next === 'peoples' && !civilizationProps.length) return;
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
    showVeil(next === 'peoples' ? 'Drawing peoples…' : next === 'societies' ? 'Drawing networks…' : next === 'biomes' ? 'Drawing climate…'
      : next === 'ideologies' ? 'Drawing governments…' : next === 'worldviews' ? 'Drawing worldviews…' : 'Drawing borders…');
  } else if (dataReady) {
    finishLoading();
  }
}

/** Only the active lens's label layers may draw; the others are cleared and refuse queued frames. */
function syncLabelLayers(): void {
  polityLabels.setEnabled(activeLens === 'polities' || activeLens === 'ideologies' || activeLens === 'worldviews');
  subLabels.setEnabled(activeLens === 'polities');
  civilizationLabels.setEnabled(activeLens === 'peoples');
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

// Step buttons: a tap moves the year by the amount on the button; holding repeats.
function stepYear(amount: number): void {
  if (playing) stopPlaying();
  setYear(year + amount);
  writeHash();
}
for (const button of document.querySelectorAll<HTMLButtonElement>('.step button')) {
  const amount = Number(button.dataset.step);
  let hold = 0;
  let repeat = 0;
  const stop = (): void => {
    window.clearTimeout(hold);
    window.clearInterval(repeat);
  };
  button.addEventListener('pointerdown', (event) => {
    if (event.button > 0) return;
    stepYear(amount);
    stop();
    // After a short hold, keep stepping (small steps repeat faster than big ones).
    hold = window.setTimeout(() => {
      repeat = window.setInterval(() => stepYear(amount), Math.abs(amount) >= 100 ? 220 : 90);
    }, 380);
  });
  for (const type of ['pointerup', 'pointercancel', 'pointerleave']) button.addEventListener(type, stop);
  // Keyboard activation (Enter or Space) arrives as a click with no pointer.
  button.addEventListener('click', (event) => { if (event.detail === 0) stepYear(amount); });
}
document.addEventListener('keydown', (event) => {
  const target = event.target as HTMLElement | null;
  if (target && (target.tagName === 'INPUT' || target.tagName === 'SELECT' || target.tagName === 'TEXTAREA')) return;
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    stepYear((event.key === 'ArrowLeft' ? -1 : 1) * (event.shiftKey ? 10 : 1));
    event.preventDefault();
  }
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

// ---- Loading splash ------------------------------------------------------------------------------
// The first load shows a full splash (globe, steps, a rotating fact). Later lens switches reuse the
// same element as a small toast ("compact").
const SPLASH_FACTS = [
  'The borders come from Cliopatria, part of the Seshat Global History Databank: about 12,500 dated shapes.',
  'Six lenses: who governed, who lived there, who really ran things, how they governed, what they believed, and the land itself.',
  'The Aral Sea, Lake Chad and Lake Texcoco shrink or vanish as the years go by.',
  'From 2016 the map shows the de jure world: occupied land is drawn under the state the law gives it to.',
  'Click any place for a Wikipedia summary, its infobox and figures from Wikidata and the World Bank.',
  'Worldviews stack several articles: a place can be Protestant, deist and Enlightened all at once.',
  'Societies draws de facto control: blocs, empires, occupiers and the networks that moved people and goods.',
  'Edit mode lets you build your own alternate history on top of the real borders.',
  'Biomes shift with a rough model of past climate: the green Sahara, the 4.2 ka drought, Maya droughts.',
];
const loadingFact = $('loading-fact');
let factTimer = 0;
let factIndex = Math.floor(Math.random() * SPLASH_FACTS.length);
function showFact(): void {
  loadingFact.textContent = SPLASH_FACTS[factIndex % SPLASH_FACTS.length];
  factIndex++;
}
showFact();
factTimer = window.setInterval(showFact, 4800);
function markStep(step: string): void {
  const items = [...loading.querySelectorAll<HTMLElement>('.splash-steps li')];
  const at = items.findIndex((item) => item.dataset.step === step);
  items.forEach((item, index) => {
    item.classList.toggle('done', index < at || step === 'all');
    item.classList.toggle('active', index === at);
  });
}
markStep('fetch');

let loadingDone = false;
let loadingHideTimer = 0;
let dataReady = false;
function finishLoading(): void {
  if (loadingDone || !dataReady) return;
  loadingDone = true;
  markStep('all');
  if (factTimer) {
    window.clearInterval(factTimer);
    factTimer = 0;
  }
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
  return activeLens === 'polities' || activeLens === 'ideologies' || activeLens === 'worldviews' ? 'polities'
    : activeLens === 'peoples' ? 'civilizations' : activeLens === 'societies' ? 'societies' : 'ocean';
}

/** Show the veil while a lens that has not drawn yet is being tiled. */
function showVeil(message: string): void {
  // A fade-out from an earlier lens switch must not hide this veil.
  if (loadingHideTimer) window.clearTimeout(loadingHideTimer);
  loadingHideTimer = 0;
  loadingDone = false;
  loading.hidden = false;
  loading.classList.add('compact');
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
    const [land, polityList, civilizationData, societyData, rivers, lakes, koppen, ecoBin, ecoMeta, ecoLines, ocean, subList] = await Promise.all([
      getJson(`${BASE}data/land.geojson`),
      getJson<Props[]>(`${BASE}data/polities-props.json`),
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
      getJson<Props[]>(`${BASE}data/subdivisions-props.json`).catch(() => null),
    ]);

    loadingText.textContent = 'Building map…';
    loadingProgress.style.width = '100%';
    markStep('build');

    // The big shape files are fetched by MapLibre's own worker (see the sources below), never parsed
    // here: doing both held several copies in memory and phones killed the tab (data/split-web-data.py).
    const civilizationFeatures = civilizationData?.features ?? [];
    civilizationFeatures.forEach((feature, index) => {
      feature.properties.k = index;
      // Broad "lighter wash" spheres and yellow or tan families nearly vanished against the land.
      const lv = Number(feature.properties.lv);
      feature.properties.c = capLightness(String(feature.properties.c), lv === 1 ? MAX_WASH_LIGHTNESS : MAX_FILL_LIGHTNESS);
    });
    // Provinces: polygons carry keys from SUB_K up (set in the data file); border lines (bd) carry none.
    subProps = (subList ?? []).map((props) => ({
      ...props,
      q: '',
      nt: `Provinces as in ${props.era}; borders are approximated from modern boundaries, so edges are rough.`,
    }));
    polityProps = polityList;
    basePolityProps = polityProps.slice();
    realmColours = new Map(polityList.filter((item) => item.g).map((item) => [item.n, item.c]));
    baseSubProps = subProps.slice();
    subsByParent = new Map();
    for (const item of baseSubProps) subsByParent.set(item.p as string, [...(subsByParent.get(item.p as string) ?? []), item]);
    polityIdsByName = new Map();
    basePolityProps.forEach((item) => polityIdsByName.set(item.n, [...(polityIdsByName.get(item.n) ?? []), item.k]));
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
    if (!civilizationProps.length) disable('peoples', 'Peoples data unavailable');
    if (!societyProps.length) disable('societies', 'Societies data unavailable');
    if (!biomeModel) disable('biomes', 'Biome data unavailable');
    if (activeLens === 'peoples' && !civilizationProps.length) activeLens = 'polities';
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
    // Polities and provinces are static vector tiles (data/build-tiles.mjs), not GeoJSON: parsing and
    // indexing the 40 MB of shapes took 2 GB or more and phones killed the tab.
    map.addSource('polities', {
      type: 'vector',
      // Each shape's key k is its feature id, so the Ideologies, Worldviews and Societies lenses can
      // colour it through feature state (see applyThemes) without rebuilding the tiles.
      promoteId: 'k',
      tiles: [`${dataBase}data/tiles/polities/{z}/{x}/{y}.pbf`],
      minzoom: 0,
      maxzoom: 6,
    });
    map.addSource('polities-edit', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: [] } as GeoData,
    });
    map.addSource('subs-edit', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: [] } as GeoData,
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
      type: 'vector',
      tiles: [`${dataBase}data/tiles/subdivisions/{z}/{x}/{y}.pbf`],
      minzoom: 0,
      maxzoom: 6,
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
      'source-layer': 'polities',
      filter: leafFilter(year),
      paint: { 'fill-color': ['get', 'c'], 'fill-opacity': 0.84 },
      layout: { visibility: visible('polities') },
    });
    // Thematic lenses: the same polity shapes, coloured by the class each one gets for the year.
    for (const [lens, id, state] of THEME_FILLS) {
      map.addLayer({
        id,
        type: 'fill',
        source: 'polities',
        'source-layer': 'polities',
        filter: leafFilter(year),
        paint: {
          'fill-color': ['to-color', ['coalesce', ['feature-state', state], '#5c656d']],
          'fill-opacity': ['to-number', ['coalesce', ['feature-state', `${state}Op`], 0]],
        },
        layout: { visibility: visible(lens) },
      });
    }
    map.addLayer({
      id: 'civilization-fill',
      type: 'fill',
      source: 'civilizations',
      filter: yearFilter(year),
      paint: {
        'fill-color': ['get', 'c'],
        'fill-opacity': localFade(0.7),
      },
      layout: { visibility: visible('peoples') },
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
      'source-layer': 'polities',
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
      'source-layer': 'polities',
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
      'source-layer': 'polities',
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
      'source-layer': 'polities',
      filter: NO_FEATURE,
      paint: { 'line-color': '#f6e7b8', 'line-width': 2.4, 'line-opacity': 0.95 },
      layout: { 'line-join': 'round', visibility: visible('polities') },
    });
    for (const [lens, id] of THEME_FILLS) {
      const base = id.replace('-fill', '');
      map.addLayer({
        id: `${base}-line`,
        type: 'line',
        source: 'polities',
        'source-layer': 'polities',
        filter: leafFilter(year),
        paint: {
          'line-color': '#2a2118',
          'line-width': ['interpolate', ['linear'], ['zoom'], 1, 0.25, 4, 0.5, 9, 1],
          'line-opacity': lens === 'societies' ? 0.28 : 0.4,
        },
        layout: { ...roundLines, visibility: visible(lens) },
      });
      map.addLayer({
        id: `${base}-hl`,
        type: 'line',
        source: 'polities',
        'source-layer': 'polities',
        filter: NO_FEATURE,
        paint: { 'line-color': '#f6e7b8', 'line-width': 2.4, 'line-opacity': 0.95 },
        layout: { 'line-join': 'round', visibility: visible(lens) },
      });
    }

    // Edit mode: records the user's world changed are drawn from their own small source, outlined in amber.
    map.addLayer({
      id: 'edit-fill',
      type: 'fill',
      source: 'polities-edit',
      filter: editLayerFilter(year),
      paint: { 'fill-color': ['get', 'c'], 'fill-opacity': 0.84 },
      layout: { visibility: visible('polities') },
    });
    map.addLayer({
      id: 'edit-line',
      type: 'line',
      source: 'polities-edit',
      filter: editLayerFilter(year),
      paint: { 'line-color': '#d99a2b', 'line-width': ['interpolate', ['linear'], ['zoom'], 1, 0.8, 5, 1.4, 9, 2.2], 'line-opacity': 0.9 },
      layout: { ...roundLines, visibility: visible('polities') },
    });
    map.addLayer({
      id: 'edit-hl',
      type: 'line',
      source: 'polities-edit',
      filter: NO_FEATURE,
      paint: { 'line-color': '#f6e7b8', 'line-width': 2.4, 'line-opacity': 0.95 },
      layout: { 'line-join': 'round', visibility: visible('polities') },
    });

    // Edit mode, provinces: edited provinces, and the provinces of a split polity drawn as polities of their own.
    map.addLayer({
      id: 'subedit-fill',
      type: 'fill',
      source: 'subs-edit',
      filter: editLayerFilter(year),
      paint: { 'fill-color': ['get', 'c'], 'fill-opacity': ['case', ['has', 'split'], 0.84, 0.55] },
      layout: { visibility: visible('polities') },
    });
    map.addLayer({
      id: 'subedit-line',
      type: 'line',
      source: 'subs-edit',
      filter: editLayerFilter(year),
      paint: {
        'line-color': ['case', ['has', 'split'], '#2a2118', '#3fc6d6'],
        'line-width': ['interpolate', ['linear'], ['zoom'], 1, 0.8, 5, 1.4, 9, 2.2],
        'line-opacity': 0.9,
      },
      layout: { ...roundLines, visibility: visible('polities') },
    });
    map.addLayer({
      id: 'subedit-hl',
      type: 'line',
      source: 'subs-edit',
      filter: NO_FEATURE,
      paint: { 'line-color': '#f6e7b8', 'line-width': 2.4, 'line-opacity': 0.95 },
      layout: { 'line-join': 'round', visibility: visible('polities') },
    });

    // Provinces inside big polities: same colour as the parent, so only their borders show.
    map.addLayer({
      id: 'sub-fill',
      type: 'fill',
      source: 'subdivisions',
      'source-layer': 'subdivisions',
      filter: ['all', yearFilter(year), ['!', ['has', 'bd']]],
      paint: { 'fill-color': ['get', 'c'], 'fill-opacity': 0.02 },
      layout: { visibility: visible('polities') },
    });
    map.addLayer({
      id: 'sub-line',
      type: 'line',
      source: 'subdivisions',
      'source-layer': 'subdivisions',
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
      'source-layer': 'subdivisions',
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
      layout: { ...roundLines, visibility: visible('peoples') },
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
      layout: { ...roundLines, visibility: visible('peoples') },
    });
    map.addLayer({
      id: 'civilization-hl',
      type: 'line',
      source: 'civilizations',
      filter: NO_FEATURE,
      paint: { 'line-color': '#f6e7b8', 'line-width': 2.2, 'line-opacity': 0.95 },
      layout: { 'line-join': 'round', visibility: visible('peoples') },
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

    const realRecord = (k: number): { k: number; n: string; s: number; e: number; c: string; parent?: string } | undefined => {
      const item = k >= SUB_K ? baseSubProps[k - SUB_K] : basePolityProps[k];
      return item ? { k, n: item.n, s: item.s, e: item.e, c: item.c, parent: k >= SUB_K ? (item.p as string) : undefined } : undefined;
    };
    const editKeys = new Map<string, number>();
    basePolityProps.forEach((item) => editKeys.set(recordKey(item), item.k));
    baseSubProps.forEach((item) => editKeys.set(subKey(item as Props & { p: string }), item.k));
    editUi = initEditUi({
      index: () => editKeys,
      keyOf: (k) => {
        const item = k >= SUB_K ? baseSubProps[k - SUB_K] : basePolityProps[k];
        return item ? (k >= SUB_K ? subKey(item as Props & { p: string }) : recordKey(item)) : undefined;
      },
      real: realRecord,
      provincesOf: (k) => provincesOfPolity(k).map((item) => realRecord(item.k)).filter((item): item is NonNullable<typeof item> => !!item),
      parentOf: (k) => {
        const item = baseSubProps[k - SUB_K];
        const ids = item ? (polityIdsByName.get(item.p as string) ?? []).filter((id) => overlaps(basePolityProps[id], item)) : [];
        return ids[0];
      },
      apply: applyEdits,
      fmtYear,
      setActive: (on) => { editActive = on; closePanel(); },
      isPolityLens: () => activeLens === 'polities',
      highlight: (k) => setHighlight(k === null ? null : (k >= SUB_K ? subProps[k - SUB_K] : polityProps[k]) ?? null),
    });
    $('edit-btn').addEventListener('click', (event) => {
      event.stopPropagation();
      editUi?.toggle();
    });

    map.on('click', (event) => {
      if (activeLens === 'biomes') {
        openBiomePanel(event.lngLat.lng, event.lngLat.lat);
        return;
      }
      if (activeLens === 'peoples') {
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
          // No network under the click: say who held de facto control of the place.
          const ground = map.getLayer('ctrl-fill') ? map.queryRenderedFeatures(event.point, { layers: ['ctrl-fill'] }) : [];
          const key = ground.length ? (ground[ground.length - 1].properties as { k?: number }).k : undefined;
          const polity = typeof key === 'number' ? basePolityProps[key] : undefined;
          if (polity) openThemePanel(polity);
          else closePanel();
          return;
        }
        overlapSet = stack;
        openPanel(stack[0]);
        return;
      }
      const fill = fillLayerOf(activeLens);
      const hits = fill
        ? map.queryRenderedFeatures(event.point, { layers: fill === 'polity-fill' && map.getLayer('edit-fill') ? [fill, 'edit-fill'] : [fill] })
        : [];
      // Provinces under the click: listed first when zoomed in, after the polity otherwise.
      // Looked up before anything else: a province must open even where no polity shape was hit
      // (province borders are approximate and can reach past the polity's own shape).
      const subHits = activeLens === 'polities'
        ? map.queryRenderedFeatures(event.point, { layers: ['sub-fill', 'subedit-fill'].filter((id) => map.getLayer(id)) })
        : [];
      const subs: Props[] = [];
      for (const hit of subHits) {
        const key = (hit.properties as { k?: number }).k;
        const item = typeof key === 'number' ? subProps[key - SUB_K] : undefined;
        if (item && !subs.includes(item)) subs.push(item);
      }
      if (!hits.length && !subs.length) {
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
      // In edit mode a province is chosen when zoomed in or when its polity was split; otherwise the polity.
      const splitHit = subHits.some((hit) => (hit.layer.id === 'subedit-fill') && (hit.properties as { split?: number }).split);
      // Outside edit mode a province opens as soon as its borders are drawn (SUB_PICK_ZOOM), with its
      // polity listed beside it; below that the polity opens and the provinces are listed.
      const pickSubs = map.getZoom() >= (editActive ? SUB_ZOOM - 0.2 : SUB_PICK_ZOOM);
      let ordered = editActive && !(splitHit || (subs.length && pickSubs))
        ? stack
        : pickSubs || splitHit ? [...subs, ...stack] : [...stack, ...subs];
      if (!ordered.length) ordered = subs;
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
    for (const lens of ['polities', 'peoples'] as Lens[]) {
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
    markStep('draw');
    loadingText.textContent = 'Drawing the first year…';
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
