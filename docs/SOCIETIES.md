# Societies (the lens)

**A Society is an affinity group that holds de facto control, organised as a logistical network.**

It answers "how is the world actually run?", not only by states and not only by peoples, but by the
groups that hold things together and move them: dynasties, trade routes and merchant houses,
banks and companies, alliances and blocs, orders, NGOs and international organisations, and the
roads, ports and cables they run. A state can be a Society, but only when it works as a network of
control, and it is one kind among many.

Status: **settled for now** (8 November 2026), **extended the same day to cover factions and movements**
(see "Factions and movements" below). The definition, the test, the spheres and the checks below
are in place and enforced when the data is built. What is deliberately left for later is listed under
"Next".

## Where the idea comes from
Three bodies of thought, used as lenses and not as doctrine:
- **World-society theory** (for example John Burton's "cobweb" of transnational relations, and
  the "world society" work of John Meyer and colleagues): the world is a web of overlapping groups
  and organisations, and states are only some of the nodes.
- **Marxist group analysis**, and **world-systems theory** (Wallerstein) which grew out of it: a group
  is defined by its place in production, exchange and coercion, by what it controls, not by its legal
  label. Commodity chains and trade networks are the world-systems view of a society.
- **Michael Mann's "sources of social power"**: societies are overlapping networks of ideological,
  economic, military and political power. This is the most practical way to say *what* a group
  controls (see "Power type" below).

## The test
Something is a Society only if it passes all four:

1. **Affinity.** Its members or nodes are bound by something that makes them act as a group:
   kinship or a dynasty, a trade, a command chain, a shared interest, membership of an order,
   church or league, a charter or treaty. Not just a similarity from outside.
2. **Control.** It holds working control over part of how things run: ground, routes, credit,
   information, force, supply, or legitimacy. Control is judged by what it does on the ground, not
   by what the law says.
3. **Network.** It is made of nodes (hubs) and links (routes, kin ties, credit lines, command
   chains), so it can be drawn as dots, lines and areas, with years.
4. **Scale.** A *network* spans a continent, a major region or the world: its farthest points are
   **at least 1,000 km apart**, with at least two hubs and a route or an area. Anything smaller can still
   be a **faction** (next section) if it passes tests 1 to 3. A single family firm or one market town
   is still too small.

`python3 data/build-societies.py` checks this for every entry and stops with a list if one fails. It tags
each one `network` or `faction` by size, and checks that each has a sphere, a power type, a note saying
what it controls, a Wikipedia title, years in order (a single year is allowed) and a unique name. A
faction needs at least one hub or an area.

## Factions and movements
Much of how the world is run was never in a state's borders: sects and schismatic churches, rebel and
breakaway movements, communes and leagues, warlords, pirates, mafias and cartels, and parties that
governed places the law did not give them. They hold ground, routes or markets de facto, so they pass
the same affinity, control and network tests. They are **not required to span 1,000 km**: a faction
needs one hub or an area, years, and a note on what it controlled. In the app the panel says
"Scale: Faction or local movement" and its label appears when you zoom in.

Examples now mapped (`data/societies_factions.py`): Cathars, Waldensians, Hussites, Lollards, Anabaptists,
Bogomils, Old Believers, Donatists, the Western Schism, Huguenots, Lingayats, the Sikh misls, the Nizari
Ismailis, Qarmatians, the Zanj, Red Turbans, the White Lotus, Boxers, the Zapatistas, the Paris Commune,
the Lombard League, the German Peasants' War, the Vendée, the Sanfedisti, Makhnovshchina, the Spanish
collectives, the Carbonari, the Maroons, the Underground Railroad, Wokou raiders, Barbary corsairs,
Caribbean pirates, Cossack hosts, the Sicilian Mafia, the Medellín, Cali and Sinaloa cartels, Chinese
warlords, Afghan mujahideen, Somali militias, the Khmer Rouge, the Ho Chi Minh Trail, FARC, the Tamil
Tigers, the Muslim Brotherhood, the Ba'ath Party, Hezbollah, Hamas, and the Libyan rebels and militias.

Three new spheres colour them: **Dissenting and schismatic movements** (a child of Christendom),
**Insurgents, rebels and breakaway movements**, and **Warlords, cartels and the underworld**.

Rules for the modern entries, stricter than for old ones: name the organisation, never a living person;
include only what court judgments, UN or government bodies or major reporting document; use hedged
wording where control is contested; end a group in 2026 only if the sources show it still exists.
Entries whose recent state is uncertain (for example Hamas and Hezbollah since 2023) say so in their note.

## What can be a Society (there is no closed list)
| Form | Examples |
|---|---|
| State as a network of control (not its borders) | Roman roads and post, the Chinese tributary system, the Mongol relay system, the Inca road system |
| Dynasty or house | Habsburg dynastic network (marriage, courts, the Spanish Road) |
| Trade route or merchant system | Silk Road, Indian Ocean trade, Trans-Saharan trade, Hanseatic League |
| Banking house | Medici banking network |
| Company or corporation | VOC, British East India Company, Hudson's Bay; in the modern era, big shipping, energy and platform firms |
| Confederacy, alliance or bloc | Steppe confederations, Aztec Triple Alliance, NATO, Warsaw Pact, European Union |
| Order, church or league (as an organisation) | Knights Templar, Latin Christendom as an institution, the Jesuits |
| NGO or international organisation | United Nations, Red Cross and Red Crescent |
| Armed faction holding ground | Chinese Communist base areas |
| Infrastructure system | Telegraph and undersea cables, container shipping, Trans-Siberian Railway |
| Clandestine or criminal network | Only if documented (see "The modern era") |

## What is not a Society, and where it goes
The same group can show up in more than one lens, for different reasons.
| It is... | Lens | Notes |
|---|---|---|
| Legal borders of a state or empire | **Polities** | Who claims the land |
| A people: language, ancestry, culture, ethnic communities and diasporas *as identities* | **Civilizations** | Who you belong to. A diaspora's *trade network* is a Society. |
| A belief or philosophy | **Worldviews** (planned tab) | What people believe. The church *organisation* (property, schools, a command chain) is a Society. |
| How a polity is structured (monarchy, republic, one-party state...) | **Ideologies** (planned tab) | How polities are organised |
| Climate and ecoregions | **Biomes** | |

This revises an earlier plan to move the church and diaspora entries out of Societies. An
organisation or network that passes the test stays; the belief or identity it carries goes to the
other lens.

## Power type
Each network is tagged with the kinds of power it wields, after Mann: **I**deological (meaning,
legitimacy), **E**conomic (production, exchange, credit), **M**ilitary (force), **P**olitical
(territorial rule). Most have more than one: the Hanseatic League is E and M, a dynasty E and P, the
Templars I, E and M. The tag is in `POWER_OF` in `data/societies_groups.py` and shows as "Power" in
the panel. A legend filter by power is not built yet.

## The modern era
Societies run to the present, including **big corporations and criminal networks**, under stricter
rules because the evidence is thinner and the stakes higher:
- **Corporations:** include one only if it runs a system (ports, fleets, platforms, a global supply
  chain) at the scale above. Show the system, not the brand, with years and hubs from filings,
  annual reports or standard references.
- **Criminal networks:** include one only if it is documented by court judgments, UN or government
  reports, or major investigative reporting. Name the organisation, never a living person. Describe
  hubs and routes as reported and label the uncertainty. When in doubt, leave it out.

## Spheres: colour by lineage
Colour is the **sphere of influence** (the affinity group), not the kind of network. A sphere is a
lineage or bloc that its own members would recognise: Latin Christendom, Orthodox Christendom, the
Chinese sphere, the Western bloc.

Spheres descend from one another, and that is recorded (`SPHERE_DEFS` in `data/societies_groups.py`):
- Christendom (before the schisms) gives Latin Christendom and Orthodox and Eastern Christendom.
- Latin Christendom gives the Italian maritime republics, Northern and Baltic trade, the dynastic and
  banking houses, the Iberian empires and the Northwest European chartered companies.
- The chartered companies give the Western bloc, which gives the global institutions; the Iberian
  empires give the Atlantic slave system.
- Orthodox Christendom gives the Russian empire, which gives the Communist movement.
- Other spheres (Steppe and Inner Asia, Maritime Asia, the Chinese sphere, the Islamic world, the Buddhist
  and Indic world, Indigenous American systems, the ancient Near East) have no parent yet.

A family shares a hue neighbourhood (Christendom: indigo, blues and lilacs), with lightness and hue
spaced so relatives read as relatives but can still be told apart. Colours are chosen by hand; the
panel shows a network's lineage ("Christendom → Latin Christendom → Italian maritime republics").

What is not built: a network keeps **one** sphere for its whole life (it does not change sphere
when its sphere splits), and there is no family-tree view. The lineages are interpretive (for
example, the Western bloc as a descendant of the chartered companies) and are open to argument.

## Adding a Society: checklist
1. Passes the four-part test (write one sentence: *who* the group is and *what it controls*).
2. At least three hubs or a route or an area of control, with years.
3. A sphere (`GROUP_OF`) and a power type (`POWER_OF`), both in `data/societies_groups.py`; a kind
   (`KINDS` in `data/societies_data.py`); a note saying what it controls; a Wikipedia title.
4. Nothing living-person-specific; modern criminal networks follow the rules above.

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
57 networks exist. All of them pass the test as organisations or systems, so none is removed now.
- **Added with this revision** (to show the broader definition): Habsburg dynastic network (1477 to
  1700), Medici banking network, Knights Templar.
- **Kept, with the identity or belief belonging elsewhere:** Overseas Chinese networks (the trade and
  credit network is a Society; the community is a Civilization), Lapita and Polynesian voyaging, the
  church and mission entries (Latin Christendom, Catholic Church, Orthodox Christendom, Church of the
  East, Jesuits, Early Christian communities, Spread of Buddhism: the organisation is a Society, the
  belief is a Worldview), Hajj caravans (the caravan system), Communist International (an organisation;
  its ideology is an Ideology).
- **Worth a second look:** Haudenosaunee Confederacy and Aztec Triple Alliance (close to Polities).

## Next (deliberately left for later)
1. A legend filter by power type, and a family-tree view of the spheres.
2. A network changing sphere over its life (per-year sphere assignment).
3. Modern corporations and documented criminal networks, under the rules above (none added yet).
4. More dynasties, banking houses, guilds, leagues and orders; more of the Americas, Africa and the Pacific.
5. Edges with weight (volume) and direction, once open datasets exist; areas that change shape by year.

## Open questions
- How Ideologies and Worldviews will be defined; their docs should say where they meet Societies.
