# Batch 023 of 047: polities that lasted 100+ years

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
| 1 | Q431575 | Idrisids (Wikipedia: Idrisid dynasty) | 793 CE to 979 CE | 33.5, -5.3 | 820, 885, 950 |
| 2 | Q179876 | Kingdom of England (Wikipedia: Kingdom of England) | 936 CE to 1071 CE | 52.0, -1.3 | 970, 1046 |
| 3 | Q568638 | Duchy of Silesia (Wikipedia: Duchy of Silesia) | 1139 CE to 1304 CE | 50.7, 19.1 | 1169, 1220, 1280 |
| 4 | Q77 | Oriental Republic of Uruguay (Wikipedia: Uruguay) | 1828 CE to 2026 CE | -32.9, -56.3 | 1860, 1925, 1995 |
| 5 | Q1515009 | Duchy of Greater Poland (Wikipedia: Duchy of Greater Poland) | 1139 CE to 1304 CE | 52.7, 16.1 | 1165, 1220, 1280 |
| 6 | Q1061057 | Sultanate of Aceh (Wikipedia: Aceh Sultanate) | 1516 CE to 1959 CE | 4.9, 95.6 | 1580, 1740, 1895 |
| 7 | Q187684 | Despotate of Epirus (Wikipedia: Despotate of Epirus) | 1206 CE to 1481 CE | 40.0, 20.7 | 1245, 1343, 1440 |
| 8 | Q2428714 | Sena Dynasty (Wikipedia: Sena Dynasty) | 1072 CE to 1235 CE | 23.9, 89.0 | 1095, 1155, 1210 |
| 9 | Q4210248 | Kalmyk Khanate (Wikipedia: Kalmyk Khanate) | 1632 CE to 1771 CE | 46.6, 45.7 | 1665, 1735 |
| 10 | Q1071439 | Merina Kingdom (Wikipedia: Merina Kingdom) | 1792 CE to 1897 CE | -18.9, 46.8 | 1820, 1870 |
| 11 | Q736 | Republic of Ecuador (Wikipedia: Ecuador) | 1834 CE to 2026 CE | -1.2, -78.8 | 1865, 1930, 1995 |
| 12 | Q2086556 | Kakatiya Dynasty (Wikipedia: Kakatiya dynasty) | 1177 CE to 1325 CE | 18.1, 80.9 | 1215, 1290 |
| 13 | Q231392 | Kingdom of Asturias (Wikipedia: Kingdom of Asturias) | 724 CE to 925 CE | 42.7, -7.8 | 755, 825, 895 |
| 14 | Q816814 | Kingdom of Gwynedd (Wikipedia: Kingdom of Gwynedd) | 540 CE to 1284 CE | 53.0, -4.0 | 650, 910, 1170 |
| 15 | Q1324889 | Germiyanids (Wikipedia: Germiyanids) | 1305 CE to 1439 CE | 39.2, 29.6 | 1340, 1405 |

Reply now with only the JSON array.
