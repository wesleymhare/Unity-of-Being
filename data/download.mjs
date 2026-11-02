// Downloads the Cliopatria dataset (CC BY 4.0) into data/raw/ and unzips it.
// Raw data is git-ignored; only the built output in public/data/ is committed.
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
console.log('Done. Files are in data/raw/. Next: npm run data:build');
