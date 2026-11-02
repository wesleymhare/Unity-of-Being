"""Societies batch 4: continuity for long-lived peoples (Iran, Anatolia, Egypt, Nubia)
and fill-in for thinner regions (Africa, the Andes, Siberia, the Pacific).

Defaults are lvl 3 (regional or local identity). Pass lvl=2 for a people.
"""
from societies_data import SOCIETIES, add, blob, box  # noqa: F401


def S(name, s, e, fam, kind, lang, wiki, poly, lvl=3, line=None, note='', clip=True):
    add(name, s, e, fam, kind, lang, wiki, poly, lvl=lvl, line=line, note=note, clip=clip)


def register():
    # The single long Persians entry becomes dated stages.
    SOCIETIES[:] = [e for e in SOCIETIES if e['name'] != 'Persians']

    # ---- Iran ----------------------------------------------------------------------
    S('Medes and early Persians', -1000, -331, 'IE', 'People', 'Old Persian, Median (Iranian)', 'Medes',
      [[44.0, 38.0], [50.0, 38.5], [55.0, 35.5], [55.0, 29.0], [51.0, 27.5], [48.0, 30.0], [46.0, 34.0]], lvl=2, line='iranian',
      note='Iranian-speaking peoples of the plateau whose kings built the Median and Achaemenid empires.')
    S('Hellenistic and Parthian Iranians', -330, 223, 'IE', 'People', 'Parthian, Greek, Aramaic', 'Parthian Empire',
      [[44.0, 39.0], [56.0, 38.0], [62.0, 36.0], [62.0, 28.0], [54.0, 26.0], [48.0, 29.0], [45.0, 34.0]], lvl=2, line='iranian',
      note='A feudal, horse-riding Iranian society under Greek-influenced kings, then the Arsacids.')
    S('Sasanian Persians (Zoroastrian Iran)', 224, 650, 'IE', 'People', 'Middle Persian', 'Sasanian Empire',
      [[44.0, 40.0], [56.0, 38.0], [64.0, 36.0], [64.0, 27.0], [54.0, 25.5], [48.0, 29.5], [44.5, 35.0]], lvl=2, line='iranian',
      note='A Zoroastrian state church, a priestly and landed aristocracy and a Middle Persian literature.')
    S('Islamic Persianate society', 651, 1500, 'IE', 'People', 'New Persian, Arabic, Turkic', 'Persianate society',
      [[44.0, 40.0], [56.0, 41.0], [67.0, 40.0], [70.0, 35.0], [66.0, 30.0], [60.0, 25.5], [52.0, 26.0], [48.0, 30.0], [44.0, 35.0]],
      lvl=2, line='iranian',
      note='Persian became the language of poetry, courts and administration across Iran, Central Asia and India, under Arab, then Turkic and Mongol rulers.')
    S('Persians and Iranians', 1501, 2024, 'IE', 'People', 'Persian (Farsi) and other Iranian languages', 'Iranians',
      [[44.1, 39.5], [48.0, 38.6], [54.0, 37.5], [61.0, 36.0], [61.5, 31.0], [63.0, 27.0], [57.0, 25.5], [52.0, 27.0], [48.5, 30.0], [46.0, 33.5]],
      lvl=2, line='iranian', note='Shi’a Iran since the Safavids, with a strong Persian national and literary identity.')

    # ---- Anatolia ------------------------------------------------------------------
    S('Byzantine Greeks of Anatolia', 330, 1070, 'IE', 'People', 'Medieval Greek', 'Byzantine Greeks',
      [[26.0, 41.2], [35.0, 42.0], [41.0, 40.8], [38.0, 36.5], [30.0, 36.3], [26.0, 38.0]], lvl=2, line='anatolia',
      note='The Greek-speaking Orthodox Christian society of the Roman Empire’s heartland.')
    S('Anatolian Greeks and Armenians under Turkish rule', 1071, 1922, 'IE', 'People', 'Greek, Armenian, Turkish', 'Rum Millet',
      [[26.0, 41.0], [35.0, 42.0], [44.0, 41.0], [44.0, 37.5], [36.0, 36.5], [27.0, 37.5]], lvl=3, line='anatolia',
      note='Orthodox Greek and Apostolic Armenian communities living under Seljuk and Ottoman rulers, ended by war and population exchange.')
    S('Pontic Greeks', -700, 1923, 'IE', 'People', 'Pontic Greek', 'Pontic Greeks', box(36.0, 40.5, 41.8, 41.5))
    S('Armenians of Anatolia', 1000, 1915, 'IE', 'People', 'Western Armenian', 'Armenians in the Ottoman Empire', box(36.0, 37.0, 44.0, 41.0))
    S('Laz and Black Sea peoples', 1000, 2024, 'IS', 'People', 'Laz (Kartvelian)', 'Laz people', box(40.0, 40.7, 42.0, 41.6))

    # ---- Egypt and Nubia --------------------------------------------------------------------
    S('Alexandrian Greeks and Hellenised Egyptians', -331, 639, 'IE', 'People', 'Greek, Demotic, Coptic', 'Ptolemaic Kingdom',
      blob(29.9, 31.0, 0.9, 0.6), line='egypt', note='A Greek and Egyptian city-and-country society that built Alexandria’s library.')
    S('Kushites (Napata and Meroë)', -1000, 349, 'NS', 'People', 'Meroitic (Nilo-Saharan)', 'Kingdom of Kush',
      [[30.0, 22.5], [34.0, 22.0], [35.0, 14.0], [32.0, 12.5], [30.0, 15.0]], lvl=2, line='nubia',
      note='Black pharaohs, ironworkers and pyramid builders of the middle Nile.')
    S('Christian Nubians (Makuria and Alodia)', 350, 1500, 'NS', 'People', 'Old Nubian', 'Makuria',
      [[30.5, 24.0], [33.5, 23.0], [34.0, 14.5], [31.0, 14.0], [30.0, 18.0]], lvl=2, line='nubia',
      note='A long-lived Christian society with Old Nubian literature, until Islamisation and Arab migration.')
    S('Nubians of the Nile', 1500, 2024, 'NS', 'People', 'Nobiin, Dongolawi (Nubian); Arabic', 'Nubians',
      [[31.5, 24.5], [33.5, 23.0], [34.0, 18.0], [31.5, 17.5]], lvl=3, line='nubia')
    S('Garamantes', -500, 700, 'AA', 'People', 'Libyan (Berber)', 'Garamantes', box(10.0, 24.0, 15.5, 27.8))

    # ---- Africa fill-in ------------------------------------------------------------------------
    S('Aksumites', -100, 940, 'AA', 'People', 'Geʽez (Ethiosemitic)', 'Kingdom of Aksum', box(36.5, 12.5, 40.5, 15.5), line='habesha',
      note='Traders of the Red Sea who became one of the first Christian kingdoms.')
    S('Mandinka', 1200, 2024, 'NC', 'People', 'Mandinka (Mandé)', 'Mandinka people', box(-14.0, 10.0, -5.0, 15.0))
    S('Fon and Dahomey', 1600, 2024, 'NC', 'People', 'Fon (Gbe)', 'Fon people', box(1.5, 6.2, 3.0, 8.8))
    S('Ovambo and Herero', 1500, 2024, 'NC', 'People', 'Oshiwambo, Otjiherero (Bantu)', 'Ovambo people', box(13.5, -22.5, 19.5, -17.0))
    S('Forest peoples of the Congo basin', -3400, 2024, 'NS', 'People', 'Bantu, Ubangian and Central Sudanic languages', 'Pygmy peoples', box(14.0, -3.5, 30.0, 4.0))

    # ---- Andes and South America ---------------------------------------------------------------
    S('Wari', 600, 1000, 'AD', 'Civilization', 'Quechua or Aymara (uncertain)', 'Wari Empire', box(-77.0, -16.0, -72.0, -9.5), line='andes')
    S('Aymara', 1100, 2024, 'AD', 'People', 'Aymara', 'Aymara people', box(-71.0, -19.0, -66.0, -14.0))
    S('Guaraní', 1000, 2024, 'AD', 'People', 'Guaraní (Tupian)', 'Guaraní people', box(-58.5, -28.0, -53.5, -22.0))
    S('Yanomami', 1000, 2024, 'AD', 'People', 'Yanomaman languages', 'Yanomami', box(-66.0, 0.5, -62.0, 4.5))
    S('Tehuelche and Patagonian peoples', -3000, 1900, 'AD', 'People', 'Tehuelche (Chonan)', 'Tehuelche people', box(-72.0, -52.5, -64.5, -40.0))
    S('Chileans', 1541, 2024, 'IE', 'People', 'Chilean Spanish', 'Chileans', box(-72.4, -42.0, -69.9, -29.5))

    # ---- Mesoamerica fill-in ---------------------------------------------------------------------
    S('Toltec', 900, 1150, 'MA', 'People', 'Nahuatl', 'Toltec', blob(-99.0, 20.2, 1.2, 0.8), line='nahua')
    S('Mixtec and Zapotec of Oaxaca', -500, 2024, 'MA', 'People', 'Mixtec, Zapotec (Oto-Manguean)', 'Mixtec', box(-98.5, 15.5, -95.5, 18.5))

    # ---- Siberia ------------------------------------------------------------------------------------
    S('Nenets', 1000, 2024, 'UR', 'People', 'Nenets (Samoyedic)', 'Nenets people', box(55.0, 66.0, 82.0, 72.5))
    S('Sibiryaks (Russian Siberians)', 1600, 2024, 'IE', 'People', 'Russian (Siberian dialects)', 'Siberian Russians', box(60.0, 52.0, 112.0, 62.0))
    S('Tuvans', 1200, 2024, 'TM', 'People', 'Tuvan (Turkic)', 'Tuvans', box(89.0, 49.5, 100.5, 53.8))

    # ---- Pacific -------------------------------------------------------------------------------------
    S('Tongans', -1000, 2024, 'AN', 'People', 'Tongan (Polynesian)', 'Tongans', blob(-175.2, -21.2, 0.5, 0.7), line='polynesia')
    S('Samoans', -1000, 2024, 'AN', 'People', 'Samoan (Polynesian)', 'Samoans', blob(-172.3, -13.7, 0.6, 0.3), line='polynesia')
    S('Society Islands and Marquesas', 700, 2024, 'AN', 'People', 'Tahitian, Marquesan (Polynesian)', 'Tahitians',
      [blob(-149.5, -17.6, 0.9, 0.5), blob(-139.5, -9.0, 0.5, 0.4)], line='polynesia')
    S('Chamorro', -1500, 2024, 'AN', 'People', 'Chamorro (Austronesian)', 'Chamorros', blob(144.8, 13.5, 0.3, 0.4))
    S('Highlands peoples of New Guinea', -3400, 2024, 'PA', 'People', 'Trans-New Guinea languages', 'Papua New Guinean Highlanders', box(142.0, -7.0, 146.5, -5.0))

    # ---- California (a people-level identity between the nation and SoCal) -------------------
    S('Californians', 1850, 2024, 'IE', 'People', 'English, Spanish and many others', 'Californians', box(-124.6, 32.4, -114.1, 42.1), lvl=2,
      note='A state-sized identity of migrants, coasts, mountains and deserts that sits between the nation and places like Southern California.')
