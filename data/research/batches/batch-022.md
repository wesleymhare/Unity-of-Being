# Batch 022 of 047: polities that lasted 100+ years

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
| 1 | Q17161 | Etruscans (Wikipedia: Etruscan civilization) | 750 BCE to 265 BCE | 43.1, 11.7 | -675, -510, -340 |
| 2 | Q307697 | Zayyanid dynasty (Wikipedia: Zayyanid dynasty) | 1236 CE to 1555 CE | 35.6, 3.5 | 1285, 1395, 1505 |
| 3 | Q4807130 | Dutch Cape Colony (Wikipedia: Dutch Cape Coast) | 1653 CE to 1805 CE | -33.9, 19.0 | 1675, 1730, 1780 |
| 4 | Q2662372 | Principality of Minsk (Wikipedia: Principality of Minsk) | 1111 CE to 1313 CE | 54.5, 27.1 | 1140, 1210, 1285 |
| 5 | Q16933165 | Duchy of Sandomierz (Wikipedia: Duchy of Sandomierz) | 1139 CE to 1304 CE | 51.0, 22.0 | 1165, 1220, 1280 |
| 6 | Q715257 | Unified Silla (Wikipedia: Unified Silla) | 682 CE to 935 CE | 36.4, 127.9 | 720, 810, 895 |
| 7 | Q210688 | Asuka Japan (Wikipedia: Asuka period) | 540 CE to 709 CE | 36.6, 139.4 | 565, 625, 685 |
| 8 | Q186537 | Khanate of Kazan (Wikipedia: Khanate of Kazan) | 1440 CE to 1551 CE | 55.7, 49.6 | 1470, 1525 |
| 9 | Q10921634 | Khoshut Khanate (Wikipedia: Khoshut Khanate) | 1582 CE to 1695 CE | 41.4, 93.7 | 1610, 1665 |
| 10 | Q581741 | Chimor (Wikipedia: Chimor) | 911 CE to 1481 CE | -8.2, -79.0 | 995, 1195, 1395 |
| 11 | Q617219 | English Colonial Empire (Wikipedia: English overseas possessions) | 1612 CE to 1779 CE | 37.1, -76.5 | 1635, 1695, 1755 |
| 12 | Q33698 | Livonian Conference (Wikipedia: Livonian language) | 1422 CE to 1563 CE | 58.0, 25.9 | 1455, 1530 |
| 13 | Q465960 | Jesuit Reducciones (Wikipedia: Jesuit missions among the Guaraní) | 1595 CE to 1768 CE | -25.4, -55.7 | 1620, 1680, 1740 |
| 14 | Q940785 | Sabaeans (Wikipedia: Sabaeans) | 800 BCE to 20 BCE | 15.6, 44.8 | -685, -410, -135 |
| 15 | Q568523 | Nobatia (Wikipedia: Nobatia) | 347 CE to 655 CE | 22.1, 32.2 | 395, 500, 610 |

Reply now with only the JSON array.
