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
- Check the Society Wikipedia titles and add more Americas and Oceania entries; consider a second-level split of the broad Indo-European entries.
- Worldview lens (curated file).
- Replace the large GeoJSON with vector tiles.
- Panel: population, wealth (with confidence labels), conflicts.
- Tier 2 terrain (three.js), then tier 3 hex dioramas.
