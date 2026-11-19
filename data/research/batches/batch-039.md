# Batch 039 of 047: polities that lasted 100+ years

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
| 1 | Q1311219 | Jaffna kingdom (Wikipedia: Jaffna kingdom) | 1314 CE to 1594 CE | 8.6, 80.5 | 1355, 1455, 1550 |
| 2 | Q156108 | Obotrites (Wikipedia: Obotrites) | 793 CE to 946 CE | 53.7, 11.8 | 815, 870, 925 |
| 3 | Q7440601 | First Sealand Dynasty (Wikipedia: First Sealand dynasty) | 1700 BCE to 1401 BCE | 30.3, 47.0 | -1655, -1550, -1445 |
| 4 | Q287996 | Blambangan Kingdom (Wikipedia: Blambangan Kingdom) | 1519 CE to 1743 CE | -8.2, 113.8 | 1555, 1630, 1710 |
| 5 | Q846 | Qatar Dynasty (Wikipedia: Qatar) | 1820 CE to 2026 CE | 25.1, 51.2 | 1850, 1915, 1995 |
| 6 | Q606377 | Itza Mayans (Wikipedia: Itza people) | 1547 CE to 1699 CE | 17.2, -90.0 | 1570, 1625, 1675 |
| 7 | Q622032 | Paphlagonia (Wikipedia: Paphlagonia) | 279 BCE to 127 BCE | 41.0, 33.7 | -255, -205, -150 |
| 8 | Q2077648 | Sultanate of Cirebon (Wikipedia: Sultanate of Cirebon) | 1482 CE to 1676 CE | -6.9, 108.3 | 1510, 1580, 1645 |
| 9 | Q135364 | Olmec Civilization (Wikipedia: Olmecs) | 650 BCE to 351 BCE | 18.0, -94.2 | -605, -500, -395 |
| 10 | Q213638 | Kingdom of Cyprus (Wikipedia: Kingdom of Cyprus) | 1192 CE to 1491 CE | 35.0, 33.3 | 1235, 1340, 1445 |
| 11 | Q605051 | County of Touraine (Wikipedia: Touraine) | 1206 CE to 1491 CE | 46.0, 1.7 | 1250, 1363, 1450 |
| 12 | Q136884 | Kingdom of Lazica (Wikipedia: Lazica) | 638 CE to 777 CE | 42.5, 42.2 | 675, 740 |
| 13 | Q197598 | Zheng (Wikipedia: Zheng (state)) | 750 BCE to 367 BCE | 35.1, 113.8 | -695, -560, -425 |
| 14 | Q15487 | County of Berga (Wikipedia: Berga) | 898 CE to 1235 CE | 42.3, 1.9 | 950, 1065, 1185 |
| 15 | Q5519387 | Galuh Kingdom (Wikipedia: Galuh Kingdom) | 674 CE to 824 CE | -7.2, 108.1 | 695, 750, 800 |

Reply now with only the JSON array.
