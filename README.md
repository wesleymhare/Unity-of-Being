# Unity of Being

An interactive map of human history: polities, societies and worldviews, with a year slider.
Tier 1 (this version) is a Paradox-style political map of 3400 BCE to 2024 CE.

Live site: https://wesleymhare.github.io/unity-of-being/

## Run locally
```
npm install
npm run dev        # dev server
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build
```

## Rebuild the data (only needed if you change the pipeline)
```
npm run data:download   # fetches Cliopatria into data/raw/ (git-ignored)
npm run data:build      # simplifies it into public/data/polities.geojson and land.geojson
```

## Deploy
Pushing to `main` runs `.github/workflows/deploy.yml`, which builds and publishes to GitHub Pages.
One-time setup: repo Settings, Pages, Source = GitHub Actions.

## Data and credits
- Borders: Cliopatria (Seshat Global History Databank), CC BY 4.0, simplified for the web.
- Coastlines: Natural Earth (public domain) via world-atlas.
- Summaries: fetched live from Wikipedia (CC BY-SA), linked in the panel.
- Map engine: MapLibre GL JS.

Borders are one scholarly reading of the evidence and are often disputed.
