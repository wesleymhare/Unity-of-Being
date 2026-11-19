# Batch 030 of 047: polities that lasted 100+ years

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
| 1 | Q211 | Republic of Latvia (Wikipedia: Latvia) | 1920 CE to 2026 CE | 56.7, 26.7 | 1939, 2000 |
| 2 | Q1411866 | Najahid Dynasty (Wikipedia: Najahid dynasty) | 1066 CE to 1168 CE | 14.5, 44.6 | 1090, 1140 |
| 3 | Q28428 | Baekje (Wikipedia: Baekje) | 347 CE to 660 CE | 36.2, 127.2 | 395, 505, 615 |
| 4 | Q4899891 | Beylik of Tunis (Wikipedia: Beylik of Tunis) | 1706 CE to 1884 CE | 35.3, 9.6 | 1735, 1795, 1855 |
| 5 | Q104815700 | Thracian Kingdom (Wikipedia: Thracian kingdom) | 87 BCE to 50 CE | 42.8, 25.9 | -55, 15 |
| 6 | Q311341 | Bahrani Dynasty (Wikipedia: Al-Ahsa Oasis) | 1260 CE to 1520 CE | 25.2, 51.2 | 1300, 1390, 1480 |
| 7 | Q783 | Honduras (Wikipedia: Honduras) | 1840 CE to 2026 CE | 14.8, -87.1 | 1870, 1935, 2000 |
| 8 | Q1311990 | Principality of Serbia (Wikipedia: Principality of Serbia) | 768 CE to 961 CE | 43.2, 19.4 | 795, 865, 925 |
| 9 | Q105946539 | Dongye (Wikipedia: Dongye) | 91 BCE to 391 CE | 37.7, 128.2 | -20, 150, 320 |
| 10 | Q9326 | Vientiane (Wikipedia: Vientiane) | 1709 CE to 1827 CE | 17.2, 104.4 | 1740, 1800 |
| 11 | Q2301908 | Nguyễn lords (Wikipedia: Nguyễn lords) | 1572 CE to 1775 CE | 14.2, 108.3 | 1600, 1675, 1745 |
| 12 | Q774 | Guatemala (Wikipedia: Guatemala) | 1840 CE to 2026 CE | 15.2, -89.7 | 1870, 1935, 2000 |
| 13 | Q870517 | Odrysian Kingdom (Wikipedia: Odrysian kingdom) | 450 BCE to 338 BCE | 42.5, 25.9 | -420, -365 |
| 14 | Q237234 | Kingdom of Osroene (Wikipedia: Osroene) | 63 BCE to 214 CE | 36.7, 39.2 | -20, 75, 170 |
| 15 | Q582948 | Norse Greenland (Wikipedia: Norse colonization of North America) | 1072 CE to 1271 CE | 64.4, -50.5 | 1100, 1170, 1240 |

Reply now with only the JSON array.
