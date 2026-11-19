# Batch 034 of 047: polities that lasted 100+ years

You are a careful historian filling a worldbuilding database. For each polity below and each
year listed for it, give your best estimates of the fields below. Accuracy matters more than completeness.

RULES
- Unknown means null. Never invent a figure to fill a gap. A rough, honest estimate is fine; a made-up one is not.
- Every snapshot needs `src`: a real work (author, year, title) or a Wikipedia article title. Do not write
  "general knowledge", "various" or "n/a". Every snapshot needs `conf`: "high", "medium" or "low".
- Answer for the exact year listed, for this polity only (not the whole region or later periods).

FIELDS (per polity and year)
- `population`: people in the polity (number).
- `troops`: standing or permanently embodied troops (number), `troops_note`: 2 to 6 words on what they were.
- `tech`: one or two of ["Stone", "Bronze", "Iron", "Steel", "Gunpowder", "Industrial", "Nuclear"]: the most advanced material in regular military use.
  `main_arm`: one of ["infantry", "cavalry", "archers", "chariots", "navy", "artillery", "mixed"].
- `wealth_t_gold`: wealth in TONNES OF GOLD-EQUIVALENT (number). Use annual economic output if you can estimate it
  (`wealth_basis`: "GDP"), else annual state revenue ("revenue"), else the treasury ("treasury").
  Convert with the period's own coinage and metal ratios; show it briefly in `wealth_note`
  (for example "about 20bn sesterces; 1 aureus = 100 sesterces = 7.3 g gold").
- `cities`: up to 5 largest cities, each {"name": ..., "pop": number}.
- `lingua`: language(s) of administration or lingua franca (up to 3 short strings).
  `writing`: administrative script(s) or writing system(s) (up to 3 short strings).

Allowed `wealth_basis`: ["GDP", "revenue", "treasury"].

OUTPUT: reply with ONLY one JSON array inside a single ```json code block, no other text, in this shape:
[{"qid": "Q12544", "name": "Name as given", "snapshots": [
  {"year": 150, "population": 60000000, "troops": 400000, "troops_note": "legions and auxiliaries",
   "tech": ["Iron"], "main_arm": "infantry", "wealth_t_gold": 1500, "wealth_basis": "GDP",
   "wealth_note": "about 20bn sesterces; 1 aureus = 100 sesterces = 7.3 g gold",
   "cities": [{"name": "Rome", "pop": 1000000}], "lingua": ["Latin", "Greek"], "writing": ["Latin alphabet", "Greek alphabet"],
   "src": "Scheidel and Friesen 2009; Wikipedia: Demographics of the Roman Empire", "conf": "low"}]}]
Leave a field out (or null) when you do not know it. Keep the order of the table.

## Polities

| # | Wikidata | Polity | Existed | Centre (lat, lng) | Years to answer (CE/BCE) |
|---|---|---|---|---|---|
| 1 | Q1448688 | Uyunid Emirate (Wikipedia: Uyunid dynasty) | 1072 CE to 1235 CE | 25.2, 51.2 | 1095, 1155, 1210 |
| 2 | Q155019 | Duchy of Lorraine (Wikipedia: Duchy of Lorraine) | 1431 CE to 1768 CE | 48.4, 6.3 | 1482, 1600, 1715 |
| 3 | Q2379418 | Classic Veracruz Culture (Wikipedia: Classic Veracruz culture) | 555 CE to 1235 CE | 19.9, -96.9 | 655, 895, 1135 |
| 4 | Q676745 | County of Armagnac (Wikipedia: County of Armagnac) | 1206 CE to 1496 CE | 43.7, 0.1 | 1250, 1350, 1450 |
| 5 | Q3167772 | Kingdom of Polonnaruwa (Wikipedia: Kingdom of Polonnaruwa) | 1072 CE to 1259 CE | 8.6, 80.5 | 1100, 1165, 1230 |
| 6 | Q3762571 | Kingdom of Bithynia (Wikipedia: Kingdom of Bithynia) | 333 BCE to 67 BCE | 40.9, 30.4 | -295, -200, -105 |
| 7 | Q1378584 | Byeonhan (Wikipedia: Byeonhan confederacy) | 91 BCE to 566 CE | 35.3, 128.0 | 10, 240, 465 |
| 8 | Q5032034 | Chandra Dynasty (Wikipedia: Chandra dynasty) | 900 CE to 1055 CE | 22.0, 92.5 | 925, 980, 1030 |
| 9 | Q138803 | Qarmatians (Wikipedia: Qarmatians) | 899 CE to 1071 CE | 25.2, 55.6 | 925, 985, 1045 |
| 10 | Q2096678 | Beylik of Sinop (Wikipedia: Candar dynasty) | 1305 CE to 1462 CE | 41.4, 35.8 | 1330, 1385, 1440 |
| 11 | Q770281 | Neo-Hittite states (Wikipedia: Neo-Hittite states) | 1150 BCE to 801 BCE | 36.6, 36.8 | -1100, -975, -855 |
| 12 | Q756895 | Kediri Kingdom (Wikipedia: Kediri Kingdom) | 1046 CE to 1226 CE | -7.6, 110.7 | 1075, 1135, 1200 |
| 13 | Q1658411 | Kingdom of Sarawak (Wikipedia: Raj of Sarawak) | 1842 CE to 1946 CE | 1.4, 110.5 | 1870, 1894 |
| 14 | Q309197 | Breton Kingdoms (Wikipedia: Bretons) | 587 CE to 824 CE | 48.3, -3.4 | 625, 705, 790 |
| 15 | Q921067 | Taifa of Murcia (Wikipedia: Taifa of Murcia) | 1147 CE to 1249 CE | 38.0, -1.2 | 1170, 1236 |

Reply now with only the JSON array.
