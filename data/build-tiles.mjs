// Cuts the polity and province shapes into static vector tiles, so the browser never has to hold
// the 26 MB and 14 MB GeoJSON files in memory (phones killed the tab). Output:
//   public/data/tiles/polities/{z}/{x}/{y}.pbf       layer "polities":     k s e c g r
//   public/data/tiles/subdivisions/{z}/{x}/{y}.pbf   layer "subdivisions": k s e c bd
// Beyond MAXZOOM the map stretches the last tile (the shapes are simplified to about 25 km anyway).
// Run after data/split-web-data.py:  node data/build-tiles.mjs
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import geojsonvt from 'geojson-vt';
import vtpbf from 'vt-pbf';

const MAXZOOM = 6;
const JOBS = [
  { name: 'polities', file: 'public/data/polities.geojson', keep: ['k', 's', 'e', 'c', 'g', 'r'] },
  { name: 'subdivisions', file: 'public/data/subdivisions.geojson', keep: ['k', 's', 'e', 'c', 'bd'] },
];

for (const job of JOBS) {
  const data = JSON.parse(readFileSync(job.file, 'utf8'));
  for (const feature of data.features) {
    const slim = {};
    for (const key of job.keep) if (feature.properties[key] !== undefined) slim[key] = feature.properties[key];
    feature.properties = slim;
  }
  const index = geojsonvt(data, { maxZoom: MAXZOOM, indexMaxZoom: MAXZOOM, indexMaxPoints: 0, tolerance: 3, extent: 4096, buffer: 64 });
  const dir = `public/data/tiles/${job.name}`;
  rmSync(dir, { recursive: true, force: true });
  let count = 0;
  let bytes = 0;
  for (const { z, x, y } of index.tileCoords) {
    const tile = index.getTile(z, x, y);
    if (!tile || !tile.features.length) continue;
    const buffer = vtpbf.fromGeojsonVt({ [job.name]: tile }, { version: 2 });
    mkdirSync(`${dir}/${z}/${x}`, { recursive: true });
    writeFileSync(`${dir}/${z}/${x}/${y}.pbf`, buffer);
    count++;
    bytes += buffer.length;
  }
  console.log(`${job.name}: ${count} tiles, ${(bytes / 1e6).toFixed(1)} MB`);
}
