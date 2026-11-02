# What a "Society" is on this map

The repo never defined this in one place. The README and PROGRESS notes only say
"a Societies lens for language-family areas and selected peoples" and, in the
early roadmap, "society (Glottolog/Wikidata)". This page fixes that wording so
the data, the labels and the panel all mean the same thing. If you meant
something different, change this page first, then the data follows.

## Definition

A **Society** is a people held together by shared language and way of life,
regardless of which state rules them at the time. It answers "who are the
people here?", where a **Polity** answers "who governs here?".

That has consequences:

| | Polity | Society |
|---|---|---|
| Unit | a state, empire, city-state, chiefdom | a people, culture or language community |
| Edges | borders set by rulers | soft footprints of where the community lived |
| Overlap | avoided (one ruler per place) | allowed (a people can live under many states; two can share a region) |
| Persistence | ends when the state ends | outlasts regimes, but can move, grow, shrink, merge or fade |
| Colour | one colour per realm | one colour per **language family or cultural sphere** |
| Source | Cliopatria (Seshat) | curated in `data/societies_data.py` |

A Society entry has:

- `name`, the name people use for the community (for example "Celts", "Bantu peoples")
- `s` / `e`, the years its footprint is shown
- `kind`: **People**, **Culture** (an archaeological culture), **Civilization**,
  or **Language area**
- a **family group** (colour and legend): Indo-European, Afro-Asiatic, and so on,
  plus cultural spheres where no family is established (Mesoamerican, Andean...)
- a **footprint**: a coarse polygon, trimmed to the coastline

## Rules for adding or editing a Society

1. It must be a *community*, not a state. "Roman Empire" is a polity; "Latins and
   Romans" or "Italians" is a society.
2. Draw the **core and long-term range**, not a single year's border. Footprints
   are approximate and deliberately smooth. Do not imply a precision the evidence
   does not have.
3. When a community's range changes a lot, add a **new entry with new dates**
   rather than stretching one polygon (for example "Han Chinese" before and after
   1300 CE, or the stages of the Bantu expansion).
4. Use a language family or sphere from the list in `data/societies_data.py`. If
   nothing fits, use "Isolates and lost languages".
5. Give the best Wikipedia article title in `wiki`. The panel loads its summary
   from it.
6. Prefer the name that sits naturally on the map. Long names are shortened or
   hidden at low zoom by the label engine, so keep them short.

## How it is built

`python3 data/build-societies.py` reads `data/societies_data.py`, trims each
polygon to `public/data/land.geojson`, computes a label anchor inside each shape,
and writes `public/data/societies.geojson`.

The earlier Societies layer (about 8,500 Glottography language polygons plus ten
hand-drawn boxes) was removed. It was too fine-grained to read or label, it only
covered 1500 CE onward, and it modelled individual languages rather than peoples.

## Caveats

Footprints are broad, simplified and sometimes disputed. Ethnicity and language
do not always line up, and many peoples overlap or blend. Read the map as a
guide to where a community was centred, never as a boundary.
