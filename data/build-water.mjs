// Natural Earth 1:50m rivers and lakes (public domain) -> public/data/*.geojson
// Run `npm run data:download` first.
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { existsSync, statSync } from 'node:fs';

const require = createRequire(import.meta.url);
const mapshaper = require.resolve('mapshaper/bin/mapshaper');
const rivers = 'data/raw/rivers/ne_50m_rivers_lake_centerlines.shp';
const lakes = 'data/raw/lakes/ne_50m_lakes.shp';

for (const file of [rivers, lakes]) {
  if (!existsSync(file)) throw new Error(`Missing ${file}. Run: npm run data:download`);
}

function run(args) {
  const result = spawnSync(process.execPath, [mapshaper, ...args], { stdio: 'inherit' });
  if (result.status !== 0) throw new Error('mapshaper failed');
}

// Keep the major rivers; 50m centre lines are already a manageable size.
run([
  '-i', rivers,
  '-filter', 'featurecla == "River"',
  '-simplify', '20%', 'keep-shapes',
  '-filter-fields', 'name,min_zoom',
  '-o', 'public/data/rivers.geojson', 'format=geojson', 'precision=0.01',
]);

run([
  '-i', lakes,
  '-simplify', '25%', 'keep-shapes',
  '-filter-fields', 'name,min_zoom',
  '-o', 'public/data/lakes.geojson', 'format=geojson', 'precision=0.01',
]);

// Caspian Sea, historic Aral/Chad/Texcoco/Lop Nur and the lake years (needs Python and shapely).
const extra = spawnSync('python3', ['data/build-water-extra.py'], { stdio: 'inherit' });
if (extra.status !== 0) throw new Error('data/build-water-extra.py failed');

const kb = (file) => (statSync(file).size / 1024).toFixed(0);
console.log(`rivers.geojson: ${kb('public/data/rivers.geojson')} KB`);
console.log(`lakes.geojson: ${kb('public/data/lakes.geojson')} KB`);
