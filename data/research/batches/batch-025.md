# Batch 025 of 047: polities that lasted 100+ years

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
| 1 | Q19083 | Caucasian Iberia (Wikipedia: Kingdom of Iberia) | 63 BCE to 533 CE | 41.9, 43.7 | 25, 235, 445 |
| 2 | Q29654286 | Kingdom of Cappadocia (Wikipedia: Kingdom of Cappadocia) | 239 BCE to 22 CE | 38.6, 35.5 | -200, -110, -15 |
| 3 | Q528546 | First Hellenic Republic (Wikipedia: First Hellenic Republic) | 1822 CE to 1940 CE | 37.8, 22.2 | 1850, 1910 |
| 4 | Q58389 | House of Bourbon (Wikipedia: House of Bourbon) | 1333 CE to 1594 CE | 46.0, 1.7 | 1370, 1465, 1555 |
| 5 | Q181264 | Mycenaean Greece (Wikipedia: Mycenaean Greece) | 1500 BCE to 1101 BCE | 38.2, 22.4 | -1440, -1300, -1160 |
| 6 | Q188586 | Kingdom of Sicily (Wikipedia: Kingdom of Sicily) | 1139 CE to 1384 CE | 40.7, 15.7 | 1175, 1260, 1345 |
| 7 | Q3332217 | Gorkha Kingdom (Wikipedia: Gorkha Kingdom) | 1588 CE to 1787 CE | 29.0, 82.0 | 1620, 1690, 1755 |
| 8 | Q1148042 | Golconda Sultanate (Wikipedia: Qutb Shahi dynasty) | 1519 CE to 1686 CE | 18.5, 79.0 | 1545, 1600, 1660 |
| 9 | Q210163 | Astrakhan Khanate (Wikipedia: Astrakhan Khanate) | 1642 CE to 1768 CE | 49.6, 42.6 | 1675, 1735 |
| 10 | Q177819 | Old Kingdom of Egypt (Wikipedia: Old Kingdom of Egypt) | 2500 BCE to 2201 BCE | 30.4, 31.2 | -2455, -2350, -2245 |
| 11 | Q19336869 | County of Blôis (Wikipedia: County of Blois) | 990 CE to 1401 CE | 48.2, 1.4 | 1050, 1195, 1340 |
| 12 | Q917 | Kingdom of Bhutan (Wikipedia: Bhutan) | 1636 CE to 2026 CE | 27.5, 90.0 | 1695, 1830, 1970 |
| 13 | Q722071 | Ashanti Empire (Wikipedia: Ashanti Empire) | 1702 CE to 1897 CE | 6.7, -1.6 | 1730, 1800, 1870 |
| 14 | Q26847 | Galatia (Wikipedia: Galatia) | 279 BCE to 26 BCE | 39.5, 33.3 | -240, -150, -65 |
| 15 | Q248572 | Sultanate of Maguindanao (Wikipedia: Sultanate of Maguindanao) | 1521 CE to 1852 CE | 8.1, 125.5 | 1570, 1685, 1800 |

Reply now with only the JSON array.
