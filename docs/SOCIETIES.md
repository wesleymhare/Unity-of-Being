# Societies (the lens)

A **Society** is a de facto network: who actually moves goods, messages and people, or holds a
group together, whatever the legal map says. It is not a people (that is a
[Civilization](CIVILIZATIONS.md)) and not a legal state (that is a Polity).

## What counts
Dated, named networks of these kinds (colour in the legend):

| Kind | Examples |
|---|---|
| Trade network | Silk Road, Trans-Saharan trade, Hanseatic League, Incense Route |
| Company or maritime system | VOC, Spanish treasure fleets, Venetian and Genoese systems, Manila galleon |
| Communications and logistics | Royal Road, Mongol yam, Qhapaq Ñan, Pony Express |
| Faction or party | Lombard League, Guelphs and Ghibellines, Jacobin clubs, Comintern, CCP base areas |
| Community or diaspora | Sogdians, Radhanites, New Julfa Armenians, Maroon communities |
| Pilgrimage | Hajj caravans, Camino de Santiago |
| Clandestine network | Barbary corsairs, Golden Age pirates, Underground Railroad |

Rule of thumb: include it if it had real control or throughput (hubs, escorts, relays, a
membership or chain of command) that did not depend on one state's borders. Mere similarity of
culture belongs in Civilizations.

## How it is drawn
- **Routes** are lines between hubs: solid on land, dashed at sea. Schematic, not surveyed.
- **Hubs** are dots with names; larger dots are the main hubs.
- **Zones** are dashed areas of de facto presence (maroon strongholds, base areas).
- Each element can have its own years inside the network's years (e.g. the Long March route).

Clicking a hub, route or zone opens the network; the panel lists its main hubs and, where several
networks pass the same spot, the others as "Networks here" chips. Hub labels list every active
network that has that hub.

## Data
`data/societies_data.py` (curated, ~40 networks; add with `net(...)`) →
`python3 data/build-societies.py` (or `npm run data:societies`) → `public/data/societies.geojson`
(elements plus `entities` and `labels` arrays). Coordinates are approximate. Wikipedia titles are
unchecked against live Wikipedia; the panel falls back to a search.

## Later
- Edges with weights (volume) and direction, once there are open datasets (e.g. Roman roads in
  the Barrington Atlas, Orbis, ancient trade ledgers).
- Parties and factions as areas of vote or control for the modern era.
- Per-network detail layers and a legend toggle by kind.
