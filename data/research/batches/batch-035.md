# Batch 035 of 047: polities that lasted 100+ years

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
| 1 | Q124661 | Strathclyde (Wikipedia: Strathclyde) | 644 CE to 1033 CE | 55.7, -4.1 | 700, 840, 975 |
| 2 | Q1660566 | Sultanate of Banjar (Wikipedia: Sultanate of Banjar) | 1526 CE to 1859 CE | -3.5, 114.9 | 1575, 1690, 1810 |
| 3 | Q422065 | Sultanate of Sulu (Wikipedia: Sultanate of Sulu) | 1673 CE to 1879 CE | 5.3, 117.7 | 1705, 1775, 1850 |
| 4 | Q1152 | County of Auvergne (Wikipedia: Auvergne) | 1206 CE to 1501 CE | 45.5, 3.0 | 1250, 1351, 1455 |
| 5 | Q676811 | Taifa of Valencia (Wikipedia: Taifa of Valencia) | 1010 CE to 1151 CE | 39.6, -0.7 | 1045, 1098 |
| 6 | Q842091 | Duchy of Normandy (Wikipedia: Duchy of Normandy) | 922 CE to 1071 CE | 49.7, 1.4 | 960, 1035 |
| 7 | Q238445 | Emirate of Granada (Wikipedia: Emirate of Granada) | 1241 CE to 1491 CE | 37.2, -2.9 | 1280, 1365, 1455 |
| 8 | Q727710 | Tabal Kingdom (Wikipedia: Tabal (state)) | 900 BCE to 701 BCE | 37.7, 36.3 | -870, -800, -730 |
| 9 | Q762084 | Bamana Empire (Wikipedia: Bamana Empire) | 1713 CE to 1821 CE | 13.5, -5.5 | 1740, 1795 |
| 10 | Q200262 | Kingdom of Navarre (Wikipedia: Kingdom of Navarre) | 1139 CE to 1428 CE | 42.8, -2.2 | 1180, 1284, 1385 |
| 11 | Q153529 | Duchy of Milan (Wikipedia: Duchy of Milan) | 1402 CE to 1539 CE | 45.5, 9.7 | 1435, 1501 |
| 12 | Q837998 | Kingdom of East Anglia (Wikipedia: Kingdom of East Anglia) | 534 CE to 869 CE | 52.5, 0.8 | 585, 700, 840 |
| 13 | Q2816439 | Dabuyid Dynasty (Wikipedia: Dabuyid dynasty) | 644 CE to 756 CE | 36.9, 54.6 | 670, 730 |
| 14 | Q1794352 | Electorate of Trier (Wikipedia: Electorate of Trier) | 1333 CE to 1618 CE | 49.5, 11.9 | 1375, 1475, 1575 |
| 15 | Q1709007 | Portuguese Ceylon (Wikipedia: Portuguese Ceylon) | 1507 CE to 1686 CE | 7.1, 81.0 | 1535, 1595, 1660 |

Reply now with only the JSON array.
