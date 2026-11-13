# Thematic lenses: Ideologies, Worldviews, and de facto control

Added 13 November 2026 (owner request: "flesh out societies lens, it should be like the de facto
control map basically; add a worldview lens (can be multiple Wikipedia articles stacked, i.e. deist
skepticism, Catholic western intellectual tradition); add an ideology lens (the political governing
style, not necessarily per polity, but usually is)").

All three answer a question about each polity shape in the year on the slider:

| Lens | Question | Where it shows |
|---|---|---|
| **Ideologies** | How was it governed? (sacral kingship, feudal monarchy, Islamic sultanate, absolute or constitutional monarchy, liberal democracy, hybrid regime, one-party dictatorship, communist state, fascist or corporatist dictatorship, military rule, colonial administration...) | Its own lens |
| **Worldviews** | What did its rulers and most of its people take the world to be? Several Wikipedia articles can be stacked for one class (for example *Enlightenment deism and skepticism* = Deism + Age of Enlightenment + Skepticism; *Latin Christendom* = Catholic Church + Christendom + Scholasticism + Thomism) | Its own lens |
| **De facto control** | Who actually ran the place: a bloc (Soviet bloc, US-led alliance, Axis), an empire (British, French, Spanish, Portuguese, Dutch, Ottoman with vassals, Roman with client kingdoms, Mongol with the Rus' principalities, Napoleonic client states), a dynastic realm, or nobody else (self-governing) | Fill under the **Societies** networks |

## How it works
- **Rules, not a dataset.** `src/thematic.ts` holds the catalogues (`IDEOLOGIES`, `WORLDVIEWS`,
  `BLOCS`, each with a colour, a one-line blurb and the Wikipedia titles to stack) and three functions
  `ideologyOf`, `worldviewOf`, `controlOf`. Each takes a polity record (name, years, label point,
  realm) and a year, and returns the class plus a plain-words reason ("why"). Order of rules:
  1. **Named regimes** (`IDEOLOGY_NAMES`, `WORLDVIEW_NAMES`, `CONTROL_NAMES`): exact polity names
     with year ranges. **First match wins**, so put narrow rules above broad lists.
  2. **Name patterns**: colonies, khanates, sultanates, shogunates, city-states, Mesoamerican and
     Andean states, chiefdoms.
  3. **Region and era defaults**: rough boxes (`R` in the file) on the polity's label point.
  4. Otherwise **Not classified yet** (grey), never a guess dressed as a fact.
- **Drawing.** The polity vector tiles are reused. The `polities` source has `promoteId: 'k'`, and
  `applyThemes()` in `src/main.ts` writes each active polity's colour and opacity into feature state
  (`ideo`, `world`, `ctrl`) whenever the year or lens changes. No tiles or data files are rebuilt.
- **Panel.** Clicking a shape (or a polity name label) opens the class: name, polity and year, the
  reason, the stacked Wikipedia summaries (loaded live), a button back to the polity, and the other
  polities in the same class that year. On Societies, a click that hits no network opens the control
  class of the polity underneath.
- **Legend.** Classes present this year with counts. Societies shows "De facto control" above its
  network filters; self-governing polities keep a faint wash of their own colour.

## Checking a change
Run the audit over every polity (counts per class for sample years and the list of anything
unclassified). Node 24 runs the TypeScript directly:
```
node data/audit-thematic.mjs <repo path>
```
The script imports `src/thematic.ts`, reads `public/data/polities-props.json`, and prints, for
-2000, -500, 150, 800, 1200, 1500, 1800, 1942, 1975 and 2020, the class counts and unclassified names.
(On the owner's PC there is no Node install; GitHub Desktop's Electron runs as Node with
`ELECTRON_RUN_AS_NODE=1 "%LOCALAPPDATA%\GitHubDesktop\app-3.6.10\GitHubDesktop.exe" script.mjs`. The
same trick runs `vite build` and `vite` for a local preview.)

As of 13 November 2026 only four uninhabited or near-empty islands are unclassified (Worldviews).

## Known limits (honest)
- Classes come from names, regions and eras, so they are coarse: a whole empire gets one class even
  where its provinces differed (Mughal India is "Sunni Islam" though most subjects were Hindu; the
  reason says so). Modern regime ratings follow the broad consensus of democracy indices, not one
  index's scores.
- Region boxes overlap. Muslim dynasties are checked before European boxes because the Europe box
  reaches the Maghreb.
- Control covers named blocs and realms. Many tributary, client and occupation relationships are not
  in yet (Chinese tributary states, Japanese-occupied Asia 1937-45, Soviet-occupied Baltic states
  1940, Mughal and Maratha vassals).
- Edited polities in Edit mode are not recoloured by these lenses.

## Next
- More named regimes for 1800-1945 and more control relationships (see limits).
- Let classes vary inside a polity (provinces or civilization footprints) where one label is wrong.
- A legend filter by class, like the Societies network filter.
