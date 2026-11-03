# Plan: renaming Societies and adding a new Societies lens

**Status: done (3 November 2026).** The rename is complete, and the new Societies lens exists with ~40 curated networks (see `docs/SOCIETIES.md`). The notes below are kept as the original plan.

Status: **planned, not started** (parked on 2 November 2026, per Wes).

## The idea

The current **Societies** lens is really about shared cultural and ancestral belonging:
peoples, languages, customs, lineages through time ("who you identify with"). Wes wants to
rename it and add a different lens for de facto organisation.

| Lens (new name) | What it maps | Examples |
| --- | --- | --- |
| **Polities** (unchanged) | De jure states and their subdivisions | Rome and its provinces, Qing, Ottoman eyalets |
| **Civilizations** (today's Societies, renamed) | Sociocultural belonging and deep ancestry: language families, cultural spheres, lineages through time; room for population-genetic layers (haplogroups) | Modern Southern California, medieval Occitans, proto-Afro-Asiatic speakers |
| **Societies** (new) | Strict de facto control and organisation: logistical networks, communities, trade routes, factions, parties | Hanseatic trade network, Silk Road caravan system, a political party or faction, a diaspora network |
| **Biomes** (unchanged) | Climate and ecoregions | |

"Societies" in the new sense is about who actually controls and moves things, whatever the
legal map says, and is mostly **networks and nodes**, not filled areas.

## Open design questions (decide before building)

- Geometry: networks need lines and points (routes, hubs, nodes) as well as areas (zones of
  control, communities). The new lens needs line and point layers, not only polygons.
- Data model: dated stages like Civilizations, plus edges (route A to B) and membership.
- Sources: Wikidata (trade routes, organisations, parties), Pleiades/OmniaRoutes-style route
  data for antiquity, curated entries where nothing exists. Check licences first.
- Haplogroups for Civilizations: only from published, openly licensed ancient-DNA datasets,
  shown as a labelled layer with uncertainty, never as a claim about identity.
- Rename mechanics: lens key `societies` becomes `civilizations` in the URL hash (keep the old
  value working as an alias so shared links do not break), UI labels, docs/SOCIETIES.md
  (rename to docs/CIVILIZATIONS.md), data files and build scripts.

## Suggested order

1. Rename Societies to Civilizations (labels, hash alias, docs). No data change.
2. Design and add the new Societies lens with one worked example (for instance the Hanseatic
   League or the Silk Road) to test the line, point and area model.
3. Add haplogroup and ancestry layers to Civilizations once a clean open dataset is chosen.
