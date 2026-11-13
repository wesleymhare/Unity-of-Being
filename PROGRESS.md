# PROGRESS

## Current
*Rewritten in place; last updated 12 Nov 2026. The dated log below holds the detail.*
- **State:** `main` is `a2a15bd` on GitHub (merge repair pushed). The working tree has **uncommitted, unseen-in-the-app changes** from 12 Nov: unified entity sheet fixes (infobox grouping in `src/infobox-map.ts`), province clicks (a province opens its own panel from `SUB_PICK_ZOOM`, `src/main.ts`), civilization labels allowed to overhang their shape (`src/labels.ts`). `tsc --noEmit` passes. No Node on the build PC, so `vite build` and the running app have not been tried on these.
- **Side panel:** one entity sheet for every entity (`buildSheet` for polities, `buildGenericSheet` for the rest). Method and extension steps: `docs/POLITY-STATS.md`, "One sheet for every entity".
- **Unverified:** the CSS of the sheet (clamp, "Also reported"), edit mode and year-step buttons after the main.ts merge repair, the 2.2 zoom cut-off for picking provinces, civilization label crowding.
- **Open decision:** push to `main` (redeploys the site) once the above is checked.
- **Next action:** run `npm run dev` somewhere with Node; check a polity, province, civilization, society and ecoregion panel, edit mode, and the Civilizations lens labels. Then build the batch prompt generator + validator for researched figures (DeepSeek/ChatGPT pasted batches into a staging file, schema check, merge only reviewed figures into `public/data/polity-stats.json`).
- **Keep the Obsidian vault current:** after substantial work run `C:\Users\wesle\Documents\GitHub Obisidian Vault\Tools\Refresh project notes.cmd` (owner instruction, 12 Nov 2026).

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

### Provinces on the map, Help button (3 November 2026)
- **Provinces inside big polities** are drawn on the map (same colour as the parent, dashed internal borders, own labels from zoom 3.4, clickable with Wikipedia panel): Roman Empire, Achaemenid, Sasanian, Ottoman, Han, Tang, Ming, Qing, Mughal, British Raj. Built from modern Natural Earth boundaries, so approximate. See `docs/SUBDIVISIONS.md`. The panel list of Wikidata subdivisions stays for polities that have them.
- **Help button** (top right, "?") now holds the sources and a short how-to; the footer credits line is gone.

### Civilizations rename and new Societies lens (3 November 2026)
- **Renamed** the old Societies lens to **Civilizations** (sociocultural belonging and ancestry; room for haplogroup layers later). Code, data (`public/data/civilizations.geojson`, `data/civilizations_*.py`, `npm run data:civilizations`), docs (`docs/CIVILIZATIONS.md`). Old links with `lens=societies` now open the new lens.
- **New Societies lens**: de facto networks as routes (solid land, dashed sea), hubs and zones, ~40 curated networks from Uruk colonies to the Comintern, coloured by kind with a live legend. Click a hub, route or zone for the network panel (Type, Connects, "Networks here" chips). Data in `data/societies_data.py`, built by `data/build-societies.py`. See `docs/SOCIETIES.md`.
- Label engine now includes the pixel offset (`oy`) in its collision boxes.
- **Societies widened and tightened (same day).** Definition now follows Marxist and world-society theory: any big group held together by a logistical network (state, church, company, bloc, party, international body), controlling things on the ground. Niche networks pruned; 54 big ones kept. **Areas** added (from Cliopatria polity shapes, unions of modern countries, or hand polygons): Mongol, Inca, Roman, Achaemenid, Aztec, steppe confederations, Latin and Orthodox Christendom, Catholic Church, NATO, Warsaw Pact, EU, Chinese tributary system and others. Legend rows are filters. Mobile: brand hidden under 520px so all four lens buttons fit. See `docs/SOCIETIES.md`.

### Fast switching fix (3 November 2026)
- Switching lenses or dragging the year quickly could leave stale labels from the old lens, a stuck loading veil, or a janky map. Fixes: label layers of inactive lenses are disabled (they cancel queued frames and never redraw); the loading veil's fade-out can no longer hide a newer veil, and the veil clears on `idle`; year changes re-filter at most every 70 ms (the last value always lands). Stress-tested with 24 rapid lens+year switches and slider scrubbing.

### 7 November 2026: polity stat sheet and panel cleanup
- **Fixed-order stat sheet for every polity** (`src/profile.ts`, `docs/POLITY-STATS.md`): Government, People, Land and economy, Military, Lineage, always the same rows in the same order, dashes where nothing is on record. Year-aware (nearest dated value, marked "c. 1520"). World Bank data for modern states (population, GDP, armed forces, spending); Wikidata for the rest; a curated-figures file for later (`public/data/polity-stats.json`).
- **Wikipedia infobox moved to the bottom and folded** ("More from the Wikipedia infobox"); it was the scrambled block after the description.
- **Rulers:** fuller reign sequence with a "Full timeline" button. Fixed a bug: Wikidata qualifier dates were read as if they were whole claims, so the direct head-of-state fallback and dated flags, population and capital never matched real data.
- Long province lists fold into one line so the stat sheet is not pushed off screen.
- **Ruler box removed.** Head of state and head of government are rows in the Government section, with a "Rulers through time" fold-out. The flag or coat of arms is now directly under the title.
- **Infobox reordered** (`src/infobox-map.ts`): rows are classified by label, fill sheet rows as fallbacks (dated ones chosen by the year nearest the slider), and the rest are grouped in a fixed order.
- **Societies redefined** (`docs/SOCIETIES.md`): affinity groups that hold de facto control as logistical networks (world-society theory, Marxist group analysis, Mann's four powers). Added Habsburg, Medici and Templars as examples; 57 networks.
- **Societies settled for now (8 Nov):** sphere lineages with family colours (20 spheres), a power-type tag (I/E/M/P) on every network, and build-time checks for the definition (at least 1,000 km across, two hubs and a route or area, a note, a sphere, a power type). Panel shows Sphere, Lineage and Power. Deferred: legend filter by power, family-tree view, networks changing sphere over time, modern corporations and criminal networks.
- Not verified against live Wikidata or the World Bank (the build sandbox cannot reach them); checked with mocked responses.

### 3 November 2026: last decade, water, Societies colour, placeholders
- **Timeline now runs to 2026.** The old "present" marker (2024) was moved to 2026 in the data sources and built files.
- **2016-2026 is the de jure world** (`data/build-modern-polities.py`, Natural Earth 1:50m): no rebel or occupied zones, Palestine = West Bank + Gaza, Crimea/Donetsk/Luhansk = Ukraine, Golan = Syria, Western Sahara restored, renames by year. Cliopatria is cut at 2015. See `docs/POLITIES.md`.
- **Caspian Sea added** (it was missing in every lens: the base land polygon fills it in and Natural Earth's lake file has none). The Aral Sea, Lake Chad, Lake Texcoco and Lop Nur now change with the year (`data/build-water-extra.py`).
- **Societies are coloured by sphere/group**, not kind, with symbols: line = logistical route, dot = hub, crossed swords = frontier or conflict, handshake = trade or syncretism zone (42 marks).
- **Placeholders (nothing built behind them):** a left-pointing triangle at the start of the timeline for deep time before 3400 BCE (continental drift, ice ages), a **Tiles** button for the Tier 2 tile view, and an **Edit** button for worldbuilding, to the left of Help.

### 12 November 2026: infobox grouping, province click, civilization labels (uncommitted, not seen live)
- **Infobox rows were jumbled** (checked on the live Qing page): bulleted rows such as "- 1636-1643  Chongde Emperor" were filed by their own words, so emperors landed in History and wars in Military, and "era" matched "Literal meaning". Now (`src/infobox-map.ts`): group rules use whole words; a bulleted or dated row is filed by the heading above it and labelled "Emperor · 1636–1643 …"; a bullet with no heading and a date in its value goes to Dates and events. Checked in headless Edge on a Qing-shaped fixture. Still rough: native-name blocks ("Chinese name Transcriptions…") sit in Reference as one long folded value, and Head of state stays a dash when Wikidata has no ruler list even though the infobox lists emperors.
- **Province click** (`src/main.ts`, click handler): a click with no polity shape under it closed the panel before provinces were looked up. Provinces are now looked up first and open when no polity was hit. I could not reproduce a dead click inside a province on the live site (Roman and Qing clicks opened the polity with the provinces listed under it, as designed at low zoom), so this fixes the one cause I found in the code; the owner should confirm with the exact place and year if it still happens. The province tile keys match `subdivisions-props.json` (checked on the live site).
- **Province opens its own panel (owner report, same day):** clicking inside Rome only opened the polity with a province chip. Outside edit mode a click now opens the province (its polity is listed beside it under "Also here") from `SUB_PICK_ZOOM` (= `SUB_ZOOM - 1.2`, where the dashed borders start to show); below that zoom the polity still opens first. Edit mode keeps its old rule. Not seen in the running app.
- **Pale civilization fills (owner report: "Tocharians and stuff too light to see"):** the build tints broad spheres 18% lighter (`data/build-civilizations.py`), and yellow/tan families (Turkic-Mongolic `#cdb050`, Andean, Mainland SE Asian, Nilo-Saharan, Afro-Asiatic) sit near the land colour (brightness about 203). Data was not regenerated (no Python here). Instead `capLightness` in `src/main.ts` darkens any civilization fill above brightness 145 (broad washes above 160) toward black at load, keeping the hue, and fill opacity went 0.62 to 0.7. I could not tell which exact shapes the owner meant; blue Indo-European washes (brightness about 152) are barely changed. If some still vanish, lower `MAX_WASH_LIGHTNESS`/`MAX_FILL_LIGHTNESS` or darken the tint in the build script.
- **Civilization names hidden until clicked** (`src/labels.ts`, `src/main.ts`): civilization labels had to fit inside their shape. They may now overhang it (slack 2.8, as societies use 3) and the minimum size is lowered from 26 to 14 px (`minScore`); collisions still decide what shows. Not looked at after the change.

### 12 November 2026: merge repair (main.ts)
- **What went wrong:** merge commit `1afef41` (local `sss` + `claude/wizardly-heisenberg-dpfamd`) kept the entity-sheet version of `src/main.ts` whole and dropped that branch's changes to it: edit-mode wiring (`initEditUi`), vector tiles, Maddison loading, year-step buttons. Every other file merged correctly, so `index.html`, `edit.ts`, `edit-ui.ts` and the tile data were new while `main.ts` ignored them. `tsc` still passed, so it was silent.
- **Repair (uncommitted):** `main.ts` rebuilt as a real 3-way merge (base `61a5aa6`, branches `be68a71` and `340f74c`). Six conflicts resolved: the unified sheet replaces the other branch's separate "(Wikipedia)" infobox sections; its Maddison, edit-mode and tile code is kept. `tsc --noEmit` passes. Not run: `vite build` and the app (no Node here). Check edit mode, year-step buttons and a polity panel after `npm run dev`.

### 12 November 2026: one unified entity sheet (not yet seen in the live app)
- **Task:** owner wants a unified, clean, ordered info box per entity that integrates existing data without dropping any Wikipedia infobox data, before researched figures (DeepSeek/ChatGPT batches) are added to `public/data/polity-stats.json`.
- **Changed:** the side panel now has one fact block. `buildSheet` (polities, fixed rows) and new `buildGenericSheet` (provinces, civilizations, societies, ecoregions) in `src/profile.ts`; shared section order and infobox-group mapping in `src/infobox-map.ts`; renderer `drawSheet`/`renderSheet` in `src/main.ts`; styles at the end of the stat-sheet block in `src/style.css`. Removed `#p-facts` and `#p-infobox` from `index.html` and their code. Full description: `docs/POLITY-STATS.md`, section "One sheet for every entity".
- **Behaviour:** each row shows its best value; other readings sit under "Also reported · N" (other infobox values, other dated Wikidata values); infobox rows with no fixed row are filed into their section; infobox values keep Wikipedia links; the 200-character cut is gone (long values fold behind "more").
- **Checks:** `tsc --noEmit` passes (native tsc.exe from node_modules/@typescript, since Node is not installed on this machine). The merge/ordering logic was run in headless Edge against a Roman Empire-shaped fixture: all 12 rows, alts, extras and section order came out as intended. **Not run:** `vite build`, the real app, live Wikipedia/Wikidata, the CSS (clamp, alts) by eye.
- **Next:** run `npm run dev`, open a polity, a province, a civilization, a society and an ecoregion, and check the sheet looks right; then decide on the researched-figures workflow (batch prompt generator + validator, see conversation of 12 Nov: staging file, schema check, merge only reviewed figures).

## Planned
- **Edit mode** (plan agreed 8 Nov, see `docs/PLAN-EDIT-MODE.md`): alt-history on top of the real data, branches saved in the browser and exportable, multi-year spans, start from real shapes, separate Markdown mode for notes.
- Deep time before 3400 BCE (continental drift, ice ages, sea level).
- Tier 2 tile view; Tier 3 hex dioramas.
- Edit mode for worldbuilding.
- Ideologies tab (how polities are structured) and Worldviews tab (faiths, philosophies).
- Societies as lineages: spheres that split and merge through time, with modern corporations and criminal networks (rules in `docs/SOCIETIES.md`).

## Known rough edges
- Ecoregions are modern in every year; only the Köppen half of a biome label changes with time.
- Initial load downloads and parses the 25 MB border GeoJSON: several seconds on slow machines. Fix later with vector tiles (PMTiles) or per-era files.
- Some Cliopatria shapes have straight-line edges (their source geometry).
- Labels are HTML markers; placement is recomputed on move/zoom, not every animation frame.
- Society footprints are hand-placed approximations, deliberately soft. Coverage is stronger for Eurasia and Africa than for the Americas and Oceania. Wikipedia titles for the 167 entries have not been checked against live Wikipedia; the panel falls back to a search when a title misses.
- Biome history is a schematic shift of the modern map, not a reconstruction; mountains, monsoons and coastlines are not adjusted.
- Rulers depend on Wikidata modelling and dates; coverage is sparse for many non-European and ancient polities.
- `public/data/land.geojson` stores Afro-Eurasia in a frame shifted by -360 degrees (MapLibre draws it fine). The Python tools normalise it in `geo_labels.load_land`; the cleaner fix is in `data/build-land.mjs`.

### 7 November 2026: data licences, Maddison, Edit mode phase 1
- **Licences checked** against the sources' own pages (`docs/DATA-SOURCES.md`): Cliopatria is CC BY 4.0 (repo LICENSE.md and the Zenodo record), Maddison Project 2023 is CC BY 4.0, HYDE 3.3 is CC BY 4.0, CHELSA-TraCE21k is CC BY-SA (its page also says CC BY 2.0). **Not commercial-safe:** Seshat's other data (CC BY-NC-SA reported), Correlates of War, CShapes, Euratlas.
- **Maddison Project added** (`data/build-maddison.py`, `public/data/maddison.json`, 540 kB): population and GDP per person from 1 CE for 169 countries, used by the Population and Economy rows when the World Bank has nothing, with a visible "today's borders" note. Verified against France, the USSR and the year edge cases with a build-time test; live Wikidata ids were not testable here.
- **Edit mode phase 1 built** (`src/edit.ts`, `src/edit-ui.ts`, hooks in `src/main.ts`): worlds (branches) saved in IndexedDB, new/copy/rename/delete/export/import, and per-polity rename, recolour, change years and remove. Changed records are redrawn from a small source with an amber outline; the real data is never touched. Tested headless on a phone-sized screen: select, edit, hide, reload (persists), export, import, bad file, delete.
- **Not yet in Edit mode:** drawing shapes, splitting and merging, Markdown notes, undo/redo, Civilizations/Societies/Biomes edits (see `docs/PLAN-EDIT-MODE.md`).

### 8 November 2026: phones ran out of memory ("Webpage reloaded because a problem occurred")
- **Cause, measured** (headless Chromium, phone-sized): the page parsed the 26 MB polities and 14 MB provinces GeoJSON, then MapLibre's worker parsed and indexed them again. The renderer reached about 3.2 GB (3.4 GB with all processes) and settled near 1.9 GB; with those two sources empty it used 0.3 to 0.4 GB. A phone tab is killed far below that, so the map never finished building.
- **Fix:** polities and provinces are now **static vector tiles** (`data/build-tiles.mjs`, zoom 0 to 6, stretched beyond) read by MapLibre as a vector source, and the page loads only small property lists (`polities-props.json` 2 MB, `subdivisions-props.json` 0.8 MB) for labels, clicks and the panel. `data/split-web-data.py` gives every shape its key `k` and writes those lists plus 84 small shape chunks (`polity-shapes/`) that Edit mode fetches only when an edit needs a shape. Run both with `npm run data:web` whenever the shapes are rebuilt.
- **Result:** renderer about 0.44 GB while loading and 0.29 GB after (was 3.2 and 1.9 GB); all processes peak 0.84 GB (was 3.4 GB). The map, labels, clicks and Edit mode (select, edit, hide, reload, export, import, delete) all pass the headless test.
- **Not verified:** real iOS Safari or Android Chrome. The numbers are from desktop Chromium with software rendering, so check on a phone.
- The full GeoJSON files are still in `public/data` (build inputs, no longer loaded by the page); they could be kept out of the deployed site later. The repo grew by about 90 MB of tiles and chunks.

### 8 November 2026 (later): infobox in the one box, edit toolbar and provinces, factions in Societies
- **Wikipedia infobox rows** no longer sit in a folded "More from the Wikipedia infobox" box: for polities they are sections of the one stat sheet ("... (Wikipedia)"), always open. Other lenses show them open under the article.
- **Edit mode toolbar** now runs along the top (under the top bar), so it no longer covers the info panel or the map on a phone; the article panel is not used while editing. A fold button hides the editor.
- **Provinces vs polities:** provinces (administrative subdivisions) are edited separately from their polity (cyan "Province" badge, amber "Polity"); a province edit never changes the polity, and a polity edit says its provinces keep their own edits. A polity can be **split into its provinces**: each is drawn as a polity of its own (own colour and label), the polity itself is removed, and you can rename, recolour or remove each one. Province shapes come in chunks (`data/subdivision-shapes`), province tiles carry the parent name (`p`).
- **Bug fixed on the way:** the first edit in a new world saved the real name and colour instead of your typed ones (the form was redrawn before it was read).
- **Societies: factions and movements** (`data/societies_factions.py`, 49 new entries, 106 in all): sects and schismatics (Cathars, Waldensians, Hussites, Old Believers, Donatists, Western Schism...), rebels and risings (Red Turbans, Zanj, Boxers, Zapatistas, Libyan rebels, Makhnovshchina, Maroons...), communes and leagues (Paris Commune, Lombard League), warlords, pirates and the underworld (Chinese warlords, Barbary corsairs, Sicilian Mafia, Medellín, Cali and Sinaloa cartels...), and parties that held ground (Khmer Rouge, FARC, Tamil Tigers, Muslim Brotherhood, Ba'ath, Hezbollah, Hamas). The 1,000 km rule now sorts entries into `network` (81) and `faction` (25); a faction needs a hub or an area. Three new spheres colour them. See `docs/SOCIETIES.md`, "Factions and movements".
- **Check these facts:** the coordinates, years and notes of the new Societies entries are from memory, not a source I could open. Hamas, Hezbollah, Libya, the Sinaloa Cartel and the Muslim Brotherhood end in 2026 only as "still exists as far as known"; please review them.

- **Year step buttons** (8 Nov): a row above the slider with −100, −10, −5, −1, +1, +5, +10, +100; a tap steps the year, holding repeats, tapping pauses play; arrow keys step by 1 (Shift 10). The timeline grew 36 px, so the map and panel offsets moved with it.

## Next
- Grow Societies: more networks (Americas, Africa, Pacific), weighted edges, modern parties and factions.
- Haplogroup layer for Civilizations (open ancient-DNA data only, with uncertainty).
- Check the new panel features live (flag choice, infobox parsing on odd articles, subdivision coverage) and tune the map-image filter in `src/wiki.ts`.
- Check the Society Wikipedia titles and add more Americas and Oceania entries; consider a second-level split of the broad Indo-European entries.
- Worldview lens (curated file).
- Replace the large GeoJSON with vector tiles.
- Panel: population, wealth (with confidence labels), conflicts.
- Tier 2 terrain (three.js), then tier 3 hex dioramas.
