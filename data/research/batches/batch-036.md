# Batch 036 of 047: polities that lasted 100+ years

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
| 1 | Q769782 | Kingdom of Powys (Wikipedia: Kingdom of Powys) | 540 CE to 1168 CE | 52.6, -3.2 | 635, 855, 1085 |
| 2 | Q713393 | Dong-okjeo (Wikipedia: Okjeo) | 36 BCE to 153 CE | 40.3, 127.2 | -10, 60, 125 |
| 3 | Q786 | Dominican Republic (Wikipedia: Dominican Republic) | 1846 CE to 2026 CE | 19.1, -70.8 | 1875, 1935, 2000 |
| 4 | Q800 | Republic of Costa Rica (Wikipedia: Costa Rica) | 1840 CE to 2026 CE | 10.0, -84.0 | 1870, 1935, 2000 |
| 5 | Q2006756 | Haiti (Wikipedia: Haiti) | 1792 CE to 1915 CE | 19.2, -72.2 | 1825, 1885 |
| 6 | Q2070440 | County of Nevers (Wikipedia: County of Nevers) | 1010 CE to 1325 CE | 47.6, 3.1 | 1055, 1170, 1285 |
| 7 | Q402145 | Mataram Sultanate (Wikipedia: Mataram Sultanate) | 1588 CE to 1743 CE | -7.5, 110.9 | 1610, 1665, 1720 |
| 8 | Q1530838 | Nayaks of Madurai (Wikipedia: Madurai Nayak dynasty) | 1529 CE to 1737 CE | 9.9, 78.0 | 1560, 1635, 1705 |
| 9 | Q804 | Republic of Panama (Wikipedia: Panama) | 1905 CE to 2026 CE | 8.2, -81.0 | 1935, 1995 |
| 10 | Q1947408 | County of Périgord (Wikipedia: County of Périgord) | 1206 CE to 1481 CE | 44.6, 0.4 | 1245, 1345, 1440 |
| 11 | Q26385 | County of Vermandois (Wikipedia: Vermandois) | 990 CE to 1215 CE | 49.6, 2.8 | 1025, 1100, 1188 |
| 12 | Q87791 | Magna Frisia (Wikipedia: Frisian Kingdom) | 602 CE to 771 CE | 53.1, 5.9 | 625, 685, 745 |
| 13 | Q751868 | County of Brabant (Wikipedia: Landgraviate of Brabant) | 1260 CE to 1430 CE | 51.3, 4.8 | 1285, 1345, 1405 |
| 14 | Q7038 | County of Barcelona (Wikipedia: Girona) | 898 CE to 1168 CE | 41.6, 2.0 | 940, 1040, 1130 |
| 15 | Q424 | Cambodia (Wikipedia: Cambodia Middle Period) | 1700 CE to 1802 CE | 11.5, 107.6 | 1725, 1775 |

Reply now with only the JSON array.
