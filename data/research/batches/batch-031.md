# Batch 031 of 047: polities that lasted 100+ years

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
| 1 | Q266923 | Kingdom of Mysore (Wikipedia: Kingdom of Mysore) | 1572 CE to 1799 CE | 12.2, 76.9 | 1605, 1685, 1765 |
| 2 | Q356524 | Kalinga (Wikipedia: Kalinga) | 318 BCE to 171 BCE | 19.5, 83.4 | -280, -210 |
| 3 | Q1572529 | Hanthawaddy Kingdom (Wikipedia: Hanthawaddy Kingdom) | 1294 CE to 1546 CE | 17.0, 95.8 | 1330, 1420, 1510 |
| 4 | Q1232887 | County of Savoy (Wikipedia: County of Savoy) | 1260 CE to 1539 CE | 45.5, 6.8 | 1300, 1400, 1495 |
| 5 | Q1796223 | Kingdom of Lunda (Wikipedia: Kingdom of Lunda) | 1709 CE to 1889 CE | -6.2, 14.7 | 1735, 1800, 1860 |
| 6 | Q200229 | House of Savoy (Wikipedia: House of Savoy) | 1564 CE to 1720 CE | 45.3, 7.5 | 1585, 1640, 1695 |
| 7 | Q849623 | Oyo Empire (Wikipedia: Oyo Empire) | 1609 CE to 1835 CE | 8.4, 4.7 | 1645, 1720, 1800 |
| 8 | Q918153 | Ceylon (Wikipedia: Sri Lanka) | 1236 CE to 1506 CE | 6.5, 80.6 | 1275, 1370, 1465 |
| 9 | Q168352 | House of Ascania (Wikipedia: House of Ascania) | 1260 CE to 1486 CE | 51.1, 13.5 | 1295, 1375, 1450 |
| 10 | Q463871 | Lower Egypt (Wikipedia: Old Kingdom of Egypt) | 2200 BCE to 2001 BCE | 30.4, 31.3 | -2170, -2100, -2030 |
| 11 | Q2247225 | Tarumanagara (Wikipedia: Tarumanagara) | 367 CE to 673 CE | -6.4, 107.1 | 415, 520, 625 |
| 12 | Q31 | Kingdom of Belgium (Wikipedia: Belgium) | 1830 CE to 2026 CE | 50.7, 4.5 | 1860, 1930, 1995 |
| 13 | Q3532152 | Early Pandyas (Wikipedia: Early Pandyas) | 291 BCE to 305 CE | 9.5, 78.0 | -200, 5, 215 |
| 14 | Q127885 | Serbs (Wikipedia: Serbs) | 1805 CE to 1915 CE | 44.0, 21.3 | 1830, 1890 |
| 15 | Q79861 | Michoacán (Wikipedia: Michoacán) | 1305 CE to 1533 CE | 18.6, -100.9 | 1340, 1420, 1500 |

Reply now with only the JSON array.
