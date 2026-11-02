# Plan: make Biomes move like real climate, not a latitude slide

Status: **plan only, nothing built yet.** Written 2 November 2026. It needs open web
access (the coding sandbox can only reach GitHub, npm and PyPI), so the work will
happen in a session that can download the datasets below.

## The problem

`src/biomes.ts` currently makes the past by moving the modern Köppen map north or south
by a small, hand-picked number of degrees, plus a wetter Sahara/Arabia/Thar belt before
about 3000 BCE. That is a placeholder. Real climate change:

- is **regional**, not a uniform belt (the Medieval Climate Anomaly and Little Ice Age
  were strongest around the North Atlantic and Europe and weak or off-beat elsewhere);
- is often about **rainfall**, not temperature (the Green Sahara was a monsoon change
  driven by the Earth's orbit, not a warmer Sahara);
- interacts with **mountains**, which keep their own climates;
- is not tied to real data at all in the current model.

## Goal

For any year from 3400 BCE to 2024 CE, show the Köppen–Geiger class (and so the
ecoregion patch labels) that a published climate reconstruction implies for each place,
at about century resolution, with the source and uncertainty stated plainly.

## Approach

Compute Köppen classes from **monthly temperature and precipitation**, using the
standard Köppen rules, for each time step. Köppen needs monthly values, so a class map
alone cannot be moved realistically; that is why the current approach cannot be fixed
in place.

Two routes, in order of preference:

1. **Use a ready-made paleoclimate set (preferred).** CHELSA-TraCE21k provides monthly
   temperature and precipitation for roughly every century back 21,000 years, at fine
   resolution, downscaled from the NCAR TraCE-21ka simulation. Compute Köppen from it
   directly for each century. Covers the whole slider range in one consistent product.
2. **Change-factor (delta) method as a fallback or cross-check.** Take modern monthly
   climate (WorldClim 2.1, which keeps mountain detail) and add the *change* between
   each past period and the modern period from a coarser reconstruction or model
   (TraCE-21ka or PMIP4 for 6000 years ago; PAGES2k for the last 2000 years for
   temperature). Then compute Köppen.

## Data sources (to be verified when access is open)

Names, resolutions and licences below are from memory and **must be checked** before
building anything.

| Role | Source | What to confirm |
|---|---|---|
| Past monthly climate, main | CHELSA-TraCE21k (Karger et al. 2023, Scientific Data), hosted via EnviDat / CHELSA | time steps, variables, resolution, licence, file sizes |
| Modern monthly climate | WorldClim 2.1 (Fick & Hijmans 2017) | version, licence, resolution to download |
| Last 2000 years, temperature check | PAGES2k (2019) regional reconstructions, NOAA Paleo | regions, format |
| Mid-Holocene check | PMIP4 6 ka simulations (ESGF) or published ensemble maps | access route |
| Validation against evidence | BIOME 6000 / pollen-based biome reconstructions (Harrison et al.) | dataset, licence |
| Köppen rules | Peel et al. 2007 / Kottek et al. 2006 definitions | exact thresholds (the code must match the modern map's convention) |

The existing modern map (Rubel et al., via `kgcpy`) stays as the 1951–2000 reference
frame and as the test that the new Köppen code reproduces it.

## Pipeline

1. **Download** the datasets (new `data/download-climate.*`). Raw files stay in
   `data/raw/` (git-ignored). Expect several GB; only coarse versions are needed.
2. **Resample** each time step to the project grid (1/12 degree, or 1/6 if size
   demands) with area-aware averaging.
3. **Classify**: implement Köppen from monthly T and P in Python (numpy). **Test it
   first on modern WorldClim** and compare with the existing `koppen.bin`; agreement
   should be high apart from known dataset differences. Do not build past maps until
   this passes.
4. **Bias-correct** past maps toward the modern reference with the delta method so
   the 1950–2000 slice reproduces the observed map, and past slices differ from it by
   the model's *change*, not its bias.
5. **Compress**: store a class grid per time step, run-length encoded. Rough budget:
   about 0.3–0.5 MB per step at 1/12 degree, so about 55 steps from 3400 BCE is
   **20–30 MB**, too heavy to load at once. Mitigations: 1/6 degree for the deep past,
   store only cells that differ from the modern grid, and fetch time steps lazily as
   the slider moves. Decide the format after measuring.
6. **Validate** (see below).

## Front-end changes

- `src/biomes.ts`: replace `KEYFRAMES`/`climateShift` and the per-cell shifting in
  `update()` with: pick the two nearest time steps for the year, and use the nearer
  one (nearest-step, not blended, since blending class codes is meaningless).
- Keep `patches()`, the ecoregion labels, click panel and era note. The era note
  should now name the real source and the time step shown.
- Lazy loading with a small loading state when a time step is not yet fetched.
- Update `docs/BIOMES.md` to describe the data, the Köppen implementation and the
  validation results instead of the schematic shift.

## Validation

- **Modern test:** new Köppen code on WorldClim vs `koppen.bin` (percent of cells
  equal, and a map of differences).
- **Known events:** the Sahara should be markedly greener around 5000–3000 BCE and dry
  out by about 1000 BCE; the Little Ice Age should show up around the North Atlantic
  more than elsewhere; check Beck et al. 2023 for 1901 onward.
- **Evidence check:** compare a handful of regions with BIOME 6000 pollen biome
  reconstructions for 6 ka (for example Sahara, Scandinavia, Tibetan Plateau).
- Record the results in `docs/BIOMES.md`, including where the model and evidence
  disagree.

## Known limits that will remain

- Past maps are **model output**, not measurements. Models are known to under-green the
  Sahara and to misplace the timing of regional anomalies like the Medieval Climate
  Anomaly.
- Century resolution; no year-by-year weather.
- Ecoregions stay **modern** (borders and names). Only the climate half of each
  ecoregion label changes.
- Sea level and coastlines are not changed.
- Köppen classes depend on thresholds, so small climate differences can flip a class
  and make borders look jumpy between time steps.

## Decisions (owner, 2 November 2026)

1. Model-based climate with stated uncertainty is acceptable.
2. No file-size budget concern; lazy loading is fine.
3. Remove the schematic model once the real data is in.

(Original questions kept below for the record.)

## Decisions needed from the owner

1. Is "model-based, with stated uncertainty" acceptable, or does every map need direct
   proxy evidence (pollen, etc.)? Proxy-only coverage is patchy.
2. File size budget for the site (the data above could add tens of MB) and whether
   lazy loading is acceptable.
3. Whether to keep the schematic model as a switchable fallback or remove it.

## Access needed

Open web access to the dataset hosts above (or the files placed somewhere reachable,
such as a GitHub release in this repo). If working in the coding sandbox, the hosts
must be allowed in the session's network settings.

## Order of work

1. Verify sources, licences and sizes; pick the exact files.
2. Köppen implementation and modern test.
3. One past slice end to end (for example 4000 BCE) and inspect it against the Green
   Sahara and pollen evidence.
4. Full set, compression and lazy loading.
5. Front-end swap, docs, validation write-up.
