# What a "Civilization" is on this map (the Peoples lens)

> **Renamed in the app to "Peoples" on 13 November 2026** (owner request). The lens id is `peoples`;
> old links with `lens=civilizations` still open it. The data files, build script and map source keep
> the name `civilizations` so nothing had to be rebuilt; "Civilization" below means one people entry.
>
> **Genetic lineages (13 Nov 2026).** Peoples carry tags for their commonest paternal (Y-DNA, blue
> chips) and maternal (mtDNA, pink chips) haplogroups, in `src/haplogroups.ts`, keyed by the exact
> people name. 284 of 430 peoples are tagged. Each entry says whether it rests on ancient DNA (study
> named) or present-day samples. They are a first pass from the broad consensus of population-genetic
> surveys and well-known ancient-DNA papers, to be checked against the Allen Ancient DNA Resource
> (AADR) and the cited studies before any figure is quoted. Now 323 of 479 peoples. Rule: only lineages a published study
> reports as common for that people; never invent a tag for an untagged people; a haplogroup is one
> line of descent, not an identity.
>
> **Finer peoples (13 Nov 2026).** `data/civilizations_more_5.py` adds 49 level-3 regional peoples
> inside the large ones. Inside Germans: Old Saxons → Lower Saxons and Westphalians (line `saxons`),
> Holsteiners and Mecklenburgers, Upper Saxons, Thuringians, Franconians, Hessians, Rhinelanders,
> Palatines, Brandenburgers and Berliners, Pomeranians, East Prussians, German then Upper Silesians
> (line `silesians`), Sudeten Germans, Sorbs, Luxembourgers and Tyroleans. Germans abroad: Baltic,
> Transylvanian Saxon, Danube Swabian and Volga Germans. Elsewhere in Europe: Old Prussians,
> Kashubians, Masurians, Gorals, Moravians, Rusyns, Hutsuls, Pomors, Northumbrians, Yorkshire and
> West Country folk, Walloons, Picards, Burgundians, Gascons, Provençals, Auvergnats, Asturians,
> Aragonese, Guanches → Canarians (line `canary`), Friulians, Ligurians, Emilians, Cretans and Faroese.
> 39 of the 49 carry lineage tags; expelled or emigrant groups with no survey of their own are left
> untagged. Rebuilding also re-trimmed about 120 older footprints at the Caspian and Aral seas, which
> `land.geojson` gained on 3 Nov after the last build.
>
> Build on Windows: Python 3.12 is installed per user at
> `%LOCALAPPDATA%\Programs\Python\Python312\python.exe` (not on PATH). Run from the repo root:
> `python data/build-civilizations.py` (paths are relative to the root).

> Renamed from "Societies" on 3 November 2026. A Civilization is the **sociocultural and ancestral** layer: peoples, languages, customs and (later) deep ancestry such as haplogroup distributions. Control networks, trade routes, factions and parties are the separate **Societies** lens; see docs/SOCIETIES.md.

The repo never defined this in one place. The README and PROGRESS notes only say
"a Civilizations lens for language-family areas and selected peoples" and, in the
early roadmap, "civilization (Glottolog/Wikidata)". This page fixes that wording so
the data, the labels and the panel all mean the same thing. If you meant
something different, change this page first, then the data follows.

## Definition

A **Civilization** is a *shared affinity substrate*: the people, language, customs and sense
of "who we are" that hold a community together **in a place and a period**. It answers
"who do you belong to?", where a **Polity** answers "who governs here?".

A Civilization is **temporal**. The same people at different times are different civilizations:
ancient Dravidian speakers, the Sangam Tamils, the Chola-age Tamils and modern Tamils
are four stages, not one. So each entry is a **stage**, with its own dates and
footprint, and stages that continue one another are joined into a **lineage**
("This civilization through time" in the panel) that you can walk with one click.

Examples the map is built around:

- Proto-Afro-Asiatic speakers, pre-Islamic Arabians, medieval Bedouin, modern Arabs
- Medieval Occitans, Occitans under the French crown, Occitan speakers today
- Siculo-Arabs, then Norman-Arab-Byzantine Sicilians, then Sicilians, then Italian-Americans
- Early Zagros highlanders, medieval Kurds, Kurmanji Kurds of Diyarbakır, Sorani Kurds of Iraqi Kurdistan
- Albanians, Kosovo Albanians, Arbëreshë in Italy
- Tongva, Californios, then modern Southern California

## Where you stand (no centre)

Civilizations are a sociological map, not a hierarchy. In world-civilization terms the world
culture is isomorphic, so people group into "peoples" and common-interest communities
without any central point of privilege: the Dacians mostly dealt with Dacians even while
Rome was the polity next door, and a Southern Californian today belongs to Modern
Southern California whatever state or country draws the border.

So clicking a place does not open "the" civilization there. It finds **every identity active
at that point and year** (by geometry, whatever is drawn on top, at any zoom) and opens
the one at the scale the map is showing, listing the rest as peers grouped by scale:
local identity, people, wider sphere. Nesting in space is incidental; none of them
contains or governs the others.

| | Polity | Civilization |
|---|---|---|
| Unit | a state, empire, city-state, chiefdom | a community of belonging at one time |
| Edges | borders set by rulers | soft footprints of where the community lived |
| Overlap | avoided (one ruler per place) | allowed and expected: a people can live under many states, and local identities nest inside broader ones |
| Persistence | ends when the state ends | outlasts regimes, but changes, so it is cut into dated stages |
| Colour | one colour per realm | one hue per **language family or cultural sphere**; local identities are a deeper shade |
| Source | Cliopatria (Seshat) | curated in `data/civilizations_data.py` and `data/civilizations_more_*.py` |

## Levels

Every stage has a level (`lvl`), which sets how it is drawn:

1. **Broad sphere**: a language family or cultural area (for example "Indo-Aryan peoples").
   Drawn as a light wash underneath.
2. **People**: a nation-scale community (for example "Greeks", "Poles", "Persians").
3. **Local identity**: a regional or sub-ethnic community, or a diaspora (for example
   "Kosovo Albanians", "Modern Southern California", "Italian-Americans"). Drawn in a
   deeper shade; they fade in between zoom 2.2 and 3.0, and their names appear with the shape. (They used
   to fade in at 3.0 to 4.0 while names showed at every zoom, which left the Kyrgyz and most regional
   peoples as floating text at the default zoom; fixed 18 Nov 2026, stops are `LOCAL_FADE_FROM` and
   `LOCAL_FADE_TO` in `src/main.ts`.) Clicks choose a local identity from zoom 3.4.

## An entry

- `name`, the name people use for the community at that stage
- `s` / `e`, the years that stage is shown
- `kind`: **People**, **Culture** (archaeological), **Civilization**, or **Language area**
- a **family group** (colour and legend): Indo-European, Afro-Asiatic, and so on,
  plus cultural spheres where no family is established
- a **footprint**: a coarse polygon, trimmed to the coastline
- `line`: the lineage id that joins this stage to its earlier and later stages
- `note`: one line on what holds the community together

## Rules for adding or editing a Civilization

1. It must be a *community*, not a state. "Roman Empire" is a polity; "Latins and
   Romans" or "Italians" is a civilization.
2. **Cut by time.** When a community changes a lot (new language, new religion, new place,
   new name), add a **new stage** with its own dates and give both the same `line`.
3. Draw the **core and long-term range** for that stage, not a single year's border.
   Footprints are approximate and deliberately smooth.
4. Use level 3 for regional identities and diasporas, and nest them inside the broader stage.
5. Use a language family or sphere from the list in `data/civilizations_data.py`. If nothing
   fits, use "Isolates and lost languages".
6. Give the best Wikipedia article title in `wiki`. The panel loads its summary from it and
   falls back to a search when a title misses.
7. Keep names short; the label engine shortens or hides long names at low zoom.
8. Where a link between stages is a hypothesis (for example Illyrians and Albanians), say
   so in `note`.

## How it is built

`python3 data/build-civilizations.py` (run from the repo root) reads `data/civilizations_data.py` (and the batch modules
`civilizations_more_1.py` to `civilizations_more_5.py` that it loads), applies the lineage table
in `data/civilizations_lineages.py`, trims each polygon to `public/data/land.geojson`,
computes a label anchor inside each shape, and writes `public/data/civilizations.geojson`.
`box()` and `blob()` build rough rectangles and ellipses for quick footprints.

Coverage today: about 440 stages in about 70 lineages. Strongest for Europe, the
Near East, South Asia and North America; thinner for sub-Saharan Africa, the Pacific,
Central and South America, and Siberia. Adding stages is the main work still to do.

The earlier Civilizations layer (about 8,500 Glottography language polygons plus ten
hand-drawn boxes) was removed. It was too fine-grained to read or label, it only
covered 1500 CE onward, and it modelled individual languages rather than peoples.

## Caveats

Footprints are broad, simplified and sometimes disputed. Ethnicity and language
do not always line up, and many communities overlap or blend. Links between stages
are interpretive. Read the map as a guide to where a community was centred, never as
a boundary.
