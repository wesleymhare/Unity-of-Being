# Batch 042 of 047: polities that lasted 100+ years

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
| 1 | Q1709337 | Emirate of Nekor (Wikipedia: Emirate of Nekor) | 750 CE to 1027 CE | 35.0, -3.5 | 790, 890, 985 |
| 2 | Q762943 | County of Holland (Wikipedia: County of Holland) | 1260 CE to 1362 CE | 52.2, 4.6 | 1285, 1335 |
| 3 | Q12491027 | Early Balinese Kingdoms (Wikipedia: Bali Kingdom) | 922 CE to 1343 CE | -8.4, 115.1 | 985, 1130, 1285 |
| 4 | Q328818 | Kingdom of Kent (Wikipedia: Kingdom of Kent) | 490 CE to 762 CE | 51.2, 0.8 | 530, 625, 720 |
| 5 | Q2195101 | Principality of Guria (Wikipedia: Principality of Guria) | 1468 CE to 1829 CE | 41.8, 42.0 | 1520, 1650, 1775 |
| 6 | Q1122980 | Comtat Venaissin (Wikipedia: Comtat Venaissin) | 1272 CE to 1790 CE | 44.1, 5.1 | 1350, 1530, 1710 |
| 7 | Q244796 | Achaean League (Wikipedia: Achaean League) | 279 BCE to 145 BCE | 38.2, 21.9 | -245, -180 |
| 8 | Q13522657 | County of Rosellón (Wikipedia: Roussillon) | 896 CE to 1176 CE | 42.7, 2.7 | 940, 1035, 1135 |
| 9 | Q584435 | Patani Kingdom (Wikipedia: Patani Kingdom) | 1572 CE to 1690 CE | 6.3, 101.5 | 1600, 1660 |
| 10 | Q1968654 | Beylik of Saruhan (Wikipedia: Sarukhanids) | 1314 CE to 1414 CE | 38.5, 27.8 | 1340, 1390 |
| 11 | Q1069690 | Chen (Wikipedia: Chen (state)) | 750 BCE to 451 BCE | 34.5, 114.2 | -705, -600, -495 |
| 12 | Q23148 | Cornwall (Wikipedia: Cornwall) | 710 CE to 946 CE | 50.5, -4.7 | 745, 830, 910 |
| 13 | Q1588434 | Nayaks of Thanjavur (Wikipedia: Thanjavur Nayak kingdom) | 1534 CE to 1676 CE | 10.7, 79.4 | 1570, 1640 |
| 14 | Q5769444 | Sultanate of Terengganu (Wikipedia: Sultan of Terengganu) | 1727 CE to 1904 CE | 5.2, 102.9 | 1755, 1815, 1875 |
| 15 | Q2723760 | Giudicato of Gallura (Wikipedia: Judicate of Gallura) | 866 CE to 1209 CE | 40.5, 9.5 | 915, 1040, 1160 |

Reply now with only the JSON array.
