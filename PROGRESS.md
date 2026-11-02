# PROGRESS

## Done
- Scaffold: Vite + TypeScript + MapLibre, GitHub Actions deploy to Pages.
- Data: Cliopatria (CC BY 4.0) simplified to public/data/polities.geojson (13,651 shapes, 30.5 MB raw, about 6 MB gzipped) and land.geojson (0.9 MB).
- Tier 1 MVP: year slider (3400 BCE to 2024 CE), play/pause with speed, hashed polity colours, name labels, click for panel with live Wikipedia summary, URL hash (#year, lng, lat, z).
- Water: Natural Earth 1:50m rivers and lakes (public domain), simplified to rivers.geojson (128 KB) and lakes.geojson (126 KB).
- Labels: collision-aware placement, zoom-scaled type, two-line wrapping, clickable labels, selected state.
- Panel: fixed title/scroll reset, disambiguation/missing-article detection, canonical Wikipedia links, Wikidata facts (CC0), Commons image, OpenStreetMap embed.
- Borders: coast/river/lake layers, zoom-scaled border casing, round joins, consistent panel/timeline chrome.
- Loader: progress bar, source-ready check, race-free dismissal.

## Known rough edges
- Initial load downloads and parses the 30 MB GeoJSON: several seconds on slow machines. Fix later with vector tiles (PMTiles) or per-era files.
- Some Cliopatria shapes have straight-line edges (their source geometry).
- Colours are hash-based, so neighbours can clash.
- Labels are HTML markers; placement is recomputed on move/zoom, not during the animation.
- Some polities only have a broad Wikipedia article (for example, a regional history), so the panel names the article explicitly rather than implying an exact match.

## Next
- Lenses: society (Glottolog/Wikidata), worldview (curated file).
- Panel: population, wealth (with confidence labels), conflicts.
- Nested polity shading (MemberOf/Components) and drill-down.
- Tier 2 terrain (three.js), then tier 3 hex dioramas.
