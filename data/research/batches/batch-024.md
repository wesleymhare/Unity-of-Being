# Batch 024 of 047: polities that lasted 100+ years

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
| 1 | Q71747 | Duchy of Brittany (Wikipedia: Duchy of Brittany) | 947 CE to 1491 CE | 48.1, -2.6 | 1030, 1220, 1410 |
| 2 | Q220594 | Nabataeans (Wikipedia: Nabataeans) | 164 BCE to 105 CE | 29.4, 33.9 | -125, -30, 65 |
| 3 | Q733668 | Ghassanids (Wikipedia: Ghassanids) | 510 CE to 633 CE | 31.8, 38.4 | 540, 600 |
| 4 | Q130900 | Lombards (Wikipedia: Lombards) | 480 CE to 586 CE | 55.7, 13.2 | 505, 560 |
| 5 | Q4962 | Georgia (Wikipedia: Georgia) | 724 CE to 1009 CE | 43.2, 41.2 | 765, 865, 965 |
| 6 | Q3045696 | Regency of Algiers (Wikipedia: Regency of Algiers) | 1706 CE to 1845 CE | 35.7, 3.5 | 1740, 1810 |
| 7 | Q1479952 | Kadamba Empire (Wikipedia: Kadamba Empire) | 353 CE to 554 CE | 16.7, 75.8 | 385, 455, 525 |
| 8 | Q2022162 | Kingdom of Pergamon (Wikipedia: Kingdom of Pergamon) | 279 BCE to 127 BCE | 39.0, 27.4 | -255, -205, -150 |
| 9 | Q7703611 | Duchy of Aquitaine (Wikipedia: Duchy of Aquitaine) | 990 CE to 1138 CE | 46.0, 2.2 | 1025, 1100 |
| 10 | Q1261908 | Principality of Pereyaslavl (Wikipedia: Principality of Pereyaslavl) | 1056 CE to 1240 CE | 50.3, 32.7 | 1085, 1150, 1210 |
| 11 | Q28456 | Silla (Wikipedia: Silla) | 378 CE to 681 CE | 36.5, 128.8 | 425, 530, 635 |
| 12 | Q10791211 | Kingdom of Mrauk U (Wikipedia: Kingdom of Mrauk U) | 1429 CE to 1787 CE | 21.0, 93.5 | 1485, 1610, 1735 |
| 13 | Q207600 | Aghlabid Dynasty (Wikipedia: Aghlabids) | 800 CE to 910 CE | 35.6, 9.1 | 830, 880 |
| 14 | Q2267508 | Trịnh lords (Wikipedia: Trịnh lords) | 1572 CE to 1787 CE | 19.4, 105.2 | 1605, 1680, 1755 |
| 15 | Q55 | Netherlands (Wikipedia: Netherlands) | 1811 CE to 2026 CE | -7.6, 111.6 | 1845, 1920, 1995 |

Reply now with only the JSON array.
