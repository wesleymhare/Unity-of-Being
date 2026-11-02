// Downloads the Köppen–Geiger class map used by the Biomes lens.
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
