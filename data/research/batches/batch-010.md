# Batch 010 of 047: polities that lasted 100+ years

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
| 1 | Q65968 | House of Habsburg (Wikipedia: House of Habsburg) | 1260 CE to 1515 CE | 47.1, 8.0 | 1300, 1390, 1475 |
| 2 | Q47690 | Babylonia (Wikipedia: Babylonia) | 1800 BCE to 801 BCE | 32.4, 44.7 | -1650, -1300, -950 |
| 3 | Q419 | Republic of Peru (Wikipedia: Peru) | 1822 CE to 2026 CE | -11.0, -73.2 | 1855, 1925, 1995 |
| 4 | Q28573 | Inca Empire (Wikipedia: Inca Empire) | 1440 CE to 1571 CE | -13.7, -72.4 | 1475, 1540 |
| 5 | Q856691 | Rashtrakuta Dynasty (Wikipedia: Rashtrakuta dynasty) | 755 CE to 989 CE | 19.5, 76.7 | 790, 870, 955 |
| 6 | Q148837 | Greek City-States (Wikipedia: Polis) | 800 BCE to 77 CE | 38.1, 22.3 | -670, -360, -55 |
| 7 | Q34 | Kingdom of Sweden (Wikipedia: Sweden) | 1905 CE to 2026 CE | 65.9, 18.7 | 1935, 1995 |
| 8 | Q1139762 | Empire of Kanem (Wikipedia: Kanem-Bornu Empire) | 1072 CE to 1894 CE | 11.9, 16.0 | 1195, 1485, 1770 |
| 9 | Q239502 | Halych-Volhynia occupation (Wikipedia: Kingdom of Galicia-Volhynia) | 1056 CE to 1351 CE | 47.8, 34.2 | 1100, 1205, 1305 |
| 10 | Q203817 | First Bulgarian Empire (Wikipedia: First Bulgarian Empire) | 682 CE to 1017 CE | 44.0, 26.9 | 730, 850, 965 |
| 11 | Q199688 | Almohad Caliphate (Wikipedia: Almohad Caliphate) | 1139 CE to 1343 CE | 29.4, -8.6 | 1170, 1240, 1310 |
| 12 | Q10957559 | Principality of Moldavia (Wikipedia: Moldavia) | 1363 CE to 1858 CE | 46.8, 27.8 | 1435, 1610, 1785 |
| 13 | Q875305 | Northern Wei (Wikipedia: Northern Wei) | 387 CE to 533 CE | 41.2, 114.6 | 425, 495 |
| 14 | Q555994 | Aq Qoyunlu (Wikipedia: Aq Qoyunlu) | 1407 CE to 1511 CE | 38.2, 40.4 | 1435, 1485 |
| 15 | Q35216 | Zhou Dynasty (Wikipedia: Zhou dynasty) | 1000 BCE to 751 BCE | 35.8, 115.8 | -965, -875, -790 |

Reply now with only the JSON array.
