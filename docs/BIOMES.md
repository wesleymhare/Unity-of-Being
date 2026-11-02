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

## Colour

Hue comes from the Köppen class (`colour` in `CLASSES`). Within a class, every ecoregion
gets one of six lightness shades (`SHADES` in `src/biomes.ts`), so neighbouring ecoregions
of the same climate look different and the ecoregion borders are readable by colour as
well as by line. Shades are chosen once at load by a greedy graph colouring over
ecoregion adjacency on the grid: neighbours that share a Köppen class in the modern map
must differ most, neighbours of other classes differ where possible. An ecoregion keeps
its shade as the climate shifts, so a patch changes hue, not lightness, when its class
changes.

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

There is no global gridded reconstruction behind this yet (the data-based plan is in
`docs/PLAN-REALISTIC-CLIMATE.md` and waits on network access to the climate datasets).
Until then the map for any year is the modern map **resampled from a different place**:
each cell takes the class the modern map has at an offset position. The offset is computed
on 0.5 degree blocks (`src/biomes.ts`) and has two parts.

1. **Temperature.** A global warm/cold series, in degrees of latitude (about 1.25 degrees
   per °C), scaled by region: about 1.5 times stronger over the North Atlantic and Europe,
   stronger toward the Arctic, half as strong in the Southern Hemisphere, and absent in the
   tropics (below 15 degrees) where temperature barely separates Köppen classes. An extra
   early-Holocene warmth applies north of about 45 degrees until about 1000 BCE.
2. **Regional events**, each with its own area, direction and timeline (`REGIONS`):

| Event | Where | When (peak) | Effect |
|---|---|---|---|
| African Humid Period | Sahara, Sahel, Arabia | until about 3000 BCE, gone by 600 BCE | wetter: classes shift north |
| Stronger Indian monsoon | Thar, Indus | until about 2500 BCE | wetter |
| Stronger East Asian monsoon | northern China, Mongolia | until about 2000 BCE | wetter |
| 4.2 ka drought | Mesopotamia, Levant, Iran | about 2200 to 1900 BCE | drier |
| Late Bronze Age drought | Anatolia, eastern Mediterranean | about 1200 BCE | drier |
| Wetter Mediterranean | Mediterranean | Little Ice Age, peak about 1650 CE | wetter |
| Medieval megadrought | American Southwest and Plains | about 1150 to 1300 CE | drier |
| Classic Maya drought | Yucatán and the Maya lowlands | about 800 to 1000 CE | drier |

The global series: mid-Holocene warmth to 2500 BCE, cool phase about 750 BCE, Roman Warm
Period about 1 CE, Late Antique cold phase about 550 CE, Medieval Climate Anomaly about
1050 CE, Little Ice Age about 1650 CE, then industrial-era warming. Edit the keyframes
and regions in `src/biomes.ts`.

## Limits (read before trusting it)

- **Ecoregions are modern.** They are drawn with today's borders and names in every
  year; only the Köppen class half of each label changes with time. Real ecoregions
  also shifted over the millennia, and none of that is modelled.
- This shows the direction, place and rough size of well-known climate events, not a
  reconstruction. Class borders can be wrong by hundreds of kilometres, and many regional
  events (for example monsoon changes in Africa south of the Sahel, or the Andes) are not modelled.
- Mountains, monsoon strength, ocean currents, sea level and coastlines are not
  adjusted. Rainfall changes outside the Africa–Arabia–Thar belt are not modelled.
- The 1/12 degree grid (about 9 km) is coarse for small ecoregions; the smallest get
  a patch only as large as a few cells, and ecoregion borders follow the grid.
- Köppen and ecoregion data come from different sources, so a Köppen colour edge and an
  ecoregion line can disagree by a few kilometres.
