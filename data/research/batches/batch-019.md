# Batch 019 of 047: polities that lasted 100+ years

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
| 1 | Q703919 | Ngô Dynasty (Wikipedia: Ngô dynasty) | 947 CE to 1406 CE | 20.6, 105.8 | 1015, 1175, 1335 |
| 2 | Q638064 | Shirvan (Wikipedia: Shirvan) | 825 CE to 1235 CE | 40.1, 46.0 | 885, 1030, 1175 |
| 3 | Q746558 | Emirate of Bukhara (Wikipedia: Emirate of Bukhara) | 1788 CE to 1919 CE | 39.1, 66.7 | 1820, 1867 |
| 4 | Q4083686 | Sultanate of Bengal (Wikipedia: Bengal Sultanate) | 1352 CE to 1533 CE | 24.0, 86.8 | 1380, 1440, 1505 |
| 5 | Q171393 | Principality of Wallachia (Wikipedia: Wallachia) | 1314 CE to 1858 CE | 44.6, 24.7 | 1395, 1585, 1775 |
| 6 | Q185488 | Volga Bulgaria (Wikipedia: Volga Bulgaria) | 682 CE to 1235 CE | 55.5, 49.5 | 765, 960, 1150 |
| 7 | Q107299 | Kingdom of Northumbria (Wikipedia: Northumbria) | 612 CE to 935 CE | 54.0, -1.3 | 660, 775, 885 |
| 8 | Q148499 | Margraviate of Brandenburg (Wikipedia: Margraviate of Brandenburg) | 1260 CE to 1618 CE | 53.0, 13.7 | 1315, 1440, 1565 |
| 9 | Q154667 | Kingdom of Georgia (Wikipedia: Kingdom of Georgia) | 1333 CE to 1578 CE | 41.2, 43.2 | 1370, 1455, 1540 |
| 10 | Q178665 | Mitanni (Wikipedia: Mitanni) | 1500 BCE to 1241 BCE | 36.4, 38.5 | -1460, -1370, -1280 |
| 11 | Q837 | Nepal (Wikipedia: Nepal) | 1775 CE to 2026 CE | 27.3, 86.7 | 1815, 1900, 1990 |
| 12 | Q177076 | Caucasian Albania (Wikipedia: Caucasian Albania) | 63 BCE to 509 CE | 41.0, 46.5 | 25, 225, 425 |
| 13 | Q5790 | Yadava Dynasty (Wikipedia: Yadava Dynasty) | 1188 CE to 1325 CE | 20.3, 75.7 | 1220, 1290 |
| 14 | Q28208 | Goryeo (Wikipedia: Goryeo) | 922 CE to 1259 CE | 37.9, 127.6 | 975, 1090, 1210 |
| 15 | Q374521 | Bahmani Sultanate (Wikipedia: Bahmani Sultanate) | 1352 CE to 1491 CE | 18.9, 78.6 | 1385, 1455 |

Reply now with only the JSON array.
