# Batch 017 of 047: polities that lasted 100+ years

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
| 1 | Q5724 | Anurādhapura (Wikipedia: Anurādhapura) | 291 BCE to 1017 CE | 7.1, 80.8 | -95, 365, 820 |
| 2 | Q1472004 | Yan (Wikipedia: Yan (state)) | 750 BCE to 204 BCE | 39.4, 117.2 | -670, -475, -285 |
| 3 | Q255931 | Haripuñjaya (Wikipedia: Haripuñjaya) | 661 CE to 1293 CE | 18.2, 99.5 | 755, 975, 1200 |
| 4 | Q939852 | Salian Franks (Wikipedia: Salian Franks) | 358 CE to 509 CE | 51.4, 5.1 | 380, 435, 485 |
| 5 | Q863279 | Sukhothai Kingdom (Wikipedia: Sukhothai Kingdom) | 1241 CE to 1458 CE | 16.9, 100.3 | 1275, 1350, 1425 |
| 6 | Q202687 | Songhai Empire (Wikipedia: Songhai Empire) | 1463 CE to 1594 CE | 16.6, 0.1 | 1495, 1560 |
| 7 | Q6737189 | Maitraka Dynasty (Wikipedia: Maitraka dynasty) | 476 CE to 731 CE | 21.9, 71.0 | 515, 605, 695 |
| 8 | Q2361927 | Duchy of Masovia (Wikipedia: Duchy of Masovia) | 1139 CE to 1351 CE | 52.5, 21.2 | 1170, 1245, 1320 |
| 9 | Q1315339 | Lohara Dynasty (Wikipedia: Lohara dynasty) | 1003 CE to 1259 CE | 35.7, 75.8 | 1040, 1130, 1220 |
| 10 | Q46652 | Sultanate of Malacca (Wikipedia: Malacca Sultanate) | 1459 CE to 1861 CE | 1.6, 103.7 | 1520, 1660, 1800 |
| 11 | Q2132267 | Rasulid Dynasty (Wikipedia: Rasulid dynasty) | 1236 CE to 1458 CE | 15.4, 45.2 | 1270, 1345, 1425 |
| 12 | Q206789 | Ghana Empire (Wikipedia: Ghana Empire) | 793 CE to 1201 CE | 15.4, -6.2 | 855, 995, 1140 |
| 13 | Q105092 | Kingdom of Mercia (Wikipedia: Mercia) | 534 CE to 883 CE | 52.6, -0.8 | 585, 710, 829 |
| 14 | Q940123 | Rustamid dynasty (Wikipedia: Rustamid dynasty) | 778 CE to 910 CE | 34.5, 2.9 | 810, 875 |
| 15 | Q170174 | Papal States (Wikipedia: Papal States) | 755 CE to 1870 CE | 41.8, 12.9 | 920, 1310, 1705 |

Reply now with only the JSON array.
