# Polity stat sheet

Every polity panel shows the same rows in the same order, so two polities can be compared at a
glance. A row with no figure shows a dash instead of disappearing. Order:

| Section | Rows |
|---|---|
| Rulers (above the description) | Head of state and head of government for the year; reign sequence with "Full timeline" |
| **Government** | Government form, Capital (for the year), Existed |
| **People** | Population, Languages, Religion |
| **Land and economy** | Area, Economy (GDP and per person), Currency (for the year) |
| **Military** | Armed forces, Military spending |
| **Lineage** | Preceded by, Succeeded by, Part of (realm) |

The Wikipedia infobox is still there, but at the bottom and folded ("More from the Wikipedia
infobox"), because each article orders it differently.

## Where each figure comes from
Tried in this order, per row (`src/profile.ts`):
1. **Curated:** `public/data/polity-stats.json`, keyed by Wikidata id. For hand-checked figures with
   a source note.
2. **World Bank open data (CC BY 4.0):** modern states, about 1960 on: population, GDP and GDP per
   person, armed forces personnel (about 1985 on), military spending. Looked up by the state's ISO
   code from Wikidata (P298).
3. **Wikidata (CC0):** population and area (dated values: the nearest year to the slider is shown,
   marked "c. 1520" and greyed when more than 120 years away), capital and currency (the one in use
   that year), government, languages, religion, predecessors and successors.

## Coverage today (honest)
- Good for modern states (about 1960 to 2026): population, economy, armed forces, spending.
- Patchy before that. Wikidata has dated population or area for some polities and none for others.
  **Armed forces before the modern era are mostly dashes**: there is no single open dataset, and
  the figures that exist are scholarly estimates with wide ranges.
- The sheet only reports what a source says. It never guesses.

## Curated figures: format
`public/data/polity-stats.json` (empty for now):
```json
{
  "Q12544": {
    "army":       [{ "y": 150, "v": "about 300,000 to 400,000 (legions and auxiliaries)", "src": "source note" }],
    "population": [{ "y": 150, "v": "about 60 million", "src": "source note" }],
    "area":       [{ "y": 117, "v": "about 5 million km²", "src": "source note" }],
    "economy":    [],
    "spending":   []
  }
}
```
`v` is shown as written; `y` is the year it is for; the entry nearest the slider year is used.

## Datasets worth ingesting next (to verify before use)
Names, coverage and licences are from memory and must be checked when web access is open:
- Correlates of War National Material Capabilities: military personnel and expenditure, 1816-2016.
- Maddison Project Database: GDP per person and population, from 1 CE.
- Clio-Infra and HYDE: population and land use, long run.
- Seshat Global History Databank: structured variables for many polities, including military ones.
Each needs a mapping from its country codes or names to our polity records (Wikidata ids).

## Known limits
- Wikidata is crowd-sourced; some values are wrong or in odd units.
- A World Bank code can be missing for historical states; the row then falls back to Wikidata.
- Figures from a year far from the slider are shown with their own year so they are not mistaken for
  the year on screen.
