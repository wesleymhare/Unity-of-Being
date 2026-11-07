"""Spheres and groups for the Societies lens, and the symbols (marks) on it.

Colour is by SPHERE OF INFLUENCE or GROUP, not by what kind of network it is: Latin
Christendom is one colour and Orthodox Christendom another, the Chinese tributary
system and the Overseas Chinese share a colour, and so on. Kind (trade network,
company, church...) is still stored and shown as the "Type" fact in the panel.

Marks are symbols on top of the lines, dots and areas:
    'c'  crossed swords   a frontier or conflict zone
    'x'  handshake        a trade or syncretism zone (a place where peoples, faiths or
                          goods met and blended)
Lines are logistical networks and dots are hubs (see docs/SOCIETIES.md).
"""

GROUPS = {
    'Ancient Near East and Mediterranean': ('#d9a441', 'Bronze and Iron Age trade, road and post systems of the Near East and Mediterranean'),
    'Steppe and Inner Asia': ('#b79f6e', 'Nomadic confederations and the caravan and relay systems that crossed their lands'),
    'Maritime Asia and the Pacific': ('#35b3c4', 'Monsoon trade, Srivijaya and the voyaging peoples of the Indian and Pacific oceans'),
    'Chinese sphere': ('#e0453f', 'The Chinese tributary order, its canal and its diaspora'),
    'Islamic world and the Sahel': ('#38b06a', 'Pilgrimage and caravan systems of the Muslim world, the Sahara and the Swahili coast'),
    'Buddhist and Indic world': ('#f0782a', 'The spread of Buddhism along the roads of Asia'),
    'Orthodox and Eastern Christendom': ('#9a6fd0', 'The Orthodox churches, the Church of the East and the early and Aksumite church'),
    'Latin Christendom and the Catholic world': ('#5468e0', 'The Latin church, the Catholic Church worldwide and the Jesuit missions'),
    'Italian maritime republics': ('#e06fb0', 'Venice and Genoa'),
    'Northern and Baltic trade': ('#6fa0a8', 'The Hanseatic League and the Varangian and Volga river routes'),
    'Iberian empires': ('#b8683a', 'Portuguese and Spanish oceanic routes'),
    'Northwest European chartered companies': ('#3f8bd9', 'The VOC, the British East India Company and Hudson\'s Bay, and the opium trade'),
    'Atlantic slave system': ('#8a4f8a', 'The transatlantic slave trade'),
    'Indigenous American systems': ('#8c6a3a', 'The Inca road system, the Aztec Triple Alliance and the Haudenosaunee'),
    'Russian empire': ('#8a9a2e', 'The Russian-American Company and the Trans-Siberian Railway'),
    'Communist movement': ('#b5123a', 'The Comintern, the Chinese Communist base areas and the Warsaw Pact'),
    'Western bloc': ('#7fd0e8', 'NATO and the European Union'),
    'Dynastic and banking houses': ('#c8b6e2', 'Families and houses whose marriages, credit and courts held parts of Europe together'),
    'Global institutions and infrastructure': ('#d4d9de', 'The United Nations, the Red Cross, telegraph cables and container shipping'),
}

GROUP_OF = {}
for _group, _names in {
    'Ancient Near East and Mediterranean': [
        'Uruk expansion', 'Indus–Mesopotamia trade (Meluhha)', 'Phoenician and Carthaginian network',
        'Greek colonial network', 'Incense Route', 'Royal Road', 'Roman road and post network'],
    'Steppe and Inner Asia': [
        'Silk Road (overland)', 'Mongol yam relay system', 'Ancient Tea Horse Road', 'Steppe nomadic confederations'],
    'Maritime Asia and the Pacific': [
        'Indian Ocean trade network', 'Srivijaya', 'Lapita and Polynesian voyaging'],
    'Chinese sphere': ['Grand Canal (China)', 'Overseas Chinese networks', 'Chinese tributary system'],
    'Islamic world and the Sahel': ['Hajj caravans', 'Trans-Saharan trade', 'Swahili coast trade network'],
    'Buddhist and Indic world': ['Spread of Buddhism'],
    'Orthodox and Eastern Christendom': [
        'Early Christian communities', 'Church of the East', 'Orthodox Christendom', 'Kingdom of Aksum trade network'],
    'Latin Christendom and the Catholic world': [
        'Latin Christendom (the medieval Church)', 'Catholic Church worldwide', 'Society of Jesus missions', 'Knights Templar'],
    'Italian maritime republics': ['Venetian maritime network', 'Genoese trading network'],
    'Northern and Baltic trade': ['Varangian and Volga river routes', 'Hanseatic League'],
    'Iberian empires': [
        'Carreira da Índia (Portuguese India route)', 'Spanish treasure fleets (Carrera de Indias)', 'Manila galleon route'],
    'Northwest European chartered companies': [
        'Dutch East India Company network (VOC)', "Hudson's Bay fur-trade network", 'British East India Company',
        'Opium trade to China'],
    'Atlantic slave system': ['Transatlantic slave trade'],
    'Indigenous American systems': [
        'Qhapaq Ñan (Inca road system)', 'Aztec Triple Alliance and pochteca', 'Haudenosaunee Confederacy'],
    'Russian empire': ['Trans-Siberian Railway', 'Russian-American Company'],
    'Communist movement': [
        'Communist International (Comintern)', 'Chinese Communist base areas and Long March', 'Warsaw Pact and Soviet bloc'],
    'Western bloc': ['NATO', 'European Union'],
    'Dynastic and banking houses': ['Habsburg dynastic network (1477-1700)', 'Medici banking network'],
    'Global institutions and infrastructure': [
        'Container shipping network', 'Submarine telegraph cables',
        'International Red Cross and Red Crescent Movement', 'United Nations system'],
}.items():
    for _name in _names:
        GROUP_OF[_name] = _group

# (network, place or zone, longitude, latitude, 'c' conflict or 'x' exchange, first year, last year)
MARKS = [
    # frontiers and conflict zones
    ('Roman road and post network', 'Rhine–Danube frontier (limes)', 10.5, 48.9, 'c', 9, 476),
    ('Roman road and post network', 'Euphrates frontier with Parthia and Persia', 39.0, 36.0, 'c', -53, 476),
    ('Steppe nomadic confederations', 'Great Wall frontier', 112.0, 40.6, 'c', -214, 1644),
    ('Chinese tributary system', 'Ming–Mongol frontier (the Nine Garrisons)', 111.0, 40.0, 'c', 1368, 1644),
    ('Latin Christendom (the medieval Church)', 'Reconquista frontier in Iberia', -4.5, 39.0, 'c', 718, 1492),
    ('Latin Christendom (the medieval Church)', 'Crusader states', 35.6, 33.0, 'c', 1099, 1291),
    ('Latin Christendom (the medieval Church)', 'Baltic crusades', 23.0, 57.0, 'c', 1198, 1410),
    ('Orthodox Christendom', 'Byzantine–Arab frontier (the Taurus)', 35.5, 37.5, 'c', 650, 1000),
    ('Orthodox Christendom', 'Ottoman advance on the Balkans', 26.0, 41.5, 'c', 1354, 1453),
    ('Mongol yam relay system', 'Mongol–Jin and Song frontier', 113.0, 34.5, 'c', 1211, 1279),
    ('Haudenosaunee Confederacy', 'Beaver Wars frontier', -76.0, 43.0, 'c', 1640, 1701),
    ('Aztec Triple Alliance and pochteca', 'Flower-war frontier with Tlaxcala', -98.2, 19.3, 'c', 1428, 1521),
    ('Dutch East India Company network (VOC)', 'Spice wars: Banda and the Moluccas', 129.9, -4.5, 'c', 1609, 1667),
    ('Chinese Communist base areas and Long March', 'Jiangxi encirclement campaigns', 115.5, 26.5, 'c', 1930, 1934),
    ('Communist International (Comintern)', 'Spanish Civil War', -3.7, 40.4, 'c', 1936, 1939),
    ('Warsaw Pact and Soviet bloc', 'Inner German border (Iron Curtain)', 10.5, 52.2, 'c', 1955, 1990),
    ('NATO', 'Russo-Ukrainian war front', 37.5, 48.0, 'c', 2014, 2026),
    # trade and syncretism zones
    ('Silk Road (overland)', 'Gandhara: Greek, Buddhist and Indian exchange', 71.5, 34.2, 'x', -130, 400),
    ('Silk Road (overland)', 'Dunhuang: Buddhist, Manichaean and Nestorian exchange', 94.7, 40.1, 'x', 400, 1000),
    ('Silk Road (overland)', 'Sogdian trade colonies of Samarkand', 66.97, 39.65, 'x', 500, 1200),
    ('Greek colonial network', 'Naukratis: Greek and Egyptian trade port', 30.6, 30.9, 'x', -650, -330),
    ('Incense Route', 'Petra: Nabataean, Greek and Roman crossroads', 35.45, 30.3, 'x', -300, 106),
    ('Indian Ocean trade network', 'Quanzhou: foreign quarters', 118.6, 24.9, 'x', 700, 1400),
    ('Indian Ocean trade network', 'Calicut', 75.8, 11.25, 'x', -100, 1500),
    ('Indian Ocean trade network', 'Malacca', 102.25, 2.2, 'x', 1400, 1511),
    ('Swahili coast trade network', 'Kilwa: Bantu, Arab and Persian blend', 39.5, -8.96, 'x', 900, 1500),
    ('Trans-Saharan trade', 'Timbuktu', -3.0, 16.77, 'x', 1100, 1591),
    ('Hanseatic League', 'Novgorod: Hanse and Rus exchange', 31.3, 58.5, 'x', 1200, 1494),
    ('Varangian and Volga river routes', 'Kyiv: Norse, Slavic and Byzantine blend', 30.5, 50.45, 'x', 860, 1100),
    ('Venetian maritime network', 'Constantinople: the Venetian quarter', 28.98, 41.02, 'x', 1082, 1453),
    ('Genoese trading network', 'Caffa on the Black Sea', 35.38, 45.0, 'x', 1266, 1475),
    ('Manila galleon route', 'Manila: Chinese, Spanish and Mexican exchange', 120.98, 14.6, 'x', 1571, 1815),
    ('Carreira da Índia (Portuguese India route)', 'Goa', 73.85, 15.5, 'x', 1510, 1700),
    ('Carreira da Índia (Portuguese India route)', 'Macau', 113.55, 22.2, 'x', 1557, 1700),
    ('Dutch East India Company network (VOC)', 'Dejima trading post', 129.87, 32.75, 'x', 1641, 1799),
    ('Opium trade to China', 'Canton factories', 113.25, 23.1, 'x', 1773, 1842),
    ('Spread of Buddhism', 'Kucha: Indo-Iranian and Chinese blend', 82.95, 41.7, 'x', 200, 800),
    ('Church of the East', "Chang'an: the Nestorian stele", 108.9, 34.3, 'x', 635, 845),
    ('Society of Jesus missions', 'Beijing: Jesuits at court', 116.4, 39.9, 'x', 1601, 1773),
    ('Society of Jesus missions', 'Paraguay missions', -57.0, -27.0, 'x', 1609, 1767),
    ("Hudson's Bay fur-trade network", 'Red River: Métis communities', -97.1, 49.9, 'x', 1700, 1870),
    ('Overseas Chinese networks', 'Nanyang: Peranakan and Chinese Malay blend', 103.8, 1.3, 'x', 1600, 2026),
]
