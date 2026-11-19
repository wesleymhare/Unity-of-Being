# Batch 044 of 047: polities that lasted 100+ years

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
| 1 | Q717112 | Beylik of Aydin (Wikipedia: Aydinids) | 1305 CE to 1428 CE | 37.8, 27.6 | 1335, 1395 |
| 2 | Q1025803 | Cai (Wikipedia: Cai (state)) | 750 BCE to 451 BCE | 34.7, 113.5 | -705, -600, -495 |
| 3 | Q891 | Nizhny Novgorod (Wikipedia: Nizhny Novgorod) | 1294 CE to 1394 CE | 56.6, 42.5 | 1320, 1370 |
| 4 | Q646374 | French India (Wikipedia: French India) | 1673 CE to 1847 CE | 22.7, 88.4 | 1700, 1760, 1820 |
| 5 | Q110888 | Kingdom of Essex (Wikipedia: Kingdom of Essex) | 534 CE to 665 CE | 51.7, 0.1 | 565, 630 |
| 6 | Q185944 | Kelantan (Wikipedia: Kelantan) | 1762 CE to 1904 CE | 5.4, 102.0 | 1800, 1870 |
| 7 | Q2665398 | Janapada of Matsya (Wikipedia: Matsya (tribe)) | 600 BCE to 405 BCE | 27.5, 76.3 | -570, -500, -435 |
| 8 | Q5582862 | Cuzco (Wikipedia: Cusco) | 1294 CE to 1439 CE | -13.7, -72.4 | 1330, 1405 |
| 9 | Q1068408 | Janapada of Kuru (Wikipedia: Kuru Kingdom) | 600 BCE to 405 BCE | 28.7, 77.3 | -570, -500, -435 |
| 10 | Q134178 | Minoan civilization (Wikipedia: Minoan civilization) | 1600 BCE to 1401 BCE | 35.1, 24.9 | -1570, -1500, -1430 |
| 11 | Q1330149 | Janapada of Surasena (Wikipedia: Surasena) | 600 BCE to 405 BCE | 27.2, 77.7 | -570, -500, -435 |
| 12 | Q48685 | Kingdom of Judah (Wikipedia: Kingdom of Judah) | 900 BCE to 701 BCE | 31.6, 35.2 | -870, -800, -730 |
| 13 | Q1541787 | County of Pallars (Wikipedia: County of Pallars) | 875 CE to 1014 CE | 42.5, 1.0 | 910, 980 |
| 14 | Q208169 | Republic of Ragusa (Wikipedia: Republic of Ragusa) | 1385 CE to 1808 CE | 42.9, 18.0 | 1450, 1595, 1745 |
| 15 | Q3109927 | Sultanate of Sambas (Wikipedia: Sultanate of Sambas) | 1619 CE to 1821 CE | 1.4, 109.2 | 1650, 1720, 1790 |

Reply now with only the JSON array.
