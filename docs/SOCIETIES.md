# What a "Society" is on this map

The repo never defined this in one place. The README and PROGRESS notes only say
"a Societies lens for language-family areas and selected peoples" and, in the
early roadmap, "society (Glottolog/Wikidata)". This page fixes that wording so
the data, the labels and the panel all mean the same thing. If you meant
something different, change this page first, then the data follows.

## Definition

A **Society** is a *shared affinity substrate*: the people, language, customs and sense
of "who we are" that hold a community together **in a place and a period**. It answers
"who do you belong to?", where a **Polity** answers "who governs here?".

A Society is **temporal**. The same people at different times are different societies:
ancient Dravidian speakers, the Sangam Tamils, the Chola-age Tamils and modern Tamils
are four stages, not one. So each entry is a **stage**, with its own dates and
footprint, and stages that continue one another are joined into a **lineage**
("This society through time" in the panel) that you can walk with one click.

Examples the map is built around:

- Proto-Afro-Asiatic speakers, pre-Islamic Arabians, medieval Bedouin, modern Arabs
- Medieval Occitans, Occitans under the French crown, Occitan speakers today
- Siculo-Arabs, then Norman-Arab-Byzantine Sicilians, then Sicilians, then Italian-Americans
- Early Zagros highlanders, medieval Kurds, Kurmanji Kurds of Diyarbakır, Sorani Kurds of Iraqi Kurdistan
- Albanians, Kosovo Albanians, Arbëreshë in Italy
- Tongva, Californios, then modern Southern California

## Where you stand (no centre)

Societies are a sociological map, not a hierarchy. In world-society terms the world
culture is isomorphic, so people group into "peoples" and common-interest communities
without any central point of privilege: the Dacians mostly dealt with Dacians even while
Rome was the polity next door, and a Southern Californian today belongs to Modern
Southern California whatever state or country draws the border.

So clicking a place does not open "the" society there. It finds **every identity active
at that point and year** (by geometry, whatever is drawn on top, at any zoom) and opens
the one at the scale the map is showing, listing the rest as peers grouped by scale:
local identity, people, wider sphere. Nesting in space is incidental; none of them
contains or governs the others.

| | Polity | Society |
|---|---|---|
| Unit | a state, empire, city-state, chiefdom | a community of belonging at one time |
| Edges | borders set by rulers | soft footprints of where the community lived |
| Overlap | avoided (one ruler per place) | allowed and expected: a people can live under many states, and local identities nest inside broader ones |
| Persistence | ends when the state ends | outlasts regimes, but changes, so it is cut into dated stages |
| Colour | one colour per realm | one hue per **language family or cultural sphere**; local identities are a deeper shade |
| Source | Cliopatria (Seshat) | curated in `data/societies_data.py` and `data/societies_more_*.py` |

## Levels

Every stage has a level (`lvl`), which sets how it is drawn:

1. **Broad sphere**: a language family or cultural area (for example "Indo-Aryan peoples").
   Drawn as a light wash underneath.
2. **People**: a nation-scale community (for example "Greeks", "Poles", "Persians").
3. **Local identity**: a regional or sub-ethnic community, or a diaspora (for example
   "Kosovo Albanians", "Modern Southern California", "Italian-Americans"). Drawn in a
   deeper shade and shown from about zoom 3.6; you cannot click them when zoomed out.

## An entry

- `name`, the name people use for the community at that stage
- `s` / `e`, the years that stage is shown
- `kind`: **People**, **Culture** (archaeological), **Civilization**, or **Language area**
- a **family group** (colour and legend): Indo-European, Afro-Asiatic, and so on,
  plus cultural spheres where no family is established
- a **footprint**: a coarse polygon, trimmed to the coastline
- `line`: the lineage id that joins this stage to its earlier and later stages
- `note`: one line on what holds the community together

## Rules for adding or editing a Society

1. It must be a *community*, not a state. "Roman Empire" is a polity; "Latins and
   Romans" or "Italians" is a society.
2. **Cut by time.** When a community changes a lot (new language, new religion, new place,
   new name), add a **new stage** with its own dates and give both the same `line`.
3. Draw the **core and long-term range** for that stage, not a single year's border.
   Footprints are approximate and deliberately smooth.
4. Use level 3 for regional identities and diasporas, and nest them inside the broader stage.
5. Use a language family or sphere from the list in `data/societies_data.py`. If nothing
   fits, use "Isolates and lost languages".
6. Give the best Wikipedia article title in `wiki`. The panel loads its summary from it and
   falls back to a search when a title misses.
7. Keep names short; the label engine shortens or hides long names at low zoom.
8. Where a link between stages is a hypothesis (for example Illyrians and Albanians), say
   so in `note`.

## How it is built

`python3 data/build-societies.py` reads `data/societies_data.py` (and the batch modules
`societies_more_1.py` to `societies_more_3.py` that it loads), applies the lineage table
in `data/societies_lineages.py`, trims each polygon to `public/data/land.geojson`,
computes a label anchor inside each shape, and writes `public/data/societies.geojson`.
`box()` and `blob()` build rough rectangles and ellipses for quick footprints.

Coverage today: about 440 stages in about 70 lineages. Strongest for Europe, the
Near East, South Asia and North America; thinner for sub-Saharan Africa, the Pacific,
Central and South America, and Siberia. Adding stages is the main work still to do.

The earlier Societies layer (about 8,500 Glottography language polygons plus ten
hand-drawn boxes) was removed. It was too fine-grained to read or label, it only
covered 1500 CE onward, and it modelled individual languages rather than peoples.

## Caveats

Footprints are broad, simplified and sometimes disputed. Ethnicity and language
do not always line up, and many communities overlap or blend. Links between stages
are interpretive. Read the map as a guide to where a community was centred, never as
a boundary.
