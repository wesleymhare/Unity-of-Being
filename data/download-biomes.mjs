// Downloads the Köppen–Geiger class map used by the Biomes lens.
//
// Also downloads the ecoregion polygons for the Biomes lens (see the end of this file).
//
// The map (about 3 km, 1951–2000 reference period) ships as an 8-bit PNG inside
// the `kgcpy` Python package on PyPI: one pixel per cell, value = class number.
//   Rubel, F., Brugger, K., Haslinger, K. and Auer, I. (2016/2017), the Köppen–
//   Geiger climate classification maps at 100 arc-second resolution, after
//   Kottek et al. (2006) and Rubel & Kottek (2010). kgcpy code: BSD licence.
import { mkdirSync, writeFileSync } from 'node:fs';
import AdmZip from 'adm-zip';

const VERSION = '1.1.8';
mkdirSync('data/raw/koppen', { recursive: true });

console.log(`Looking up kgcpy ${VERSION} on PyPI…`);
const meta = await (await fetch(`https://pypi.org/pypi/kgcpy/${VERSION}/json`)).json();
const wheel = meta.urls.find((file) => file.filename.endsWith('.whl'));
if (!wheel) throw new Error('No wheel found for kgcpy');

console.log(`Downloading ${wheel.filename}…`);
const response = await fetch(wheel.url);
if (!response.ok) throw new Error(`Download failed: ${response.status}`);
const zip = new AdmZip(Buffer.from(await response.arrayBuffer()));
const entry = zip.getEntry('kgcpy/kmz_int_reshape.png');
if (!entry) throw new Error('kmz_int_reshape.png not found in the wheel');
writeFileSync('data/raw/koppen/koppen-classes.png', entry.getData());

const license = zip.getEntry(`kgcpy-${VERSION}.dist-info/LICENSE.txt`);
if (license) writeFileSync('data/raw/koppen/LICENSE.txt', license.getData());

console.log('Done. Next: npm run data:biomes:build');

// ---- WWF-style ecoregions (RESOLVE Ecoregions 2017, CC BY 4.0) ------------------
// Dinerstein et al. 2017, "An Ecoregion-Based Approach to Protecting Half the
// Terrestrial Realm", BioScience 67(6). A revision of WWF's Terrestrial Ecoregions
// of the World (Olson et al. 2001) that keeps its names. The Catalogue of Life
// gazetteers repo publishes it as one simplified GeoJSON file per ecoregion.
const BASE = 'https://raw.githubusercontent.com/CatalogueOfLife/col-gazetteers/master/teow/features';
mkdirSync('data/raw/ecoregions', { recursive: true });

const features = [];
const ids = Array.from({ length: 900 }, (_, i) => i + 1);
console.log('Downloading ecoregions (about 32 MB)…');
async function worker() {
  for (let id = ids.shift(); id !== undefined; id = ids.shift()) {
    const res = await fetch(`${BASE}/${id}.geojson`);
    if (res.status === 404) continue;
    if (!res.ok) throw new Error(`Ecoregion ${id}: ${res.status}`);
    const json = await res.json();
    features.push(...(json.type === 'FeatureCollection' ? json.features : [json]));
  }
}
await Promise.all(Array.from({ length: 16 }, worker));
if (features.length < 800) throw new Error(`Only ${features.length} ecoregions downloaded`);
features.sort((a, b) => a.properties.ECO_ID - b.properties.ECO_ID);
writeFileSync(
  'data/raw/ecoregions/ecoregions-2017.geojson',
  JSON.stringify({ type: 'FeatureCollection', features }),
);
console.log(`${features.length} ecoregions saved.`);
