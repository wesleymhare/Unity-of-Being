# Batch 015 of 047: polities that lasted 100+ years

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
| 1 | Q1337854 | Emirate of Córdoba (Wikipedia: Emirate of Córdoba) | 757 CE to 935 CE | 39.2, -3.5 | 785, 845, 910 |
| 2 | Q975405 | Sultanate of Rum (Wikipedia: Sultanate of Rum) | 1094 CE to 1313 CE | 39.1, 32.6 | 1125, 1205, 1259 |
| 3 | Q43 | Republic of Turkey (Wikipedia: Turkey) | 1924 CE to 2026 CE | 39.1, 33.2 | 1950, 2000 |
| 4 | Q582861 | Marinid Sultanate (Wikipedia: Marinid Sultanate) | 1344 CE to 1467 CE | 31.4, -7.2 | 1375, 1435 |
| 5 | Q1627675 | Pyu City-States (Wikipedia: Pyu city-states) | 84 CE to 1045 CE | 21.3, 95.6 | 230, 565, 900 |
| 6 | Q943191 | Lakhmid Kingdom (Wikipedia: Lakhmid kingdom) | 270 CE to 633 CE | 30.9, 42.5 | 325, 450, 580 |
| 7 | Q179293 | Kingdom of Castile (Wikipedia: Kingdom of Castile) | 961 CE to 1235 CE | 42.0, -3.5 | 1000, 1100, 1195 |
| 8 | Q911440 | Protectorate of the Western Regions (Wikipedia: Protectorate of the Western Regions) | 117 CE to 223 CE | 39.2, 81.3 | 145, 195 |
| 9 | Q4765854 | Shan States (Wikipedia: Shan States) | 1294 CE to 1563 CE | 25.6, 97.1 | 1335, 1430, 1525 |
| 10 | Q171740 | Caliphate of Córdoba (Wikipedia: Caliphate of Córdoba) | 936 CE to 1071 CE | 39.2, -3.9 | 970, 1035 |
| 11 | Q420759 | Second Bulgarian Empire (Wikipedia: Second Bulgarian Empire) | 1188 CE to 1394 CE | 43.3, 26.7 | 1220, 1290, 1365 |
| 12 | Q486918 | Khwarezmid Dynasty (Wikipedia: Anushtegin dynasty) | 1094 CE to 1201 CE | 43.1, 63.6 | 1120, 1175 |
| 13 | Q887803 | Sultanate of Brunei (Wikipedia: Bruneian Sultanate (1368-1888)) | 1363 CE to 1889 CE | 4.7, 114.7 | 1440, 1625, 1810 |
| 14 | Q101985 | Saxons (Wikipedia: Saxons) | 283 CE to 799 CE | 53.6, 8.9 | 360, 540, 720 |
| 15 | Q1332305 | Lavo Kingdom (Wikipedia: Lavo Kingdom) | 638 CE to 1394 CE | 14.7, 100.3 | 750, 1015, 1280 |

Reply now with only the JSON array.
