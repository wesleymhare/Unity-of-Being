# PROGRESS

## Done
- Scaffold: Vite + TypeScript + MapLibre, GitHub Actions deploy to Pages.
- Data: Cliopatria (CC BY 4.0) simplified and cleaned into public/data/polities.geojson (12,458 shapes, 25.6 MB raw) and land.geojson (0.9 MB).
- Tier 1 MVP: year slider (3400 BCE to 2024 CE), play/pause with speed, click for panel with live Wikipedia summary, URL hash (#year, lng, lat, z, lens).
- Water: Natural Earth 1:50m rivers and lakes (public domain).
- Panel: fixed title/scroll reset, disambiguation/missing-article detection, canonical Wikipedia links, Wikidata facts (CC0), Commons image, OpenStreetMap embed.
- Rulers: year-specific heads of state and officeholders from Wikidata (CC0).

### 2 November 2026: polities cleanup, Societies remap, Biomes lens
- **Polities cleaned (`data/clean-polities.py`).** Cliopatria's parenthesised group shapes (for example "(British Empire)") were drawn on top of their own members, doubling fills and labels. They are now label-only realm shapes; relationship groups ("Allegiance of X to Y") are dropped; exact duplicates are removed. 13,651 shapes became 12,458 and the file dropped from 30.5 MB to 25.6 MB.
- **Labels rebuilt (`src/labels.ts`).** Each name is anchored at the pole of inaccessibility of its shape (computed with enclaves cut out) and fitted inside the shape's free width and height, so a name that cannot fit stays hidden until zoomed in. Realm names are uppercase and drawn first. Fewer lines are preferred.
- **Colours.** Polities that touch in space and time get different colours (graph colouring, no same-colour contacts); members of a realm share the realm colour; a vassal takes its overlord's colour. Realm outlines are heavier than the borders inside them.
- **Societies wiped and remapped.** The old layer (about 8,500 Glottography language polygons plus ten boxes) is gone. A Society is now defined in `docs/SOCIETIES.md`: a people held together by shared language and way of life, regardless of state. 167 dated, curated footprints in `data/societies_data.py`, coloured by language family or sphere, with a live legend.
- **Biomes lens.** Köppen–Geiger classes (Rubel et al.) shifted through time by a small, documented model: warm/cold swings and the African Humid Period. Click any place for class, temperature, rainfall and vegetation. See `docs/BIOMES.md`.
- Initial load no longer hides the loader before the active lens has drawn.

### Ecoregions on the Biomes lens
- WWF-style ecoregions (RESOLVE 2017, CC BY 4.0, 846 + Rock and Ice) are overlaid on the Köppen climate, one patch per (ecoregion, climate class) pair, labelled like "Am North Western Ghats montane rain forests". About 3,300 distinct pairs today, about 8,700 patches. Patches are recomputed in the browser whenever the climate shift changes, so labels follow the slider.
- The Köppen legend on the side is gone; a small climate-age note replaces it. The click panel shows ecoregion, biome, realm, climate class and its description, and loads the ecoregion's Wikipedia summary.
- Grids moved from 1/6 to 1/12 degree so small ecoregions survive.

### Biome colour (3 November 2026)
- Biomes now use the Köppen hue with a per-ecoregion lightness shade (six shades, graph-coloured so neighbours differ). See `docs/BIOMES.md`, section Colour.
- Realistic climate through time is still **blocked on network access**: the coding sandbox cannot reach the climate dataset hosts (checked worldclim.org, envidat.ch, chelsa-climate.org, zenodo.org, NOAA, PANGAEA). Plan is in `docs/PLAN-REALISTIC-CLIMATE.md`.

### Biome time model and overlap clicking (3 November 2026)
- Biomes through time now use a **regional event model** instead of a latitude slide: temperature scaled by region plus eight rainfall events (African Humid Period, 4.2 ka drought, Late Bronze Age drought, monsoon changes, Medieval Southwest megadrought, Classic Maya drought, wetter Mediterranean). See `docs/BIOMES.md`. Still rough, not a reconstruction.
- Clicking where several societies or polities overlap opens the top one and lists the rest as "Also here" chips in the panel.

### Societies made temporal (3 November 2026)
- A society is now a dated **stage** in a **lineage**, at three levels (broad sphere, people, local identity). The panel shows "This society through time" and jumps between stages. Local identities fade in when zoomed in. See `docs/SOCIETIES.md`.
- About 400 stages (was 167): added stages for the Arabian, Kurdish, Sicilian, Occitan, Albanian, Dravidian, Southern California and many other threads, in `data/societies_more_1.py` to `_3.py`.
- Coverage is thinner for sub-Saharan Africa, the Pacific, Central and South America and Siberia; footprints are rough and many stage links are interpretive.

### Click-through, panel images, infoboxes, subdivisions (3 November 2026)
- **Societies click = "where you stand".** Clicking finds every identity active at the point by point-in-polygon (not by what is drawn on top), so nested and faint shapes are always reachable at any zoom. The panel lists them as peer chips grouped by scale (local identity, people, wider sphere). Label clicks use the same stack. See `docs/SOCIETIES.md`.
- **Panel image above the text.** Polities show the flag (Wikidata P41, picked by year; coat of arms P94 as fallback) instead of Wikipedia's usually-map thumbnail. Societies show the article thumbnail (map-like file names skipped, Wikidata image as fallback). Biomes show the first non-map photograph of the ecoregion article, then its WWF biome article, then the Köppen class article.
- **Wikipedia infobox** below the summary (section 0 of the article via the MediaWiki parse API, rows turned into safe DOM, links kept to Wikipedia only). Ruler lists, succession rows, capital, area, etc. come through as collapsible sections; long ones start collapsed.
- **Administrative subdivisions** for polities: Wikidata P150 children that have English Wikipedia articles, filtered by start/end dates against the slider year, with a pin that flies to the subdivision when Wikidata has coordinates. Only as good as Wikidata's P150 coverage.
- Added a Californians people-level identity and widened the 1900+ Anglo-American footprint to the Pacific coast so SoCal has a full stack.
- Tested with mocked Wikipedia/Wikidata responses (the build sandbox cannot reach them). First live check is on the deployed site.

## Known rough edges
- Ecoregions are modern in every year; only the Köppen half of a biome label changes with time.
- Initial load downloads and parses the 25 MB border GeoJSON: several seconds on slow machines. Fix later with vector tiles (PMTiles) or per-era files.
- Some Cliopatria shapes have straight-line edges (their source geometry).
- Labels are HTML markers; placement is recomputed on move/zoom, not every animation frame.
- Society footprints are hand-placed approximations, deliberately soft. Coverage is stronger for Eurasia and Africa than for the Americas and Oceania. Wikipedia titles for the 167 entries have not been checked against live Wikipedia; the panel falls back to a search when a title misses.
- Biome history is a schematic shift of the modern map, not a reconstruction; mountains, monsoons and coastlines are not adjusted.
- Rulers depend on Wikidata modelling and dates; coverage is sparse for many non-European and ancient polities.
- `public/data/land.geojson` stores Afro-Eurasia in a frame shifted by -360 degrees (MapLibre draws it fine). The Python tools normalise it in `geo_labels.load_land`; the cleaner fix is in `data/build-land.mjs`.

## Next
- Check the new panel features live (flag choice, infobox parsing on odd articles, subdivision coverage) and tune the map-image filter in `src/wiki.ts`.
- Check the Society Wikipedia titles and add more Americas and Oceania entries; consider a second-level split of the broad Indo-European entries.
- Worldview lens (curated file).
- Replace the large GeoJSON with vector tiles.
- Panel: population, wealth (with confidence labels), conflicts.
- Tier 2 terrain (three.js), then tier 3 hex dioramas.
