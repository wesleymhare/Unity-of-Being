# Batch 045 of 047: polities that lasted 100+ years

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
| 1 | Q1376303 | Janapada of Malla (Wikipedia: Malla (tribe)) | 600 BCE to 451 BCE | 26.6, 84.1 | -565, -490 |
| 2 | Q1642472 | Tondo (Wikipedia: Tondo (historical polity)) | 1375 CE to 1571 CE | 14.9, 121.0 | 1405, 1475, 1540 |
| 3 | Q1400572 | Beylik of Menteshe (Wikipedia: Menteshe) | 1305 CE to 1414 CE | 37.4, 28.1 | 1330, 1385 |
| 4 | Q156418 | Kingdom of Hawaï'i (Wikipedia: Hawaiian Kingdom) | 1791 CE to 1894 CE | 19.5, -155.4 | 1815, 1870 |
| 5 | Q12719 | County of Pallars Sobirà (Wikipedia: Pallars Sobirà) | 1040 CE to 1201 CE | 42.6, 1.0 | 1065, 1120, 1175 |
| 6 | Q817 | Kuwait (Wikipedia: Kuwait) | 1757 CE to 1872 CE | 29.1, 48.0 | 1785, 1845 |
| 7 | Q603771 | Emirate of Crete (Wikipedia: Emirate of Crete) | 830 CE to 960 CE | 35.1, 24.9 | 860, 930 |
| 8 | Q605199 | Janapada of Vajji (Wikipedia: Vajjika League) | 600 BCE to 481 BCE | 26.8, 85.9 | -570, -510 |
| 9 | Q213893 | Negeri Sembilan (Wikipedia: Negeri Sembilan) | 1775 CE to 1894 CE | 2.6, 102.3 | 1805, 1865 |
| 10 | Q2719360 | Luxembourg (Wikipedia: Luxembourg) | 1890 CE to 2015 CE | 49.8, 6.0 | 1920, 1985 |
| 11 | Q124207979 | Janapada of Cedī (Wikipedia: Cedī (tribe)) | 600 BCE to 451 BCE | 25.5, 81.5 | -565, -490 |
| 12 | Q1541699 | County of Ampuria (Wikipedia: County of Empúries) | 1000 CE to 1414 CE | 42.4, 3.1 | 1060, 1205, 1350 |
| 13 | Q1331184 | Janapada of Vatsa (Wikipedia: Vatsa) | 600 BCE to 451 BCE | 25.8, 82.0 | -565, -490 |
| 14 | Q1178043 | Texcoco (Wikipedia: Texcoco) | 1202 CE to 1428 CE | 19.2, -98.9 | 1235, 1315, 1395 |
| 15 | Q43292 | Sultanate of Bone (Wikipedia: Sultan) | 1512 CE to 1858 CE | -4.9, 120.1 | 1565, 1685, 1805 |

Reply now with only the JSON array.
