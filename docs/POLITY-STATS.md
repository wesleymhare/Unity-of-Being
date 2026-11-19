# Polity stat sheet

Every polity panel shows the same rows in the same order, so two polities can be compared at a
glance. A row with no figure shows a dash instead of disappearing. Order:

| Section | Rows |
|---|---|
| **Government** | Government form, **Head of state**, **Head of government** (for the year), Capital (for the year), Existed; a fold-out "Rulers through time" lists every ruler on record |
| **People** | Population, Languages, Religion |
| **Land and economy** | Area, Economy (GDP and per person), Currency (for the year) |
| **Military** | Armed forces, Military spending |
| **Lineage** | Preceded by, Succeeded by, Part of (realm) |

The flag or coat of arms (for the year) is the first thing under the title; there is no separate
ruler box.

## One sheet for every entity (since 12 Nov 2026)
The panel has a single fact block, `#p-profile`, drawn by `drawSheet` in `src/main.ts`. The old
Wikidata fact list and the folded "More from the Wikipedia infobox" block are gone: everything
they showed is now inside the sheet, so nothing is dropped and nothing is shown twice.

- **Polities** use the fixed sheet above (`buildSheet`).
- **Provinces, civilizations, societies and ecoregions/climate** use `buildGenericSheet`
  (`src/profile.ts`): the same sections in the same order, but only rows that have data. The
  entity's own group comes first ("Civilization", "Society", "Province", "Ecoregion"), holding
  this project's curated facts (sphere, lineage, power, climate...) and Wikidata's "Instance of".
- **Section order everywhere:** the entity's own group, Government, History, People, Land and
  economy, Military, Lineage, Reference. `History` and `Reference` appear only when the infobox
  gives rows for them. Order constants: `SECTION_ORDER` in `src/infobox-map.ts`.
- **Each row shows its best value** (curated, then World Bank, then Wikidata, then the infobox).
  **Every other reading is kept** under the row as a folded "Also reported · N": other infobox
  values (including each dated population or area figure) and other dated Wikidata values, each
  tagged with its source and year. A reading the chosen value already contains is not repeated.
- **Infobox rows with no fixed row** (rulers, legislature, "Today part of", ISO codes...) are filed
  by `organiseInfobox` into a group (`GROUP_ORDER`) and `SECTION_OF_GROUP` maps the group to a
  sheet section. Their labels are dimmer and say "From the Wikipedia infobox" on hover.
- **Wikipedia links are kept**: values taken from the infobox are shown as safe DOM (links into
  Wikipedia only), not flattened text. Nothing is cut at 200 characters any more; a value over 240
  characters folds to three lines with a "more" button.
- The sheet redraws whenever the year moves, the infobox arrives, or Wikidata arrives.

### One panel order for every lens (18 Nov 2026)
Every lens now fills the panel in the same order (`index.html`, `openPanel` and `openThemePanel` in
`src/main.ts`): kicker, name, image, dates or context line, one-line note, then the body:
1. the Wikipedia lead of the entity's main article;
2. the fact sheet above (own group first, then the fixed sections);
3. the lens's own blocks: genetic lineages (Peoples), provinces (Polities), further articles and the
   other polities in the class (Ideologies, Worldviews, de facto control);
4. "through time" (lineage), the modern-location map, then links and credits.

Ideologies, Worldviews and the de facto control click used to show only stacked article summaries.
Their main article now fills the lead, image and sheet like any other entity; the own group holds
Class, Applies to, Why, Stacked from (how many articles) and Same class (peers); the stack lists only
the remaining articles ("More from Wikipedia"). Biomes already used the shared sheet (ecoregion article
and its infobox, own group "Ecoregion" or "Climate").

To add a row that has a fixed place: add its key to `RowKey` and `RULES` in `src/infobox-map.ts`,
then to the label and section tables above `buildGenericSheet` in `src/profile.ts` (and to
`buildSheet` if polities should show a dash for it).

## Worldbuilding rows (built 18 Nov 2026)
**Principle.** Wikipedia (infobox and lead) keeps what it covers well: prose, rulers, capital, languages,
religion, dates, events. The researched layer adds only simple, comparable figures for worldbuilding,
chosen by the owner:

| Sheet section | Row | What it holds |
|---|---|---|
| People | **Population** | existing row (World Bank, researched figure, Maddison, Wikidata, infobox) |
| People | **Cities** | up to five largest cities with their populations that year |
| People | **Lingua franca and writing** | language(s) of administration or lingua franca, and the administrative script(s) |
| Land and economy | **Wealth** | tonnes of gold-equivalent: annual economic output (GDP), else annual state revenue, else the treasury, with the conversion shown |
| Military | **Standing troops** | standing or permanently embodied troops (the old "Armed forces" row, renamed), plus a few words on what they were |
| Military | **Military tech** | the most advanced material in regular use (Stone, Bronze, Iron, Steel, Gunpowder, Industrial, Nuclear) and the main arm |

**Wealth in gold.** One universal measure across eras: tonnes of gold-equivalent, a year's output or
revenue (or the treasury's total), converted with the period's own coinage and metal ratios (for example
Rome in 150 CE: about 20 billion sesterces, 100 sesterces to the aureus, 7.3 g of gold each, about 1,500 t).
The basis (GDP, revenue or treasury) is always stated. It sits beside the existing "Economy" row, which keeps
modern dollar figures.

**Storage.** `public/data/polity-stats.json`, keyed by Wikidata id, with the keys `population`, `army`
(standing troops), `tech`, `wealth`, `cities`, `lingua` (and the older `area`, `economy`, `spending`).
Every entry is `{ y, v, src, conf, by, n? }`: the year, the text shown, the source, `conf` (high, medium or
low), `by` (`curated` or `ai`) and, where there is one, the number behind the text (`n`). Entries with
`by: "ai"` show on the sheet as "unverified, <confidence>" with the source marked AI-filled, and are only
used where nothing better exists (World Bank, a curated figure, Maddison, Wikidata and the infobox come
first for the rows that have them). Curated entries are never overwritten by an AI entry.

**Filling it.** See `docs/RESEARCH-BATCHES.md`: Markdown batch files to paste into a chat model, and a
checker that validates the reply before anything is merged.

## Where each figure comes from
Tried in this order, per row (`src/profile.ts`):
1. **Curated:** `public/data/polity-stats.json`, keyed by Wikidata id. For hand-checked figures with
   a source note.
2. **World Bank open data (CC BY 4.0):** modern states, about 1960 on: population, GDP and GDP per
   person, armed forces personnel (about 1985 on), military spending. Looked up by the state's ISO
   code from Wikidata (P298).
3. **Wikipedia infobox:** fallback text for a row, or a dated value when it is nearer the slider year.
4. **Wikidata (CC0):** population and area (dated values: the nearest year to the slider is shown,
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

## Maddison Project (added)
`public/data/maddison.json` (built by `data/build-maddison.py` from the Maddison Project Database 2023,
CC BY 4.0) gives population and GDP per person for 169 countries from 1 CE: sparse before 1820
(1, 1000, 1500, 1600, 1700), yearly after. It is used when a state has an ISO code in Wikidata (or is
the USSR, Yugoslavia or Czechoslovakia), in these rows:
- **Population:** after the World Bank and curated figures; chosen over Wikidata or the infobox when its
  year is at least as close to the slider.
- **Economy:** after the World Bank; GDP per person in 2011 international dollars, plus a total GDP when a
  population figure within 5 years exists.
Its series follow **present-day borders**, so the row's visible note says "today's borders" and a figure
more than 120 years from the slider is greyed. It never uses a figure more than 150 years away.

## Datasets worth ingesting next (licences checked 7 Nov 2026, see `docs/DATA-SOURCES.md`)
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
