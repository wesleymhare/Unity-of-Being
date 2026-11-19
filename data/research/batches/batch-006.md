# Batch 006 of 047: polities that lasted 100+ years

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
| 1 | Q11774 | Gupta Empire (Wikipedia: Gupta Empire) | 324 CE to 554 CE | 25.7, 83.2 | 360, 440, 520 |
| 2 | Q2118293 | Turks (Wikipedia: Turk) | 666 CE to 1055 CE | 40.1, 69.2 | 717, 860, 995 |
| 3 | Q467985 | Yuezhi (Wikipedia: Yuezhi) | 404 BCE to 42 CE | 39.8, 80.2 | -335, -180, -25 |
| 4 | Q62943 | Maurya Empire (Wikipedia: Maurya Empire) | 318 BCE to 171 BCE | 26.9, 78.2 | -280, -210 |
| 5 | Q208404 | Kingdom of Armenia (Wikipedia: Kingdom of Armenia (antiquity)) | 326 BCE to 489 CE | 39.6, 43.5 | -211, 80, 365 |
| 6 | Q34 | Kingdom of Sweden (Wikipedia: Sweden) | 980 CE to 1401 CE | 59.7, 17.7 | 1045, 1190, 1340 |
| 7 | Q668412 | Pala Empire (Wikipedia: Pala Empire) | 750 CE to 1168 CE | 23.9, 90.3 | 815, 960, 1105 |
| 8 | Q160307 | Fatimid Caliphate (Wikipedia: Fatimid Caliphate) | 911 CE to 1176 CE | 35.6, 9.0 | 950, 1045, 1135 |
| 9 | Q494354 | Kara-Khanids (Wikipedia: Kara-Khanid Khanate) | 850 CE to 1138 CE | 42.6, 77.0 | 895, 995, 1095 |
| 10 | Q282428 | Mamluk Sultanate (Wikipedia: Mamluk Sultanate) | 1241 CE to 1518 CE | 35.3, 38.4 | 1285, 1380, 1475 |
| 11 | Q10914393 | Neo-Assyrian Empire (Wikipedia: Neo-Assyrian Empire) | 900 BCE to 601 BCE | 34.9, 43.2 | -855, -750, -645 |
| 12 | Q180568 | New Kingdom of Egypt (Wikipedia: New Kingdom of Egypt) | 1500 BCE to 801 BCE | 27.0, 30.7 | -1395, -1150, -905 |
| 13 | Q491106 | Khanate of Khiva (Wikipedia: Khanate of Khiva) | 1512 CE to 1919 CE | 42.3, 59.8 | 1575, 1715, 1860 |
| 14 | Q173282 | Khazaria (Wikipedia: Khazars) | 630 CE to 979 CE | 45.5, 44.0 | 680, 805, 925 |
| 15 | Q23666 | Kingdom of Great Britain (Wikipedia: Great Britain) | 1709 CE to 2015 CE | 52.7, -1.6 | 1755, 1860, 1970 |

Reply now with only the JSON array.
