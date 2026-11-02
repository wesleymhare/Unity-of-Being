# Biomes lens: Köppen–Geiger climate through time

The Biomes lens colours the land by Köppen–Geiger climate class and lets the year
slider nudge the map through well-known climate swings. Click anywhere for the
class, its typical temperature, rainfall and vegetation, and the climate age shown.

## Data

- **Base map:** Köppen–Geiger classes at about 3 km (100 arc-seconds), reference
  period 1951–2000. Rubel, Brugger, Haslinger & Auer (2017), after Kottek et al.
  (2006) and Rubel & Kottek (2010). The raster comes from the `kgcpy` package on
  PyPI (BSD-licensed code), fetched by `npm run data:biomes:download`.
- **Built file:** `public/data/koppen.bin`, 1/6 degree, one byte per cell, run-length
  encoded (about 160 KB). `public/data/ocean.geojson` is the open sea, used to trim
  the colours exactly to the Natural Earth coastline.
- Rebuild with `npm run data:biomes:build` (needs `data/requirements.txt`).

Class numbers follow kgcpy: 1 = Af, 2 = Am, 3 = As, 4 = Aw, 5 = BSh, 6 = BSk,
7 = BWh, 8 = BWk, 9 = Cfa ... 29 = Dwd, 30 = EF, 31 = ET, 0 = open sea.

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

- This shows direction and rough size, not a reconstruction. Real swings were
  regional, not a clean latitude shift. The Medieval Climate Anomaly and Little Ice
  Age, for example, were not synchronous worldwide.
- Mountains, monsoon strength, ocean currents, sea level and coastlines are not
  adjusted. Rainfall changes outside the Africa–Arabia–Thar belt are not modelled.
- The ocean mask uses modern coastlines, so drowned or exposed shelves are ignored.
- Treat the modern frame (about 1975) as the only measured one.
