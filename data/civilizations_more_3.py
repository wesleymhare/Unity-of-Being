"""Civilizations batch 3: Africa, the Americas, Oceania and the diasporas.

Defaults are lvl 3 (regional or local identity). Pass lvl=2 for a people.
"""
from civilizations_data import add, blob, box  # noqa: F401


def S(name, s, e, fam, kind, lang, wiki, poly, lvl=3, line=None, note='', clip=True):
    add(name, s, e, fam, kind, lang, wiki, poly, lvl=lvl, line=line, note=note, clip=clip)


def register():
    # ---- North Africa --------------------------------------------------------------
    S('Carthaginians (Punic civilization)', -814, -146, 'AA', 'People', 'Punic (Phoenician)', 'Carthage',
      [[8.0, 36.0], [11.8, 37.3], [11.5, 34.0], [9.0, 33.5]], line='punic',
      note='Phoenician-descended traders of Carthage and its western Mediterranean colonies.')
    S('Romanised North Africans', -145, 640, 'AA', 'People', 'Latin, Punic, Berber', 'Roman Africa',
      [[-2.0, 35.5], [11.5, 37.3], [12.0, 32.5], [5.0, 31.5], [-1.0, 33.5]], line='punic')
    S('Kabyles', 640, 2024, 'AA', 'People', 'Kabyle (Berber)', 'Kabyle people', box(3.4, 35.9, 6.6, 37.0))
    S('Chleuh and Rif Amazigh', 640, 2024, 'AA', 'People', 'Tashelhit, Tarifit (Berber)', 'Shilha people',
      [box(-9.7, 29.3, -5.0, 31.8), box(-5.2, 34.7, -2.2, 35.3)])
    S('Sahrawis', 1100, 2024, 'AA', 'People', 'Hassaniya Arabic', 'Sahrawi people', box(-17.0, 21.0, -8.7, 27.7))
    S('Beja', -2000, 2024, 'AA', 'People', 'Beja (Cushitic)', 'Beja people', box(33.0, 17.0, 38.0, 22.8))
    S('Sudanese Arabs', 1300, 2024, 'AA', 'People', 'Sudanese Arabic', 'Sudanese Arabs', box(24.0, 9.0, 35.0, 16.0))

    # ---- West and Central Africa ---------------------------------------------------------
    S('Nok culture', -1500, 300, 'NC', 'Culture', 'Unknown (possibly Benue-Congo)', 'Nok culture', box(7.0, 8.5, 10.5, 11.0), line='west-africa-iron',
      note='Early ironworkers and terracotta sculptors of central Nigeria.')
    S('Wolof', 1300, 2024, 'NC', 'People', 'Wolof (Atlantic)', 'Wolof people', box(-17.5, 13.5, -14.5, 16.7))
    S('Mossi', 1100, 2024, 'NC', 'People', 'Mooré (Gur)', 'Mossi people', box(-3.2, 10.7, 0.8, 14.2))
    S('Kanuri', 900, 2024, 'NS', 'People', 'Kanuri (Saharan)', 'Kanuri people', box(11.5, 10.8, 15.5, 14.2))
    S('Edo (Benin)', 1180, 2024, 'NC', 'People', 'Edo (Benue-Congo)', 'Edo people', box(5.0, 5.7, 6.9, 7.2))
    S('Kongo', 1300, 2024, 'NC', 'People', 'Kikongo (Bantu)', 'Kongo people', box(12.0, -8.5, 16.5, -3.8))
    S('Luba and Lunda', 1500, 2024, 'NC', 'People', 'Luba, Lunda (Bantu)', 'Luba people', box(22.0, -12.5, 27.5, -6.0))

    # ---- East and Horn of Africa ----------------------------------------------------------
    S('Amhara', 1270, 2024, 'AA', 'People', 'Amharic (Ethiosemitic)', 'Amhara people', box(36.0, 9.5, 40.5, 13.5))
    S('Tigrayans', 1000, 2024, 'AA', 'People', 'Tigrinya (Ethiosemitic)', 'Tigrayans', box(37.5, 12.5, 40.0, 14.8))
    S('Oromo', 1500, 2024, 'AA', 'People', 'Oromo (Cushitic)', 'Oromo people', box(34.0, 3.0, 43.5, 10.0), lvl=2)
    S('Somalis', 900, 2024, 'AA', 'People', 'Somali (Cushitic)', 'Somalis', box(41.0, -1.7, 51.3, 11.8), lvl=2)
    S('Baganda and Great Lakes kingdoms', 1300, 2024, 'NC', 'People', 'Luganda, Kinyarwanda (Bantu)', 'Baganda', blob(32.0, -0.5, 2.0, 2.0))
    S('Kikuyu', 1500, 2024, 'NC', 'People', 'Kikuyu (Bantu)', 'Kikuyu people', blob(37.0, -0.8, 0.8, 0.7))
    S('Maasai', 1600, 2024, 'NS', 'People', 'Maa (Nilotic)', 'Maasai people', box(35.0, -4.8, 38.5, 0.5))

    # ---- Southern Africa ----------------------------------------------------------------
    S('Great Zimbabwe and early Shona', 900, 1499, 'NC', 'Civilization', 'Shona (Bantu)', 'Great Zimbabwe', box(28.0, -22.5, 33.0, -17.0), line='shona',
      note='Gold-trading stone-city civilization of the Zimbabwe plateau.')
    S('Shona', 1500, 2024, 'NC', 'People', 'Shona (Bantu)', 'Shona people', box(28.0, -22.5, 33.0, -16.5), line='shona')
    S('Zulu and Nguni', 1600, 2024, 'NC', 'People', 'Zulu, Xhosa (Nguni Bantu)', 'Zulu people', box(26.0, -34.0, 32.5, -26.5), lvl=2)
    S('Sotho and Tswana', 1400, 2024, 'NC', 'People', 'Sotho-Tswana (Bantu)', 'Sotho people', box(24.0, -30.5, 29.5, -22.0))
    S('Cape Coloureds', 1652, 2024, 'IE', 'People', 'Afrikaans', 'Cape Coloureds', box(18.0, -34.6, 23.0, -32.0))
    S('Merina', 1500, 2024, 'AN', 'People', 'Malagasy (Austronesian)', 'Merina people', blob(47.3, -19.0, 0.9, 1.2))

    # ---- Americas: Mesoamerica -----------------------------------------------------------
    S('Classic Maya', 250, 899, 'MA', 'Civilization', 'Mayan (Classic Mayan)', 'Classic Maya collapse', box(-92.5, 15.5, -87.5, 21.5), line='maya',
      note='City-state kingdoms with glyphic writing, astronomy and monumental temples.')
    S('Postclassic Maya', 900, 1524, 'MA', 'People', 'Mayan (Yucatec, K’iche’ and others)', 'Postclassic Maya',
      [box(-91.5, 19.0, -87.0, 21.6), box(-92.0, 14.4, -90.0, 16.0)], line='maya')
    S('Maya today', 1525, 2024, 'MA', 'People', 'Mayan languages; Spanish', 'Maya peoples', box(-92.5, 14.0, -87.5, 21.5), line='maya')
    S('Mexica (Aztecs) and the Triple Alliance', 1300, 1521, 'MA', 'People', 'Nahuatl', 'Aztecs', blob(-98.8, 19.4, 1.5, 1.1), line='nahua',
      note='The Nahuatl-speaking civilization of the Valley of Mexico whose capital was Tenochtitlan.')
    S('Purépecha', 1300, 2024, 'IS', 'People', 'Purépecha (isolate)', 'Purépecha', blob(-101.8, 19.6, 1.0, 0.6))
    S('New Spain: Mestizo and Indigenous Mexico', 1522, 1820, 'IE', 'People', 'Spanish, Nahuatl, many languages', 'New Spain',
      [[-110.0, 24.0], [-105.0, 29.0], [-97.0, 26.0], [-97.7, 21.0], [-96.0, 18.0], [-91.0, 18.2], [-88.5, 15.8], [-92.0, 14.5], [-105.0, 20.0]],
      line='mexico', note='A caste civilization that blended Spanish, Indigenous and African peoples.')
    S('Mexicans', 1821, 2024, 'IE', 'People', 'Spanish and Indigenous languages', 'Mexicans',
      [[-117.0, 32.5], [-110.0, 31.3], [-103.0, 29.0], [-97.2, 25.9], [-97.7, 21.0], [-96.0, 18.0], [-91.0, 18.2], [-87.0, 21.4],
       [-88.5, 15.8], [-92.0, 14.5], [-105.0, 20.0], [-112.0, 28.0]], lvl=2, line='mexico')

    # ---- Americas: Andes and South America ------------------------------------------------
    S('Inca (Tawantinsuyu)', 1438, 1533, 'AD', 'Civilization', 'Quechua', 'Inca Empire',
      [[-79.0, 1.5], [-75.5, 0.0], [-68.0, -14.0], [-66.0, -22.0], [-68.5, -31.0], [-71.5, -34.0], [-71.0, -20.0], [-76.0, -12.0], [-80.0, -3.0]],
      lvl=2, line='andes', note='A road-linked highland civilization of many ethnic groups under Quechua-speaking Inca rule.')
    S('Chimú', 900, 1470, 'AD', 'Civilization', 'Muchik (Chimu)', 'Chimú culture', box(-80.5, -9.5, -77.5, -5.5))
    S('Muisca', 600, 1540, 'AD', 'People', 'Chibcha (Muysccubun)', 'Muisca', box(-74.5, 4.5, -72.6, 6.6))
    S('Gauchos and Pampas', 1700, 1900, 'IE', 'People', 'Spanish', 'Gaucho', box(-65.5, -39.5, -57.5, -30.0))
    S('Afro-Brazilians of Bahia', 1550, 2024, 'NC', 'People', 'Portuguese; Yoruba and Bantu heritage', 'Afro-Brazilians', box(-40.0, -18.5, -37.2, -11.0), line='afro-atlantic',
      note='African-descended culture of Salvador and the Recôncavo: candomblé, capoeira and Bahian cuisine.')

    # ---- North America ----------------------------------------------------------------------
    S('Hopewell culture', -200, 500, 'NA', 'Culture', 'Unknown', 'Hopewell tradition', box(-85.5, 37.5, -80.5, 41.8))
    S('Hohokam', 300, 1450, 'NA', 'Culture', 'Unknown (possibly Uto-Aztecan)', 'Hohokam', box(-113.5, 32.5, -110.5, 34.2))
    S('Algonquian peoples', -500, 2024, 'NA', 'People', 'Algonquian languages', 'Algonquian peoples', box(-80.0, 40.0, -60.0, 52.0), lvl=2)
    S('Cherokee and Muskogean peoples', 1000, 1838, 'NA', 'People', 'Cherokee (Iroquoian), Muskogean', 'Cherokee', box(-90.0, 31.0, -80.0, 36.8))
    S('Lakota and Dakota', 1700, 2024, 'NA', 'People', 'Dakotan (Siouan)', 'Lakota people', box(-105.0, 42.0, -96.0, 47.5))
    S('Comanche', 1700, 1875, 'NA', 'People', 'Comanche (Uto-Aztecan)', 'Comanche', box(-104.0, 31.0, -97.0, 37.5))
    S('Métis', 1750, 2024, 'IE', 'People', 'Michif, French, English', 'Métis people (Canada)', box(-106.0, 49.0, -94.0, 55.0))
    S('Alaska Natives', 1000, 2024, 'NA', 'People', 'Yup’ik, Aleut, Tlingit and others', 'Alaska Natives', box(-168.0, 55.0, -140.0, 66.0))
    S('Hispano New Mexicans', 1598, 2024, 'IE', 'People', 'New Mexican Spanish', 'Hispanos of New Mexico', box(-107.5, 34.0, -104.0, 37.0))
    S('Acadians', 1604, 2024, 'IE', 'People', 'Acadian French', 'Acadians', box(-66.5, 44.5, -61.0, 48.0))
    S('New England Yankees', 1620, 2024, 'IE', 'People', 'American English', 'Yankee', box(-73.7, 41.0, -69.9, 44.8))
    S('Pennsylvania Germans', 1683, 2024, 'IE', 'People', 'Pennsylvania Dutch (German)', 'Pennsylvania Dutch', box(-77.8, 39.8, -75.0, 41.2))
    S('Appalachian Scots-Irish', 1730, 2024, 'IE', 'People', 'American English (Appalachian)', 'Scotch-Irish Americans', box(-85.0, 34.5, -78.0, 39.5))
    S('Louisiana Creoles and Cajuns', 1699, 2024, 'IE', 'People', 'Louisiana French, Creole, English', 'Cajuns', box(-93.8, 29.0, -89.0, 31.2),
      note='French, Spanish, African and Indigenous roots in a distinct Gulf Coast culture.')
    S('Gullah Geechee', 1700, 2024, 'NC', 'People', 'Gullah Creole (English-based)', 'Gullah', [[-82.0, 30.4], [-81.0, 33.0], [-79.0, 34.0], [-79.5, 32.0], [-81.2, 30.4]],
      line='african-american', note='Sea Island and coastal African-descended communities that kept strong West African cultural forms.')
    S('African Americans of the Deep South', 1700, 1915, 'NC', 'People', 'English; African heritage', 'African Americans',
      box(-92.0, 30.0, -80.5, 36.0), line='african-american')
    S('Great Migration communities', 1916, 2024, 'NC', 'People', 'American English; African heritage', 'Great Migration (African American)',
      [blob(-87.7, 41.85, 0.4, 0.35), blob(-83.1, 42.35, 0.4, 0.3), blob(-73.95, 40.8, 0.4, 0.3), blob(-118.25, 34.0, 0.5, 0.3)], line='african-american')
    S('Latter-day Saints of Utah', 1847, 2024, 'IE', 'People', 'American English', 'Mormon corridor', box(-113.5, 37.0, -110.8, 42.0))
    S('Midwestern German and Scandinavian Americans', 1850, 2024, 'IE', 'People', 'American English; German and Scandinavian heritage',
      'German Americans', box(-98.0, 42.5, -87.0, 47.8))
    S('Chinese Americans of the Bay Area', 1850, 2024, 'ST', 'People', 'English, Cantonese, Mandarin', 'Chinese Americans', blob(-122.2, 37.6, 0.5, 0.4))
    S('Cuban Americans of Miami', 1960, 2024, 'IE', 'People', 'English and Spanish', 'Cuban Americans', blob(-80.3, 25.8, 0.3, 0.25))
    S('Koreatown, Los Angeles', 1965, 2024, 'JK', 'People', 'Korean and English', 'Koreatown, Los Angeles', blob(-118.3, 34.06, 0.1, 0.06))

    # ---- Caribbean and Central America ----------------------------------------------------------
    S('Afro-Caribbean peoples', 1500, 2024, 'NC', 'People', 'Creoles, English, French, Spanish', 'Afro-Caribbean', [
        blob(-77.3, 18.1, 1.1, 0.4), blob(-73.2, 19.0, 1.4, 0.7), blob(-61.0, 13.5, 0.7, 2.0, rot=70)], line='afro-atlantic')
    S('Cubans', 1500, 2024, 'IE', 'People', 'Cuban Spanish', 'Cubans', box(-85.0, 19.8, -74.0, 23.3))
    S('Garifuna', 1797, 2024, 'AD', 'People', 'Garifuna (Arawakan)', 'Garifuna', box(-89.0, 15.6, -83.0, 17.2))

    # ---- Oceania ---------------------------------------------------------------------------------
    S('Rapa Nui', 1200, 2024, 'AN', 'People', 'Rapa Nui (Polynesian)', 'Rapa Nui people', blob(-109.35, -27.12, 0.12, 0.09), line='polynesia')
    S('Fijians', 1500, 2024, 'AN', 'People', 'Fijian (Austronesian)', 'Fijians', blob(178.0, -17.8, 1.0, 0.7))
    S('Yolngu (Arnhem Land)', -3400, 2024, 'PA', 'People', 'Yolŋu Matha (Pama-Nyungan)', 'Yolngu', box(134.0, -14.5, 137.0, -11.5))
    S('Noongar', -3400, 2024, 'PA', 'People', 'Noongar (Pama-Nyungan)', 'Noongar', box(115.0, -35.2, 119.5, -30.0))
    S('Kulin nation', -3400, 2024, 'PA', 'People', 'Kulin languages (Pama-Nyungan)', 'Kulin', box(143.0, -38.6, 146.8, -36.0))
    S('New Zealanders (Pākehā and Māori civilization)', 1840, 2024, 'IE', 'People', 'English and Māori', 'New Zealanders', box(166.0, -47.5, 178.8, -34.2))

    # ---- Overseas Chinese and Indian diasporas ----------------------------------------------------
    S('Overseas Chinese of Nanyang', 1400, 2024, 'ST', 'People', 'Hokkien, Teochew, Cantonese, Hakka and local languages',
      'Overseas Chinese', [blob(103.8, 1.35, 0.3, 0.2), blob(100.4, 5.4, 0.3, 0.3), blob(106.8, -6.2, 0.4, 0.2), blob(100.5, 13.75, 0.4, 0.3),
                           blob(121.0, 14.6, 0.3, 0.2)], note='Merchant and labour communities across Southeast Asia, many of them for centuries.')
    S('Indian diaspora of the Indian Ocean', 1830, 2024, 'IE', 'People', 'Gujarati, Tamil, Bhojpuri and local languages', 'Indian diaspora',
      [blob(36.8, -1.3, 1.0, 0.7), blob(31.0, -29.9, 0.7, 0.7), blob(57.5, -20.2, 0.3, 0.3), blob(178.0, -17.8, 0.8, 0.6), blob(-58.2, 6.8, 0.8, 0.5)])
