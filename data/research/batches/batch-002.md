# Batch 002 of 047: polities that lasted 100+ years

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
| 1 | Q200464 | Portuguese Empire (Wikipedia: Portuguese Empire) | 1502 CE to 1910 CE | -12.8, -38.8 | 1565, 1705, 1850 |
| 2 | Q1661685 | Sasanian Empire (Wikipedia: Sasanian Empire) | 215 CE to 643 CE | 29.9, 52.8 | 280, 430, 580 |
| 3 | Q170770 | Grand Principality of Moscow (Wikipedia: Principality of Moscow) | 1294 CE to 1546 CE | 55.8, 37.4 | 1330, 1420, 1510 |
| 4 | Q1068371 | Han Dynasty (Wikipedia: Han dynasty) | 202 BCE to 237 CE | 34.7, 114.3 | -135, 30, 170 |
| 5 | Q112039853 | Byzantine Empire (Wikipedia: Byzantine Empire) | 633 CE to 1467 CE | 26.5, 31.1 | 760, 1050, 1340 |
| 6 | Q83958 | Macedonian Empire (Wikipedia: Macedonia (ancient kingdom)) | 675 BCE to 292 BCE | 40.5, 22.4 | -620, -485, -350 |
| 7 | Q9903 | Ming Dynasty (Wikipedia: Ming dynasty) | 1375 CE to 1644 CE | 30.8, 112.0 | 1415, 1510, 1605 |
| 8 | Q190513 | Khanate of Sibir (Wikipedia: Khanate of Sibir) | 1429 CE to 1587 CE | 58.9, 78.1 | 1455, 1510, 1565 |
| 9 | Q1433867 | Kazakh Khanate (Wikipedia: Kazakh Khanate) | 1468 CE to 1847 CE | 43.6, 73.0 | 1525, 1660, 1790 |
| 10 | Q2320005 | Ptolemaic Kingdom (Wikipedia: Ptolemaic Kingdom) | 331 BCE to 28 BCE | 26.6, 31.0 | -285, -180, -75 |
| 11 | Q1986139 | Parthian Empire (Wikipedia: Parthian Empire) | 239 BCE to 237 CE | 38.4, 58.4 | -170, 1, 165 |
| 12 | Q861054 | Xianbei (Wikipedia: Xianbei) | 60 CE to 237 CE | 45.8, 114.9 | 85, 150, 210 |
| 13 | Q175881 | Roman Republic (Wikipedia: Roman Republic) | 480 BCE to 32 BCE | 42.0, 12.3 | -415, -255, -100 |
| 14 | Q389688 | Achaemenid Empire (Wikipedia: Achaemenid Empire) | 550 BCE to 327 BCE | 35.9, 61.3 | -515, -440, -360 |
| 15 | Q12548 | Holy Roman Empire (Wikipedia: Holy Roman Empire) | 962 CE to 1806 CE | 50.6, 9.1 | 1090, 1385, 1680 |

Reply now with only the JSON array.
