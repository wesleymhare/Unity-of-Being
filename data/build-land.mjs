// Natural Earth land (public domain) -> public/data/land.geojson
// world-atlas closes a few shapes across the antimeridian with an edge that runs the long way
// round the world (stripes in the Arctic). We unwrap those rings and split them at 180 degrees.
import { readFileSync, writeFileSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import { feature } from 'topojson-client';

const require = createRequire(import.meta.url);
const topo = JSON.parse(readFileSync(require.resolve('world-atlas/land-50m.json'), 'utf8'));
const land = feature(topo, topo.objects.land);

const hasJump = (ring) => ring.some((p, i) => i && Math.abs(p[0] - ring[i - 1][0]) > 180);
const minLat = (ring) => Math.min(...ring.map((p) => p[1]));

function unwrap(ring) {
  let off = 0;
  const out = [[ring[0][0], ring[0][1]]];
  for (let i = 1; i < ring.length; i++) {
    const d = ring[i][0] - ring[i - 1][0];
    if (d > 180) off -= 360;
    else if (d < -180) off += 360;
    out.push([ring[i][0] + off, ring[i][1]]);
  }
  return out;
}

// Sutherland-Hodgman clip of one ring against x <= 180 (keepLow) or x >= 180 (!keepLow)
function clipX(ring, keepLow) {
  const inside = (p) => (keepLow ? p[0] <= 180 : p[0] >= 180);
  const out = [];
  for (let i = 0; i < ring.length - 1; i++) {
    const a = ring[i], b = ring[i + 1];
    const ia = inside(a), ib = inside(b);
    if (ia) out.push(a);
    if (ia !== ib) out.push([180, a[1] + ((180 - a[0]) / (b[0] - a[0])) * (b[1] - a[1])]);
  }
  if (out.length < 3) return null;
  out.push(out[0]);
  return out;
}

const fixed = [];
for (const poly of land.features[0].geometry.coordinates) {
  const outer = poly[0];
  if (!hasJump(outer) || minLat(outer) < -60) { fixed.push(poly); continue; } // Antarctica handled as is
  const u = unwrap(outer);
  const lo = clipX(u, true);
  const hi = clipX(u, false);
  if (lo) fixed.push([lo]);
  if (hi) fixed.push([hi.map((p) => [p[0] - 360, p[1]])]);
}
land.features[0].geometry.coordinates = fixed;

writeFileSync('public/data/land.geojson', JSON.stringify(land, (k, v) => (typeof v === 'number' ? Math.round(v * 100) / 100 : v)));
console.log(`land.geojson: ${(statSync('public/data/land.geojson').size / 1e6).toFixed(1)} MB, ${fixed.length} polygons`);
