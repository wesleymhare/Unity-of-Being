"""Societies batch 1: Near East, Arabia, Kurds, the Mediterranean, the Balkans,
France, South Asia and Southern California.

Every entry is a *stage in time*. Stages that continue one another share a `line`.
lvl 2 = a people; lvl 3 = a regional or local identity (shown when zoomed in).
Footprints are coarse and soft (see docs/SOCIETIES.md).
"""
from societies_data import SOCIETIES, add, blob, box  # noqa: F401


def register():
    # The old single-polygon Arabs and Kurds entries are replaced by finer stages below.
    SOCIETIES[:] = [e for e in SOCIETIES if e['name'] not in ('Arabs', 'Kurds')]

    # ---- Afro-Asiatic roots ----------------------------------------------------
    add('Proto-Afro-Asiatic speakers', -3400, -3000, 'AA', 'Language area',
        'Proto-Afro-Asiatic (reconstructed)', 'Afroasiatic languages',
        [[24.0, 28.0], [34.0, 30.0], [42.0, 20.0], [44.0, 9.0], [36.0, 4.0], [26.0, 10.0], [22.0, 18.0]],
        lvl=1, line='afroasiatic',
        note='Ancestors of Egyptian, Berber, Cushitic, Chadic and Semitic speakers. The homeland and date '
             '(well before 3400 BCE) are debated; shown here from the start of the timeline.')

    # ---- Arabia: south Arabian, pre-Islamic Arabian, Bedouin, Arabs ------------
    add('South Arabian kingdoms', -1000, 570, 'AA', 'Civilization', 'Afro-Asiatic (Old South Arabian: Sabaean, Minaean, Himyarite)',
        'South Arabia', [[43.0, 18.2], [47.0, 19.0], [52.5, 17.5], [52.8, 16.0], [48.5, 14.0], [43.5, 12.8]],
        line='south-arabia', note='Frankincense-trade kingdoms (Saba, Ma’in, Qataban, Himyar) with their own scripts and gods.')
    add('Yemenis and Hadhramis', 571, 2024, 'AA', 'People', 'Afro-Asiatic (Arabic; Modern South Arabian languages)',
        'Yemenis', [[42.7, 17.5], [47.0, 18.5], [52.5, 17.5], [52.8, 16.0], [48.5, 14.0], [43.3, 12.8]], lvl=3,
        line='south-arabia', note='Highland Yemen and the Hadhramaut: Arabic-speaking, tribal and Islamic, with older south Arabian roots.')
    add('Pre-Islamic Arabians', -900, 632, 'AA', 'People', 'Afro-Asiatic (Old Arabic; North Arabian dialects)',
        'Pre-Islamic Arabia', [[35.0, 29.8], [38.0, 32.0], [44.0, 32.4], [48.0, 29.5], [51.5, 24.5], [55.5, 24.0],
                              [53.0, 20.0], [44.5, 18.0], [40.0, 20.5], [36.5, 26.0]],
        line='arabian', note='Tribal Arabia of oasis towns, caravan routes and desert tribes before Islam: Nabataeans, Lakhmids, Ghassanids, Quraysh.')
    add('Early Arab-Islamic society', 633, 1000, 'AA', 'People', 'Afro-Asiatic (Arabic)',
        'Early Muslim conquests', [
            [[35.0, 29.8], [38.0, 33.0], [44.0, 33.5], [48.0, 30.0], [55.5, 24.0], [53.0, 20.0], [44.5, 15.0], [40.0, 20.5]],
            [[34.5, 36.8], [41.0, 37.0], [44.0, 36.0], [48.0, 31.5], [44.0, 33.0], [38.0, 33.0], [35.0, 31.0]],
            [[25.0, 31.8], [34.4, 31.4], [34.0, 22.0], [25.0, 22.0]],
            [[-9.0, 35.5], [11.0, 37.3], [12.0, 33.0], [9.0, 28.0], [-1.0, 26.0]],
        ], line='arabian', note='A conquest elite and its soldiers spread Arabic and Islam across the Near East, Egypt and North Africa; '
                                  'Arabization of the countryside came more slowly.')
    add('Arabs and the Arabic-speaking world', 1001, 2024, 'AA', 'People', 'Afro-Asiatic (Arabic dialects)',
        'Arabs', [
            [[35.0, 29.5], [38.0, 32.0], [44.0, 32.6], [48.0, 30.0], [52.0, 24.0], [59.6, 22.6], [57.0, 17.0],
             [52.0, 16.0], [43.0, 12.8], [40.0, 17.0], [36.0, 26.0]],
            [[34.5, 36.8], [41.0, 37.2], [44.0, 36.0], [48.0, 31.2], [44.0, 33.0], [38.0, 33.0], [35.0, 31.0]],
            [[25.0, 31.8], [34.4, 31.4], [34.0, 23.0], [25.0, 22.0]],
            [[-13.0, 27.5], [-9.8, 35.7], [11.0, 37.3], [12.0, 33.0], [9.0, 28.0], [-1.0, 25.0]],
        ], line='arabian', note='Shared language, literature and Islamic heritage over a huge area, with strong regional identities (Egyptian, Levantine, Gulf, Maghrebi).')
    add('Nomadic Arabs (Aʿrāb)', -900, 632, 'AA', 'People', 'Afro-Asiatic (Old Arabic)', 'Arab people',
        [[36.0, 31.5], [41.0, 32.5], [46.5, 30.0], [50.0, 25.0], [48.0, 21.0], [43.0, 20.0], [38.0, 24.0]],
        lvl=3, line='bedouin', note='Camel-herding tribes of the steppe and desert, known to settled neighbours as raiders and guides.')
    add('Medieval Bedouin', 633, 1500, 'AA', 'People', 'Afro-Asiatic (Bedouin Arabic)', 'Bedouin', [
        [[36.0, 31.8], [41.0, 33.0], [46.5, 30.5], [51.0, 25.0], [49.0, 20.5], [43.0, 19.5], [38.0, 24.0]],
        [[32.5, 31.2], [35.0, 30.0], [34.5, 28.0], [32.5, 29.0]],
        [[-6.0, 30.0], [8.0, 33.0], [10.0, 29.0], [-2.0, 26.0]],
    ], lvl=3, line='bedouin',
        note='Tribal Arab pastoralists (Banu Hilal and Banu Sulaym moved west into the Maghreb from the 11th century), '
             'fighters, caravan guards and poets.')
    add('Bedouin of the Ottoman and modern era', 1501, 2024, 'AA', 'People', 'Afro-Asiatic (Bedouin Arabic)', 'Bedouin', [
        [[36.0, 31.8], [41.0, 33.0], [46.5, 30.5], [49.0, 26.0], [47.0, 21.0], [43.0, 20.5], [38.0, 25.0]],
        [[32.5, 31.2], [35.2, 30.0], [34.8, 28.0], [32.5, 29.0]],
        [[34.8, 31.5], [35.3, 31.0], [35.1, 30.2], [34.7, 30.6]],
    ], lvl=3, line='bedouin', note='Tribal pastoral life under pressure from settlement, borders and oil economies; many Bedouin now live in towns.')

    # ---- Levant, Egypt, Mesopotamia -------------------------------------------
    add('Samaritans and Judeans', -586, 135, 'AA', 'People', 'Afro-Asiatic (Hebrew, Aramaic)', 'Second Temple Judaism',
        [[34.6, 32.8], [35.9, 32.8], [35.6, 31.0], [34.8, 31.0]], lvl=3, line='judean',
        note='Jewish society around Jerusalem under Persian, Greek and Roman rule, ending with the Bar Kokhba revolt.')
    add('Syriac Christians and Mesopotamian Arameans', 100, 1300, 'AA', 'People', 'Afro-Asiatic (Syriac, Aramaic)', 'Syriac Christianity',
        [[37.0, 37.5], [43.5, 37.5], [46.0, 35.0], [45.0, 32.5], [41.0, 34.0], [38.0, 35.0]], lvl=3, line='assyrian-christian',
        note='A Christian, Aramaic-speaking society between the Roman and Persian worlds.')
    add('Copts', 300, 2024, 'AA', 'People', 'Afro-Asiatic (Coptic liturgy; Egyptian Arabic)', 'Copts',
        [[29.5, 31.0], [32.5, 30.0], [32.8, 25.0], [31.5, 24.0], [30.5, 27.0]], lvl=3,
        note='Egyptian Christians who kept the Coptic Church and the last stage of the ancient Egyptian language.')
    add('Mizrahi and Sephardic Jews of the Islamic world', 700, 1950, 'AA', 'People', 'Judeo-Arabic, Ladino and others',
        'Mizrahi Jews', [[-8.0, 35.0], [10.0, 36.5], [20.0, 32.0], [35.0, 33.0], [44.5, 36.5], [45.5, 32.0], [44.0, 14.0],
                         [36.0, 31.0]], lvl=3, note='Jewish communities living under Muslim rule from Morocco to Iraq and Yemen.')

    # ---- Kurds ---------------------------------------------------------------
    add('Early Zagros highlanders (Kurdish ancestors)', -600, 699, 'IE', 'People', 'Indo-European (Northwestern Iranian)',
        'History of the Kurdish people',
        [[40.0, 37.5], [44.5, 38.8], [47.5, 36.8], [48.5, 33.5], [45.0, 32.8], [42.5, 34.5]], line='kurdish',
        note='Mountain peoples of the Zagros and Taurus (Medes, Carduchi, Guti and others) from whom Kurdish identity grew.')
    add('Medieval Kurds', 700, 1499, 'IE', 'People', 'Indo-European (Kurdish)', 'Kurds',
        [[38.5, 38.2], [44.6, 39.6], [47.5, 37.2], [48.3, 34.5], [46.0, 33.2], [43.0, 34.0], [40.0, 36.6]], line='kurdish',
        note='Tribal and dynastic Kurds (Marwanids, Ayyubids under Saladin, Hasanwayhids) in the mountains and the Jazira.')
    add('Kurds under Ottoman and Safavid rule', 1500, 1899, 'IE', 'People', 'Indo-European (Kurdish: Kurmanji, Sorani)', 'Kurds',
        [[37.5, 38.5], [44.0, 40.0], [47.8, 37.5], [48.2, 34.0], [45.5, 33.8], [42.5, 35.0], [39.5, 36.5]], line='kurdish',
        note='Semi-autonomous Kurdish emirates between two empires, split by the 1514 Chaldiran border.')
    add('Kurds', 1900, 2024, 'IE', 'People', 'Indo-European (Kurdish: Kurmanji, Sorani, Southern Kurdish)', 'Kurds',
        [[37.2, 38.5], [43.5, 40.0], [46.5, 39.4], [48.5, 37.0], [48.0, 33.8], [45.4, 34.0], [42.3, 35.4], [38.5, 36.4]],
        line='kurdish', note='A stateless nation of some 30 million split among Turkey, Iraq, Iran and Syria, with a shared language family and a strong national movement.')
    add('Kurmanji Kurds of Diyarbakır and Turkish Kurdistan', 1500, 2024, 'IE', 'People', 'Kurdish (Kurmanji)',
        'Kurds in Turkey', [[38.0, 38.8], [42.5, 39.4], [44.2, 38.0], [42.0, 37.0], [38.6, 37.2]], lvl=3, line='kurds-turkey',
        note='Northern Kurdistan: Diyarbakır, Mardin, Van and the south-east; Kurmanji speech and the Turkish-state context.')
    add('Sorani Kurds of Iraqi Kurdistan', 1750, 2024, 'IE', 'People', 'Kurdish (Sorani)', 'Iraqi Kurdistan',
        [[43.0, 37.2], [45.5, 36.6], [46.2, 35.0], [45.0, 34.8], [43.3, 35.8]], lvl=3, line='kurds-iraq',
        note='Southern Kurdistan: Erbil, Sulaymaniyah and Duhok. Sorani, the Baban emirate, and since 1991 an autonomous region.')
    add('Kurds of Iran (Rojhelat)', 1500, 2024, 'IE', 'People', 'Kurdish (Sorani, Southern Kurdish)', 'Kurds in Iran',
        [[44.2, 39.2], [47.5, 38.0], [47.8, 35.0], [46.5, 33.5], [45.5, 35.5]], lvl=3, line='kurds-iran')
    add('Kurds of Syria (Rojava)', 1920, 2024, 'IE', 'People', 'Kurdish (Kurmanji)', 'Rojava',
        [[37.0, 37.0], [42.4, 37.3], [42.3, 36.5], [38.5, 36.4]], lvl=3, line='kurds-syria')
    add('Zaza and Alevi Kurds of Dersim', 1300, 2024, 'IE', 'People', 'Zazaki, Kurmanji', 'Zaza people',
        [[38.8, 39.9], [41.5, 39.7], [41.4, 38.6], [39.0, 38.4]], lvl=3)
    add('Yazidis', 1100, 2024, 'IE', 'People', 'Kurdish (Kurmanji); Yazidism', 'Yazidis',
        [[41.4, 36.7], [43.6, 37.0], [43.4, 36.1], [41.6, 36.0]], lvl=3, note='A Kurdish-speaking religious community centred on Sinjar and Lalish.')

    # ---- Mediterranean: Sicily ----------------------------------------------
    add('Sicans, Sicels and Elymians', -1300, -300, 'IE', 'People', 'Indo-European (Italic) and unknown',
        'Sicels', box(12.4, 36.65, 15.65, 38.3), lvl=3, line='sicily',
        note='The native peoples of Sicily before and during Greek and Phoenician colonisation.')
    add('Greeks and Romans of Sicily', -299, 826, 'IE', 'People', 'Greek and Latin', 'Sicily in classical antiquity',
        box(12.4, 36.65, 15.65, 38.3), lvl=3, line='sicily',
        note='A Greek-speaking Sicily under Rome and then Byzantium, the empire’s grain store.')
    add('Siculo-Arabs', 827, 1090, 'AA', 'People', 'Arabic and Sicilian Romance', 'Emirate of Sicily',
        box(12.4, 36.65, 15.65, 38.3), lvl=3, line='sicily',
        note='Arab, Berber and local converts of the Emirate of Sicily: new crops, irrigation, Arabic poetry and a mixed Christian and Muslim island.')
    add('Norman-Arab-Byzantine Sicilians', 1091, 1299, 'IE', 'People', 'Sicilian, Greek, Arabic, Latin, Norman French', 'Kingdom of Sicily',
        [[12.4, 36.65], [15.65, 36.65], [15.65, 38.3], [12.4, 38.3]], lvl=3, line='sicily',
        note='A three-language court (Latin, Greek, Arabic) under Norman kings; Muslims lived on the island until Frederick II deported them.')
    add('Sicilians', 1300, 2024, 'IE', 'People', 'Sicilian (Romance); Italian', 'Sicilians',
        box(12.4, 36.65, 15.65, 38.3), lvl=3, line='sicily',
        note='A distinct island people with its own language and history under Aragonese, Spanish, Bourbon and Italian rule.')
    add('Italian-Americans', 1880, 2024, 'IE', 'People', 'American English; Italian and Sicilian heritage',
        'Italian Americans', [blob(-73.9, 40.75, 0.5, 0.3), blob(-71.1, 42.4, 0.35, 0.25), blob(-75.2, 39.95, 0.35, 0.25),
                              blob(-87.7, 41.85, 0.4, 0.3), blob(-81.7, 41.5, 0.3, 0.2)], lvl=3, line='sicily', clip=True,
        note='Sicilian, Neapolitan and other southern Italian emigrants and their descendants in the cities of the Northeast and Midwest, '
             'who became Italian-American.')

    # ---- France: Occitan -----------------------------------------------------
    occitania = [[-1.2, 45.0], [1.0, 46.2], [4.5, 46.0], [7.2, 45.2], [7.4, 43.7], [3.2, 42.4], [0.6, 42.7], [-1.6, 43.3]]
    add('Gallo-Romans of the south', 50, 475, 'IE', 'People', 'Latin and Gaulish', 'Gallia Narbonensis',
        [[-1.5, 43.4], [1.5, 46.0], [5.5, 46.0], [7.4, 44.0], [3.2, 42.4], [0.5, 42.7]], lvl=3, line='occitan',
        note='Romanised southern Gaul: Narbonensis and Aquitania.')
    add('Medieval Occitans (the troubadour world)', 900, 1299, 'IE', 'People', 'Occitan (Romance)', 'Occitania', occitania,
        lvl=3, line='occitan', note='The land of the langue d’oc: troubadours, Toulouse, the Cathars, and a courtly culture distinct from northern France.')
    add('Occitans under the French crown', 1300, 1899, 'IE', 'People', 'Occitan dialects; French', 'Occitan language',
        occitania, lvl=3, line='occitan', note='After the Albigensian Crusade the south was absorbed by France, and Occitan was slowly pushed to the countryside.')
    add('Occitan speakers and the Midi today', 1900, 2024, 'IE', 'People', 'Occitan (minority language), French', 'Occitan language',
        [[-0.5, 44.5], [2.5, 45.2], [6.8, 44.6], [7.2, 43.9], [3.2, 42.6], [0.6, 43.0]], lvl=3, line='occitan')

    # ---- Balkans: Albanians ---------------------------------------------------
    add('Albanians', 1000, 2024, 'IE', 'People', 'Indo-European (Albanian)', 'Albanians',
        [[19.0, 39.7], [20.8, 39.6], [21.7, 41.0], [21.8, 42.5], [21.2, 43.0], [20.0, 42.8], [19.3, 42.2]],
        line='albanian', note='A people with their own branch of Indo-European, often linked to ancient Illyrians, though the link is debated.')
    add('Ghegs', 1000, 2024, 'IE', 'People', 'Albanian (Geg)', 'Gheg Albanians',
        [[19.1, 41.3], [21.7, 41.5], [21.8, 42.6], [20.2, 42.8], [19.3, 42.2]], lvl=3, line='albanian-north')
    add('Tosks', 1000, 2024, 'IE', 'People', 'Albanian (Tosk)', 'Tosk Albanians',
        [[19.4, 39.7], [20.8, 39.8], [21.0, 41.3], [19.5, 41.3]], lvl=3, line='albanian-south')
    add('Kosovo Albanians', 1700, 2024, 'IE', 'People', 'Albanian (Geg)', 'Albanians in Kosovo',
        [[20.2, 42.3], [21.4, 42.2], [21.6, 43.0], [20.6, 43.2], [20.0, 42.8]], lvl=3, line='kosovo',
        note='The Albanian majority of Kosovo, with a shared Gheg culture, strong clan memory and a long Serbian-Albanian contest over the land.')
    add('Arbëreshë of southern Italy and Sicily', 1450, 2024, 'IE', 'People', 'Arbëresh (Tosk-derived Albanian)', 'Arbëreshë people',
        [blob(16.4, 39.6, 0.5, 0.5), blob(13.3, 37.95, 0.25, 0.2), blob(16.0, 40.7, 0.4, 0.3)], lvl=3,
        note='Albanians who fled the Ottomans in the 1400s and kept their language and rite in Italy.')
    add('Arvanites', 1300, 2024, 'IE', 'People', 'Arvanitika (Albanian)', 'Arvanites',
        [[22.8, 38.0], [24.0, 38.3], [24.2, 37.6], [23.2, 37.4]], lvl=3, note='Medieval Albanian settlers in Attica and the Peloponnese, now largely Greek-speaking.')
    add('Vlachs and Aromanians', 600, 2024, 'IE', 'People', 'Aromanian (Eastern Romance)', 'Aromanians',
        [[20.5, 39.6], [22.0, 40.5], [22.3, 41.4], [20.8, 40.8]], lvl=3, note='Latin-speaking mountain herders of the Pindus and Macedonia.')

    # ---- South Asia: Dravidian stages ------------------------------------------
    add('Proto-Dravidian speakers', -3400, -1501, 'DR', 'Language area', 'Proto-Dravidian (reconstructed)', 'Proto-Dravidian language',
        [[69.5, 28.0], [76.0, 26.0], [82.0, 23.0], [80.0, 16.0], [75.5, 14.0], [71.0, 20.0]], line='dravidian',
        note='Ancestors of the Dravidian languages. Their homeland (the Indus region, central India or the Deccan) is debated.')
    add('Iron Age megalithic South India', -1500, -301, 'DR', 'Culture', 'Early Dravidian (Proto-South Dravidian)', 'Megalithic culture of South India',
        [[74.0, 19.0], [80.5, 19.0], [80.5, 9.0], [77.0, 8.2], [75.0, 12.0]], line='dravidian',
        note='Burial-stone builders of the Deccan and the far south, speaking early Dravidian languages.')
    add('Sangam Tamils', -300, 299, 'DR', 'People', 'Old Tamil', 'Sangam period',
        [[76.2, 13.4], [80.4, 13.4], [80.3, 9.8], [78.2, 8.2], [77.2, 8.2], [76.3, 10.5]], line='dravidian',
        note='The Tamil poetry and trade world of the Chera, Chola and Pandya, with Roman coins in its ports.')
    add('Pallava-Chola Tamils', 300, 1299, 'DR', 'People', 'Middle Tamil', 'Chola dynasty',
        [[[76.2, 13.4], [80.4, 13.8], [80.3, 9.8], [78.2, 8.2], [77.2, 8.2], [76.3, 10.5]], [[79.7, 9.8], [81.6, 9.6], [81.2, 8.4], [79.9, 8.8]]],
        line='dravidian', note='Temple builders and sea-traders whose culture reached Sri Lanka and Southeast Asia.')
    add('Tamils', 1300, 2024, 'DR', 'People', 'Tamil', 'Tamils',
        [[[76.2, 13.5], [80.4, 13.8], [80.3, 9.8], [78.2, 8.2], [77.2, 8.2], [76.3, 10.5]], [[79.7, 9.8], [81.9, 9.8], [81.6, 8.0], [80.0, 8.8]]],
        line='dravidian', note='Tamil-speaking Tamil Nadu and northern Sri Lanka, with a large world diaspora.')
    add('Early Kannadigas (Kadamba and Chalukya)', 450, 999, 'DR', 'People', 'Old Kannada', 'Kannada people',
        [[74.0, 18.0], [77.5, 18.0], [78.0, 13.0], [75.5, 12.5], [74.0, 14.0]], lvl=3, line='kannada')
    add('Kannadigas', 1000, 2024, 'DR', 'People', 'Kannada', 'Kannada people',
        [[74.0, 18.5], [78.0, 18.5], [78.4, 13.0], [76.0, 11.6], [74.5, 13.5]], lvl=3, line='kannada')
    add('Telugus', 600, 2024, 'DR', 'People', 'Telugu', 'Telugu people',
        [[77.0, 19.8], [81.0, 19.3], [84.5, 18.5], [80.4, 13.6], [78.0, 14.0], [77.0, 17.0]], lvl=3)
    add('Malayalis', 800, 2024, 'DR', 'People', 'Malayalam', 'Malayali people',
        [[75.0, 12.6], [76.8, 11.2], [77.3, 8.4], [76.3, 8.4], [75.0, 11.0]], lvl=3,
        note='Kerala: spice coast, early Jewish, Christian and Muslim communities, and a distinct language that split from Tamil.')
    add('Brahui', -1000, 2024, 'DR', 'People', 'Brahui (northwestern Dravidian)', 'Brahui people',
        [[65.5, 30.5], [67.8, 30.0], [67.8, 27.6], [65.8, 27.8]], lvl=3,
        note='A Dravidian-speaking island in Balochistan, a clue to the old Dravidian range.')
    add('Gond and other Central Indian tribal peoples', -500, 2024, 'DR', 'People', 'Gondi, Kurukh, Kui and other Central Dravidian',
        'Gond people', [[78.0, 22.5], [82.0, 22.0], [83.0, 19.5], [79.5, 18.5], [77.5, 20.5]], lvl=3)
    add('Sri Lankan Tamils', 1000, 2024, 'DR', 'People', 'Tamil', 'Sri Lankan Tamils',
        [[79.7, 9.9], [81.9, 9.4], [81.7, 7.0], [80.2, 8.6]], lvl=3)

    # ---- Southern California -------------------------------------------------
    add('Tongva, Chumash and Luiseño peoples', -3400, 1769, 'NA', 'People', 'Uto-Aztecan and Chumashan', 'Tongva',
        [[-121.5, 35.2], [-118.0, 35.3], [-116.7, 33.5], [-117.3, 32.7], [-120.5, 34.0]], lvl=3, line='socal',
        note='Coastal and valley peoples of Southern California: acorn, fishing and plank canoe cultures.')
    add('Californios (Spanish and Mexican Alta California)', 1770, 1847, 'IE', 'People', 'Spanish; Indigenous mission communities', 'Californio',
        [[-121.5, 35.2], [-118.0, 35.0], [-116.8, 33.4], [-117.2, 32.6], [-120.8, 34.2]], lvl=3, line='socal',
        note='Missions, ranchos and the Spanish-speaking Californios; Indigenous peoples drawn into the mission system.')
    add('Gold Rush and citrus-belt Southern California', 1848, 1944, 'IE', 'People', 'English, Spanish', 'History of Southern California',
        [[-120.0, 35.0], [-117.5, 35.0], [-116.5, 33.4], [-117.2, 32.6], [-119.5, 34.0]], lvl=3, line='socal',
        note='Anglo-American boosterism, orange groves, oil, the movies and a growing Mexican and Asian labour force.')
    add('Modern Southern California', 1945, 2024, 'IE', 'People', 'English, Spanish and many others', 'Southern California', [
        blob(-118.1, 34.0, 1.1, 0.7), blob(-117.4, 34.0, 0.9, 0.4), blob(-117.9, 33.75, 0.4, 0.3), blob(-117.15, 32.8, 0.4, 0.3)],
        lvl=3, line='socal',
        note='Freeways, suburbs, surf and skate culture, Hollywood, Chicano and Asian American communities: a shared way of life across Los Angeles, '
             'the Inland Empire, Orange County and San Diego.')
    add('Chicano and Mexican-American Southern California', 1848, 2024, 'IE', 'People', 'Spanish and English', 'Chicano',
        [blob(-118.2, 34.05, 0.6, 0.3), blob(-117.3, 34.1, 0.4, 0.2), blob(-117.9, 33.75, 0.3, 0.15)], lvl=3)
    add('Vietnamese Americans of Little Saigon', 1975, 2024, 'SE', 'People', 'Vietnamese and English', 'Little Saigon',
        [blob(-117.95, 33.76, 0.12, 0.09)], lvl=3, note='The largest Vietnamese community outside Vietnam, in Westminster, Garden Grove and Fountain Valley.')
