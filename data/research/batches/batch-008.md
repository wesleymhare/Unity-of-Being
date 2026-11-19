# Batch 008 of 047: polities that lasted 100+ years

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
| 1 | Q184536 | Mali Empire (Wikipedia: Mali Empire) | 1236 CE to 1611 CE | 14.3, -8.7 | 1290, 1425, 1555 |
| 2 | Q849967 | Brythons (Wikipedia: Celtic Britons) | 439 CE to 1235 CE | 52.6, -1.6 | 560, 835, 1115 |
| 3 | Q34 | Kingdom of Sweden (Wikipedia: Sweden) | 1502 CE to 1611 CE | 63.1, 27.0 | 1530, 1585 |
| 4 | Q504759 | Chu (Wikipedia: Chu (state)) | 750 BCE to 224 BCE | 32.0, 112.2 | -670, -485, -305 |
| 5 | Q5066 | Great Jin (Wikipedia: Jin dynasty (1115-1234)) | 1126 CE to 1235 CE | 43.6, 126.1 | 1155, 1210 |
| 6 | Q139377 | Kingdom of Axum (Wikipedia: Kingdom of Aksum) | 50 BCE to 946 CE | 14.0, 39.4 | 100, 450, 795 |
| 7 | Q23039102 | First Toungoo Empire (Wikipedia: First Toungoo Empire) | 1502 CE to 1756 CE | 20.2, 96.3 | 1540, 1630, 1720 |
| 8 | Q750 | Bolivia (Wikipedia: Bolivia) | 1825 CE to 2026 CE | -17.5, -64.5 | 1855, 1925, 1995 |
| 9 | Q298 | Republic of Chile (Wikipedia: Chile) | 1812 CE to 2026 CE | -26.9, -69.9 | 1845, 1920, 1995 |
| 10 | Q83546 | Principality of Rostov-Suzdal (Wikipedia: Vladimir-Suzdal) | 1056 CE to 1486 CE | 58.2, 38.7 | 1120, 1294, 1420 |
| 11 | Q1968654 | Han (Wikipedia: Han (state)) | 404 BCE to 203 BCE | 35.0, 111.5 | -375, -305, -235 |
| 12 | Q2086608 | Western Satraps (Wikipedia: Western Satraps) | 43 CE to 409 CE | 24.1, 72.9 | 100, 225, 355 |
| 13 | Q2429397 | Carthage (Wikipedia: Ancient Carthage) | 650 BCE to 145 BCE | 36.5, 10.3 | -575, -400, -220 |
| 14 | Q46370 | West Franks (Wikipedia: West Francia) | 850 CE to 989 CE | 47.1, 1.4 | 885, 955 |
| 15 | Q126936 | Visigothic Kingdom (Wikipedia: Visigothic Kingdom) | 426 CE to 723 CE | 44.5, 0.4 | 470, 575, 680 |

Reply now with only the JSON array.
