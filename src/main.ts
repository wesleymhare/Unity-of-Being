import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url';
import './style.css';
import { BiomeModel, CLASSES, GROUPS, climateShift, type EcoMeta, type EcoPatch } from './biomes';
import { LabelLayer, type LabelProps } from './labels';
import {
  getLeaderHistory,
  getSummary,
  getWikidata,
  leadersAtYear,
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
/** Zoom at which local society identities (level 3) fade in. */
const LOCAL_ZOOM = 3.6;
const MIN_YEAR = -3400;
const MAX_YEAR = 2024;

/** Properties of one polity, realm group or society (see data/*.py). */
interface Props extends LabelProps {
  w: string;
  q: string;
  /** Realm this polity belongs to. */
  m?: string;
  /** Colour. */
  c: string;
  /** Realm-level outline. */
  r?: number;
  /** Societies: what kind of community, its languages, and its family group. */
  kind?: string;
  fam?: string;
  fg?: string;
  /** Societies: level (1 broad sphere, 2 people, 3 local identity), lineage id, one-line note. */
  lv?: number;
  ln?: string;
  nt?: string;
}

interface MapFeature {
  type: string;
  geometry: unknown;
  properties: Props;
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

const signed = (value: number): string =>
  `${value < 0 ? '−' : '+'}${Math.abs(value).toFixed(1)}`;

// ---- State from the URL hash ------------------------------------------------
type Lens = 'polities' | 'societies' | 'biomes';
const LENSES: Lens[] = ['polities', 'societies', 'biomes'];

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
const pFacts = $<HTMLDListElement>('p-facts');
const pOsm = $('p-osm');
const pOsmFrame = $<HTMLIFrameElement>('p-osm-frame');
const pOsmLink = $<HTMLAnchorElement>('p-osm-link');
const pLink = $<HTMLAnchorElement>('p-link');
const pWdLink = $<HTMLAnchorElement>('p-wd-link');
const lensButtons = [...document.querySelectorAll<HTMLButtonElement>('.lens-btn')];

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
/** Opacity that is `full` everywhere, except local identities (level 3), which fade in with zoom. */
const localFade = (full: number): maplibregl.ExpressionSpecification => [
  'interpolate', ['linear'], ['zoom'],
  LOCAL_ZOOM - 0.6, ['case', ['==', ['get', 'lv'], 3], 0, full],
  LOCAL_ZOOM + 0.4, full,
];
const NO_FEATURE: Filter = ['==', ['get', 'k'], -1];

const YEAR_FILTERS: Record<string, (value: number) => Filter> = {
  'polity-fill': leafFilter,
  'polity-line': leafFilter,
  'polity-realm-casing': realmFilter,
  'polity-realm-line': realmFilter,
  'society-fill': yearFilter,
  'society-casing': yearFilter,
  'society-line': yearFilter,
};

const LENS_LAYERS: Record<Lens, string[]> = {
  polities: ['polity-fill', 'polity-line', 'polity-realm-casing', 'polity-realm-line', 'polity-hl'],
  societies: ['society-fill', 'society-casing', 'society-line', 'society-hl'],
  biomes: ['biome-raster', 'eco-lines', 'ocean-mask'],
};

const fillLayerOf = (lens: Lens): string | null =>
  lens === 'polities' ? 'polity-fill' : lens === 'societies' ? 'society-fill' : null;
const highlightLayerOf = (lens: Lens): string | null =>
  lens === 'polities' ? 'polity-hl' : lens === 'societies' ? 'society-hl' : null;

let polityProps: Props[] = [];
let societyProps: Props[] = [];
let biomeModel: BiomeModel | null = null;

const polityLabels = new LabelLayer<Props>(map, (p) => { overlapSet = []; openPanel(p); });
const societyLabels = new LabelLayer<Props>(map, (p) => { overlapSet = []; openPanel(p); });
// Ecoregion patches are often thin strips with long names, so let names overhang them.
const biomeLabels = new LabelLayer<EcoPatch>(map, (patch) => openBiomePanel(patch.lx, patch.ly), 2.2);

function activeLabels(): { schedule(): void } | null {
  if (activeLens === 'polities') return polityLabels;
  if (activeLens === 'societies') return societyLabels;
  return biomeLabels;
}

function lensProps(lens: Lens): Props[] {
  return lens === 'polities' ? polityProps : lens === 'societies' ? societyProps : [];
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
  if (activeLens !== 'societies') {
    legend.hidden = true;
    return;
  }
  legend.hidden = false;

  if (activeLens === 'societies') {
    legendTitle.textContent = 'Language family or sphere';
    const present = new Map<string, { colour: string; count: number }>();
    for (const p of societyProps) {
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
    if (!present.size) legendBody.textContent = 'No societies are mapped for this year.';
  }
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
function setYear(next: number): void {
  year = clamp(Math.round(next), MIN_YEAR, MAX_YEAR);

  if (selectedProps && (selectedProps.s > year || selectedProps.e < year)) closePanel();

  if (yearRaf) return;
  yearRaf = requestAnimationFrame(() => {
    yearRaf = 0;
    slider.value = String(year);
    yearLabel.textContent = fmtYear(year);

    for (const [id, make] of Object.entries(YEAR_FILTERS)) {
      if (map.getLayer(id)) map.setFilter(id, make(year));
    }
    const highlight = highlightLayerOf(activeLens);
    if (highlight && map.getLayer(highlight)) {
      map.setFilter(highlight, selectedKey >= 0 ? highlightFilter(year, selectedKey) : NO_FEATURE);
    }

    if (activeLens === 'biomes') renderBiomes();
    polityLabels.setYear(year, activeLens === 'polities');
    societyLabels.setYear(year, activeLens === 'societies');
    renderLegend();
    if (activeLens === 'biomes' && !panel.hidden && biomePoint) scheduleBiomePanel();
    if (!panel.hidden && panelQid && activeLens === 'polities') scheduleLeaderRefresh();
    scheduleHash();
  });
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
  const label = activeLens === 'societies' ? 'society' : activeLens === 'biomes' ? 'ecoregion' : 'polity';
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
  const ticket = panelTicket;
  const qid = panelQid;
  if (leaderTimer) window.clearTimeout(leaderTimer);
  leaderTimer = window.setTimeout(() => {
    if (ticket === panelTicket) void loadLeaders(qid, year, ticket);
  }, 220);
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
        return;
      }
    }

    renderFacts(facts, extraFacts);
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

function updateSelection(): void {
  polityLabels.setSelected(selectedKey);
  societyLabels.setSelected(selectedKey);
}

/** Everything under the last click, so overlapping shapes can all be reached. */
let overlapSet: Props[] = [];

function renderOthers(current: Props): void {
  pOthersList.replaceChildren();
  const others = overlapSet.filter((item) => item.k !== current.k);
  pOthers.hidden = others.length === 0;
  for (const item of others) {
    const button = document.createElement('button');
    button.type = 'button';
    const dot = document.createElement('i');
    dot.style.background = item.c;
    const label = document.createElement('span');
    label.textContent = `${item.n} · ${fmtRange(item.s, item.e)}`;
    button.title = label.textContent;
    button.append(dot, label);
    button.addEventListener('click', () => openPanel(item));
    pOthersList.append(button);
  }
}

let lineages = new Map<string, Props[]>();

function buildLineages(): void {
  lineages = new Map();
  for (const p of societyProps) {
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
  if (activeLens !== 'societies' || !stages || stages.length < 2) {
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

  const societies = activeLens === 'societies';
  pName.textContent = name;
  pName.title = name;
  pYears.textContent = fmtRange(p.s, p.e);
  pKind.textContent = societies ? 'Society' : p.g ? 'Realm' : 'Polity';
  pSource.textContent = societies ? 'Curated' : 'Cliopatria';
  pFine.textContent = societies
    ? 'Footprints: curated approximations, see docs/SOCIETIES.md · Text: Wikipedia (CC BY-SA) · Modern map: OpenStreetMap (ODbL)'
    : 'Borders: Cliopatria (CC BY 4.0) · Text: Wikipedia (CC BY-SA) · Facts: Wikidata (CC0) · Modern map: OpenStreetMap (ODbL)';
  pSwatch.style.background = p.c;
  pSummary.textContent = 'Loading Wikipedia…';
  pLink.href = wikiSearchUrl(name);
  pLink.textContent = 'Search Wikipedia';

  showPanel();
  renderLineage(p);
  renderOthers(p);
  document.title = `${name} · Unity of Being`;

  const highlight = highlightLayerOf(activeLens);
  if (highlight && map.getLayer(highlight)) map.setFilter(highlight, highlightFilter(year, p.k));
  updateSelection();
  renderOsm(p.lx, p.ly, p.sz, name);

  const extraFacts: WikiFact[] = [];
  if (societies) {
    if (p.kind) extraFacts.push({ label: 'Type', value: p.kind });
    if (p.fam) extraFacts.push({ label: 'Languages', value: p.fam });
    if (p.fg) extraFacts.push({ label: 'Family group', value: p.fg });
  } else if (p.m) {
    extraFacts.push({ label: 'Realm', value: p.m });
  }
  if (qid && !societies && !p.g) void loadLeaders(qid, year, ticket);
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
  for (const lens of ['polities', 'societies'] as Lens[]) {
    const id = highlightLayerOf(lens);
    if (id && map.getLayer(id)) map.setFilter(id, NO_FEATURE);
  }
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
  if (next === 'societies' && !societyProps.length) return;
  if (next === 'biomes' && !biomeModel) return;
  closePanel();
  activeLens = next;
  const source = activeSourceId();
  if (map.getSource(source) && !map.isSourceLoaded(source)) {
    showVeil(next === 'societies' ? 'Drawing societies…' : next === 'biomes' ? 'Drawing climate…' : 'Drawing borders…');
  }
  polityLabels.clear();
  societyLabels.clear();
  biomeLabels.clear();
  setLensVisibility();
  updateLensButtons();
  if (next === 'biomes') renderBiomes(true);
  setYear(year);
  activeLabels()?.schedule();
  scheduleHash();
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
let dataReady = false;
function finishLoading(): void {
  if (loadingDone || !dataReady) return;
  loadingDone = true;
  loading.classList.add('hide');
  mapVeil.hidden = true;
  window.setTimeout(() => {
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
  return activeLens === 'polities' ? 'polities' : activeLens === 'societies' ? 'societies' : 'ocean';
}

/** Show the veil while a lens that has not drawn yet is being tiled. */
function showVeil(message: string): void {
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
    const [land, polityData, societyData, rivers, lakes, koppen, ecoBin, ecoMeta, ecoLines, ocean] = await Promise.all([
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
      getJson<FeatureCollection>(`${BASE}data/societies.geojson`).catch((error) => {
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
    ]);

    loadingText.textContent = 'Building map…';
    loadingProgress.style.width = '100%';

    const polityFeatures = polityData.features;
    const societyFeatures = societyData?.features ?? [];
    polityFeatures.forEach((feature, index) => {
      feature.properties.k = index;
    });
    societyFeatures.forEach((feature, index) => {
      feature.properties.k = index;
    });
    polityProps = polityFeatures.map((feature) => feature.properties);
    societyProps = societyFeatures.map((feature) => feature.properties);
    buildLineages();
    polityLabels.setFeatures(polityProps);
    societyLabels.setFeatures(societyProps);

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
    if (!societyProps.length) disable('societies', 'Societies data unavailable');
    if (!biomeModel) disable('biomes', 'Biome data unavailable');
    if (activeLens === 'societies' && !societyProps.length) activeLens = 'polities';
    if (activeLens === 'biomes' && !biomeModel) activeLens = 'polities';

    map.on('sourcedata', checkSources);

    map.addSource('land', { type: 'geojson', data: land as GeoData });
    map.addSource('polities', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: polityFeatures } as GeoData,
    });
    map.addSource('societies', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: societyFeatures } as GeoData,
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
      id: 'society-fill',
      type: 'fill',
      source: 'societies',
      filter: yearFilter(year),
      paint: {
        'fill-color': ['get', 'c'],
        'fill-opacity': localFade(0.62),
      },
      layout: { visibility: visible('societies') },
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
        paint: { 'fill-color': '#35505f', 'fill-opacity': 0.95 },
      });
      map.addLayer({
        id: 'lake-line',
        type: 'line',
        source: 'lakes',
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

    map.addLayer({
      id: 'society-casing',
      type: 'line',
      source: 'societies',
      filter: yearFilter(year),
      paint: {
        'line-color': '#201811',
        'line-width': ['interpolate', ['linear'], ['zoom'], 1, 0.9, 4, 1.4, 9, 2.4],
        'line-opacity': localFade(0.26),
      },
      layout: { ...roundLines, visibility: visible('societies') },
    });
    map.addLayer({
      id: 'society-line',
      type: 'line',
      source: 'societies',
      filter: yearFilter(year),
      paint: {
        'line-color': '#2a2118',
        'line-width': ['interpolate', ['linear'], ['zoom'], 1, 0.35, 4, 0.65, 9, 1.3],
        'line-opacity': localFade(0.6),
      },
      layout: { ...roundLines, visibility: visible('societies') },
    });
    map.addLayer({
      id: 'society-hl',
      type: 'line',
      source: 'societies',
      filter: NO_FEATURE,
      paint: { 'line-color': '#f6e7b8', 'line-width': 2.2, 'line-opacity': 0.95 },
      layout: { 'line-join': 'round', visibility: visible('societies') },
    });

    map.on('click', (event) => {
      if (activeLens === 'biomes') {
        openBiomePanel(event.lngLat.lng, event.lngLat.lat);
        return;
      }
      const fill = fillLayerOf(activeLens);
      let hits = fill ? map.queryRenderedFeatures(event.point, { layers: [fill] }) : [];
      if (activeLens === 'societies' && map.getZoom() < LOCAL_ZOOM - 0.2) {
        hits = hits.filter((hit) => (hit.properties as { lv?: number }).lv !== 3);
      }
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
      overlapSet = stack;
      if (stack.length) openPanel(stack[0]);
    });
    for (const lens of ['polities', 'societies'] as Lens[]) {
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
