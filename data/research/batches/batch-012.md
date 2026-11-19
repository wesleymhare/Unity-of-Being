# Batch 012 of 047: polities that lasted 100+ years

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
| 1 | Q1475713 | Funj Sultanate (Wikipedia: Funj Sultanate) | 1507 CE to 1821 CE | 13.9, 33.1 | 1555, 1665, 1775 |
| 2 | Q43100 | Kashmir (Wikipedia: Kashmir) | 626 CE to 1343 CE | 33.0, 77.4 | 735, 985, 1235 |
| 3 | Q1395011 | Chalukya Dynasty (Wikipedia: Chalukya dynasty) | 555 CE to 756 CE | 14.7, 75.9 | 585, 655, 725 |
| 4 | Q841364 | Ayutthaya Kingdom (Wikipedia: Ayutthaya Kingdom) | 1352 CE to 1768 CE | 14.6, 100.8 | 1415, 1560, 1705 |
| 5 | Q1136188 | Saadi Sultanate (Wikipedia: Saadi Sultanate) | 1556 CE to 1740 CE | 31.8, -6.6 | 1585, 1650, 1710 |
| 6 | Q717 | Republic of Venezuela (Wikipedia: Venezuela) | 1811 CE to 2026 CE | 8.5, -68.8 | 1845, 1920, 1995 |
| 7 | Q854062 | Wusun (Wikipedia: Wusun) | 66 BCE to 450 CE | 43.4, 78.0 | 10, 190, 375 |
| 8 | Q62389 | Icelandic Commonwealth (Wikipedia: Icelandic Commonwealth) | 936 CE to 1271 CE | 64.9, -18.8 | 985, 1105, 1220 |
| 9 | Q1028 | Morocco (Wikipedia: Morocco) | 1670 CE to 2026 CE | 31.9, -6.4 | 1725, 1850, 1975 |
| 10 | Q216786 | Chámpa (Wikipedia: Champa) | 207 CE to 1652 CE | 13.9, 108.8 | 425, 930, 1435 |
| 11 | Q739 | Republic of Colombia (Wikipedia: Colombia) | 1866 CE to 2026 CE | 3.4, -73.4 | 1890, 1945, 2000 |
| 12 | Q12567 | Viking settlements (Wikipedia: Vikings) | 793 CE to 1325 CE | 59.9, 31.3 | 875, 1060, 1245 |
| 13 | Q1179 | Aquitaine (Wikipedia: Aquitaine) | 629 CE to 767 CE | 43.9, 0.6 | 665, 730 |
| 14 | Q28322 | Balhae (Wikipedia: Balhae) | 705 CE to 925 CE | 41.4, 128.4 | 740, 815, 890 |
| 15 | Q7427 | Western Xia (Wikipedia: Western Xia) | 990 CE to 1226 CE | 39.5, 109.7 | 1025, 1110, 1190 |

Reply now with only the JSON array.
