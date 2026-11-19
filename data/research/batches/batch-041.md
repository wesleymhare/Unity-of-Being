# Batch 041 of 047: polities that lasted 100+ years

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
| 1 | Q140446 | Zagwe dynasty (Wikipedia: Zagwe kingdom) | 947 CE to 1271 CE | 12.3, 39.0 | 995, 1110, 1220 |
| 2 | Q792 | Republic of El Salvador (Wikipedia: El Salvador) | 1840 CE to 2026 CE | 13.9, -89.2 | 1870, 1935, 2000 |
| 3 | Q235030 | Principality of Antioch (Wikipedia: Principality of Antioch) | 1099 CE to 1271 CE | 36.3, 36.3 | 1125, 1185, 1245 |
| 4 | Q13131807 | Kingdom of Morgannwg (Wikipedia: Kingdom of Morgannwg) | 540 CE to 1055 CE | 51.6, -3.5 | 615, 800, 980 |
| 5 | Q313136 | Dumnonia (Wikipedia: Dumnonia) | 602 CE to 709 CE | 50.8, -3.9 | 630, 680 |
| 6 | Q748595 | Qataban (Wikipedia: Qataban) | 350 BCE to 67 BCE | 15.2, 46.0 | -310, -210, -110 |
| 7 | Q122293 | House of Luxembourg (Wikipedia: House of Luxembourg) | 1260 CE to 1414 CE | 50.0, 5.8 | 1285, 1335, 1390 |
| 8 | Q676184 | Kingdom of Sussex (Wikipedia: Kingdom of Sussex) | 490 CE to 771 CE | 51.0, -1.0 | 530, 630, 730 |
| 9 | Q732738 | County of Maine (Wikipedia: Maine (province)) | 990 CE to 1110 CE | 48.0, -0.2 | 1020, 1080 |
| 10 | Q2650109 | Xu (Wikipedia: Xu (state)) | 750 BCE to 285 BCE | 34.7, 117.4 | -680, -520, -355 |
| 11 | Q770776 | Dutch Gold Coast (Wikipedia: Dutch Gold Coast) | 1653 CE to 1872 CE | 5.2, -1.4 | 1685, 1760, 1840 |
| 12 | Q227007 | Zhu (Wikipedia: Zhu (state)) | 750 BCE to 405 BCE | 35.3, 117.6 | -700, -580, -455 |
| 13 | Q2070440 | County of Nevers (Wikipedia: County of Nevers) | 1407 CE to 1520 CE | 47.0, 3.3 | 1435, 1490 |
| 14 | Q12491027 | Balinese Kingdom (Wikipedia: Bali Kingdom) | 1519 CE to 1686 CE | -8.4, 115.1 | 1545, 1600, 1660 |
| 15 | Q836894 | Patriarchate of Aquileia (Wikipedia: Patriarchate of Aquileia) | 1260 CE to 1449 CE | 46.2, 12.9 | 1290, 1355, 1420 |

Reply now with only the JSON array.
