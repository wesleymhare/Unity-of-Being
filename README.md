> Navigation: [START_HERE.md](START_HERE.md) links to the current project records and consultation workflow.

# Unity of Being

An interactive map of human history: polities, civilizations, biomes and worldviews, with a year slider.
Tier 1 (this version) is a Paradox-style political map of 3400 BCE to 2026 CE with three lenses:

- **Polities:** who governed (states, empires, realms). Cliopatria to 2015, cleaned so realms are not drawn on top of their own parts; from 2016 to 2026 the current de jure map from Natural Earth. See [docs/POLITIES.md](docs/POLITIES.md). Each polity panel has a fixed stat sheet, see [docs/POLITY-STATS.md](docs/POLITY-STATS.md).
- **Civilizations:** who lived there. A people held together by shared language and way of life, whatever state ruled them. See [docs/CIVILIZATIONS.md](docs/CIVILIZATIONS.md).
- **Societies:** who actually controls things on the ground. Big de facto networks of any kind (states and confederacies, churches, companies, blocs, parties, international organisations, trade and logistics systems), drawn as areas, routes and hubs. See [docs/SOCIETIES.md](docs/SOCIETIES.md).
- **Biomes:** WWF-style ecoregions split by Köppen–Geiger climate class, with the climate shifted slightly through time (for example "Am North Western Ghats montane rain forests"). See [docs/BIOMES.md](docs/BIOMES.md).

Live site: https://wesleymhare.github.io/Unity-of-Being/

## Run locally
```
npm install
npm run dev        # dev server
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build
```

## Rebuild the data (only needed if you change the pipeline)
The pipeline needs Node and Python 3 (`pip install -r data/requirements.txt`).
```
npm run data:download            # Cliopatria + Natural Earth rivers/lakes into data/raw/ (git-ignored)
npm run data:build               # simplifies Cliopatria, runs data/clean-polities.py (about 3 minutes), builds land, rivers, lakes
npm run data:water               # rebuild only the Natural Earth water layers
npm run data:civilizations           # data/civilizations_data.py -> public/data/civilizations.geojson
npm run data:polities:modern     # data/build-modern-polities.py: 2016 onward de jure map (run after data:build)
npm run data:biomes:download     # Köppen-Geiger raster and RESOLVE ecoregions into data/raw/
npm run data:biomes:build        # koppen.bin, ecoregions.bin/json, ecoregion-lines.geojson, ocean.geojson
```

## Deploy
Pushing to `main` runs `.github/workflows/deploy.yml`, which builds and publishes to GitHub Pages.
One-time setup: repo Settings, Pages, Source = GitHub Actions.

## Data and credits
- Borders: Cliopatria (Seshat Global History Databank), CC BY 4.0, simplified for the web. Group shapes such as "(British Empire)" are used only for realm names, outlines and colours, never drawn as a second layer of fill.
- Societies: curated networks in `data/societies_data.py` (project data, CC BY 4.0), schematic routes and approximate hubs.
- Civilizations: curated footprints in `data/civilizations_data.py` (project data, CC BY 4.0). They are approximations, not scholarly boundaries.
- Biomes: Köppen–Geiger climate classes, Rubel et al. 2017 (1951–2000), via the `kgcpy` PyPI package; ecoregions from RESOLVE Ecoregions 2017 (Dinerstein et al., CC BY 4.0), a revision of WWF's Terrestrial Ecoregions of the World, via the Catalogue of Life gazetteers repo. Past climates are a schematic shift of the Köppen map; ecoregions stay modern. See docs/BIOMES.md.
- Coastlines, rivers and lakes: Natural Earth (public domain), simplified for the web.
- Population and GDP per person from 1 CE: Maddison Project Database 2023, Bolt and van Zanden (CC BY 4.0), present-day borders; built by `npm run data:maddison:download` then `data:maddison:build` into `public/data/maddison.json`. Other datasets considered and their licences: `docs/DATA-SOURCES.md`.
- Panel: live Wikipedia summaries and search (CC BY-SA), Wikidata facts and year-specific rulers (CC0), and an OpenStreetMap embed (ODbL).
- Map engine: MapLibre GL JS.

Borders are one scholarly reading of the evidence and are often disputed.
