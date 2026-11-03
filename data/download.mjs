// Downloads Cliopatria (CC BY 4.0) and Natural Earth water layers (public domain)
// into data/raw/ and unzips them. Raw data is git-ignored; only built output is committed.
import { mkdirSync, writeFileSync } from 'node:fs';
import AdmZip from 'adm-zip';

const URL = 'https://raw.githubusercontent.com/Seshat-Global-History-Databank/cliopatria/main/cliopatria.geojson.zip';
mkdirSync('data/raw', { recursive: true });

console.log('Downloading Cliopatria (about 46 MB)...');
const res = await fetch(URL);
if (!res.ok) throw new Error(`Download failed: ${res.status}`);
const buf = Buffer.from(await res.arrayBuffer());
writeFileSync('data/raw/cliopatria.geojson.zip', buf);
new AdmZip(buf).extractAllTo('data/raw', true);
console.log('Cliopatria unpacked.');

const WATER = [
  {
    url: 'https://naciscdn.org/naturalearth/50m/physical/ne_50m_rivers_lake_centerlines.zip',
    dir: 'rivers',
  },
  {
    url: 'https://naciscdn.org/naturalearth/50m/physical/ne_50m_lakes.zip',
    dir: 'lakes',
  },
];

for (const { url, dir } of WATER) {
  console.log(`Downloading Natural Earth ${dir}...`);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Download failed: ${response.status} ${url}`);
  const water = Buffer.from(await response.arrayBuffer());
  writeFileSync(`data/raw/${dir}.zip`, water);
  new AdmZip(water).extractAllTo(`data/raw/${dir}`, true);
}

console.log('Done. Files are in data/raw/. Next: npm run data:build');

// Natural Earth 1:50m countries (public domain) for the 2016 onward de jure map
// (data/build-modern-polities.py). Served from the Natural Earth GitHub mirror.
mkdirSync('data/raw/ne', { recursive: true });
console.log('Downloading Natural Earth countries (about 3 MB)...');
const ne = await fetch('https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_0_countries.geojson');
if (!ne.ok) throw new Error(`Download failed: ${ne.status} ne_50m_admin_0_countries`);
writeFileSync('data/raw/ne/ne_50m_admin_0_countries.geojson', Buffer.from(await ne.arrayBuffer()));
