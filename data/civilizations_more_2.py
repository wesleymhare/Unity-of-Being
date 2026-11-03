"""Civilizations batch 2: Europe, the Caucasus and steppe, Iran and Central Asia,
South Asia, East and Southeast Asia. Stages in time and local identities.

Defaults here are lvl 3 (regional or local identity). Pass lvl=2 for a people.
"""
from civilizations_data import add, blob, box  # noqa: F401


def S(name, s, e, fam, kind, lang, wiki, poly, lvl=3, line=None, note='', clip=True):
    add(name, s, e, fam, kind, lang, wiki, poly, lvl=lvl, line=line, note=note, clip=clip)


def register():
    # ---- Britain and Ireland ----------------------------------------------------
    S('Romano-Britons', 43, 449, 'IE', 'People', 'Latin and Brythonic', 'Romano-British culture',
      [[-5.5, 50.0], [-3.0, 55.0], [0.5, 54.5], [1.7, 52.5], [1.3, 50.8]], line='england',
      note='Roman-style towns and villas over a Celtic-speaking countryside, south of Hadrian’s Wall.')
    S('Anglo-Saxons and Danelaw', 450, 1065, 'IE', 'People', 'Old English, Old Norse', 'Anglo-Saxons',
      [[-5.0, 50.0], [-2.0, 55.5], [0.5, 54.5], [1.7, 52.5], [1.3, 50.8]], line='england',
      note='Germanic settlers who made England; the Danelaw added Norse speakers in the north-east.')
    S('Anglo-Norman England', 1066, 1349, 'IE', 'People', 'Middle English, Anglo-Norman French', 'Anglo-Norman language',
      [[-5.5, 50.0], [-2.0, 55.8], [0.5, 54.5], [1.7, 52.5], [1.3, 50.8]], line='england',
      note='A French-speaking ruling class over an English-speaking people, until the two merged.')
    S('Welsh', 450, 2024, 'IE', 'People', 'Brittonic (Welsh)', 'Welsh people', box(-5.3, 51.4, -2.7, 53.4), line='welsh')
    S('Cornish', 450, 2024, 'IE', 'People', 'Brittonic (Cornish, revived)', 'Cornish people', box(-5.7, 49.95, -4.2, 50.9))
    S('Irish', 450, 2024, 'IE', 'People', 'Goidelic (Irish)', 'Irish people', box(-10.5, 51.4, -6.0, 55.4), line='irish')
    S('Scottish Highlanders and Gaels', 450, 2024, 'IE', 'People', 'Goidelic (Scottish Gaelic)', 'Scottish Gaelic', box(-7.5, 56.0, -3.0, 58.7))
    S('Lowland Scots', 1100, 2024, 'IE', 'People', 'Scots (Germanic)', 'Scots people', box(-5.2, 54.9, -1.8, 56.3))
    S('Ulster Scots and Ulster Irish', 1610, 2024, 'IE', 'People', 'English, Ulster Scots, Irish', 'Ulster Scots people', box(-8.2, 54.0, -5.4, 55.3))

    # ---- France, Low Countries, Germany, Alps -----------------------------------
    S('Normans', 911, 1204, 'IE', 'People', 'Norman French', 'Normans', box(-1.8, 48.6, 1.8, 50.0), line='normans',
      note='Norse settlers who became French-speaking Normans and conquered England, Sicily and southern Italy.')
    S('Bretons', 450, 2024, 'IE', 'People', 'Brittonic (Breton)', 'Bretons', box(-5.2, 47.3, -1.9, 48.8))
    S('Alsatians and Lorrainers', 900, 2024, 'IE', 'People', 'Alsatian (Alemannic), French', 'Alsace', box(6.2, 47.5, 8.3, 49.2))
    S('Corsicans', 1100, 2024, 'IE', 'People', 'Corsican (Italo-Romance)', 'Corsicans', blob(9.1, 42.15, 0.35, 0.85))
    S('Franks and Gallo-Romans', 476, 899, 'IE', 'People', 'Old French, Frankish, Latin', 'Franks',
      [[-1.8, 47.0], [2.0, 51.0], [8.0, 50.8], [7.5, 47.5], [3.0, 44.5]], line='france',
      note='The merged Frankish and Gallo-Roman civilization that became France and western Germany.')
    S('Dutch and Flemings', 1000, 2024, 'IE', 'People', 'Dutch (Germanic)', 'Dutch people', box(2.8, 50.6, 7.2, 53.6), lvl=2)
    S('Frisians', -500, 2024, 'IE', 'People', 'Frisian (Germanic)', 'Frisians', box(4.5, 52.8, 8.9, 53.8))
    S('Swiss', 1291, 2024, 'IE', 'People', 'Alemannic German, French, Italian, Romansh', 'Swiss people', box(6.0, 45.9, 10.4, 47.7))
    S('Bavarians and Austrians', 550, 2024, 'IE', 'People', 'Bavarian (Germanic)', 'Bavarians', box(10.2, 46.8, 17.0, 49.5), lvl=3)
    S('Alemanni and Swabians', 250, 2024, 'IE', 'People', 'Alemannic (Germanic)', 'Alemannic Germans', box(7.5, 46.9, 10.2, 49.2))
    S('Ashkenazi Jews', 1000, 1944, 'AA', 'People', 'Yiddish (Germanic) with Hebrew', 'Ashkenazi Jews',
      [[5.0, 47.5], [14.0, 53.5], [24.0, 56.0], [33.0, 52.5], [32.0, 47.0], [22.0, 47.0], [12.0, 47.5]],
      note='Jewish communities of the Rhineland and later of Poland-Lithuania and Ukraine, with a rich Yiddish culture largely destroyed by the Holocaust.')
    S('Romani people', 1100, 2024, 'IS', 'People', 'Romani (Indo-Aryan)', 'Romani people',
      [[20.0, 42.0], [28.0, 44.0], [29.0, 48.0], [21.0, 47.0]], note='Descendants of medieval migrants from India, scattered across Europe.')

    # ---- Iberia -------------------------------------------------------------
    S('Hispano-Romans and Visigoths', 409, 710, 'IE', 'People', 'Latin, Gothic', 'Visigothic Kingdom', box(-9.3, 36.0, 3.2, 43.7), line='iberia-medieval')
    S('Andalusis (Muslim Iberia)', 711, 1491, 'AA', 'People', 'Andalusi Arabic, Mozarabic, Berber', 'Al-Andalus',
      [[-9.0, 37.0], [-5.0, 41.0], [0.5, 41.0], [0.3, 38.5], [-2.0, 36.7], [-7.5, 36.8]], line='iberia-medieval',
      note='Arabic-speaking Muslim, Christian and Jewish civilization of the south and centre of the peninsula.')
    S('Castilians', 900, 2024, 'IE', 'People', 'Castilian Spanish', 'Castilians', box(-6.8, 38.5, -1.5, 43.2))
    S('Catalans and Valencians', 800, 2024, 'IE', 'People', 'Catalan', 'Catalans', [[0.2, 42.6], [3.3, 42.5], [0.2, 38.7], [-0.5, 39.0], [0.0, 40.8]])
    S('Galicians and Portuguese', 600, 2024, 'IE', 'People', 'Galician-Portuguese', 'Galicians', box(-9.5, 36.9, -6.2, 43.8))
    S('Andalusians', 1492, 2024, 'IE', 'People', 'Andalusian Spanish', 'Andalusians', box(-7.4, 36.0, -1.7, 38.7))

    # ---- Italy and Mediterranean islands ----------------------------------------------
    S('Nuragic Sardinians', -1800, -238, 'IS', 'People', 'Paleo-Sardinian (unknown)', 'Nuragic civilization', blob(9.0, 40.0, 0.7, 1.1), line='sardinia')
    S('Sardinians', -237, 2024, 'IE', 'People', 'Sardinian (Romance)', 'Sardinians', blob(9.0, 40.0, 0.7, 1.1), line='sardinia')
    S('Venetians', 700, 2024, 'IE', 'People', 'Venetian (Romance)', 'Venetian people', box(11.4, 45.0, 13.6, 46.6))
    S('Tuscans', 1000, 2024, 'IE', 'People', 'Tuscan (Romance)', 'Tuscans', box(9.8, 42.4, 12.4, 44.3))
    S('Lombards and Piedmontese', 568, 2024, 'IE', 'People', 'Lombard, Piedmontese (Romance)', 'Lombards', box(6.8, 44.4, 10.6, 46.0))
    S('Neapolitans and southern Italians', 1000, 2024, 'IE', 'People', 'Neapolitan (Romance)', 'Neapolitans', [[13.5, 41.8], [16.5, 41.6], [18.4, 40.4], [16.0, 38.0], [14.0, 40.0]])
    S('Maltese', 1090, 2024, 'AA', 'People', 'Maltese (Arabic-derived Semitic)', 'Maltese people', blob(14.4, 35.9, 0.25, 0.15),
      note='A Semitic language written in Latin letters, in a Catholic, Mediterranean civilization.')
    S('Greeks of Magna Graecia and Anatolia', -800, -100, 'IE', 'People', 'Greek', 'Magna Graecia',
      [box(14.8, 37.8, 18.0, 40.8), box(26.0, 36.5, 28.5, 40.5)], line='greek-colonies')

    # ---- Balkans, Romania, Ukraine -------------------------------------------------
    S('Dacians', -500, 105, 'IE', 'People', 'Dacian (Indo-European)', 'Dacians', box(21.0, 44.0, 29.0, 48.0), line='romanian')
    S('Daco-Romans and Vlachs', 106, 599, 'IE', 'People', 'Latin', 'Daco-Roman', box(21.0, 43.5, 28.5, 47.5), line='romanian')
    S('Romanians', 600, 2024, 'IE', 'People', 'Romanian (Eastern Romance)', 'Romanians', box(20.8, 43.6, 29.7, 48.3), lvl=2, line='romanian')
    S('Bulgarians', 681, 2024, 'IE', 'People', 'Bulgarian (South Slavic)', 'Bulgarians', box(22.4, 41.2, 28.6, 44.2))
    S('Serbs', 800, 2024, 'IE', 'People', 'Serbian (South Slavic)', 'Serbs', box(18.8, 42.5, 22.6, 45.8))
    S('Croats', 800, 2024, 'IE', 'People', 'Croatian (South Slavic)', 'Croats', box(13.5, 42.4, 19.4, 46.4))
    S('Bosniaks', 1300, 2024, 'IE', 'People', 'Bosnian (South Slavic)', 'Bosniaks', box(16.5, 43.0, 19.6, 45.2))
    S('Poles', 960, 2024, 'IE', 'People', 'Polish (West Slavic)', 'Poles', box(14.2, 49.0, 24.2, 54.6), lvl=2, line='poles')
    S('Czechs', 870, 2024, 'IE', 'People', 'Czech (West Slavic)', 'Czechs', box(12.1, 48.6, 18.9, 51.0))
    S('Ukrainians', 1000, 2024, 'IE', 'People', 'Ukrainian (East Slavic)', 'Ukrainians', box(22.5, 44.4, 40.0, 52.4), lvl=2, line='ukrainian')
    S('Belarusians', 1000, 2024, 'IE', 'People', 'Belarusian (East Slavic)', 'Belarusians', box(23.2, 51.3, 32.8, 56.2))
    S('Cossacks', 1500, 1920, 'IE', 'People', 'Ukrainian, Russian', 'Cossacks',
      [[30.0, 46.5], [38.0, 50.0], [46.0, 51.0], [46.0, 44.0], [38.0, 44.5]], note='Free frontier communities of the steppe turned into military hosts.')
    S('Crimean Tatars', 1250, 2024, 'TM', 'People', 'Crimean Tatar (Turkic)', 'Crimean Tatars', box(32.5, 44.4, 36.6, 46.2))
    S('Volga Tatars', 1000, 2024, 'TM', 'People', 'Tatar (Turkic)', 'Volga Tatars', box(47.0, 53.5, 56.0, 56.5))

    # ---- Scandinavia -----------------------------------------------------------
    S('Norse of the Viking Age', 793, 1066, 'IE', 'People', 'Old Norse', 'Vikings', [
        [[4.5, 58.0], [10.5, 65.0], [18.0, 63.0], [16.0, 56.0], [8.0, 55.2]],
        [[-5.0, 55.0], [0.5, 54.5], [-0.5, 52.0], [-3.0, 53.0]],
        [[-24.0, 63.3], [-13.0, 66.5], [-13.0, 63.4]],
        [[-6.5, 53.0], [-6.0, 54.0], [-5.8, 53.0]],
    ], line='norse', note='Seafarers who raided, traded and settled from Dublin and Normandy to Iceland, Greenland and the Dnieper.')
    S('Norwegians', 800, 2024, 'IE', 'People', 'Norwegian (North Germanic)', 'Norwegians', box(4.5, 58.0, 12.0, 70.0))
    S('Swedes', 800, 2024, 'IE', 'People', 'Swedish (North Germanic)', 'Swedes', box(11.5, 55.5, 19.0, 66.0))
    S('Danes', 800, 2024, 'IE', 'People', 'Danish (North Germanic)', 'Danes', box(8.0, 54.7, 12.8, 57.7))

    # ---- Caucasus ----------------------------------------------------------------
    S('Circassians (Adyghe)', -500, 2024, 'IS', 'People', 'Northwest Caucasian', 'Circassians', box(37.0, 43.5, 41.5, 45.0))
    S('Chechens and Nakh peoples', -500, 2024, 'IS', 'People', 'Northeast Caucasian (Nakh)', 'Chechens', box(44.5, 42.4, 46.5, 43.8))
    S('Dagestani peoples', -500, 2024, 'IS', 'People', 'Northeast Caucasian (Avar, Lezgin, Dargin)', 'Peoples of Dagestan', box(45.5, 41.0, 48.5, 43.2))
    S('Ossetians and Alans', -200, 2024, 'IE', 'People', 'Ossetic (Iranian)', 'Ossetians', box(43.0, 42.3, 45.2, 43.2),
      note='Descendants of the Alans, Iranian steppe nomads, in the central Caucasus.')

    # ---- Iran and Central Asia -----------------------------------------------------
    S('Bactrians', -1000, 700, 'IE', 'People', 'Bactrian (Eastern Iranian)', 'Bactria', box(62.0, 35.0, 70.0, 38.8), line='bactria')
    S('Khwarazmians', -600, 1500, 'IE', 'People', 'Khwarezmian (Eastern Iranian)', 'Khwarazmian dynasty', box(58.0, 40.0, 62.5, 43.5))
    S('Tocharians', -2000, 799, 'IE', 'People', 'Tocharian (Indo-European)', 'Tocharians', box(76.0, 36.5, 90.0, 42.0), line='tarim',
      note='Indo-European speakers of the Tarim Basin, with Buddhist oasis towns and manuscripts.')
    S('Uyghurs', 800, 2024, 'TM', 'People', 'Uyghur (Turkic)', 'Uyghurs', box(74.0, 36.0, 90.0, 44.5), line='tarim',
      note='Turkic Muslims of the Tarim Basin and Turpan, heirs to the oasis cities of the Silk Road.')
    S('Kazakhs', 1465, 2024, 'TM', 'People', 'Kazakh (Turkic)', 'Kazakhs', box(50.0, 41.0, 87.0, 54.0), lvl=2)
    S('Uzbeks', 1500, 2024, 'TM', 'People', 'Uzbek (Turkic)', 'Uzbeks', box(56.0, 37.5, 73.0, 45.5))
    S('Turkmen', 1000, 2024, 'TM', 'People', 'Turkmen (Turkic)', 'Turkmens', box(53.0, 35.8, 66.0, 42.5))
    S('Kyrgyz', 1000, 2024, 'TM', 'People', 'Kyrgyz (Turkic)', 'Kyrgyz people', box(70.0, 39.0, 80.5, 43.5))
    S('Baloch', 1000, 2024, 'IE', 'People', 'Balochi (Iranian)', 'Baloch people', box(57.5, 25.0, 68.5, 30.5))
    S('Lurs and Bakhtiari', 500, 2024, 'IE', 'People', 'Luri (Iranian)', 'Lurs', box(47.0, 31.0, 51.5, 34.5))
    S('Hazaras', 1200, 2024, 'IE', 'People', 'Hazaragi (Persian dialect)', 'Hazaras', box(64.5, 33.0, 68.8, 35.3))
    S('Parsis', 900, 2024, 'IE', 'People', 'Gujarati; Zoroastrian faith', 'Parsis', blob(72.9, 20.2, 0.9, 1.6),
      note='Zoroastrian emigrants from Persia who settled on the Gujarat and Mumbai coast.')

    # ---- South Asia ----------------------------------------------------------------
    S('Vedic peoples', -1500, -501, 'IE', 'People', 'Vedic Sanskrit', 'Vedic period', box(70.0, 27.0, 83.0, 33.5), lvl=2, line='indo-aryan',
      note='Early Indo-Aryan speakers of the Punjab and upper Gangetic plain whose hymns became the Vedas.')
    S('Gangetic Buddhist-Hindu civilization', -500, 299, 'IE', 'Civilization', 'Sanskrit, Prakrits, Pali', 'History of India',
      box(78.0, 23.5, 88.5, 28.5), lvl=2, line='indo-aryan',
      note='The age of the Buddha, the Mauryas and the great epics: cities, trade guilds and rival schools of thought.')
    S('Classical Hindu civilization', 300, 699, 'IE', 'Civilization', 'Sanskrit, Prakrits', 'Gupta Empire',
      box(72.0, 21.0, 88.5, 29.0), lvl=2, line='indo-aryan', note='Gupta-age temple building, Sanskrit literature, mathematics and law.')
    S('Rajputs and medieval Hindu kingdoms', 700, 1199, 'IE', 'People', 'Apabhramsha, early Hindi, Gujarati', 'Rajput',
      box(69.5, 22.0, 78.5, 30.5), lvl=3, line='indo-aryan')
    S('Hindustani-speaking Indo-Muslim civilization', 1200, 1856, 'IE', 'People', 'Hindustani (Persianate Hindi-Urdu)', 'Hindustani language',
      box(74.5, 23.5, 86.5, 30.5), lvl=2, line='indo-aryan',
      note='Delhi and its sultanates and Mughals: a Persian-using court, Hindu and Muslim subjects, and the birth of Urdu.')
    S('Hindi-Urdu belt of India and Pakistan', 1857, 2024, 'IE', 'People', 'Hindi, Urdu, Punjabi and others', 'Hindi Belt',
      box(72.5, 23.5, 88.0, 31.0), lvl=2, line='indo-aryan')
    S('Punjabis', 1500, 2024, 'IE', 'People', 'Punjabi', 'Punjabis', box(71.5, 29.8, 77.5, 32.9))
    S('Sindhis', 700, 2024, 'IE', 'People', 'Sindhi', 'Sindhis', box(66.5, 24.0, 71.0, 28.5))
    S('Gujaratis', 700, 2024, 'IE', 'People', 'Gujarati', 'Gujarati people', box(68.5, 20.2, 74.5, 24.7))
    S('Marathas', 1300, 2024, 'IE', 'People', 'Marathi', 'Marathi people', box(72.7, 15.7, 80.5, 21.5))
    S('Assamese', 1200, 2024, 'IE', 'People', 'Assamese', 'Assamese people', box(89.7, 24.1, 96.0, 28.0))
    S('Kashmiris', 600, 2024, 'IE', 'People', 'Kashmiri (Dardic)', 'Kashmiris', box(73.5, 33.4, 75.8, 34.7))
    S('Newars and Nepali hill peoples', 600, 2024, 'ST', 'People', 'Newar, Nepali', 'Newar people', box(80.0, 26.5, 88.0, 30.0))
    S('Odia and Bengal delta cultures', 600, 2024, 'IE', 'People', 'Odia', 'Odia people', box(81.5, 17.8, 87.5, 22.5))
    S('Naga, Mizo and hill peoples of the Northeast', -500, 2024, 'ST', 'People', 'Many Tibeto-Burman languages', 'Naga people', box(92.5, 23.0, 97.2, 27.5))

    # ---- East Asia ------------------------------------------------------------------
    S('Chu culture', -1000, -223, 'ST', 'Culture', 'Old Chinese (Chu dialect)', 'Chu (state)', box(109.0, 28.0, 119.0, 34.0))
    S('Wu Chinese (Jiangnan)', 700, 2024, 'ST', 'People', 'Wu Chinese', 'Wu Chinese', box(118.5, 28.2, 122.5, 32.6))
    S('Cantonese (Lingnan)', 900, 2024, 'ST', 'People', 'Yue Chinese', 'Cantonese people', box(109.0, 21.5, 115.8, 25.0))
    S('Hokkien and Min Chinese', 700, 2024, 'ST', 'People', 'Min Chinese', 'Hokkien', box(116.0, 23.3, 120.6, 28.0))
    S('Hakka', 1100, 2024, 'ST', 'People', 'Hakka Chinese', 'Hakka people', box(113.5, 23.3, 117.8, 26.5))
    S('Sichuanese (Ba and Shu)', -1000, 2024, 'ST', 'People', 'Southwestern Mandarin', 'Sichuanese people', box(102.0, 28.0, 108.5, 32.2))
    S('Hui Muslims', 700, 2024, 'ST', 'People', 'Chinese; Islamic faith', 'Hui people', box(103.0, 34.5, 107.8, 38.5))
    S('Yi peoples', -500, 2024, 'ST', 'People', 'Loloish (Tibeto-Burman)', 'Yi people', box(100.0, 24.5, 104.5, 29.5))
    S('Zhuang', -500, 2024, 'SE', 'People', 'Zhuang (Tai)', 'Zhuang people', box(105.5, 22.0, 111.5, 25.6))
    S('Taiwanese Hokkien and Hakka', 1650, 2024, 'ST', 'People', 'Taiwanese Hokkien, Hakka, Mandarin', 'Taiwanese people', box(120.0, 22.7, 121.7, 25.2))
    S('Jurchen and Manchus', 1000, 2024, 'TM', 'People', 'Manchu (Tungusic)', 'Manchu people', box(119.0, 39.5, 135.0, 50.0), lvl=2)
    S('Buryats', 1200, 2024, 'TM', 'People', 'Buryat (Mongolic)', 'Buryats', box(102.0, 50.0, 112.5, 56.5))
    S('Kalmyks and Oirats', 1400, 2024, 'TM', 'People', 'Oirat (Mongolic)', 'Kalmyks', [box(43.5, 45.0, 47.8, 48.5), box(82.0, 43.5, 89.0, 47.5)])
    S('Ryukyuans', 1100, 2024, 'JK', 'People', 'Ryukyuan languages', 'Ryukyuan people', blob(127.8, 26.5, 0.8, 2.2, rot=-30))
    S('Emishi', -300, 1000, 'IS', 'People', 'Unknown (possibly Ainu-related)', 'Emishi', box(139.3, 37.3, 141.9, 41.5))
    S('Koreans of Manchuria', 1860, 2024, 'JK', 'People', 'Korean', 'Koreans in China', box(126.0, 41.0, 131.2, 44.5))

    # ---- Southeast Asia ------------------------------------------------------------------
    S('Pyu', -200, 1050, 'ST', 'People', 'Pyu (Tibeto-Burman)', 'Pyu city-states', box(94.0, 18.5, 96.5, 23.0), line='burmese')
    S('Shan', 1000, 2024, 'SE', 'People', 'Shan (Tai)', 'Shan people', box(96.0, 19.5, 100.5, 24.0))
    S('Karen peoples', 700, 2024, 'ST', 'People', 'Karenic', 'Karen people', box(96.5, 15.0, 99.5, 19.5))
    S('Javanese', 700, 2024, 'AN', 'People', 'Javanese', 'Javanese people', box(105.5, -8.8, 114.6, -6.0))
    S('Sundanese', 700, 2024, 'AN', 'People', 'Sundanese', 'Sundanese people', box(105.0, -7.8, 108.8, -6.2))
    S('Balinese', 900, 2024, 'AN', 'People', 'Balinese', 'Balinese people', blob(115.1, -8.4, 0.5, 0.35))
    S('Minangkabau', 1000, 2024, 'AN', 'People', 'Minangkabau', 'Minangkabau people', box(99.4, -3.0, 101.9, 0.6))
    S('Bugis and Makassar seafarers', 1000, 2024, 'AN', 'People', 'Buginese', 'Bugis', box(119.0, -6.0, 121.3, -3.2))
    S('Tagalog and Luzon Filipinos', 900, 2024, 'AN', 'People', 'Tagalog, Ilocano', 'Tagalog people', box(119.8, 13.0, 122.6, 18.6))
    S('Visayans', 900, 2024, 'AN', 'People', 'Cebuano, Hiligaynon, Waray', 'Visayans', box(121.8, 9.5, 126.0, 12.0))
    S('Moros of Mindanao and Sulu', 1300, 2024, 'AN', 'People', 'Maguindanao, Tausug (Austronesian)', 'Moro people', box(119.5, 5.5, 125.5, 8.8))
    S('Angkorian Khmer', 802, 1430, 'SE', 'Civilization', 'Old and Middle Khmer', 'Khmer Empire', box(102.5, 11.8, 106.5, 15.2), line='khmer',
      note='Temple-city civilization of Angkor, with Hindu and then Buddhist state ritual.')
