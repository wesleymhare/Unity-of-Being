# Batch 013 of 047: polities that lasted 100+ years

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
| 1 | Q205662 | Tokugawa Shogunate (Wikipedia: Tokugawa shogunate) | 1600 CE to 1869 CE | 36.4, 138.9 | 1640, 1735, 1830 |
| 2 | Q577867 | Kingdom of Poland (Wikipedia: Kingdom of Poland) | 962 CE to 1138 CE | 52.4, 18.7 | 990, 1050, 1110 |
| 3 | Q28405 | Joseon (Wikipedia: Joseon) | 1395 CE to 1897 CE | 36.5, 127.9 | 1470, 1645, 1820 |
| 4 | Q189545 | Zengid dynasty (Wikipedia: Zengid dynasty) | 1139 CE to 1259 CE | 36.2, 41.4 | 1170, 1230 |
| 5 | Q48189 | Teutonic Order (Wikipedia: Teutonic Order) | 1236 CE to 1525 CE | 53.3, 19.2 | 1280, 1380, 1480 |
| 6 | Q14624218 | Western Chalukya Empire (Wikipedia: Western Chalukya Empire) | 980 CE to 1187 CE | 18.8, 76.6 | 1010, 1085, 1155 |
| 7 | Q2345840 | Sumerian City-States (Wikipedia: History of Sumer) | 3400 BCE to 2251 BCE | 30.9, 46.3 | -3230, -2825, -2425 |
| 8 | Q466803 | Late Pallava Empire (Wikipedia: Pallava dynasty) | 283 CE to 805 CE | 14.9, 79.2 | 360, 545, 725 |
| 9 | Q1045322 | Nanzhao (Wikipedia: Nanzhao) | 741 CE to 910 CE | 25.2, 100.0 | 765, 825, 885 |
| 10 | Q1483495 | Principality of Smolensk (Wikipedia: Principality of Smolensk) | 1056 CE to 1406 CE | 55.5, 32.5 | 1110, 1230, 1355 |
| 11 | Q160440 | Crimean Khanate (Wikipedia: Crimean Khanate) | 1450 CE to 1782 CE | 47.7, 34.2 | 1500, 1615, 1730 |
| 12 | Q449639 | Alodia (Wikipedia: Alodia) | 347 CE to 1506 CE | 16.8, 33.0 | 520, 925, 1330 |
| 13 | Q4461035 | Akkadian Empire (Wikipedia: Akkadian Empire) | 2300 BCE to 2101 BCE | 35.1, 42.7 | -2270, -2200, -2130 |
| 14 | Q654380 | Turk Shahis (Wikipedia: Kabul Shahi) | 561 CE to 874 CE | 34.1, 68.6 | 610, 720, 825 |
| 15 | Q867782 | Funan (Wikipedia: Funan) | 51 CE to 640 CE | 11.6, 105.6 | 140, 345, 550 |

Reply now with only the JSON array.
