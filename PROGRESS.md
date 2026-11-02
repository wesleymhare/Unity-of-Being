# PROGRESS

## Done
- Scaffold: Vite + TypeScript + MapLibre, GitHub Actions deploy to Pages.
- Data: Cliopatria (CC BY 4.0) simplified to public/data/polities.geojson (13,651 shapes, 30.5 MB raw, about 6 MB gzipped) and land.geojson (0.9 MB).
- Tier 1 MVP: year slider (3400 BCE to 2024 CE), play/pause with speed, hashed polity colours, name labels, click for panel with live Wikipedia summary, URL hash (#year, lng, lat, z).
- Water: Natural Earth 1:50m rivers and lakes (public domain), simplified to rivers.geojson (128 KB) and lakes.geojson (126 KB).
- Labels: collision-aware placement, zoom-scaled type, two-line wrapping, clickable labels, selected state.
- Panel: fixed title/scroll reset, disambiguation/missing-article detection, canonical Wikipedia links, Wikidata facts (CC0), Commons image, OpenStreetMap embed.
- Borders: coast/river/lake layers, zoom-scaled border casing, round joins, consistent panel/timeline chrome.
- Societies lens: Glottography / Asher & Moseley 2007 language areas for 1500–present (CC BY 4.0), about 8,500 polygons, plus curated approximations for early civilizations and named examples (Bedouin Arabs, Old High German, modern Southern California).
- Lens switch: URL-aware Polities/Societies toggle, separate sources/layers, panel source labels and a type fact.
- Rulers: year-specific heads of state and officeholders from Wikidata (CC0), with direct P35/P6 fallbacks. The panel shows the current ruler(s) plus a short neighboring-reign sequence and refreshes when the year changes.
- Labels: polling on move/zoom, duplicate-name suppression, extra collision padding and a lower label cap.
- Loader: progress bar, data-ready dismissal, race-free handling.

## Known rough edges
- Initial load downloads and parses the 30 MB border GeoJSON plus the 8.4 MB societies GeoJSON: several seconds on slow machines. Fix later with vector tiles (PMTiles) or per-era/lens files.
- Some Cliopatria shapes have straight-line edges (their source geometry).
- Colours are hash-based, so neighbours can clash.
- Labels are HTML markers; placement is recomputed on move/zoom, not every animation frame.
- Societies coverage is uneven: source polygons cover 1500–present at language scale; earlier eras only show curated examples, and the named examples are rough approximations. The source has no historical date ranges.
- Rulers depend on Wikidata modelling and dates; coverage is sparse for many non-European and ancient polities, and some officeholders lack start dates.
- Some polities only have a broad Wikipedia article (for example, a regional history), so the panel names the article explicitly rather than implying an exact match.

## Next
- Expand curated historical societies and replace the large GeoJSON with vector tiles.
- Worldview lens (curated file).
- Panel: population, wealth (with confidence labels), conflicts.
- Nested polity shading (MemberOf/Components) and drill-down.
- Tier 2 terrain (three.js), then tier 3 hex dioramas.
