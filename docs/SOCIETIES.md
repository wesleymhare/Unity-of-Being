# Societies (the lens)

A **Society** is a de facto network of organisation: a group held together by a working system
of exchange, communication, authority and supply, whatever the legal map says. The idea follows
Marxist and world-society theory: a society is not only a state. It can be a state or
confederacy, a church, an ethnic or religious community, a company, a party or bloc, an
international organisation, a trade or logistics system, an alliance. What matters is that it
**controls something on the ground**.

It is not a people held together by language and way of life (that is a
[Civilization](CIVILIZATIONS.md)), and not the legal borders of a state (that is a Polity).
Where a Polity says who claims the land, a Society says who actually moves things across it.

## What counts
**Big and real.** A network qualifies when it held ground or throughput at the scale of a
continent or a major region: territory it governed or policed in practice, ports and roads it
ran, a supply chain, a command structure, tens of thousands of members or more. Niche or purely
local networks (one family firm, one pilgrimage town, a single movement) are left out for now.

| Kind | Examples |
|---|---|
| Trade network | Silk Road, Indian Ocean trade, Trans-Saharan trade, Hanseatic League, Atlantic slave trade |
| Company or maritime system | VOC, British East India Company, Hudson's Bay, Spanish treasure fleets, container shipping |
| Communications and logistics | Royal Road, Roman roads, Mongol yam, Qhapaq Ñan, Grand Canal, Trans-Siberian, telegraph cables |
| State or confederacy | Steppe nomadic confederations, Aztec Triple Alliance, Haudenosaunee, Chinese tributary system |
| Faction or party | Comintern, Chinese Communist base areas |
| Community, diaspora or ethnic group | Overseas Chinese, Polynesian voyaging |
| Religious network | Latin Christendom, the Catholic Church, Orthodox Christendom, Buddhism, the Jesuits, Hajj |
| NGO or international organisation | United Nations, Red Cross and Red Crescent, NATO, Warsaw Pact, European Union |

Kinds are descriptive, not exclusive: one network can be several things (the Church is a faith, a
landowner, a school system). The legend lets you switch kinds on and off.

## How it is drawn
- **Areas** are zones of de facto control or presence, dashed outline and light fill. They come
  from three sources: the shape of a historic polity (the largest Cliopatria record inside the
  years), a union of modern countries, or a hand-drawn polygon.
- **Routes** are lines between hubs: solid on land, dashed at sea. Schematic, not surveyed.
- **Hubs** are dots with names; larger dots are the main hubs.
- Any element can have its own years inside the network's years (for example the Mongol zone
  becomes the Yuan zone, or the Long March route lasts two years).

Clicking a hub, route or area opens the network; the panel lists its main hubs and, where several
networks overlap, the others as "Networks here" chips.

## Data
`data/societies_data.py` and `data/societies_more.py` (curated; add with `net(...)`, give areas
with `Z(poly=...)`, `Z(countries=[...])` or `Z([(lng, lat), ...])`, or add to an existing network with
`add_zone(name, ...)`) → `python3 data/build-societies.py` (or `npm run data:societies`) →
`public/data/societies.geojson` (elements plus `entities` and `labels` arrays). The builder reads
`public/data/polities.geojson` and the Natural Earth countries in `data/raw/ne/`.
Coordinates are approximate. Country-union areas use modern borders, so they are coarse for the past.
Wikipedia titles are unchecked against live Wikipedia; the panel falls back to a search.

## Later
- More big networks in the Americas, Africa and the Pacific; bigger coverage of the modern era
  (corporations, supply chains, parties, blocs).
- Edges with weights (volume) and direction, once there are open datasets (Orbis, Roman roads,
  ancient trade ledgers).
- Areas that change shape through the years (for example per-decade bloc membership).
