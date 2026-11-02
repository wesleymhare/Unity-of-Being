// Builds the data files the site loads:
//   public/data/polities.geojson  (Cliopatria, simplified and cleaned, with start/end years)
//   public/data/land.geojson      (Natural Earth land, 1:50m)
//   public/data/rivers.geojson    (Natural Earth rivers, 1:50m)
//   public/data/lakes.geojson     (Natural Earth lakes, 1:50m)
// Run `npm run data:download` first.
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { mkdirSync, readdirSync, statSync } from 'node:fs';
import { feature } from 'topojson-client';

const require = createRequire(import.meta.url);
mkdirSync('public/data', { recursive: true });

// ---- Polities -------------------------------------------------------------
const rawName = readdirSync('data/raw').find((f) => /^cliopatria_polities_only.*\.geojson$/.test(f));
if (!rawName) throw new Error('Raw Cliopatria file not found. Run: npm run data:download');
const RAW = `data/raw/${rawName}`;
const TMP = 'data/raw/polities.simplified.json';

// Simplify to ~25 km, drop tiny slivers, keep only the fields the site needs.
const mapshaper = require.resolve('mapshaper/bin/mapshaper');
const r = spawnSync(process.execPath, [
  mapshaper, '-i', RAW,
  '-rename-fields', 'n=Name,s=FromYear,e=ToYear,w=Wikipedia,q=Wikidata,m=MemberOf',
  '-filter-fields', 'n,s,e,w,q,m',
  '-simplify', 'interval=25000',
  '-filter-slivers', 'min-area=100km2', 'remove-empty',
  '-o', TMP, 'format=geojson', 'precision=0.1',
], { stdio: 'inherit' });
if (r.status !== 0) throw new Error('mapshaper failed');

// Clean the shapes: drop Cliopatria's overlapping group shapes, add label anchors and
// colours. Needs Python 3 with shapely and numpy (see data/requirements.txt).
const clean = spawnSync('python3', ['data/clean-polities.py', TMP, 'public/data/polities.geojson'], {
  stdio: 'inherit',
});
if (clean.status !== 0) throw new Error('data/clean-polities.py failed');
console.log(`polities.geojson: ${(statSync('public/data/polities.geojson').size / 1e6).toFixed(1)} MB`);

// ---- Land (Natural Earth, public domain) -----------------------------------
await import('./build-land.mjs');

// ---- Rivers and lakes (Natural Earth, public domain) -----------------------
await import('./build-water.mjs');
