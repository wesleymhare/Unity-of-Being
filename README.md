# Unity of Being

An interactive map of human history: polities, societies and worldviews, with a year slider.
Tier 1 (this version) is a Paradox-style political map of 3400 BCE to 2024 CE, plus a Societies lens for language-family areas and selected peoples.

Live site: https://wesleymhare.github.io/Unity-of-Being/

## Run locally
```
npm install
npm run dev        # dev server
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build
```

## Rebuild the data (only needed if you change the pipeline)
```
npm run data:download            # Cliopatria + Natural Earth rivers/lakes into data/raw/ (git-ignored)
npm run data:build               # builds polities.geojson, land.geojson, rivers.geojson, lakes.geojson
npm run data:water               # rebuild only the Natural Earth water layers
npm run data:societies:download  # Glottography language layers into data/raw/
npm run data:societies:build     # simplifies and builds societies.geojson
```

## Deploy
Pushing to `main` runs `.github/workflows/deploy.yml`, which builds and publishes to GitHub Pages.
One-time setup: repo Settings, Pages, Source = GitHub Actions.

## Data and credits
- Borders: Cliopatria (Seshat Global History Databank), CC BY 4.0, simplified for the web.
- Societies: Glottography / Asher & Moseley 2007 language areas (CC BY 4.0), simplified for the web—about 8,500 language polygons. Named examples such as Bedouin Arabs, Old High German, Ancient Egyptians and modern Southern California are curated approximations rather than source polygons.
- Coastlines, rivers and lakes: Natural Earth (public domain), simplified for the web.
- Panel: live Wikipedia summaries and search (CC BY-SA), Wikidata facts and year-specific rulers (CC0), and an OpenStreetMap embed (ODbL).
- Map engine: MapLibre GL JS.

Borders are one scholarly reading of the evidence and are often disputed.
