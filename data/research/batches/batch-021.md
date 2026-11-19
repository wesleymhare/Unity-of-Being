# Batch 021 of 047: polities that lasted 100+ years

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
| 1 | Q620765 | Lydia (Wikipedia: Lydia) | 700 BCE to 541 BCE | 38.3, 27.9 | -675, -620, -565 |
| 2 | Q156173 | Kingdom of Numidia (Wikipedia: Jugurtha) | 197 BCE to 47 BCE | 35.7, 3.6 | -175, -120, -70 |
| 3 | Q1297894 | County of Ribagorza (Wikipedia: County of Ribagorza) | 866 CE to 1084 CE | 42.8, -1.7 | 900, 975, 1050 |
| 4 | Q662410 | Twenty-sixth Dynasty of Egypt (Wikipedia: Twenty-sixth Dynasty of Egypt) | 615 BCE to 501 BCE | 26.6, 31.1 | -585, -530 |
| 5 | Q111471 | Dál Riata (Wikipedia: Dál Riata) | 540 CE to 899 CE | 56.3, -5.3 | 595, 720, 845 |
| 6 | Q13048507 | Bavarians (Wikipedia: Bavarians) | 540 CE to 787 CE | 47.6, 11.3 | 575, 665, 750 |
| 7 | Q1317991 | Đại Việt (Wikipedia: Mạc dynasty) | 1529 CE to 1833 CE | 21.3, 105.9 | 1575, 1680, 1785 |
| 8 | Q7135130 | Paramara Dynasty (Wikipedia: Paramara dynasty) | 980 CE to 1235 CE | 24.2, 76.3 | 1020, 1110, 1195 |
| 9 | Q5261548 | Qasimids (Wikipedia: Rassid dynasty) | 1636 CE to 1802 CE | 15.2, 44.9 | 1660, 1720, 1775 |
| 10 | Q382593 | New Netherland (Wikipedia: New Netherland) | 1622 CE to 1802 CE | 6.4, -58.4 | 1650, 1710, 1775 |
| 11 | Q321371 | Cimmerian Bosporus (Wikipedia: Bosporan Kingdom) | 404 BCE to 372 CE | 45.2, 36.3 | -290, -15, 255 |
| 12 | Q207017 | Ziyadid dynasty (Wikipedia: Ziyadid dynasty) | 866 CE to 1138 CE | 14.4, 44.6 | 905, 1000, 1095 |
| 13 | Q187979 | Early Dynastic Period of Egypt (Wikipedia: Early Dynastic Period (Egypt)) | 3000 BCE to 2501 BCE | 30.4, 31.2 | -2925, -2750, -2575 |
| 14 | Q914898 | Kingdom of Khotan (Wikipedia: Kingdom of Khotan) | 888 CE to 1009 CE | 39.9, 78.5 | 920, 980 |
| 15 | Q2577303 | Kingdom of Sardinia (Wikipedia: Kingdom of Sardinia (1720-1861)) | 1721 CE to 1861 CE | 45.0, 7.5 | 1755, 1825 |

Reply now with only the JSON array.
