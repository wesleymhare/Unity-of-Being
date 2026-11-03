# Polities: where the borders come from

## 3400 BCE to 2015 CE: Cliopatria
Borders and dates come from Cliopatria (Seshat Global History Databank, CC BY 4.0), cleaned by
`data/clean-polities.py` (group shapes such as "(British Empire)" are label-only realms, not a
second layer of fill). See the notes at the top of that script. These are one scholarly reading of
the evidence and are often disputed. Records are cut off at the end of 2015.

## 2016 to 2026: the current de jure map
Cliopatria's last years mix in de facto entities (rebel and occupied zones, "Gaza/Hamas",
"Mujahideen", "Russian-occupied territories", a Turkish Republic of Northern Cyprus). From 2016
the map is instead the internationally recognised ("de jure") world, built by
`data/build-modern-polities.py` from Natural Earth 1:50m countries (public domain).

Treatments, all deliberate:

| Case | Shown as |
|---|---|
| Crimea, Donetsk, Luhansk | Ukraine |
| Abkhazia, South Ossetia | Georgia |
| Transnistria | Moldova |
| Golan Heights | Syria |
| Syrian rebel, Kurdish and other zones | Syria (one state, no zones) |
| West Bank (with East Jerusalem) and Gaza | Palestine |
| Western Sahara | its own territory (Natural Earth gives most of it to Morocco; the south is restored) |
| Northern Cyprus | Cyprus |
| Somaliland | Somalia |
| Kosovo | its own state (recognised by about half of UN members) |
| Taiwan | its own state (recognised by few) |
| Dependencies (Greenland, Puerto Rico, Hong Kong, Falklands...) | part of the realm of their state, same colour, thin borders |
| Names | follow the year: Czechia from 2016, Eswatini from 2018 (Swaziland before), North Macedonia from 2019 (Macedonia before), Türkiye from 2022 |

Limits. Natural Earth is not survey grade. Crimea, the Golan and Western Sahara are cut from
Natural Earth shapes with small boxes, so those lines are approximate. Kashmir, Arunachal Pradesh,
Aksai Chin, Hala'ib and other disputed lines follow Natural Earth; there is no single "standard"
for them. Contested recognition (Kosovo, Taiwan, Palestine, Western Sahara) is shown, not settled.
Changes of government (for example Syria in December 2024) do not change this map, which is about
borders.

## Water
The Caspian Sea, and the larger pre-1960 Aral Sea, Lake Chad, Lake Texcoco (until the 1520s) and
Lop Nur (until 1972), come from Natural Earth (public domain) via `data/build-water-extra.py`. The
base land layer fills in the Caspian, so it is cut out of the land as well.
