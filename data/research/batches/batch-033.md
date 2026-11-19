# Batch 033 of 047: polities that lasted 100+ years

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
| 1 | Q241 | Republic of Cuba (Wikipedia: Cuba) | 1905 CE to 2026 CE | 20.6, -76.5 | 1935, 1995 |
| 2 | Q1752110 | Yarubid dynasty (Wikipedia: Ya'rubids) | 1626 CE to 1743 CE | 23.0, 57.5 | 1655, 1715 |
| 3 | Q2272880 | Takrur (Wikipedia: Takrur) | 1040 CE to 1235 CE | 16.2, -14.3 | 1070, 1140, 1205 |
| 4 | Q939200 | Capetian House of Anjou (Wikipedia: Capetian House of Anjou) | 1250 CE to 1384 CE | 47.6, -0.3 | 1285, 1350 |
| 5 | Q5311389 | Duchy of Thuringia (Wikipedia: Duchy of Thuringia) | 567 CE to 723 CE | 50.4, 10.4 | 590, 645, 700 |
| 6 | Q178913 | Empire of Trebizond (Wikipedia: Empire of Trebizond) | 1206 CE to 1462 CE | 41.3, 35.5 | 1245, 1335, 1425 |
| 7 | Q4492881 | Frisia Kingdom (Wikipedia: Frisia) | 612 CE to 717 CE | 48.1, 8.7 | 644, 690 |
| 8 | Q2626105 | Kingdom of Sophene (Wikipedia: Kingdom of Sophene) | 256 BCE to 113 CE | 38.9, 40.0 | -200, -63, 60 |
| 9 | Q7903 | Barghawata Conference (Wikipedia: Casablanca) | 793 CE to 1065 CE | 32.6, -8.2 | 835, 930, 1025 |
| 10 | Q1317579 | Sultanate of Kedah (Wikipedia: Kedah Sultanate) | 1139 CE to 1910 CE | 6.0, 100.7 | 1255, 1525, 1795 |
| 11 | Q28405 | Gojoseon (Wikipedia: Gojoseon) | 197 BCE to 92 BCE | 40.0, 126.4 | -170, -120 |
| 12 | Q877155 | Early Cheras (Wikipedia: Chera dynasty) | 291 BCE to 305 CE | 10.0, 76.7 | -200, 5, 215 |
| 13 | Q7313 | Great Yuan (Wikipedia: Yuan dynasty) | 110 BCE to 50 CE | 40.7, 70.1 | -85, -30, 25 |
| 14 | Q55502 | Kingdom of Jerusalem (Wikipedia: Kingdom of Jerusalem) | 1099 CE to 1293 CE | 31.6, 35.1 | 1130, 1195, 1265 |
| 15 | Q1929987 | Karamanli Dynasty (Wikipedia: Karamanli dynasty) | 1713 CE to 1839 CE | 32.0, 14.9 | 1745, 1810 |

Reply now with only the JSON array.
