// Downloads the Glottography / Asher & Moseley 2007 language layers.
// Source: https://github.com/Glottography/asher2007world (CC BY 4.0).
import { mkdirSync, writeFileSync } from 'node:fs';

const FILES = [
  {
    name: 'contemporary-languages.geojson',
    url: 'https://raw.githubusercontent.com/Glottography/asher2007world/main/cldf/contemporary/languages.geojson',
  },
  {
    name: 'traditional-languages.geojson',
    url: 'https://raw.githubusercontent.com/Glottography/asher2007world/main/cldf/traditional/languages.geojson',
  },
];

mkdirSync('data/raw/societies', { recursive: true });

for (const file of FILES) {
  console.log(`Downloading ${file.name}…`);
  const response = await fetch(file.url);
  if (!response.ok) throw new Error(`Download failed: ${response.status} ${file.url}`);
  writeFileSync(`data/raw/societies/${file.name}`, Buffer.from(await response.arrayBuffer()));
}

console.log('Done. Next: npm run data:societies:build');
