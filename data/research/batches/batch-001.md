# Batch 001 of 047: polities that lasted 100+ years

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
| 1 | Q34266 | Russian Empire (Wikipedia: Russian Empire) | 1721 CE to 1916 CE | 62.0, 111.5 | 1750, 1820, 1885 |
| 2 | Q8680 | British Colonial Empire (Wikipedia: British Empire) | 1709 CE to 1999 CE | 40.1, -74.7 | 1750, 1855, 1955 |
| 3 | Q186096 | Tsardom of Russia (Wikipedia: Tsardom of Russia) | 1547 CE to 1720 CE | 58.8, 36.0 | 1575, 1635, 1695 |
| 4 | Q30 | United States of America (Wikipedia: United States) | 1776 CE to 2026 CE | 36.9, -79.7 | 1815, 1900, 1990 |
| 5 | Q12544 | Roman Empire (Wikipedia: Roman Empire) | 31 BCE to 632 CE | 46.8, 2.4 | 70, 300, 535 |
| 6 | Q223 | Greenland (Wikipedia: Greenland) | 1734 CE to 1940 CE | 65.1, -51.7 | 1765, 1835, 1910 |
| 7 | Q8733 | Qing Dynasty (Wikipedia: Qing dynasty) | 1645 CE to 1911 CE | 47.2, 125.5 | 1685, 1780, 1870 |
| 8 | Q80702 | Spanish Empire (Wikipedia: Spanish Empire) | 1516 CE to 1879 CE | 20.6, -76.5 | 1570, 1700, 1825 |
| 9 | Q79965 | Golden Horde (Wikipedia: Golden Horde) | 1294 CE to 1695 CE | 50.1, 65.3 | 1355, 1495, 1635 |
| 10 | Q188836 | Xiongnu (Wikipedia: Xiongnu) | 208 BCE to 153 CE | 46.9, 99.3 | -155, -30, 100 |
| 11 | Q12560 | Ottoman Empire (Wikipedia: Ottoman Empire) | 1305 CE to 1923 CE | 40.1, 30.7 | 1400, 1615, 1830 |
| 12 | Q9683 | Tang Dynasty (Wikipedia: Tang dynasty) | 623 CE to 910 CE | 34.6, 107.1 | 665, 765, 865 |
| 13 | Q151536 | Novgorod Republic (Wikipedia: Novgorod Republic) | 1056 CE to 1481 CE | 60.8, 32.9 | 1120, 1285, 1415 |
| 14 | Q2477776 | Kimek-Kipchak confederation (Wikipedia: Kimek-Kipchak confederation) | 750 CE to 1235 CE | 49.0, 69.2 | 825, 990, 1160 |
| 15 | Q12536 | Abbasid Caliphate (Wikipedia: Abbasid Caliphate) | 750 CE to 1055 CE | 32.5, 58.7 | 795, 900, 1010 |

Reply now with only the JSON array.
