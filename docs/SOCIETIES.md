# Societies (the lens)

**A Society is an organised system that controls or moves things on the ground, at the scale of a
continent, a major region or the whole world.** It answers "who actually runs the flows and holds
the ground here?", whatever the legal map says.

Status: definition agreed with Wes on 4 November 2026. The data below is being brought into line
(see "Existing entries").

## The test
Something is a Society only if it passes all three:

1. **It controls or moves something real.** People, goods, money, information or force: it
   governs or polices ground in practice, runs routes, ports or relays, supplies or commands
   people, or keeps a working chain of custody.
2. **At scale.** A continent, a major region, or a global system. One family firm, one market
   town, one pilgrimage site or a single local movement does not count (yet).
3. **It can be drawn.** You can point to hubs, routes or an area of control, with years. If it
   cannot be placed on a map, it is not a Society.

## What is not a Society, and where it goes
| It is... | It goes in | Notes |
|---|---|---|
| A legal state or empire and its borders | **Polities** | Who claims the land |
| A people: language, ancestry, culture, **ethnic communities and diasporas** | **Civilizations** | Who you belong to |
| A faith, philosophy or way of seeing the world | **Worldviews** (planned tab) | What people believe |
| How a polity is structured (monarchy, republic, one-party state, theocracy...) | **Ideologies** (planned tab) | How polities are organised |
| Climate and ecoregions | **Biomes** | |

Edge cases, decided:
- **A church** splits in two. The *belief* is a Worldview. The *organisation* is a Society only if
  it passes the test as a system (landholdings, schools, supply, a command chain), and then it is
  listed for what it runs, not for what it believes.
- **An armed faction holding ground** (the Chinese Communist base areas) is a Society for the
  ground and supply it controlled. Its ideology goes in Ideologies.
- **An alliance or bloc** (NATO, the Warsaw Pact) is a Society: it moves force, money and
  materiel across a region.
- **A diaspora** with a working trade network (the Overseas Chinese) is a **Civilization**. If the
  network is a company or a shipping system, the company is the Society.

## Kinds (descriptive, not exclusive)
Kind is stored and shown as "Type" in the panel; colour comes from the sphere (below).

| Kind | Examples |
|---|---|
| Trade network | Silk Road, Indian Ocean trade, Trans-Saharan trade, Hanseatic League, transatlantic slave trade |
| Company or maritime system | VOC, British East India Company, Hudson's Bay, Spanish treasure fleets |
| **Corporation or supply chain** (modern) | Major shipping lines, oil majors, tech platforms, global manufacturing chains |
| Communications and logistics | Royal Road, Roman roads, Mongol yam, Qhapaq Ñan, Grand Canal, Trans-Siberian, telegraph and undersea cables, container shipping |
| State-like confederacy | Steppe nomadic confederations, Aztec Triple Alliance, Haudenosaunee, Chinese tributary system |
| Alliance or bloc | NATO, Warsaw Pact, European Union, OPEC-style cartels |
| International organisation or NGO | United Nations, Red Cross and Red Crescent |
| Armed faction holding ground | Chinese Communist base areas |
| **Criminal or clandestine network** | Large trafficking and smuggling networks, documented cartels |

## The modern era
Societies go all the way to the present, including **big corporations and criminal networks**,
under extra rules because the evidence is thinner and the stakes are higher:
- **Corporations:** include a company only if it runs a system (ports, fleets, platforms, a
  global supply chain) at the scale above. Show the system, not the brand. Years and hubs from
  filings, annual reports or standard references.
- **Criminal networks:** include a network only if it is documented by court judgments, UN or
  government reports, or major investigative reporting. Name the organisation, never a living
  person. Hubs and routes are approximate and described as reported; label uncertainty plainly.
  When in doubt, leave it out.

## Spheres: colour by lineage through time
Colour is the **sphere of influence**, not the kind. A sphere is a lineage or bloc that its
own members would recognise: Latin Christendom, Orthodox Christendom, the Chinese sphere, the
Western bloc.

Spheres have a **history**. They can split, merge and be renamed, and the colours follow:
- A sphere has an id, a name, dates and optional **parents** and **children** (for example early
  Christendom splits into the Latin and Orthodox spheres, and the Latin sphere later divides again).
- The hue family stays with the root lineage; a child keeps the parent's hue and shifts its
  lightness a little, so related spheres read as relatives and unrelated ones stay distinct. A
  merger takes the dominant parent's hue.
- A network belongs to the sphere that applies **in each year**. If a sphere splits while the
  network exists, the network follows the child that carried it on, or is shown under the parent
  until the split.
- The legend lists the spheres present in the year shown; the panel will show the lineage of the
  network's sphere ("This sphere through time"), and later a family-tree view.

Today there are 18 flat spheres in `data/societies_groups.py`. Turning them into lineages is the
next data change (see "Next").

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

## Colour and symbols
**Colour is the sphere of influence or group, not the kind of network.** Latin Christendom is one
colour and Orthodox Christendom another; the Chinese tributary system, the Grand Canal and the
Overseas Chinese share a colour; the Hanseatic League and the Varangian routes share one. Kind
(trade network, company, church...) is still stored and shown as the "Type" fact in the panel. The
legend lists the spheres present in the year shown and filters them on click. Spheres live in
`data/societies_groups.py` (`GROUPS`, `GROUP_OF`); a network with no sphere stops the build.

Symbols on the map:
- **Line**: a logistical network (a route, solid on land, dashed at sea).
- **Dot**: a hub (a city, port, post or base); larger dots are the main hubs.
- **Crossed swords**: a frontier or conflict zone.
- **Handshake**: a trade or syncretism zone, a place where peoples, faiths or goods met and blended.
- **Dashed area**: a zone of de facto control or presence.

Marks (swords and handshakes) are listed in `MARKS` in `data/societies_groups.py`, each with its
network, place, position and years.

## Data
`data/societies_data.py`, `data/societies_more.py` and `data/societies_groups.py` (curated; add with `net(...)`, give areas
with `Z(poly=...)`, `Z(countries=[...])` or `Z([(lng, lat), ...])`, or add to an existing network with
`add_zone(name, ...)`) → `python3 data/build-societies.py` (or `npm run data:societies`) →
`public/data/societies.geojson` (elements plus `entities` and `labels` arrays). The builder reads
`public/data/polities.geojson` and the Natural Earth countries in `data/raw/ne/`.
Coordinates are approximate. Country-union areas use modern borders, so they are coarse for the past.
Wikipedia titles are unchecked against live Wikipedia; the panel falls back to a search.

## Existing entries under this definition
54 networks exist today. Decisions:

- **Stay (most of them):** trade, company, logistics, confederacy, alliance, international
  organisation and the Chinese Communist base areas.
- **Move out once their homes exist** (they stay on the map until then so nothing is lost):
  - To **Worldviews**: Spread of Buddhism, Early Christian communities, Church of the East, Society of
    Jesus missions, Latin Christendom (the medieval Church), Catholic Church worldwide, Orthodox
    Christendom. Where the organisation itself passes the test it may come back as a Society framed
    for what it runs.
  - To **Civilizations**: Overseas Chinese networks, Lapita and Polynesian voyaging.
- **Review:** Hajj caravans (keep as a logistics system, the pilgrimage itself is a Worldview),
  Communist International (an organisation moving money and people; its ideology is an Ideology),
  Haudenosaunee Confederacy (a confederacy, close to a Polity).

## Next
1. Turn the 18 spheres into **lineages** with split and merge dates and the colour rule above.
2. Add the new kinds: corporations and supply chains, criminal networks, with the modern-era rules.
3. Move the listed entries when Worldviews and Civilizations can take them.
4. More big networks in the Americas, Africa and the Pacific.
5. Edges with weights (volume) and direction, once open datasets exist (Orbis, Roman roads,
   ancient trade ledgers); areas that change shape through the years (per-decade bloc membership).

## Open questions
- Numbers for "at scale" (for example a minimum number of countries or a minimum throughput) so the
  test can be applied the same way every time.
- Whether an organised church should be listed as its own Society in addition to its Worldview.
- How Ideologies and Worldviews will be defined; their docs should say where they meet Societies.
