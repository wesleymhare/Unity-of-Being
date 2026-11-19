# Batch 018 of 047: polities that lasted 100+ years

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
| 1 | Q909583 | Norse (Wikipedia: Norse) | 161 CE to 499 CE | 55.3, 10.4 | 210, 330, 450 |
| 2 | Q170072 | Dutch Republic (Wikipedia: Dutch Republic) | 1582 CE to 1795 CE | 52.4, 5.7 | 1615, 1690, 1765 |
| 3 | Q230791 | Kingdom of Scotland (Wikipedia: Kingdom of Scotland) | 1294 CE to 1608 CE | 56.7, -4.1 | 1340, 1450, 1560 |
| 4 | Q1177379 | Minaeans (Wikipedia: Minaeans) | 383 BCE to 26 BCE | 16.9, 43.3 | -330, -205, -80 |
| 5 | Q466433 | Karkota Dynasty (Wikipedia: Karkota dynasty) | 592 CE to 859 CE | 36.7, 70.5 | 630, 725, 820 |
| 6 | Q1474791 | Sultanate of Darfur (Wikipedia: Sultanate of Darfur) | 1609 CE to 1876 CE | 13.6, 25.1 | 1650, 1740, 1835 |
| 7 | Q18211496 | Chaulukya Dynasty (Wikipedia: Chaulukya dynasty) | 947 CE to 1249 CE | 23.5, 71.9 | 990, 1100, 1205 |
| 8 | Q309272 | Mauretania (Wikipedia: Mauretania) | 212 BCE to 42 CE | 34.3, -5.3 | -175, -85, 5 |
| 9 | Q83821 | Bijapur Sultanate (Wikipedia: Adil Shahi dynasty) | 1492 CE to 1686 CE | 17.3, 74.6 | 1520, 1590, 1655 |
| 10 | Q1132786 | Wadai Empire (Wikipedia: Wadai Empire) | 1636 CE to 1910 CE | 13.0, 20.2 | 1675, 1775, 1870 |
| 11 | Q2365048 | Adal Sultanate (Wikipedia: Adal Sultanate) | 1415 CE to 1578 CE | 10.2, 42.1 | 1440, 1495, 1555 |
| 12 | Q274488 | Wu (Wikipedia: Wu (state)) | 750 BCE to 451 BCE | 31.5, 119.5 | -705, -600, -495 |
| 13 | Q6201794 | Jin (Wikipedia: Jin (Chinese state)) | 750 BCE to 405 BCE | 36.6, 113.4 | -700, -580, -455 |
| 14 | Q172579 | Kingdom of Italy (Wikipedia: Kingdom of Italy) | 587 CE to 774 CE | 45.4, 8.4 | 615, 680, 745 |
| 15 | Q154667 | Kingdom of Georgia (Wikipedia: Kingdom of Georgia) | 1010 CE to 1240 CE | 42.4, 42.6 | 1045, 1125, 1205 |

Reply now with only the JSON array.
