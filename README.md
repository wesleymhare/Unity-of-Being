# Unity of Being

An interactive map of human history: polities, societies, biomes and worldviews, with a year slider.
Tier 1 (this version) is a Paradox-style political map of 3400 BCE to 2024 CE with three lenses:

- **Polities:** who governed (states, empires, realms). Source: Cliopatria, cleaned so realms are not drawn on top of their own parts.
- **Societies:** who lived there. A people held together by shared language and way of life, whatever state ruled them. See [docs/SOCIETIES.md](docs/SOCIETIES.md).
- **Biomes:** Köppen–Geiger climate, shifted slightly through time. See [docs/BIOMES.md](docs/BIOMES.md).

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
npm run data:societies           # data/societies_data.py -> public/data/societies.geojson
npm run data:biomes:download     # Köppen-Geiger raster into data/raw/
npm run data:biomes:build        # koppen.bin and ocean.geojson
```

## Deploy
Pushing to `main` runs `.github/workflows/deploy.yml`, which builds and publishes to GitHub Pages.
One-time setup: repo Settings, Pages, Source = GitHub Actions.

## Data and credits
- Borders: Cliopatria (Seshat Global History Databank), CC BY 4.0, simplified for the web. Group shapes such as "(British Empire)" are used only for realm names, outlines and colours, never drawn as a second layer of fill.
- Societies: curated footprints in `data/societies_data.py` (project data, CC BY 4.0). They are approximations, not scholarly boundaries.
- Biomes: Köppen–Geiger climate classes, Rubel et al. 2017 (1951–2000), via the `kgcpy` PyPI package. Past climates are a schematic shift of that map, described in docs/BIOMES.md.
- Coastlines, rivers and lakes: Natural Earth (public domain), simplified for the web.
- Panel: live Wikipedia summaries and search (CC BY-SA), Wikidata facts and year-specific rulers (CC0), and an OpenStreetMap embed (ODbL).
- Map engine: MapLibre GL JS.

Borders are one scholarly reading of the evidence and are often disputed.
