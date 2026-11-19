# Batch 040 of 047: polities that lasted 100+ years

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
| 1 | Q459188 | Kingdom of the Isles (Wikipedia: Kingdom of the Isles) | 1085 CE to 1271 CE | 57.4, -6.4 | 1115, 1180, 1245 |
| 2 | Q2297073 | Giudicato of Cagliari (Wikipedia: Judicate of Cagliari) | 866 CE to 1187 CE | 39.5, 9.4 | 915, 1025, 1140 |
| 3 | Q1147897 | Wey (Wikipedia: Wey (state)) | 750 BCE to 248 BCE | 36.3, 115.2 | -675, -500, -325 |
| 4 | Q1761381 | Giudicato of Logudoro (Wikipedia: Judicate of Logudoro) | 866 CE to 1259 CE | 40.6, 8.8 | 925, 1060, 1200 |
| 5 | Q373988 | Beylik of Teke (Wikipedia: Beylik of Teke) | 1326 CE to 1428 CE | 36.9, 29.8 | 1350, 1400 |
| 6 | Q2288 | Tver (Wikipedia: Tver) | 1294 CE to 1486 CE | 57.2, 36.6 | 1325, 1390, 1455 |
| 7 | Q5519387 | Galuh Kingdom (Wikipedia: Galuh Kingdom) | 896 CE to 1027 CE | -7.2, 108.2 | 930, 995 |
| 8 | Q203751 | Upper Egypt (Wikipedia: Old Kingdom of Egypt) | 2200 BCE to 2001 BCE | 26.2, 32.1 | -2170, -2100, -2030 |
| 9 | Q1841483 | Dutch Ceylon (Wikipedia: Dutch Ceylon) | 1687 CE to 1795 CE | 6.9, 81.3 | 1715, 1770 |
| 10 | Q2261321 | Ramadanid Emirate (Wikipedia: Ramadanid Emirate) | 1385 CE to 1515 CE | 37.3, 35.5 | 1420, 1480 |
| 11 | Q1209822 | Kingdom of Kakheti (Wikipedia: Kingdom of Kakheti) | 1468 CE to 1578 CE | 41.5, 46.1 | 1495, 1550 |
| 12 | Q7703611 | Duchy of Aquitaine (Wikipedia: Duchy of Aquitaine) | 1206 CE to 1439 CE | 45.2, 1.6 | 1240, 1320, 1405 |
| 13 | Q172613 | Teotihuacan (Wikipedia: Teotihuacan) | 50 BCE to 704 CE | 19.3, -98.5 | 65, 325, 590 |
| 14 | Q229 | Cyprus Condominium (Wikipedia: Cyprus) | 692 CE to 959 CE | 35.0, 33.3 | 730, 825, 920 |
| 15 | Q2580032 | Taifa of Almería (Wikipedia: Taifa of Almería) | 1015 CE to 1151 CE | 37.5, -2.4 | 1050, 1093 |

Reply now with only the JSON array.
