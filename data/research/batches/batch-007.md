# Batch 007 of 047: polities that lasted 100+ years

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
| 1 | Q172107 | Polish-Lithuanian Commonwealth (Wikipedia: Polish-Lithuanian Commonwealth) | 1572 CE to 1793 CE | 52.2, 27.1 | 1605, 1680, 1760 |
| 2 | Q171150 | Kingdom of Hungary (Wikipedia: Kingdom of Hungary) | 1000 CE to 1546 CE | 47.1, 21.5 | 1080, 1275, 1465 |
| 3 | Q68962 | Avar Khaganate (Wikipedia: Pannonian Avars) | 561 CE to 805 CE | 48.1, 27.3 | 600, 685, 770 |
| 4 | Q1191125 | Moghulistan (Wikipedia: Moghulistan) | 1463 CE to 1686 CE | 43.7, 76.7 | 1495, 1575, 1655 |
| 5 | Q66504140 | Habsburg Monarchy (Wikipedia: Habsburg Austria) | 1487 CE to 1805 CE | 51.2, 4.5 | 1535, 1645, 1755 |
| 6 | Q1275225 | Scandinavian minor kingdoms (Wikipedia: Vendel Period) | 500 CE to 799 CE | 58.1, 14.2 | 545, 650, 755 |
| 7 | Q28370 | Goguryeo (Wikipedia: Goguryeo) | 36 BCE to 673 CE | 41.9, 127.2 | 70, 320, 565 |
| 8 | Q486181 | Samanid Empire (Wikipedia: Samanid Empire) | 886 CE to 999 CE | 39.9, 68.9 | 915, 970 |
| 9 | Q49683 | Grand Duchy of Lithuania (Wikipedia: Grand Duchy of Lithuania) | 1220 CE to 1449 CE | 55.3, 23.8 | 1255, 1335, 1415 |
| 10 | Q631210 | Nogai Horde (Wikipedia: Nogai Horde) | 1450 CE to 1737 CE | 50.7, 51.8 | 1495, 1595, 1695 |
| 11 | Q128904 | Elam (Wikipedia: Elam) | 2200 BCE to 601 BCE | 31.7, 49.1 | -1960, -1400, -840 |
| 12 | Q837187 | Hamdanid Emirates (Wikipedia: Hamdanid dynasty) | 936 CE to 1259 CE | 35.7, 42.1 | 985, 1100, 1210 |
| 13 | Q179876 | Kingdom of England (Wikipedia: Kingdom of England) | 1210 CE to 1708 CE | 52.4, -1.5 | 1285, 1460, 1635 |
| 14 | Q5062192 | Centralist Mexico (Wikipedia: Centralist Republic of Mexico) | 1836 CE to 2015 CE | 20.7, -102.0 | 1868, 1925, 1990 |
| 15 | Q5257 | Satavahana Dynasty (Wikipedia: Satavahana dynasty) | 225 BCE to 223 CE | 17.4, 78.8 | -160, 1, 155 |

Reply now with only the JSON array.
