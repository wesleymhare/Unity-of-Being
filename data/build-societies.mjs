// Builds public/data/societies.geojson.
// Base areas: Glottography / Asher & Moseley 2007, CC BY 4.0.
// Historical examples are curated approximations, also CC BY 4.0 (project data).
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, statSync, writeFileSync } from 'node:fs';

const CONTEMPORARY = 'data/raw/societies/contemporary-languages-simple.geojson';
const TRADITIONAL = 'data/raw/societies/traditional-languages-simple.geojson';

function ensureSimplified(input, output, percent) {
  if (existsSync(output)) return;
  if (!existsSync(input)) {
    throw new Error(`Missing ${input}. Run: npm run data:societies:download`);
  }
  console.log(`Simplifying ${input}…`);
  const result = spawnSync(
    process.execPath,
    [
      'node_modules/mapshaper/bin/mapshaper',
      '-i', input,
      '-filter-fields', 'title',
      '-simplify', `${percent}%`, 'keep-shapes',
      '-o', output,
      'format=geojson', 'precision=0.02',
    ],
    { stdio: 'inherit' },
  );
  if (result.status !== 0) {
    throw new Error(`Could not simplify ${input} (mapshaper exited ${result.status}).`);
  }
}

ensureSimplified(
  'data/raw/societies/contemporary-languages.geojson',
  CONTEMPORARY,
  6,
);
ensureSimplified(
  'data/raw/societies/traditional-languages.geojson',
  TRADITIONAL,
  6,
);

const PALETTE = [
  '#7f9b6a', '#5f8fa3', '#b08a56', '#8d7397', '#4f9a8b', '#a46b64', '#7e8fc4',
  '#b39b4f', '#6f9f7c', '#9b7d5c', '#5d8f9f', '#a07b8f', '#849a55', '#6f7e9e',
  '#b06f5a', '#5e9a93',
];

const hash = (value) => {
  let h = 2166136261;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

function ringArea(ring) {
  let area = 0;
  let cx = 0;
  let cy = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [x0, y0] = ring[j];
    const [x1, y1] = ring[i];
    const f = x0 * y1 - x1 * y0;
    area += f;
    cx += (x0 + x1) * f;
    cy += (y0 + y1) * f;
  }
  area /= 2;
  return area === 0
    ? { a: 0, cx: ring[0][0], cy: ring[0][1] }
    : { a: area, cx: cx / (6 * area), cy: cy / (6 * area) };
}

function deriveGeometry(feature) {
  const polygons = feature.geometry.type === 'Polygon'
    ? [feature.geometry.coordinates]
    : feature.geometry.coordinates;
  let best = null;
  let total = 0;
  for (const polygon of polygons) {
    const measurement = ringArea(polygon[0]);
    total += Math.abs(measurement.a);
    if (!best || Math.abs(measurement.a) > Math.abs(best.a)) best = measurement;
  }
  if (!best) return;
  feature.properties.lx = +best.cx.toFixed(2);
  feature.properties.ly = +best.cy.toFixed(2);
  feature.properties.sz = +Math.sqrt(total).toFixed(2);
}

const out = [];
const seen = new Set();

function addBase(file, startYear, endYear, sourceLabel) {
  const collection = JSON.parse(readFileSync(file, 'utf8'));
  for (const feature of collection.features) {
    const name = String(feature.properties?.title ?? '').trim();
    if (!name || !feature.geometry) continue;
    const key = `${name}|${startYear}`;
    if (seen.has(key)) continue;
    seen.add(key);
    feature.properties = {
      n: name,
      s: startYear,
      e: endYear,
      w: name,
      q: '',
      m: '',
      src: sourceLabel,
      kind: 'Language area',
      level: 'language',
    };
    deriveGeometry(feature);
    out.push(feature);
  }
}

addBase(
  CONTEMPORARY,
  1901,
  2024,
  'Glottography / Asher & Moseley 2007 (contemporary languages), CC BY 4.0',
);
addBase(
  TRADITIONAL,
  1500,
  1900,
  'Glottography / Asher & Moseley 2007 (time-of-contact languages), CC BY 4.0',
);

// Curated approximations for named societies that are not single language areas.
// These are deliberately broad first-pass footprints, not scholarly boundaries.
const CURATED = [
  {
    n: 'Ancient Egyptians',
    s: -3100,
    e: -30,
    w: 'Ancient Egypt',
    kind: 'Civilization',
    coordinates: [[
      [29.5, 31.6], [32.5, 31.6], [35.5, 23.0], [34.0, 21.8], [31.0, 24.0],
      [29.0, 29.0], [29.5, 31.6],
    ]],
  },
  {
    n: 'Sumerians',
    s: -3500,
    e: -1900,
    w: 'Sumer',
    kind: 'Civilization',
    coordinates: [[
      [43.5, 33.2], [48.5, 33.2], [49.0, 29.5], [47.0, 28.5], [44.0, 29.5],
      [43.5, 33.2],
    ]],
  },
  {
    n: 'Ancient Greeks',
    s: -800,
    e: -146,
    w: 'Ancient Greece',
    kind: 'Civilization',
    coordinates: [[
      [19.0, 34.0], [29.0, 34.0], [29.5, 41.5], [26.0, 42.5], [22.0, 41.0],
      [19.0, 38.0], [19.0, 34.0],
    ]],
  },
  {
    n: 'Han Chinese',
    s: -206,
    e: 220,
    w: 'Han dynasty',
    kind: 'Civilization',
    coordinates: [[
      [100.0, 40.0], [122.0, 40.0], [122.0, 22.0], [110.0, 20.0], [102.0, 22.0],
      [98.0, 30.0], [100.0, 40.0],
    ]],
  },
  {
    n: 'Maya',
    s: -2000,
    e: 1500,
    w: 'Maya civilization',
    kind: 'Civilization',
    coordinates: [[
      [-93.0, 15.0], [-87.0, 15.0], [-86.5, 21.5], [-90.0, 22.5], [-93.5, 19.0],
      [-93.0, 15.0],
    ]],
  },
  {
    n: 'Old Norse',
    s: 800,
    e: 1100,
    w: 'Old Norse',
    kind: 'Historical people',
    coordinates: [[
      [4.0, 57.0], [12.0, 55.0], [16.0, 56.0], [20.0, 60.0], [31.0, 70.0],
      [20.0, 71.0], [10.0, 64.0], [4.0, 62.0], [4.0, 57.0],
    ]],
  },
  {
    n: 'Swahili coast',
    s: 800,
    e: 1500,
    w: 'Swahili coast',
    kind: 'Historical people',
    coordinates: [[
      [38.0, -15.0], [41.5, -15.0], [42.0, 0.0], [41.0, 4.0], [39.0, 4.0],
      [38.0, -5.0], [38.0, -15.0],
    ]],
  },
  {
    n: 'Bedouin Arabs',
    s: -500,
    e: 2024,
    w: 'Bedouin',
    kind: 'People',
    coordinates: [[
      [34.0, 12.0], [43.0, 11.5], [52.0, 12.5], [59.0, 17.0], [59.0, 26.0],
      [55.0, 31.0], [47.0, 33.0], [41.0, 34.0], [37.0, 32.0], [34.0, 29.0],
      [33.0, 24.0], [34.0, 12.0],
    ]],
  },
  {
    n: 'Old High German',
    s: 750,
    e: 1050,
    w: 'Old High German',
    kind: 'Language stage',
    coordinates: [[
      [6.5, 46.5], [7.0, 49.5], [6.8, 51.5], [8.0, 53.7], [12.0, 54.0],
      [15.0, 51.5], [16.5, 48.5], [15.0, 46.5], [12.0, 45.5], [9.0, 45.5],
      [6.5, 46.5],
    ]],
  },
  {
    n: 'Modern Southern California',
    s: 1945,
    e: 2024,
    w: 'Southern California',
    kind: 'Culture region',
    coordinates: [[
      [-121.0, 32.5], [-114.5, 32.5], [-114.3, 35.0], [-117.0, 35.5],
      [-119.0, 35.0], [-120.5, 34.0], [-121.0, 32.5],
    ]],
  },
];

for (const entry of CURATED) {
  const feature = {
    type: 'Feature',
    properties: {
      n: entry.n,
      s: entry.s,
      e: entry.e,
      w: entry.w,
      q: '',
      m: '',
      src: 'Curated approximation (project data, CC BY 4.0)',
      kind: entry.kind,
      level: 'curated',
    },
    geometry: { type: 'Polygon', coordinates: entry.coordinates },
  };
  deriveGeometry(feature);
  out.push(feature);
}

out.forEach((feature, index) => {
  const name = feature.properties.n;
  feature.properties.k = index;
  feature.properties.c = PALETTE[hash(name) % PALETTE.length];
});

const collection = { type: 'FeatureCollection', features: out };
writeFileSync('public/data/societies.geojson', JSON.stringify(collection));
console.log(
  `societies.geojson: ${out.length} features, ` +
    `${(statSync('public/data/societies.geojson').size / 1024 / 1024).toFixed(1)} MB`,
);
