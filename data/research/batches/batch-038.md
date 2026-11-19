# Batch 038 of 047: polities that lasted 100+ years

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
| 1 | Q5228183 | Kingdom of Vaspurakan (Wikipedia: Kingdom of Vaspurakan) | 911 CE to 1027 CE | 38.5, 43.8 | 940, 1000 |
| 2 | Q154816 | Kingdom of the Iberians (Wikipedia: Kingdom of the Iberians) | 814 CE to 999 CE | 40.9, 41.9 | 840, 905, 970 |
| 3 | Q2991084 | County of Anjou (Wikipedia: County of Anjou) | 990 CE to 1125 CE | 47.2, -0.9 | 1025, 1090 |
| 4 | Q1065299 | Principality of Salerno (Wikipedia: Principality of Salerno) | 840 CE to 1084 CE | 40.5, 15.7 | 875, 960, 1045 |
| 5 | Q29237 | Kingdom of Gordyene (Wikipedia: Corduene) | 63 BCE to 259 CE | 37.7, 41.2 | -15, 100, 210 |
| 6 | Q332005 | Principality of Achaea (Wikipedia: Principality of Achaea) | 1206 CE to 1430 CE | 37.7, 22.2 | 1240, 1320, 1395 |
| 7 | Q1154556 | Later Zhou (Wikipedia: Later Zhou) | 750 BCE to 257 BCE | 35.0, 112.7 | -675, -505, -330 |
| 8 | Q2576305 | Duchy of Croatia (Wikipedia: Duchy of Croatia) | 741 CE to 925 CE | 44.5, 15.9 | 770, 850, 895 |
| 9 | Q1760473 | Principality of Abkhazia (Wikipedia: Principality of Abkhazia) | 1468 CE to 1829 CE | 43.3, 41.0 | 1520, 1650, 1775 |
| 10 | Q1069959 | Kingdom of Imereti (Wikipedia: Kingdom of Imereti) | 1468 CE to 1810 CE | 42.3, 43.1 | 1520, 1640, 1760 |
| 11 | Q954585 | Kingdom of Brycheiniog (Wikipedia: Brycheiniog) | 540 CE to 1084 CE | 52.0, -3.3 | 620, 810, 1000 |
| 12 | Q2991012 | Earldom of Desmond (Wikipedia: Earl of Desmond) | 1333 CE to 1458 CE | 54.6, -5.8 | 1365, 1425 |
| 13 | Q7185566 | Philistia (Wikipedia: Philistia) | 1150 BCE to 701 BCE | 31.5, 34.7 | -1085, -925, -770 |
| 14 | Q104028 | Judea (Wikipedia: Judea) | 144 BCE to 5 CE | 32.0, 35.2 | -105, -30 |
| 15 | Q1679856 | Sultanate of Jambi (Wikipedia: Jambi Sultanate) | 1670 CE to 1904 CE | -1.4, 103.1 | 1705, 1785, 1870 |

Reply now with only the JSON array.
