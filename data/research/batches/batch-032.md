# Batch 032 of 047: polities that lasted 100+ years

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
| 1 | Q191 | Estonia (Wikipedia: Estonia) | 1919 CE to 2026 CE | 58.7, 26.3 | 1939, 2000 |
| 2 | Q1014 | Republic of Liberia (Wikipedia: Liberia) | 1848 CE to 2026 CE | 6.9, -10.1 | 1875, 1935, 2000 |
| 3 | Q546266 | County of Champagne (Wikipedia: County of Champagne) | 990 CE to 1284 CE | 48.7, 4.2 | 1040, 1125, 1240 |
| 4 | Q148540 | Republic of Florence (Wikipedia: Republic of Florence) | 1260 CE to 1737 CE | 43.9, 11.3 | 1330, 1500, 1665 |
| 5 | Q1574107 | Zhao (Wikipedia: Zhao (state)) | 404 BCE to 226 BCE | 36.4, 112.5 | -375, -315, -255 |
| 6 | Q3627069 | Banate of Bosnia (Wikipedia: Banate of Bosnia) | 1188 CE to 1384 CE | 44.3, 18.3 | 1215, 1285, 1355 |
| 7 | Q1155101 | Korean Jin (Wikipedia: Jin (Korean state)) | 197 BCE to 92 BCE | 36.5, 128.0 | -170, -120 |
| 8 | Q3532146 | Early Cholas (Wikipedia: Early Cholas) | 291 BCE to 305 CE | 10.7, 77.4 | -200, 5, 215 |
| 9 | Q317078 | Pskov Republic (Wikipedia: Pskov Republic) | 1285 CE to 1511 CE | 57.7, 28.5 | 1320, 1400, 1475 |
| 10 | Q701273 | Jinhan (Wikipedia: Jinhan confederacy) | 91 BCE to 377 CE | 36.5, 128.8 | -20, 145, 305 |
| 11 | Q1716871 | House of Valois-Anjou (Wikipedia: House of Valois-Anjou) | 1363 CE to 1486 CE | 47.6, -0.3 | 1395, 1455 |
| 12 | Q1365493 | Republic of Pisa (Wikipedia: Republic of Pisa) | 1010 CE to 1401 CE | 43.7, 10.5 | 1070, 1205, 1340 |
| 13 | Q402580 | Mataram Kingdom (Wikipedia: Mataram Kingdom) | 741 CE to 1009 CE | -7.5, 110.9 | 780, 875, 970 |
| 14 | Q157727 | Ifat Sultanate (Wikipedia: Sultanate of Ifat) | 1285 CE to 1414 CE | 10.2, 42.1 | 1315, 1380 |
| 15 | Q638064 | Shirvan (Wikipedia: Shirvan) | 1344 CE to 1539 CE | 40.6, 48.4 | 1375, 1440, 1510 |

Reply now with only the JSON array.
