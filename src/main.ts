import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url';
import './style.css';

maplibregl.setWorkerUrl(workerUrl);

const BASE = import.meta.env.BASE_URL;
const MIN_YEAR = -3400;
const MAX_YEAR = 2024;

// Muted palette; each polity gets a stable colour from a hash of its name.
const PALETTE = [
  '#a9504d', '#c9a24a', '#7c9a62', '#6785a8', '#58a29d', '#9a6f9c', '#b8794a',
  '#7d8f4f', '#5d7ea3', '#b5646f', '#4f8f7a', '#a58a4f', '#8a6f5d', '#6c8fb0',
];
const hash = (s: string): number => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

interface Props {
  n: string; s: number; e: number; w: string; q: string; m: string;
  lx: number; ly: number; sz: number; c: string; k: number;
}

const fmtYear = (y: number): string => (y < 0 ? `${-y} BCE` : `${y === 0 ? 1 : y} CE`);

// ---- State from the URL hash ------------------------------------------------
const params = new URLSearchParams(location.hash.replace(/^#/, ''));
const num = (k: string, d: number): number => {
  const v = parseFloat(params.get(k) ?? '');
  return Number.isFinite(v) ? v : d;
};
let year = Math.min(MAX_YEAR, Math.max(MIN_YEAR, Math.round(num('year', 150))));
let selectedKey = -1;

// ---- DOM ------------------------------------------------------------------
const $ = <T extends HTMLElement>(id: string): T => document.getElementById(id) as T;
const slider = $<HTMLInputElement>('year');
const yearLabel = $('year-label');
const playBtn = $<HTMLButtonElement>('play');
const speedSel = $<HTMLSelectElement>('speed');
const panel = $('panel');
const loading = $('loading');

for (const y of [-3000, -2000, -1000, 1, 1000, 2000]) {
  const t = document.createElement('span');
  t.textContent = fmtYear(y);
  t.style.left = `${((y - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100}%`;
  $('ticks').appendChild(t);
}
slider.value = String(year);

// ---- Map ----------------------------------------------------------------------
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
map.touchZoomRotate.disableRotation();

const yearFilter = (y: number): maplibregl.ExpressionSpecification => [
  'all', ['<=', ['get', 's'], y], ['>=', ['get', 'e'], y],
];
const hlFilter = (y: number, k: number): maplibregl.ExpressionSpecification => [
  'all', yearFilter(y), ['==', ['get', 'k'], k],
];

let features: { type: 'Feature'; geometry: unknown; properties: Props }[] = [];
const markers = new Map<number, maplibregl.Marker>();

function updateLabels(): void {
  const z = map.getZoom();
  const pxPerDeg = (512 * Math.pow(2, z)) / 360;
  const visible = features
    .filter((f) => f.properties.s <= year && f.properties.e >= year && f.properties.sz * pxPerDeg > 70)
    .sort((a, b) => b.properties.sz - a.properties.sz)
    .slice(0, 150);
  const keep = new Set<number>();
  for (const f of visible) {
    const p = f.properties;
    keep.add(p.k);
    if (!markers.has(p.k)) {
      const el = document.createElement('div');
      el.className = 'poly-label';
      el.textContent = p.n;
      markers.set(p.k, new maplibregl.Marker({ element: el, anchor: 'center' }).setLngLat([p.lx, p.ly]).addTo(map));
    }
  }
  for (const [k, m] of markers) {
    if (!keep.has(k)) {
      m.remove();
      markers.delete(k);
    }
  }
}

function writeHash(): void {
  const c = map.getCenter();
  const h = `#year=${year}&lng=${c.lng.toFixed(2)}&lat=${c.lat.toFixed(2)}&z=${map.getZoom().toFixed(2)}`;
  history.replaceState(null, '', h);
}

let pending = false;
function setYear(y: number): void {
  year = Math.min(MAX_YEAR, Math.max(MIN_YEAR, Math.round(y)));
  slider.value = String(year);
  yearLabel.textContent = fmtYear(year);
  if (pending) return;
  pending = true;
  requestAnimationFrame(() => {
    pending = false;
    if (map.getLayer('polity-fill')) {
      for (const id of ['polity-fill', 'polity-line']) map.setFilter(id, yearFilter(year));
      map.setFilter('polity-hl', hlFilter(year, selectedKey));
      updateLabels();
    }
    writeHash();
  });
}

// ---- Panel ------------------------------------------------------------------
let wikiAbort: AbortController | null = null;
function openPanel(p: Props): void {
  $('p-name').textContent = p.n;
  $('p-years').textContent = `${fmtYear(p.s)} to ${fmtYear(p.e)}`;
  const summary = $('p-summary');
  const link = $<HTMLAnchorElement>('p-link');
  const title = p.w || p.n;
  link.href = p.w
    ? `https://en.wikipedia.org/wiki/${encodeURIComponent(p.w.replace(/ /g, '_'))}`
    : `https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(p.n)}`;
  summary.textContent = 'Loading summary…';
  panel.hidden = false;

  wikiAbort?.abort();
  wikiAbort = new AbortController();
  fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/ /g, '_'))}`, {
    signal: wikiAbort.signal,
  })
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
    .then((j: { extract?: string }) => {
      summary.textContent = j.extract || 'No summary found for this polity.';
    })
    .catch((err: Error) => {
      if (err.name === 'AbortError') return;
      summary.textContent = 'No summary found. Try the Wikipedia link below.';
    });
}

$('panel-close').addEventListener('click', () => {
  panel.hidden = true;
  selectedKey = -1;
  if (map.getLayer('polity-hl')) map.setFilter('polity-hl', ['==', ['get', 'k'], -1]);
});

// ---- Timeline controls ------------------------------------------------------
slider.addEventListener('input', () => setYear(Number(slider.value)));
let playing = false;
let last = 0;
let fyear = 0; // fractional year while playing
function tick(t: number): void {
  if (!playing) return;
  const dt = Math.min(0.1, (t - last) / 1000);
  last = t;
  fyear += Number(speedSel.value) * dt;
  if (fyear >= MAX_YEAR) {
    setYear(MAX_YEAR);
    stop();
    return;
  }
  setYear(fyear);
  requestAnimationFrame(tick);
}
function stop(): void {
  playing = false;
  playBtn.textContent = '▶';
  playBtn.setAttribute('aria-label', 'Play');
}
playBtn.addEventListener('click', () => {
  if (playing) return stop();
  if (year >= MAX_YEAR) setYear(MIN_YEAR);
  playing = true;
  fyear = year;
  last = performance.now();
  playBtn.textContent = '❚❚';
  playBtn.setAttribute('aria-label', 'Pause');
  requestAnimationFrame(tick);
});

async function getJson(url: string, onProgress?: (mb: number) => void): Promise<any> {
  const res = await fetch(url);
  if (!res.ok || !res.body) throw new Error(`${url}: ${res.status}`);
  const reader = res.body.getReader();
  const chunks: Uint8Array[] = [];
  let got = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    got += value.length;
    onProgress?.(got / 1048576);
  }
  return JSON.parse(await new Blob(chunks as BlobPart[]).text());
}

// ---- Data -------------------------------------------------------------------
map.on('load', async () => {
  try {
    const [land, polities] = await Promise.all([
      getJson(`${BASE}data/land.geojson`),
      getJson(`${BASE}data/polities.geojson`, (mb) => (loading.textContent = `Downloading borders… ${mb.toFixed(1)} MB`)),
    ]);
    loading.textContent = 'Building map…';
    features = polities.features;
    features.forEach((f, i) => {
      f.properties.k = i;
      f.properties.c = PALETTE[hash(f.properties.n) % PALETTE.length];
    });

    map.addSource('land', { type: 'geojson', data: land });
    map.addSource('polities', { type: 'geojson', data: polities });
    map.addLayer({ id: 'land-fill', type: 'fill', source: 'land', paint: { 'fill-color': '#d8cba7' } });
    map.addLayer({
      id: 'polity-fill', type: 'fill', source: 'polities', filter: yearFilter(year),
      paint: { 'fill-color': ['get', 'c'], 'fill-opacity': 0.82 },
    });
    map.addLayer({
      id: 'polity-line', type: 'line', source: 'polities', filter: yearFilter(year),
      paint: { 'line-color': '#2a2118', 'line-opacity': 0.55, 'line-width': 0.8 },
    });
    map.addLayer({
      id: 'polity-hl', type: 'line', source: 'polities', filter: ['==', ['get', 'k'], -1],
      paint: { 'line-color': '#f6e7b8', 'line-width': 2.5 },
    });
    map.addLayer({
      id: 'land-coast', type: 'line', source: 'land',
      paint: { 'line-color': '#6f5f3d', 'line-width': 0.8, 'line-opacity': 0.7 },
    });

    map.on('click', 'polity-fill', (e: maplibregl.MapLayerMouseEvent) => {
      const f = e.features?.[e.features.length - 1];
      if (!f) return;
      const p = f.properties as unknown as Props;
      selectedKey = p.k;
      map.setFilter('polity-hl', hlFilter(year, selectedKey));
      openPanel(p);
    });
    map.on('mouseenter', 'polity-fill', () => (map.getCanvas().style.cursor = 'pointer'));
    map.on('mouseleave', 'polity-fill', () => (map.getCanvas().style.cursor = ''));
    map.on('zoomend', updateLabels);
    map.on('moveend', writeHash);

    const done = (): void => loading.classList.add('hide');
    map.once('idle', done);
    map.on('sourcedata', () => { if (map.isSourceLoaded('polities')) done(); });
    setTimeout(done, 20000);
    setYear(year);
    updateLabels();
  } catch (err) {
    loading.textContent = `Could not load map data (${(err as Error).message}). Please reload.`;
    console.error(err);
  }
});

yearLabel.textContent = fmtYear(year);
