# Batch 016 of 047: polities that lasted 100+ years

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
| 1 | Q1057118 | Chenla (Wikipedia: Chenla) | 555 CE to 805 CE | 15.0, 105.9 | 590, 680, 770 |
| 2 | Q752662 | Hafsid Dynasty (Wikipedia: Hafsid dynasty) | 1236 CE to 1571 CE | 35.6, 9.1 | 1285, 1405, 1520 |
| 3 | Q1469742 | Sunda Kingdom (Wikipedia: Sunda Kingdom) | 674 CE to 1578 CE | -6.6, 106.7 | 810, 1125, 1440 |
| 4 | Q1143524 | Qi (Wikipedia: Qi (state)) | 750 BCE to 204 BCE | 37.3, 117.5 | -670, -475, -285 |
| 5 | Q175276 | Kingdom of León (Wikipedia: Kingdom of León) | 911 CE to 1235 CE | 42.4, -5.2 | 960, 1071, 1185 |
| 6 | Q1154406 | Ashikaga Shogunate (Wikipedia: Ashikaga shogunate) | 1344 CE to 1571 CE | 36.7, 139.4 | 1380, 1460, 1535 |
| 7 | Q3271735 | Kingdom of Arles (Wikipedia: Kingdom of Arles) | 936 CE to 1384 CE | 46.5, 6.6 | 1005, 1160, 1315 |
| 8 | Q1155700 | Rattanakosin Kingdom (Wikipedia: Rattanakosin Kingdom (1782–1932)) | 1783 CE to 1931 CE | 15.3, 100.6 | 1820, 1895 |
| 9 | Q1517159 | Hadhramaut (Wikipedia: Hadhramaut) | 700 BCE to 305 CE | 15.6, 49.3 | -550, -200, 155 |
| 10 | Q1991742 | Kingdom of Alba (Wikipedia: Kingdom of Alba) | 900 CE to 1293 CE | 56.9, -3.7 | 960, 1095, 1235 |
| 11 | Q105313 | Kingdom of Wessex (Wikipedia: Wessex) | 534 CE to 935 CE | 51.4, -1.7 | 595, 735, 875 |
| 12 | Q844750 | Zapotec Civilization (Wikipedia: Zapotec civilization) | 500 BCE to 895 CE | 17.1, -96.8 | -290, 200, 685 |
| 13 | Q577867 | Kingdom of Poland (Wikipedia: Kingdom of Poland) | 1305 CE to 1449 CE | 50.5, 20.9 | 1340, 1415 |
| 14 | Q733 | Paraguay (Wikipedia: Paraguay) | 1811 CE to 2026 CE | -23.2, -55.6 | 1845, 1920, 1995 |
| 15 | Q5636647 | Sind-Habbari Dynasty (Wikipedia: Habbari dynasty) | 860 CE to 1201 CE | 27.4, 69.2 | 910, 1030, 1150 |

Reply now with only the JSON array.
