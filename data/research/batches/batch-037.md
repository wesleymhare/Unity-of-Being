# Batch 037 of 047: polities that lasted 100+ years

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
| 1 | Q252323 | Taifa of Dénia (Wikipedia: Taifa of Dénia) | 1010 CE to 1151 CE | 38.6, -0.9 | 1045, 1115 |
| 2 | Q669317 | Bidar Sultanate (Wikipedia: Bidar Sultanate) | 1492 CE to 1618 CE | 18.4, 78.0 | 1525, 1585 |
| 3 | Q149747 | Kingdom of Adiabene (Wikipedia: Adiabene) | 63 BCE to 370 CE | 37.0, 42.1 | 1, 155, 305 |
| 4 | Q940785 | Sabaeans (Wikipedia: Sabaeans) | 154 CE to 282 CE | 16.0, 43.7 | 185, 250 |
| 5 | Q118780154 | Emirate of Sicily (Wikipedia: Emirate of Sicily) | 850 CE to 1093 CE | 37.9, 13.3 | 885, 970, 1055 |
| 6 | Q580447 | Duchy of Styria (Wikipedia: Duchy of Styria) | 1260 CE to 1501 CE | 47.0, 10.8 | 1295, 1380, 1465 |
| 7 | Q2907860 | Principality of Mingrelia (Wikipedia: Principality of Mingrelia) | 1468 CE to 1810 CE | 42.8, 42.1 | 1520, 1640, 1760 |
| 8 | Q1264808 | Beylik of Dulkadir (Wikipedia: Beylik of Dulkadir) | 1344 CE to 1515 CE | 38.1, 38.3 | 1370, 1430, 1490 |
| 9 | Q3185305 | Kingdom of Israel (Wikipedia: Kingdom of Israel (united monarchy)) | 1000 BCE to 701 BCE | 32.0, 35.5 | -955, -850, -745 |
| 10 | Q403369 | Kingdom of Champasak (Wikipedia: Champasak) | 1709 CE to 1894 CE | 15.3, 106.7 | 1735, 1800, 1865 |
| 11 | Q52028 | Chiangmai (Wikipedia: Chiang Mai) | 1775 CE to 1884 CE | 19.1, 99.3 | 1800, 1855 |
| 12 | Q2596884 | Principality of Drutsk (Wikipedia: Principality of Drutsk) | 1111 CE to 1249 CE | 54.2, 29.6 | 1145, 1215 |
| 13 | Q2649311 | Sultanate of Perak (Wikipedia: Sultan of Perak) | 1529 CE to 1876 CE | 4.4, 101.0 | 1580, 1700, 1825 |
| 14 | Q208742 | Peloponnesian League (Wikipedia: Peloponnesian League) | 550 BCE to 338 BCE | 37.5, 22.1 | -520, -445, -370 |
| 15 | Q1687929 | Principality of Jersika (Wikipedia: Principality of Jersika) | 1111 CE to 1215 CE | 56.4, 26.7 | 1135, 1190 |

Reply now with only the JSON array.
