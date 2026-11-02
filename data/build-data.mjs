// Builds the data files the site loads:
//   public/data/polities.geojson  (Cliopatria, simplified, with start/end years)
//   public/data/land.geojson      (Natural Earth land, 1:50m)
//   public/data/rivers.geojson    (Natural Earth rivers, 1:50m)
//   public/data/lakes.geojson     (Natural Earth lakes, 1:50m)
// Run `npm run data:download` first.
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
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

// Add a label point (lx, ly) and size (sz, in degrees) from each shape's largest ring.
const ringArea = (ring) => {
  let a = 0, cx = 0, cy = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [x0, y0] = ring[j], [x1, y1] = ring[i];
    const f = x0 * y1 - x1 * y0;
    a += f; cx += (x0 + x1) * f; cy += (y0 + y1) * f;
  }
  a /= 2;
  return a === 0 ? { a: 0, cx: ring[0][0], cy: ring[0][1] } : { a, cx: cx / (6 * a), cy: cy / (6 * a) };
};
const fc = JSON.parse(readFileSync(TMP, 'utf8'));
for (const f of fc.features) {
  const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
  let best = null, total = 0;
  for (const p of polys) {
    const m = ringArea(p[0]);
    total += Math.abs(m.a);
    if (!best || Math.abs(m.a) > Math.abs(best.a)) best = m;
  }
  f.properties.lx = +best.cx.toFixed(2);
  f.properties.ly = +best.cy.toFixed(2);
  f.properties.sz = +Math.sqrt(total).toFixed(2);
}
writeFileSync('public/data/polities.geojson', JSON.stringify(fc));
console.log(`polities.geojson: ${fc.features.length} shapes, ${(statSync('public/data/polities.geojson').size / 1e6).toFixed(1)} MB`);

// ---- Land (Natural Earth, public domain) -----------------------------------
await import('./build-land.mjs');

// ---- Rivers and lakes (Natural Earth, public domain) -----------------------
await import('./build-water.mjs');
