# Batch 014 of 047: polities that lasted 100+ years

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
| 1 | Q27306 | Kingdom of Prussia (Wikipedia: Kingdom of Prussia) | 1702 CE to 1863 CE | 53.4, 15.2 | 1725, 1780, 1840 |
| 2 | Q215643 | Indo-Greeks (Wikipedia: Indo-Greek Kingdom) | 126 BCE to 13 CE | 31.5, 71.5 | -90, -20 |
| 3 | Q193292 | Heian Japan (Wikipedia: Heian period) | 793 CE to 1187 CE | 36.6, 139.4 | 850, 990, 1130 |
| 4 | Q651377 | Shunga Empire (Wikipedia: Shunga Empire) | 170 BCE to 67 BCE | 27.9, 81.0 | -145, -95 |
| 5 | Q696241 | Khanate of Kokand (Wikipedia: Khanate of Kokand) | 1709 CE to 1876 CE | 40.9, 72.3 | 1735, 1790, 1850 |
| 6 | Q853477 | Lan Xang (Wikipedia: Lan Xang) | 1363 CE to 1708 CE | 16.1, 104.9 | 1415, 1535, 1655 |
| 7 | Q204920 | Crown of Aragon (Wikipedia: Crown of Aragon) | 1169 CE to 1515 CE | 41.7, -0.4 | 1220, 1340, 1465 |
| 8 | Q128938 | Shang Dynasty (Wikipedia: Shang dynasty) | 1600 BCE to 1001 BCE | 36.5, 115.4 | -1510, -1300, -1090 |
| 9 | Q167639 | Vijayanagara Empire (Wikipedia: Vijayanagara Empire) | 1344 CE to 1571 CE | 10.2, 77.7 | 1380, 1460, 1535 |
| 10 | Q26472 | Kingdom of Dali (Wikipedia: Dali Kingdom) | 947 CE to 1259 CE | 24.4, 101.1 | 995, 1105, 1210 |
| 11 | Q42585 | Kingdom of Bohemia (Wikipedia: Kingdom of Bohemia) | 1202 CE to 1528 CE | 49.9, 14.7 | 1250, 1365, 1480 |
| 12 | Q146862 | Emirate of Nejd (Wikipedia: Emirate of Nejd) | 1824 CE to 1925 CE | 24.9, 46.0 | 1850, 1905 |
| 13 | Q1322662 | Principality of Chernigov (Wikipedia: Principality of Chernigov) | 1056 CE to 1240 CE | 53.2, 37.2 | 1085, 1150, 1210 |
| 14 | Q4948 | Republic of Venice (Wikipedia: Republic of Venice) | 705 CE to 1796 CE | 45.6, 12.3 | 870, 1250, 1630 |
| 15 | Q47261 | Duchy of Bavaria (Wikipedia: Duchy of Bavaria) | 1260 CE to 1805 CE | 47.9, 11.6 | 1352, 1530, 1725 |

Reply now with only the JSON array.
