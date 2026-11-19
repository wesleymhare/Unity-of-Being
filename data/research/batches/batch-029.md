# Batch 029 of 047: polities that lasted 100+ years

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
| 1 | Q1469100 | Beylik of Karaman (Wikipedia: Karamanids) | 1305 CE to 1467 CE | 37.0, 32.9 | 1330, 1385, 1445 |
| 2 | Q844910 | Pandya Dynasty (Wikipedia: Pandya dynasty) | 592 CE to 921 CE | 9.8, 77.4 | 640, 755, 870 |
| 3 | Q2622868 | Bagratid Armenia (Wikipedia: Bagratid Armenia) | 886 CE to 1045 CE | 39.3, 43.8 | 910, 965, 1020 |
| 4 | Q335088 | Armenian Kingdom of Cilicia (Wikipedia: Armenian Kingdom of Cilicia) | 1099 CE to 1374 CE | 38.0, 35.7 | 1140, 1235, 1335 |
| 5 | Q1514510 | County of Urgell (Wikipedia: County of Urgell) | 870 CE to 1808 CE | 42.2, 1.6 | 1010, 1340, 1665 |
| 6 | Q1334322 | County of Toulouse (Wikipedia: County of Toulouse) | 990 CE to 1249 CE | 43.7, 1.4 | 1030, 1120, 1210 |
| 7 | Q811 | Republic of Nicaragua (Wikipedia: Nicaragua) | 1840 CE to 2026 CE | 12.6, -85.1 | 1870, 1935, 2000 |
| 8 | Q671362 | Principality of Turov and Pinsk (Wikipedia: Principality of Turov) | 1188 CE to 1325 CE | 52.3, 26.8 | 1220, 1294 |
| 9 | Q173065 | Kingdom of Naples (Wikipedia: Kingdom of Naples) | 1285 CE to 1501 CE | 40.7, 15.7 | 1315, 1395, 1470 |
| 10 | Q2345840 | Sumerian City-States (Wikipedia: History of Sumer) | 2100 BCE to 1761 BCE | 30.7, 46.3 | -2050, -1930, -1810 |
| 11 | Q844910 | Pandya Empire (Wikipedia: Pandya Empire) | 1216 CE to 1325 CE | 9.7, 77.8 | 1245, 1300 |
| 12 | Q276841 | Taifa of Badajoz (Wikipedia: Taifa of Badajoz) | 1010 CE to 1151 CE | 39.6, -7.7 | 1045, 1093 |
| 13 | Q734867 | Sultanate of Banten (Wikipedia: Banten Sultanate) | 1529 CE to 1808 CE | -6.5, 105.8 | 1570, 1670, 1765 |
| 14 | Q1241847 | Giudicato of Arborea (Wikipedia: Judicate of Arborea) | 866 CE to 1421 CE | 39.9, 8.8 | 950, 1145, 1340 |
| 15 | Q7462 | Song (Wikipedia: Song (state)) | 750 BCE to 285 BCE | 35.0, 115.6 | -680, -520, -355 |

Reply now with only the JSON array.
