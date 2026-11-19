# Batch 003 of 047: polities that lasted 100+ years

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
| 1 | Q19927420 | Mongol Khanate (Wikipedia: Mongol khanate) | 1468 CE to 1635 CE | 45.9, 108.1 | 1495, 1550, 1610 |
| 2 | Q188712 | Empire of Japan (Wikipedia: Empire of Japan) | 1868 CE to 2015 CE | 34.6, 132.8 | 1905, 1980 |
| 3 | Q148 | Republic of China (Wikipedia: Republic of China (1912-1949)) | 1912 CE to 2026 CE | 32.5, 109.4 | 1940, 2000 |
| 4 | Q45813 | Huns (Wikipedia: Huns) | 106 CE to 468 CE | 46.4, 53.9 | 160, 285, 415 |
| 5 | Q131802 | Scythia (Wikipedia: Scythians) | 650 BCE to 224 BCE | 47.3, 43.3 | -585, -435, -290 |
| 6 | Q33296 | Mughal Empire (Wikipedia: Mughal Empire) | 1529 CE to 1858 CE | 30.1, 72.6 | 1580, 1695, 1810 |
| 7 | Q45670 | Kingdom of Portugal (Wikipedia: Kingdom of Portugal) | 1147 CE to 1910 CE | 40.9, -7.8 | 1260, 1530, 1795 |
| 8 | Q19951607 | French Africa (Wikipedia: French Africa) | 1846 CE to 1957 CE | -1.6, 9.3 | 1875, 1930 |
| 9 | Q8575586 | Umayyad Caliphate (Wikipedia: Umayyad Caliphate) | 656 CE to 756 CE | 35.4, 37.9 | 680, 730 |
| 10 | Q2431480 | Tibetan Empire (Wikipedia: Tibetan Empire) | 623 CE to 849 CE | 29.5, 89.2 | 655, 735, 815 |
| 11 | Q202266 | Old Kingdom of Norway (Wikipedia: Norway) | 866 CE to 1401 CE | 60.8, 8.6 | 945, 1135, 1320 |
| 12 | Q1108445 | Rus' (Wikipedia: Rus) | 880 CE to 1240 CE | 57.9, 34.4 | 935, 1060, 1185 |
| 13 | Q62651 | Denmark-Norway (Wikipedia: Denmark-Norway) | 1526 CE to 1940 CE | 60.4, 7.7 | 1590, 1735, 1880 |
| 14 | Q155 | Brazilian Republic (Wikipedia: Brazil) | 1890 CE to 2026 CE | -12.2, -49.1 | 1925, 1990 |
| 15 | Q7462 | Northern Song (Wikipedia: Song dynasty) | 961 CE to 1278 CE | 34.8, 115.5 | 1010, 1120, 1230 |

Reply now with only the JSON array.
