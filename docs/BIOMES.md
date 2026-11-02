# Biomes lens: ecoregions on Köppen–Geiger climate, through time

The Biomes lens names the land by **ecoregion and climate together**. Each WWF-style
ecoregion is split wherever the Köppen–Geiger class changes, and every patch is
labelled "<class> <ecoregion>":

- `Am North Western Ghats montane rain forests`
- `Aw North Western Ghats montane rain forests`

The year slider shifts the climate, so a patch can change class (and name) as the
centuries pass. Ecoregion borders are drawn as thin lines over the Köppen colours.
Click anywhere for the ecoregion, its WWF biome and realm, the climate class, and
the climate age shown. There is no separate Köppen legend; the class code in each
label is the key, and the panel spells it out.

## Data

- **Ecoregions:** RESOLVE Ecoregions 2017 (Dinerstein et al. 2017, BioScience 67:534),
  CC BY 4.0. It is a revision of WWF's Terrestrial Ecoregions of the World (Olson et
  al. 2001) and keeps its names (846 ecoregions here, plus a "Rock and Ice" region
  made for Antarctica and the Greenland ice sheet). The polygons come from the
  Catalogue of Life gazetteers repo (`teow/features`), fetched by
  `npm run data:biomes:download`.
- **Climate:** Köppen–Geiger classes at about 3 km (100 arc-seconds), reference period
  1951–2000. Rubel, Brugger, Haslinger & Auer (2017), after Kottek et al. (2006) and
  Rubel & Kottek (2010). The raster comes from the `kgcpy` package on PyPI
  (BSD-licensed code).
- **Built files** (`npm run data:biomes:build`, needs `data/requirements.txt`), all on one
  1/12 degree grid (4320 x 2160):
  - `public/data/koppen.bin`: one byte per cell, run-length encoded (about 460 KB)
  - `public/data/ecoregions.bin`: ecoregion id per cell, run-length encoded (about 570 KB)
  - `public/data/ecoregions.json`: names, biomes and realms
  - `public/data/ecoregion-lines.geojson`: the borders between ecoregions, traced from
    the grid and smoothed (about 1.2 MB)
  - `public/data/ocean.geojson`: open sea, used to trim the colours to the coastline

Class numbers follow kgcpy: 1 = Af, 2 = Am, 3 = As, 4 = Aw, 5 = BSh, 6 = BSk,
7 = BWh, 8 = BWk, 9 = Cfa ... 29 = Dwd, 30 = EF, 31 = ET, 0 = open sea.

## How patches and labels are made

For each climate state the browser works out the Köppen class of every land cell, then
finds each connected area of one (ecoregion, class) pair (about 8,700 in the modern
frame; 3,337 distinct pairs). Each patch gets a label anchor on a wide row near its
middle, plus the free width and height there, so the shared label engine can place it.
Names may overhang thin patches, and long names appear only when zoomed in far enough.
The work is redone, debounced, only when the climate state changes (about 0.1 second).

## How the past is drawn

There is no global gridded reconstruction behind this. The map for any year is the
modern map moved by two small, smooth adjustments (`src/biomes.ts`):

1. **Warm and cold swings**, in degrees of latitude. In a warmer age a place gets
   the climate that lies that many degrees nearer the equator today; in a colder
   age, nearer the pole. The effect fades out in the tropics (below 15 degrees),
   where temperature barely separates Köppen classes. Roughly 1.25 degrees of
   latitude is about 1 °C.
2. **African Humid Period.** Until about 3000 BCE the Sahara, Arabia and the Thar
   were wetter. Dry classes in that belt take the class found up to 8 degrees
   further south today. The signal fades to nothing by about 1000 BCE.

| Years | Climate age | Warm shift (deg. of latitude) |
|---|---|---|
| 3400 to 2500 BCE | Mid-Holocene warmth, African Humid Period ending | +1.3 to +0.9 |
| 2500 to 1000 BCE | Late Holocene drying | +0.9 to +0.1 |
| 1000 to 250 BCE | Iron Age cool phase | about −0.4 to +0.3 |
| 250 BCE to 400 CE | Roman Warm Period | up to +0.7 |
| 400 to 900 CE | Late Antique cold phase | about −0.5 |
| 900 to 1300 CE | Medieval Climate Anomaly | up to +0.8 |
| 1300 to 1850 CE | Little Ice Age | down to −1.2 |
| 1850 to 1975 CE | Industrial-era warming | −0.6 to 0 |
| 1975 to 2024 CE | Modern reference, then recent warming | 0 to +0.5 |

The keyframes live in `KEYFRAMES` in `src/biomes.ts`; change them there.

## Limits (read before trusting it)

- **Ecoregions are modern.** They are drawn with today's borders and names in every
  year; only the Köppen class half of each label changes with time. Real ecoregions
  also shifted over the millennia, and none of that is modelled.
- This shows direction and rough size of climate change, not a reconstruction. Real swings
  were regional, not a clean latitude shift. The Medieval Climate Anomaly and Little Ice
  Age, for example, were not synchronous worldwide.
- Mountains, monsoon strength, ocean currents, sea level and coastlines are not
  adjusted. Rainfall changes outside the Africa–Arabia–Thar belt are not modelled.
- The 1/12 degree grid (about 9 km) is coarse for small ecoregions; the smallest get
  a patch only as large as a few cells, and ecoregion borders follow the grid.
- Köppen and ecoregion data come from different sources, so a Köppen colour edge and an
  ecoregion line can disagree by a few kilometres.
