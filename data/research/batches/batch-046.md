# Batch 046 of 047: polities that lasted 100+ years

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
| 1 | Q1051600 | Duchy of Naples (Wikipedia: Duchy of Naples) | 763 CE to 1138 CE | 40.8, 14.5 | 820, 950, 1080 |
| 2 | Q3037 | Kathmandu (Wikipedia: Kathmandu) | 1202 CE to 1761 CE | 27.8, 85.4 | 1285, 1480, 1675 |
| 3 | Q2919545 | Principality of Svaneti (Wikipedia: Principality of Svaneti) | 1721 CE to 1833 CE | 43.0, 42.7 | 1750, 1805 |
| 4 | Q1541779 | County of Osona (Wikipedia: County of Osona) | 990 CE to 1110 CE | 42.1, 2.5 | 1020, 1080 |
| 5 | Q2670895 | Taifa of Alpuente (Wikipedia: Taifa of Alpuente) | 1010 CE to 1110 CE | 40.2, -1.0 | 1035, 1085 |
| 6 | Q4401026 | Namayan (Wikipedia: Namayan) | 1202 CE to 1571 CE | 14.4, 121.1 | 1255, 1385, 1515 |
| 7 | Q12723 | County of Pallars Jussà (Wikipedia: Pallars Jussà) | 1040 CE to 1191 CE | 42.1, 0.9 | 1065, 1115, 1170 |
| 8 | Q201038 | Roman Kingdom (Wikipedia: Roman Kingdom) | 750 BCE to 481 BCE | 42.0, 12.3 | -710, -615, -520 |
| 9 | Q6151113 | Shunten Dynasty (Wikipedia: Shunten dynasty) | 1188 CE to 1313 CE | 26.6, 128.0 | 1220, 1280 |
| 10 | Q13695 | Tenochtitlan (Wikipedia: Tenochtitlan) | 1326 CE to 1428 CE | 19.2, -98.6 | 1350, 1400 |
| 11 | Q55521 | Chüzan (Wikipedia: Chūzan) | 1314 CE to 1428 CE | 26.3, 127.8 | 1340, 1400 |
| 12 | Q874954 | Principality of Theodoro (Wikipedia: Principality of Theodoro) | 1333 CE to 1474 CE | 44.6, 33.7 | 1370, 1440 |
| 13 | Q1408641 | Sultanate of Gowa (Wikipedia: Sultanate of Gowa) | 1512 CE to 1669 CE | -5.3, 119.4 | 1535, 1590, 1645 |
| 14 | Q3568009 | Wihtgar (Wikipedia: Wihtwara) | 523 CE to 691 CE | 50.7, -1.2 | 550, 605, 666 |
| 15 | Q770833 | Danish Gold Coast (Wikipedia: Danish Gold Coast) | 1659 CE to 1852 CE | 5.7, -0.1 | 1690, 1755, 1825 |

Reply now with only the JSON array.
