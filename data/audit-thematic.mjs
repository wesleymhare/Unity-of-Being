import fs from 'node:fs';
import { pathToFileURL } from 'node:url';
const repo = process.argv[2];
const m = await import(pathToFileURL(repo + '/src/thematic.ts').href);
const props = JSON.parse(fs.readFileSync(repo + '/public/data/polities-props.json', 'utf8')).filter((p) => !p.g);
for (const [label, fn] of [['IDEOLOGY', m.ideologyOf], ['WORLDVIEW', m.worldviewOf], ['CONTROL', m.controlOf]]) {
  console.log('\n######## ' + label);
  for (const y of [-2000, -500, 150, 800, 1200, 1500, 1800, 1942, 1975, 2020]) {
    const active = props.filter((p) => p.s <= y && p.e >= y);
    const counts = {}; const uncl = [];
    for (const p of active) { const r = fn(p, y); counts[r.theme.name] = (counts[r.theme.name] || 0) + 1; if (r.theme.id === 'unclassified') uncl.push(p.n); }
    console.log(`\n== ${y} (${active.length}) ` + Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k}:${v}`).join(' | '));
    if (uncl.length) console.log('   UNCLASSIFIED: ' + [...new Set(uncl)].join(', '));
  }
}
