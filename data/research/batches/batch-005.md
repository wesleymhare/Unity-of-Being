# Batch 005 of 047: polities that lasted 100+ years

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
| 1 | Q521263 | Tibet (Wikipedia: History of Tibet) | 1363 CE to 1793 CE | 32.4, 88.7 | 1430, 1580, 1730 |
| 2 | Q25979 | Kushan Empire (Wikipedia: Kushan Empire) | 43 CE to 346 CE | 37.3, 68.0 | 90, 195, 300 |
| 3 | Q29 | Kingdom of Spain (Wikipedia: Spain) | 1516 CE to 2026 CE | 40.0, -3.5 | 1581, 1770, 1931 |
| 4 | Q161205 | Safavid Dynasty (Wikipedia: Safavid dynasty) | 1502 CE to 1726 CE | 38.5, 46.1 | 1535, 1615, 1690 |
| 5 | Q241790 | Kingdom of Kush (Wikipedia: Kingdom of Kush) | 1000 BCE to 346 CE | 17.7, 33.1 | -800, -325, 145 |
| 6 | Q83142 | Yenisei Kyrgyz (Wikipedia: Yenisei Kyrgyz) | 555 CE to 1219 CE | 55.4, 97.3 | 655, 885, 1120 |
| 7 | Q41137 | Assyria (Wikipedia: Assyria) | 1800 BCE to 901 BCE | 35.9, 42.1 | -1665, -1350, -1035 |
| 8 | Q3402317 | Tümed (Wikipedia: Tumed) | 1547 CE to 1699 CE | 47.1, 92.2 | 1570, 1625, 1675 |
| 9 | Q240123 | Indo-Scythians (Wikipedia: Indo-Scythians) | 144 BCE to 282 CE | 38.0, 63.0 | -80, 70, 220 |
| 10 | Q4958 | Liao Dynasty (Wikipedia: Liao dynasty) | 911 CE to 1125 CE | 42.6, 119.7 | 945, 1020, 1095 |
| 11 | Q207521 | Ethiopian Empire (Wikipedia: Ethiopian Empire) | 1272 CE to 1935 CE | 12.0, 38.5 | 1370, 1605, 1835 |
| 12 | Q62623 | Kalmar Union (Wikipedia: Kalmar Union) | 1402 CE to 1525 CE | 61.6, 13.7 | 1435, 1495 |
| 13 | Q28567 | Mayan City-States (Wikipedia: Maya civilization) | 247 BCE to 1546 CE | 16.0, -90.8 | 20, 650, 1275 |
| 14 | Q41761342 | White Huns (Wikipedia: White Huns) | 410 CE to 560 CE | 41.3, 74.0 | 430, 485, 540 |
| 15 | Q487829 | Chagatai Khanate (Wikipedia: Chagatai Khanate) | 1294 CE to 1462 CE | 41.0, 77.3 | 1320, 1380, 1435 |

Reply now with only the JSON array.
