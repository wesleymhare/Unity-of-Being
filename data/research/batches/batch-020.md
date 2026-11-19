# Batch 020 of 047: polities that lasted 100+ years

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
| 1 | Q1048918 | Kingdom of the Suebi (Wikipedia: Kingdom of the Suebi) | 414 CE to 586 CE | 41.4, -7.8 | 440, 500, 560 |
| 2 | Q1150344 | Sultanate of Johor (Wikipedia: Johor Sultanate) | 1529 CE to 1884 CE | 0.5, 101.7 | 1580, 1705, 1830 |
| 3 | Q192319 | Hyksos (Wikipedia: Hyksos) | 1800 BCE to 1401 BCE | 30.5, 33.9 | -1740, -1600, -1460 |
| 4 | Q39 | Swiss Confederation (Wikipedia: Switzerland) | 1294 CE to 2026 CE | 47.0, 8.5 | 1405, 1660, 1915 |
| 5 | Q123027565 | Kashmiri Sultanate (Wikipedia: Kashmir Sultanate) | 1344 CE to 1587 CE | 33.8, 77.2 | 1380, 1465, 1550 |
| 6 | Q42211 | Vandals (Wikipedia: Vandals) | 337 CE to 438 CE | 45.6, 19.3 | 360, 415 |
| 7 | Q204023 | Warring States Japan (Wikipedia: Sengoku period) | 1468 CE to 1601 CE | 36.7, 139.4 | 1500, 1570 |
| 8 | Q42193 | Goths (Wikipedia: Goths) | 30 CE to 206 CE | 57.6, 15.3 | 55, 120, 180 |
| 9 | Q250515 | Eastern Ganga Kingdom (Wikipedia: Eastern Ganga dynasty) | 1056 CE to 1351 CE | 19.8, 83.6 | 1100, 1205, 1305 |
| 10 | Q32579 | Phrygia (Wikipedia: Phrygia) | 900 BCE to 676 BCE | 39.5, 32.5 | -865, -790, -710 |
| 11 | Q1483430 | Principality of Kiev (Wikipedia: Principality of Kiev) | 1056 CE to 1240 CE | 51.4, 28.2 | 1085, 1150, 1210 |
| 12 | Q1000124 | Ganzhou Kingdom (Wikipedia: Ganzhou Uyghur Kingdom) | 860 CE to 1039 CE | 39.6, 100.0 | 885, 950, 1010 |
| 13 | Q170604 | New France (Wikipedia: New France) | 1609 CE to 1790 CE | 47.0, -71.5 | 1635, 1700, 1765 |
| 14 | Q1068371 | Chauhan Dynasty (Wikipedia: Chauhan Dynasty) | 980 CE to 1201 CE | 28.4, 74.6 | 1015, 1090, 1170 |
| 15 | Q736839 | Kamakura Shogunate (Wikipedia: Kamakura shogunate) | 1188 CE to 1332 CE | 36.7, 139.4 | 1225, 1295 |

Reply now with only the JSON array.
