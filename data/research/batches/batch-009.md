# Batch 009 of 047: polities that lasted 100+ years

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
| 1 | Q213649 | Scandinavian minor kingdoms (Wikipedia: Viking Age) | 800 CE to 1002 CE | 60.5, 7.7 | 830, 900, 970 |
| 2 | Q911440 | Protectorate of the Western Regions (Wikipedia: Protectorate of the Western Regions) | 306 CE to 601 CE | 39.5, 81.3 | 350, 455, 555 |
| 3 | Q1196201 | Tuyuhun (Wikipedia: Tuyuhun) | 287 CE to 665 CE | 37.6, 98.6 | 345, 475, 610 |
| 4 | Q7380487 | Kingdom of Pontus (Wikipedia: Kingdom of Pontus) | 281 BCE to 67 CE | 40.6, 35.5 | -230, -105, 15 |
| 5 | Q5324 | Gurjara-Pratihara Dynasty (Wikipedia: Gurjara-Pratihara dynasty) | 732 CE to 1039 CE | 24.6, 73.8 | 780, 885, 995 |
| 6 | Q577668 | Khanate of Bukhara (Wikipedia: Khanate of Bukhara) | 1516 CE to 1787 CE | 40.7, 67.1 | 1555, 1650, 1745 |
| 7 | Q194355 | House of Jagiellon (Wikipedia: Jagiellonian dynasty) | 1450 CE to 1571 CE | 52.2, 30.0 | 1480, 1540 |
| 8 | Q188161 | Dutch East Indies (Wikipedia: Dutch East Indies) | 1800 CE to 1949 CE | -7.5, 111.6 | 1835, 1910 |
| 9 | Q68518 | Haudenosaunee (Wikipedia: Iroquois) | 1450 CE to 1782 CE | 43.9, -74.9 | 1500, 1615, 1730 |
| 10 | Q189326 | Qajar Dynasty (Wikipedia: Qajar dynasty) | 1788 CE to 1923 CE | 34.4, 49.4 | 1820, 1890 |
| 11 | Q234197 | Srivijaya (Wikipedia: Srivijaya) | 682 CE to 1293 CE | -3.7, 104.2 | 775, 990, 1200 |
| 12 | Q2662180 | Qocho Kingdom (Wikipedia: Qocho) | 860 CE to 1138 CE | 42.1, 88.5 | 900, 1000, 1095 |
| 13 | Q28513 | Hungarian Nationalists (Wikipedia: Austria-Hungary) | 1849 CE to 2015 CE | 47.2, 21.5 | 1875, 1918, 1990 |
| 14 | Q829356 | Makuria (Wikipedia: Makuria) | 347 CE to 1518 CE | 18.9, 33.8 | 525, 930, 1340 |
| 15 | Q20 | Kingdom of Norway (Wikipedia: Norway) | 1905 CE to 2026 CE | 60.4, 7.7 | 1935, 1995 |

Reply now with only the JSON array.
