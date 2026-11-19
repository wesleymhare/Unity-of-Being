# Batch 027 of 047: polities that lasted 100+ years

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
| 1 | Q260437 | Atropatene (Wikipedia: Atropatene) | 307 BCE to 165 BCE | 37.0, 47.0 | -270, -200 |
| 2 | Q680472 | Principality of Volhynia (Wikipedia: Principality of Volhynia) | 1056 CE to 1201 CE | 52.6, 24.0 | 1090, 1165 |
| 3 | Q13590051 | Burgundians (Wikipedia: Burgundians) | 224 CE to 346 CE | 52.2, 17.5 | 255, 315 |
| 4 | Q13590051 | Burgundians (Wikipedia: Burgundians) | 407 CE to 533 CE | 48.1, 8.1 | 438, 500 |
| 5 | Q1147823 | Gahadavala Dynasty (Wikipedia: Gahadavala dynasty) | 1085 CE to 1201 CE | 26.4, 82.1 | 1115, 1170 |
| 6 | Q136884 | Lazica (Wikipedia: Lazica) | 63 BCE to 545 CE | 42.5, 42.1 | 30, 240, 455 |
| 7 | Q858841 | Kingdom of Croatia (Wikipedia: Kingdom of Croatia (925–1102)) | 926 CE to 1098 CE | 45.4, 16.3 | 950, 1010, 1070 |
| 8 | Q320930 | Wei (Wikipedia: Wei (state)) | 404 BCE to 204 BCE | 37.8, 115.2 | -375, -305, -235 |
| 9 | Q10800789 | Lê Dynasty (Wikipedia: Lê dynasty) | 1429 CE to 1571 CE | 21.5, 105.8 | 1465, 1535 |
| 10 | Q156199 | Electorate of Saxony (Wikipedia: Electorate of Saxony) | 1363 CE to 1699 CE | 51.8, 12.9 | 1415, 1530, 1650 |
| 11 | Q661980 | Duchy of Opole (Wikipedia: Duchy of Opole) | 1177 CE to 1304 CE | 49.9, 18.8 | 1210, 1270 |
| 12 | Q241748 | Kingdom of Serbia (Wikipedia: Kingdom of Serbia) | 1188 CE to 1351 CE | 43.1, 19.4 | 1210, 1270, 1325 |
| 13 | Q1076173 | Zaporozhian Cossacks (Wikipedia: Zaporozhian Cossacks) | 1662 CE to 1774 CE | 48.4, 33.5 | 1690, 1745 |
| 14 | Q316860 | Ripuarian Franks (Wikipedia: Ripuarian Franks) | 238 CE to 509 CE | 52.1, 6.6 | 280, 375, 470 |
| 15 | Q796583 | Kingdom of Kongo (Wikipedia: Kingdom of Kongo) | 1440 CE to 1669 CE | -6.6, 14.6 | 1475, 1555, 1635 |

Reply now with only the JSON array.
