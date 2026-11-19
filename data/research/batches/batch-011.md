# Batch 011 of 047: polities that lasted 100+ years

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
| 1 | Q289577 | Himyarite Kingdom (Wikipedia: Himyarite Kingdom) | 110 BCE to 601 CE | 13.8, 44.5 | -5, 245, 495 |
| 2 | Q488880 | Greco-Bactrian Kingdom (Wikipedia: Greco-Bactrian Kingdom) | 247 BCE to 127 BCE | 37.4, 64.1 | -215, -155 |
| 3 | Q83618 | Maratha Empire (Wikipedia: Maratha Empire) | 1677 CE to 1845 CE | 16.3, 74.1 | 1690, 1760, 1820 |
| 4 | Q33 | Republic of Finland (Wikipedia: Finland) | 1918 CE to 2026 CE | 63.3, 27.4 | 1945, 2000 |
| 5 | Q422253 | Gothia (Wikipedia: Gothia) | 207 CE to 382 CE | 48.9, 29.0 | 235, 295, 355 |
| 6 | Q756617 | Kingdom of Denmark (Wikipedia: Danish Realm) | 936 CE to 1401 CE | 56.3, 9.1 | 1005, 1170, 1330 |
| 7 | Q5406 | Hittites (Wikipedia: Hittites) | 1600 BCE to 1151 BCE | 38.6, 36.1 | -1535, -1375, -1220 |
| 8 | Q1936158 | Yue (Wikipedia: Yue (state)) | 500 BCE to 111 BCE | 31.1, 119.3 | -440, -305, -171 |
| 9 | Q217196 | Crown of Castile (Wikipedia: Crown of Castile) | 1236 CE to 1515 CE | 40.2, -4.3 | 1280, 1375, 1475 |
| 10 | Q1194765 | Kamarupa Kingdom (Wikipedia: Kamarupa) | 353 CE to 1138 CE | 26.5, 93.0 | 470, 745, 1020 |
| 11 | Q1501306 | Vakataka Kingdom (Wikipedia: Vakataka dynasty) | 260 CE to 554 CE | 19.8, 77.2 | 305, 405, 510 |
| 12 | Q888574 | Pagan Kingdom (Wikipedia: Pagan Kingdom) | 850 CE to 1293 CE | 21.6, 94.8 | 915, 1070, 1225 |
| 13 | Q6806806 | Chola Empire (Wikipedia: Chola Empire) | 850 CE to 1259 CE | 11.0, 78.5 | 910, 1055, 1200 |
| 14 | Q191324 | Middle Kingdom of Egypt (Wikipedia: Middle Kingdom of Egypt) | 2000 BCE to 1601 BCE | 30.4, 31.2 | -1940, -1800, -1660 |
| 15 | Q49326 | Majapahit (Wikipedia: Majapahit) | 1294 CE to 1518 CE | -3.7, 104.2 | 1330, 1405, 1485 |

Reply now with only the JSON array.
