# Batch 004 of 047: polities that lasted 100+ years

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
| 1 | Q408 | Commonwealth of Australia (Wikipedia: Australia) | 1905 CE to 2026 CE | -23.1, 132.2 | 1935, 1995 |
| 2 | Q155361 | Rouran Khaganate (Wikipedia: Rouran Khaganate) | 402 CE to 554 CE | 45.0, 108.7 | 425, 480, 530 |
| 3 | Q1471995 | Qin (Wikipedia: Qin (state)) | 750 BCE to 219 BCE | 35.4, 109.8 | -670, -485, -300 |
| 4 | Q146246 | Kingdom of the Franks (Wikipedia: Francia) | 462 CE to 849 CE | 49.8, 5.0 | 520, 655, 790 |
| 5 | Q207162 | Kingdom of France (Wikipedia: Kingdom of France) | 990 CE to 1847 CE | 47.9, 2.6 | 1120, 1420, 1720 |
| 6 | Q201705 | Khmer Empire (Wikipedia: Khmer Empire) | 800 CE to 1867 CE | 13.5, 103.7 | 960, 1335, 1705 |
| 7 | Q187985 | Tibetans (Wikipedia: Tibetan people) | 850 CE to 1259 CE | 32.9, 88.8 | 910, 1055, 1200 |
| 8 | Q705904 | Seleucid Empire (Wikipedia: Seleucid dynasty) | 318 BCE to 64 BCE | 31.8, 46.4 | -280, -190, -100 |
| 9 | Q3708094 | Great Seljuk Empire (Wikipedia: Seljuk Empire) | 1040 CE to 1201 CE | 35.6, 59.4 | 1065, 1120, 1175 |
| 10 | Q215443 | Swedish Empire (Wikipedia: Swedish Empire) | 1612 CE to 1814 CE | 66.0, 18.7 | 1640, 1715, 1785 |
| 11 | Q484195 | Timurid Empire (Wikipedia: Timurid Empire) | 1375 CE to 1506 CE | 38.4, 70.8 | 1410, 1475 |
| 12 | Q1923401 | Dzungar Khanate (Wikipedia: Dzungar Khanate) | 1609 CE to 1756 CE | 44.9, 85.5 | 1618, 1720 |
| 13 | Q42534 | Indus Valley Civilization (Wikipedia: Indus Valley Civilisation) | 2700 BCE to 1701 BCE | 29.3, 76.1 | -2550, -2200, -1850 |
| 14 | Q12844800 | Ghaznavid Empire (Wikipedia: Ghaznavids) | 962 CE to 1191 CE | 33.3, 67.5 | 995, 1075, 1155 |
| 15 | Q7352 | Western Jin (Wikipedia: Jin dynasty (266-420)) | 265 CE to 425 CE | 27.9, 105.1 | 290, 345, 400 |

Reply now with only the JSON array.
