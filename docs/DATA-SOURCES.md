# Data sources: licences checked, and what we use

Checked on 7 Nov 2026 by reading the source's own page or record (not a mirror). The site may be run
commercially, so "commercial use OK" matters. Re-check a licence before relying on a new dataset.

## In use
| Data | Licence | Commercial use | Checked at |
|---|---|---|---|
| Cliopatria polity borders | CC BY 4.0 | yes, with credit | repo `LICENSE.md`; Zenodo record 13363121 lists `cc-by-4.0` |
| Maddison Project Database 2023 (population and GDP per person from 1 CE) | CC BY 4.0 | yes, with credit | GGDC page: "licensed under a Creative Commons Attribution 4.0 International License" |
| World Bank open data | CC BY 4.0 | yes, with credit | as stated in the app already; not re-checked 7 Nov |
| RESOLVE Ecoregions 2017 | CC BY 4.0 | yes, with credit | not re-checked 7 Nov |
| Natural Earth | public domain | yes | naturalearthdata.com |
| Wikidata | CC0 | yes | Wikidata terms (not re-checked 7 Nov) |
| Wikipedia text | CC BY-SA | yes, with credit and share-alike | Wikipedia terms |
| Wikimedia Commons images | per file | depends on the file | licence on each file page |
| OpenStreetMap | ODbL | yes, with credit | embed only |

## Checked, not used yet (safe if we do)
| Data | Licence | Notes |
|---|---|---|
| HYDE 3.3 (population, built-up area and land use, 10,000 BCE to 2023 CE) | CC BY 4.0 | Utrecht University record 94FNH0; 5 arc-minute ESRI ASCII grids. Good for a Biomes "land use" or a population-density layer. A newer HYDE 3.4/3.5 exists; use the latest when we do. |
| CHELSA-TraCE21k (temperature and precipitation every 100 years for 21,000 years) | CC BY-SA (EnviDat page header); the description text says CC BY 2.0 | Both allow commercial use. If the SA applies, layers derived from it must be shared under the same licence, which suits this open project. 30 arc-second global grids are very large: download only a few time slices and coarsen. See `docs/PLAN-REALISTIC-CLIMATE.md`. |

## Not safe for a commercial site
| Data | Why |
|---|---|
| Seshat Databank variables (army size, hierarchy...) | Seshat's download page and user agreement are reported as CC BY-NC-SA (non-commercial; seen in search results, the live page needs a login). Only the Cliopatria borders are CC BY. A mirror claims CC0 for the GitHub copy; the owner would have to confirm in writing. |
| Correlates of War (military personnel and spending, 1816-2022) | Not redistributable without written permission of the project. |
| CShapes 2.0 | CC BY-NC. |
| Euratlas | Proprietary. |
| SIPRI Military Expenditure Database | No explicit licence found, so treated as not reusable. |

## Not yet checked (hosts not reachable from the build environment)
- World Historical Gazetteer (advertises CC BY 4.0 datasets), Pleiades (CC BY per older sources) and
  ORBIS (no licence statement found). Useful for Societies hubs and ancient places.
- PaleoClim: no licence statement found.

## Rule of thumb
Prefer CC BY, CC0 and public domain. CC BY-SA is acceptable when the share-alike condition is met.
Do not ship NC or "ask permission" data. Credit every dataset in `index.html` (Sources) and `README.md`.
