# Batch 026 of 047: polities that lasted 100+ years

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
| 1 | Q1406298 | Serbian Empire (Wikipedia: Serbian Empire) | 1352 CE to 1458 CE | 41.5, 21.1 | 1380, 1430 |
| 2 | Q2572901 | Kalabhra Dynasty (Wikipedia: Kalabhra dynasty) | 353 CE to 601 CE | 10.2, 77.8 | 390, 475, 565 |
| 3 | Q157367 | Brandenburg-Prussia (Wikipedia: Brandenburg-Prussia) | 1619 CE to 1720 CE | 52.9, 13.7 | 1645, 1695 |
| 4 | Q555994 | Lu (Wikipedia: Lu (state)) | 750 BCE to 248 BCE | 35.6, 118.9 | -675, -500, -325 |
| 5 | Q2500952 | Ava Kingdom (Wikipedia: Kingdom of Ava) | 1375 CE to 1528 CE | 21.9, 96.0 | 1400, 1450, 1505 |
| 6 | Q2039087 | Chandela Kingdom (Wikipedia: Chandelas of Jejakabhukti) | 960 CE to 1313 CE | 24.8, 80.2 | 1015, 1135, 1260 |
| 7 | Q842 | Sultanate of Oman (Wikipedia: Oman) | 1744 CE to 1899 CE | 23.0, 57.5 | 1765, 1820, 1875 |
| 8 | Q174306 | Republic of Genoa (Wikipedia: Republic of Genoa) | 1010 CE to 1795 CE | 44.5, 9.5 | 1130, 1400, 1675 |
| 9 | Q190165 | Kingdom of Luang Phrabang (Wikipedia: Luang Prabang) | 1709 CE to 1894 CE | 21.0, 103.2 | 1735, 1800, 1865 |
| 10 | Q157070 | County of Flanders (Wikipedia: County of Flanders) | 990 CE to 1384 CE | 50.7, 2.9 | 1050, 1185, 1325 |
| 11 | Q1884830 | Mahdids (Wikipedia: Mahdids) | 1169 CE to 1506 CE | 23.0, 57.5 | 1220, 1340, 1455 |
| 12 | Q41642 | Phoenicia (Wikipedia: Phoenicia) | 1150 BCE to 501 BCE | 34.1, 35.9 | -1055, -825, -600 |
| 13 | Q588672 | Hammadid Dynasty (Wikipedia: Hammadid dynasty) | 1018 CE to 1151 CE | 35.7, 3.5 | 1050, 1120 |
| 14 | Q421372 | Mahan (Wikipedia: Mahan) | 91 BCE to 346 CE | 36.2, 127.2 | -25, 130, 280 |
| 15 | Q2162698 | Duchy of Bohemia (Wikipedia: Duchy of Bohemia) | 896 CE to 1002 CE | 49.8, 14.2 | 920, 975 |

Reply now with only the JSON array.
