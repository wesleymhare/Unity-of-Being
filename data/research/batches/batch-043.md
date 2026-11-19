# Batch 043 of 047: polities that lasted 100+ years

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
| 1 | Q332137 | Kingdom of Commagene (Wikipedia: Commagene) | 63 BCE to 77 CE | 38.2, 38.8 | -30, 43 |
| 2 | Q3284315 | Samudera Pasai Sultanate (Wikipedia: Samudera Pasai Sultanate) | 1272 CE to 1520 CE | 5.0, 96.9 | 1310, 1395, 1485 |
| 3 | Q1356151 | Teng (Wikipedia: Teng (state)) | 750 BCE to 451 BCE | 35.0, 116.7 | -705, -600, -495 |
| 4 | Q3530610 | Thanjavur Maratha Kingdom (Wikipedia: Thanjavur Maratha Kingdom) | 1677 CE to 1799 CE | 10.7, 79.4 | 1710, 1770 |
| 5 | Q204077 | Cao (Wikipedia: Cao (state)) | 750 BCE to 451 BCE | 35.4, 114.8 | -705, -600, -495 |
| 6 | Q1183407 | Taifa of Algeciras (Wikipedia: Taifa of Algeciras) | 1028 CE to 1168 CE | 36.7, -4.8 | 1065, 1147 |
| 7 | Q3446232 | Sultanate of Sukadana (Wikipedia: Tanjungpura Kingdom) | 1619 CE to 1833 CE | -2.6, 110.2 | 1650, 1725, 1800 |
| 8 | Q605930 | Taifa of Tortosa (Wikipedia: Taifa of Tortosa) | 1010 CE to 1110 CE | 41.5, 1.2 | 1035, 1085 |
| 9 | Q2594661 | Kingdom of Gwent (Wikipedia: Kingdom of Gwent) | 540 CE to 1055 CE | 51.7, -3.0 | 615, 800, 980 |
| 10 | Q7636765 | Sultanate of Selangor (Wikipedia: Sultan of Selangor) | 1744 CE to 1876 CE | 3.0, 101.6 | 1775, 1845 |
| 11 | Q1194906 | Janapada of Aśmaka (Wikipedia: Asmaka) | 600 BCE to 351 BCE | 19.9, 78.2 | -565, -475, -390 |
| 12 | Q2817348 | Sultanate of Bima (Wikipedia: Bima Sultanate) | 1626 CE to 1889 CE | -8.6, 120.3 | 1665, 1760, 1850 |
| 13 | Q272033 | County of Tripoli (Wikipedia: County of Tripoli) | 1111 CE to 1271 CE | 34.4, 36.0 | 1135, 1190, 1245 |
| 14 | Q334714 | Duchy of Athens (Wikipedia: Duchy of Athens) | 1206 CE to 1313 CE | 38.2, 23.7 | 1235, 1285 |
| 15 | Q3125978 | Bali (Wikipedia: Bali) | 1687 CE to 1907 CE | -8.4, 115.1 | 1720, 1795, 1875 |

Reply now with only the JSON array.
