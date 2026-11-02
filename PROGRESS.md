# PROGRESS

## Done
- Scaffold: Vite + TypeScript + MapLibre, GitHub Actions deploy to Pages.
- Data: Cliopatria (CC BY 4.0) simplified to public/data/polities.geojson (13,651 shapes, 30.5 MB raw, about 6 MB gzipped) and land.geojson (0.9 MB).
- Tier 1 MVP: year slider (3400 BCE to 2024 CE), play/pause with speed, hashed polity colours, name labels, click for panel with live Wikipedia summary, URL hash (#year, lng, lat, z).
- Smoke-tested in headless Chromium: loads, labels, click panel, slider, play, hash, no console errors.

## Known rough edges
- Initial load parses 30 MB GeoJSON in a worker: several seconds on slow machines. Fix later with vector tiles (PMTiles) or per-era files.
- Some Cliopatria shapes have straight-line edges (their source geometry).
- Colours are hash-based, so neighbours can clash.
- Labels are HTML markers with simple size-based culling.

## Next
- Lenses: society (Glottolog/Wikidata), worldview (curated file).
- Panel: population, wealth (with confidence labels), conflicts.
- Nested polity shading (MemberOf/Components) and drill-down.
- Tier 2 terrain (three.js), then tier 3 hex dioramas.
