# Batch 028 of 047: polities that lasted 100+ years

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
| 1 | Q237325 | Antigonid Dynasty (Wikipedia: Antigonid dynasty) | 291 BCE to 165 BCE | 41.0, 21.5 | -260, -195 |
| 2 | Q655621 | Principality of Transylvania (Wikipedia: Principality of Transylvania (1570-1711)) | 1572 CE to 1695 CE | 46.9, 23.7 | 1605, 1665 |
| 3 | Q25227 | Netherlands Antilles (Wikipedia: Netherlands Antilles) | 1815 CE to 2015 CE | 18.1, -63.0 | 1845, 1915, 1985 |
| 4 | Q1059707 | Lan Na Kingdom (Wikipedia: Lan Na) | 1294 CE to 1618 CE | 19.1, 99.3 | 1345, 1455, 1563 |
| 5 | Q478805 | Puebloans - Chaco Regional System (Wikipedia: Ancestral Puebloans) | 850 CE to 1151 CE | 35.8, -108.4 | 895, 1000, 1105 |
| 6 | Q267816 | Duchy of Benevento (Wikipedia: Duchy of Benevento) | 741 CE to 1084 CE | 40.7, 15.7 | 787, 910, 1035 |
| 7 | Q3503555 | Sultanate of Palembang (Wikipedia: Palembang Sultanate) | 1459 CE to 1821 CE | -3.0, 104.3 | 1515, 1640, 1765 |
| 8 | Q466581 | Hoysala Kingdom (Wikipedia: Hoysala Kingdom) | 1111 CE to 1351 CE | 13.4, 76.1 | 1145, 1230, 1315 |
| 9 | Q211661 | Jaemtland (Wikipedia: Jämtland) | 947 CE to 1187 CE | 63.0, 13.7 | 985, 1065, 1150 |
| 10 | Q27260 | Sind-Samma Dynasty (Wikipedia: Samma dynasty) | 1344 CE to 1525 CE | 25.8, 68.2 | 1370, 1435, 1500 |
| 11 | Q199442 | Kingdom of Aragon (Wikipedia: Kingdom of Aragon) | 1015 CE to 1168 CE | 42.6, 1.0 | 1040, 1090, 1145 |
| 12 | Q269109 | Principality of Ryazan (Wikipedia: Principality of Ryazan) | 1094 CE to 1240 CE | 54.4, 39.8 | 1130, 1205 |
| 13 | Q400998 | Ahmadnagar Sultanate (Wikipedia: Ahmadnagar Sultanate) | 1492 CE to 1652 CE | 19.5, 75.3 | 1515, 1570, 1630 |
| 14 | Q210443 | Greek Dark Ages (Wikipedia: Greek Dark Ages) | 1100 BCE to 801 BCE | 38.1, 22.3 | -1055, -950, -845 |
| 15 | Q1481436 | County of Foix (Wikipedia: County of Foix) | 1236 CE to 1555 CE | 42.8, 1.4 | 1285, 1395, 1505 |

Reply now with only the JSON array.
