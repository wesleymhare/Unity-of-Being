"""More Societies: religious networks, NGOs and international bodies, states and confederacies,
ethnic and diaspora networks, and networks of the Americas, Africa and the Pacific.
Imported at the end of societies_data.py; same helpers (net, R, Z, blob)."""
from societies_data import ENTITIES, net, R, Z, blob  # noqa: E402

TRADE, COMPANY, LOGI = 'Trade network', 'Company or maritime system', 'Communications and logistics'
STATE, FACTION, COMM = 'State or confederacy', 'Faction or party', 'Community, diaspora or ethnic group'
RELIG, NGO, CLAND = 'Religious network', 'NGO or international organisation', 'Clandestine network'

# ---- Early and ancient ---------------------------------------------------------------------------------
net('Roman road and post network', LOGI, -312, 476, 'Roman roads',
    'Stone-paved military roads with mansiones, milestones and the imperial courier service (cursus publicus) tying the empire to Rome.',
    routes=[R([(12.5, 41.9), (14.25, 40.85), (17.94, 40.63)]), R([(19.45, 41.32), (22.94, 40.64), (26.5, 40.9), (28.98, 41.0)]),
            R([(12.5, 41.9), (11.25, 43.77), (9.19, 45.46), (7.7, 45.07), (4.83, 45.76), (2.35, 48.85), (6.96, 50.94)]),
            R([(12.5, 41.9), (8.0, 43.7), (4.8, 43.67), (3.0, 43.18), (1.25, 41.12), (-3.7, 37.9), (-6.29, 36.53)]),
            R([(28.98, 41.0), (32.8, 39.9), (36.15, 36.2), (35.2, 31.8), (31.24, 30.04)]),
            R([(12.5, 41.9), (12.33, 45.44), (16.86, 48.11)])],
    nodes=[('Rome', 12.5, 41.9, 'major'), ('Brundisium', 17.94, 40.63), ('Dyrrachium', 19.45, 41.32), ('Thessalonica', 22.94, 40.64), ('Byzantium', 28.98, 41.0, 'major'),
           ('Mediolanum (Milan)', 9.19, 45.46), ('Lugdunum (Lyon)', 4.83, 45.76, 'major'), ('Colonia Agrippina', 6.96, 50.94), ('Tarraco', 1.25, 41.12), ('Gades', -6.29, 36.53),
           ('Antioch', 36.15, 36.2, 'major'), ('Aelia Capitolina', 35.2, 31.8), ('Alexandria', 31.24, 30.04), ('Carnuntum', 16.86, 48.11)])

net('Kingdom of Aksum trade network', STATE, 100, 940, 'Kingdom of Aksum',
    'A Red Sea and Nile highland state whose port of Adulis tied the Horn of Africa to Rome, Arabia and India.',
    routes=[R([(38.72, 14.13), (39.45, 15.25)]), R([(39.45, 15.25), (37.0, 19.0), (35.48, 23.91)], sea=True), R([(39.45, 15.25), (43.0, 12.7), (45.0, 12.8), (50.0, 12.3), (62.0, 19.0), (73.0, 18.97)], sea=True),
            R([(38.72, 14.13), (36.0, 14.0), (33.7, 16.0), (33.77, 18.5)])],
    nodes=[('Aksum', 38.72, 14.13, 'major'), ('Adulis', 39.45, 15.25, 'major'), ('Berenike', 35.48, 23.91), ('Meroë', 33.77, 16.94), ('Muziris/Barygaza (India)', 73.0, 18.97)])

net('Early Christian communities', RELIG, 40, 320, 'Early Christianity',
    'Letter-linked congregations along Roman roads and sea lanes from Jerusalem to Rome, Alexandria and Carthage.',
    routes=[R([(35.22, 31.78), (36.15, 36.2), (32.8, 39.9), (27.34, 37.94), (22.93, 37.91), (22.94, 40.64)]), R([(22.93, 37.91), (19.0, 38.0), (12.5, 41.9)], sea=True),
            R([(35.22, 31.78), (31.24, 30.04)]), R([(12.5, 41.9), (10.32, 36.85)], sea=True)],
    nodes=[('Jerusalem', 35.22, 31.78, 'major'), ('Antioch', 36.15, 36.2, 'major'), ('Ephesus', 27.34, 37.94), ('Corinth', 22.93, 37.91), ('Thessalonica', 22.94, 40.64),
           ('Rome', 12.5, 41.9, 'major'), ('Alexandria', 31.24, 30.04, 'major'), ('Carthage', 10.32, 36.85)])

net('Spread of Buddhism', RELIG, -250, 1200, 'Spread of Buddhism',
    'Monasteries, pilgrims and translators carrying Buddhism from the Ganges plain along the Silk Road and sea lanes to China, Korea, Japan and Southeast Asia.',
    routes=[R([(85.14, 25.6), (84.99, 24.7), (72.8, 33.74), (67.82, 34.84), (75.99, 39.47), (94.7, 40.1), (108.9, 34.3), (112.45, 34.62), (129.2, 35.84), (135.8, 34.69)]),
            R([(85.14, 25.6), (80.4, 8.35), (104.75, -2.99), (113.3, 23.1)], sea=True)],
    nodes=[('Pataliputra', 85.14, 25.6, 'major'), ('Bodh Gaya', 84.99, 24.7), ('Taxila', 72.8, 33.74), ('Bamiyan', 67.82, 34.84), ('Dunhuang', 94.7, 40.1),
           ("Chang'an", 108.9, 34.3, 'major'), ('Luoyang', 112.45, 34.62), ('Gyeongju', 129.2, 35.84), ('Nara', 135.8, 34.69), ('Anuradhapura', 80.4, 8.35), ('Palembang', 104.75, -2.99)])

net('Church of the East', RELIG, 400, 1400, 'Church of the East',
    'A Syriac Christian network of dioceses and monasteries from Mesopotamia across Central Asia to China and the Malabar coast.',
    routes=[R([(44.58, 33.09), (51.4, 35.6), (62.2, 37.6), (66.97, 39.65), (75.99, 39.47), (94.7, 40.1), (108.9, 34.3)]), R([(44.58, 33.09), (56.5, 27.1), (67.0, 24.85), (76.27, 9.97)], sea=True)],
    nodes=[('Seleucia-Ctesiphon', 44.58, 33.09, 'major'), ('Merv', 62.2, 37.6), ('Samarkand', 66.97, 39.65), ('Kashgar', 75.99, 39.47), ("Chang'an", 108.9, 34.3, 'major'), ('Kochi (Malabar)', 76.27, 9.97)])

net('Society of Jesus missions', RELIG, 1540, 1773, 'Society of Jesus',
    'A centrally governed order with colleges and missions from Rome to Goa, Macau, Beijing, Quebec and the Paraguayan reductions.',
    routes=[R([(12.5, 41.9), (-9.14, 38.7), (-38.5, -12.97), (-57.6, -25.3)], sea=True), R([(-9.14, 38.7), (18.4, -34.4), (73.8, 15.5), (113.54, 22.2)], sea=True),
            R([(113.54, 22.2), (113.3, 23.1), (116.4, 39.9)]), R([(-9.14, 38.7), (-50.0, 45.0), (-71.2, 46.8)], sea=True)],
    zones=[Z(blob(-55.5, -27.5, 2.0, 2.0), s=1609, e=1767)],
    nodes=[('Rome', 12.5, 41.9, 'major'), ('Goa', 73.8, 15.5, 'major'), ('Macau', 113.54, 22.2), ('Beijing', 116.4, 39.9, 'major'), ('Quebec', -71.2, 46.8), ('Asunción', -57.6, -25.3), ('Salvador', -38.5, -12.97)])

# ---- Asia and the Indian Ocean -----------------------------------------------------------------------------
net('Srivijaya', STATE, 650, 1377, 'Srivijaya',
    'A Malay sea power controlling the Strait of Malacca through port polities that tolled and protected shipping between China and India.',
    routes=[R([(104.75, -2.99), (103.6, -1.6), (102.2, 2.2), (100.5, 6.1), (99.96, 8.43)], sea=True), R([(104.75, -2.99), (106.85, -6.2), (110.4, -7.8)], sea=True)],
    nodes=[('Palembang', 104.75, -2.99, 'major'), ('Jambi', 103.6, -1.6), ('Kedah', 100.5, 6.1), ('Nakhon Si Thammarat', 99.96, 8.43), ('Java ports', 110.4, -7.8)])

net('Grand Canal (China)', LOGI, 605, 1900, 'Grand Canal (China)',
    'An artificial waterway system carrying grain tribute from the Yangtze delta to the northern capitals.',
    routes=[R([(120.16, 30.27), (120.6, 31.3), (119.4, 32.4), (119.0, 33.5), (116.6, 35.4), (115.7, 36.85), (117.2, 39.1), (116.4, 39.9)])],
    nodes=[('Hangzhou', 120.16, 30.27, 'major'), ('Suzhou', 120.6, 31.3), ('Yangzhou', 119.4, 32.4), ("Huai'an", 119.0, 33.5), ('Jining', 116.6, 35.4), ('Tianjin', 117.2, 39.1), ('Beijing', 116.4, 39.9, 'major')])

net('Ancient Tea Horse Road', TRADE, 600, 1950, 'Ancient Tea Horse Road',
    'Caravan tracks carrying tea from Yunnan and Sichuan to Tibet in exchange for horses.',
    routes=[R([(100.97, 22.8), (100.2, 25.6), (100.2, 26.9), (99.7, 28.5), (97.0, 29.2), (91.1, 29.65)]), R([(103.0, 30.0), (102.0, 30.05), (97.2, 30.5), (91.1, 29.65)])],
    nodes=[("Pu'er", 100.97, 22.8), ('Dali', 100.2, 25.6), ('Lijiang', 100.2, 26.9), ("Ya'an", 103.0, 30.0), ('Kangding', 102.0, 30.05), ('Lhasa', 91.1, 29.65, 'major')])

net('Overseas Chinese networks', COMM, 1600, 2024, 'Overseas Chinese',
    'Clan, dialect and guild associations linking Fujian and Guangdong to the ports of Southeast Asia and beyond.',
    routes=[R([(118.1, 24.5), (120.98, 14.6)], sea=True), R([(118.1, 24.5), (106.85, -6.2)], sea=True), R([(118.1, 24.5), (103.8, 1.27), (100.5, 13.75)], sea=True), R([(113.3, 23.1), (150.0, 30.0), (179.9, 35.0)], sea=True), R([(-179.9, 35.0), (-122.4, 37.8)], sea=True)],
    nodes=[('Xiamen', 118.1, 24.5, 'major'), ('Manila', 120.98, 14.6), ('Batavia', 106.85, -6.2), ('Singapore', 103.8, 1.27, 'major'), ('Bangkok', 100.5, 13.75)])

net('British East India Company', COMPANY, 1600, 1874, 'East India Company',
    'A chartered company that grew from factories into a territorial state with its own army, fleet and monopoly trade.',
    routes=[R([(-0.12, 51.5), (-9.0, 40.0), (-15.0, 25.0), (-5.0, -20.0), (18.4, -34.4), (50.0, -25.0), (72.83, 18.97)], sea=True), R([(72.83, 18.97), (80.27, 13.08), (88.36, 22.57)], sea=True),
            R([(88.36, 22.57), (98.0, 8.0), (103.8, 1.27), (113.3, 23.1)], sea=True)],
    nodes=[('London', -0.12, 51.5, 'major'), ('Cape Town', 18.4, -33.9), ('Bombay', 72.83, 18.97, 'major'), ('Madras', 80.27, 13.08), ('Calcutta', 88.36, 22.57, 'major'), ('Singapore', 103.8, 1.27), ('Canton', 113.3, 23.1, 'major')])

net('Opium trade to China', TRADE, 1773, 1910, 'Opium trade',
    'Bengal opium auctioned at Calcutta, carried by country traders to Lintin and Canton and paid for in silver and tea.',
    routes=[R([(85.14, 25.6), (88.36, 22.57)]), R([(88.36, 22.57), (98.0, 8.0), (103.8, 1.27), (113.8, 22.4)], sea=True), R([(72.83, 18.97), (80.0, 7.0), (103.8, 1.27)], sea=True)],
    nodes=[('Patna', 85.14, 25.6), ('Calcutta', 88.36, 22.57, 'major'), ('Lintin Island', 113.8, 22.4, 'major'), ('Bombay', 72.83, 18.97)])

net('Trans-Siberian Railway', LOGI, 1891, 2024, 'Trans-Siberian Railway',
    'The rail spine of the Russian east, 9,000 km from Moscow to the Pacific, with later branches to Mongolia and China.',
    routes=[R([(37.6, 55.75), (60.6, 56.84), (82.9, 55.0), (104.3, 52.3), (113.5, 52.03), (131.9, 43.1)])],
    nodes=[('Moscow', 37.6, 55.75, 'major'), ('Yekaterinburg', 60.6, 56.84), ('Novosibirsk', 82.9, 55.0), ('Irkutsk', 104.3, 52.3), ('Chita', 113.5, 52.03), ('Vladivostok', 131.9, 43.1, 'major')])

net('Container shipping network', COMPANY, 1956, 2024, 'Containerization',
    'The standardised box and a few dozen hub ports now carry most manufactured trade between East Asia, Europe and North America.',
    routes=[R([(121.5, 31.2), (103.8, 1.27), (79.85, 6.9), (55.03, 25.0), (43.0, 12.6), (32.55, 29.97), (15.0, 35.0), (4.48, 51.92)], sea=True),
            R([(121.5, 31.2), (150.0, 38.0), (179.9, 40.0)], sea=True), R([(-179.9, 40.0), (-150.0, 38.0), (-118.27, 33.74)], sea=True),
            R([(4.48, 51.92), (-30.0, 46.0), (-74.0, 40.5)], sea=True)],
    nodes=[('Shanghai', 121.5, 31.2, 'major'), ('Singapore', 103.8, 1.27, 'major'), ('Jebel Ali', 55.03, 25.0), ('Suez', 32.55, 29.97), ('Rotterdam', 4.48, 51.92, 'major'), ('Los Angeles–Long Beach', -118.27, 33.74, 'major'), ('New York–New Jersey', -74.0, 40.5)])

# ---- Africa ---------------------------------------------------------------------------------------------------
# ---- Americas ---------------------------------------------------------------------------------------------
net('Aztec Triple Alliance and pochteca', STATE, 1428, 1521, 'Aztec Triple Alliance',
    'Tenochtitlan, Texcoco and Tlacopan collected tribute from some 38 provinces while pochteca merchants carried goods and intelligence beyond the frontier.',
    routes=[R([(-99.13, 19.43), (-96.7, 17.06), (-96.1, 18.1)]), R([(-99.13, 19.43), (-95.0, 16.5), (-92.3, 14.9)]), R([(-99.13, 19.43), (-98.88, 19.51)])],
    nodes=[('Tenochtitlan', -99.13, 19.43, 'major'), ('Texcoco', -98.88, 19.51), ('Tlacopan', -99.2, 19.46), ('Oaxaca', -96.7, 17.06), ('Tochtepec', -96.1, 18.1), ('Xoconochco', -92.3, 14.9)])

net('Haudenosaunee Confederacy', STATE, 1450, 1779, 'Iroquois',
    'Five (later six) nations bound by the Great Law and a shared council fire at Onondaga, acting as one in diplomacy, war and the fur trade.',
    routes=[R([(-73.9, 42.9), (-75.2, 43.0), (-76.15, 43.0), (-76.7, 42.9), (-77.0, 42.8), (-78.0, 42.8)])],
    nodes=[('Mohawk', -73.9, 42.9), ('Oneida', -75.2, 43.0), ('Onondaga (council fire)', -76.15, 43.0, 'major'), ('Cayuga', -76.7, 42.9), ('Seneca', -77.0, 42.8)])

# ---- Pacific ----------------------------------------------------------------------------------------------
net('Lapita and Polynesian voyaging', COMM, -1000, 1400, 'Polynesian navigation',
    'Navigators who crossed the open Pacific by canoe, settling and keeping exchange between islands from Samoa and Tonga to Hawaiʻi, Rapa Nui and Aotearoa.',
    routes=[R([(178.0, -17.8), (179.9, -17.5)], sea=True), R([(-179.9, -17.5), (-172.1, -13.8), (-149.4, -17.65)], sea=True), R([(-149.4, -17.65), (-140.0, -9.0), (-155.5, 19.7)], sea=True),
            R([(-149.4, -17.65), (-109.4, -27.1)], sea=True), R([(-149.4, -17.65), (-159.8, -21.2), (-179.9, -31.0)], sea=True), R([(179.9, -31.5), (174.8, -41.0)], sea=True)],
    nodes=[('Fiji', 178.0, -17.8), ('Samoa', -172.1, -13.8, 'major'), ('Tahiti (Society Islands)', -149.4, -17.65, 'major'), ('Marquesas', -140.0, -9.0), ('Hawaiʻi', -155.5, 19.7, 'major'),
           ('Rapa Nui', -109.4, -27.1), ('Rarotonga', -159.8, -21.2), ('Aotearoa', 174.8, -41.0, 'major')])

# ---- Modern organisations --------------------------------------------------------------------------------
net('Submarine telegraph cables', LOGI, 1858, 1950, 'Submarine communications cable',
    'Laid by British and other cable companies, the first global electric communications network, joining empires, markets and newspapers.',
    routes=[R([(-10.3, 51.9), (-30.0, 50.0), (-53.4, 47.9)], sea=True), R([(-0.12, 50.8), (-9.0, 37.0), (14.5, 35.9), (29.9, 31.2), (43.0, 12.6), (72.83, 18.97)], sea=True),
            R([(72.83, 18.97), (80.27, 13.08), (103.8, 1.27), (114.2, 22.3)], sea=True), R([(103.8, 1.27), (115.0, -10.0), (130.8, -12.5), (151.2, -33.9)], sea=True),
            R([(-6.3, 36.5), (-17.0, 14.7), (-34.88, -8.05)], sea=True), R([(29.9, 31.2), (31.0, 30.0), (32.55, 29.97)], sea=True)],
    nodes=[('Valentia (Ireland)', -10.3, 51.9, 'major'), ("Heart's Content", -53.4, 47.9), ('Alexandria', 29.9, 31.2), ('Aden', 45.0, 12.8), ('Bombay', 72.83, 18.97, 'major'),
           ('Singapore', 103.8, 1.27, 'major'), ('Hong Kong', 114.2, 22.3), ('Darwin', 130.8, -12.5), ('Sydney', 151.2, -33.9)])

net('International Red Cross and Red Crescent Movement', NGO, 1863, 2024, 'International Red Cross and Red Crescent Movement',
    'A federation of national societies and the neutral ICRC in Geneva, carrying relief and protection into war and disaster zones.',
    routes=[R([(6.14, 46.2), (28.98, 41.0)]), R([(6.14, 46.2), (36.8, -1.29)]), R([(6.14, 46.2), (77.2, 28.6)]), R([(6.14, 46.2), (-77.04, 38.9)], sea=True), R([(6.14, 46.2), (151.2, -33.9)], sea=True)],
    nodes=[('Geneva (ICRC)', 6.14, 46.2, 'major'), ('Istanbul', 28.98, 41.0), ('Nairobi', 36.8, -1.29), ('New Delhi', 77.2, 28.6), ('Washington', -77.04, 38.9), ('Sydney', 151.2, -33.9)])

net('United Nations system', NGO, 1945, 2024, 'United Nations System',
    'A treaty organisation of member states with headquarters, agencies, peacekeeping and humanitarian operations across the world.',
    routes=[R([(-73.97, 40.75), (6.14, 46.2)], sea=True), R([(6.14, 46.2), (16.37, 48.2)]), R([(6.14, 46.2), (36.8, -1.29)]), R([(6.14, 46.2), (38.76, 9.03)]), R([(6.14, 46.2), (100.5, 13.75)])],
    nodes=[('New York (HQ)', -73.97, 40.75, 'major'), ('Geneva', 6.14, 46.2, 'major'), ('Vienna', 16.37, 48.2), ('Nairobi', 36.8, -1.29, 'major'), ('Addis Ababa', 38.76, 9.03), ('Bangkok', 100.5, 13.75)])


def add_zone(name, *zones):
    """Give an existing network areas of de facto control."""
    for ent in ENTITIES:
        if ent['name'] == name:
            ent['zones'].extend(zones)
            return
    raise KeyError(name)


# ---- Areas for the big networks -------------------------------------------------------------------------------
add_zone('Mongol yam relay system', Z(poly='Mongol Empire', s=1206, e=1293), Z(poly='Yuan Dynasty', s=1294, e=1368), Z(poly='Golden Horde', s=1294, e=1368))
add_zone('Royal Road', Z(poly='Achaemenid Empire'))
add_zone('Roman road and post network', Z(poly='Roman Empire', s=-31, e=117))
add_zone('Qhapaq Ñan (Inca road system)', Z(poly='Inca Empire'))
add_zone('Aztec Triple Alliance and pochteca', Z(poly='Aztec Triple Alliance'))
add_zone('Carreira da Índia (Portuguese India route)', Z(poly='Portuguese Empire', s=1502, e=1700))
add_zone('Spanish treasure fleets (Carrera de Indias)', Z(poly='Spanish Empire', s=1530, e=1790))
add_zone('Trans-Saharan trade', Z(poly='Mali Empire', s=1236, e=1450), Z(poly='Songhai Empire', s=1463, e=1594))
add_zone('Kingdom of Aksum trade network', Z(poly='Kingdom of Axum', s=100, e=940))
add_zone('Srivijaya', Z(poly='Srivijaya', s=682, e=1293))
add_zone('British East India Company', Z(countries=['India', 'Bangladesh', 'Pakistan'], s=1757, e=1858))
add_zone("Hudson's Bay fur-trade network", Z([(-95, 49.5), (-105, 49.5), (-110, 52.5), (-114, 54), (-111, 56), (-112, 59), (-102, 60), (-94, 59), (-90, 56), (-82, 52), (-78, 50), (-85, 49.5)], s=1670, e=1870))
add_zone('Haudenosaunee Confederacy', Z(poly='Haudenosaunee', s=1450, e=1779))

# ---- New: big organisations that hold ground ---------------------------------------------------------------
net('Latin Christendom (the medieval Church)', RELIG, 600, 1520, 'Western Christianity',
    'The western Church: dioceses, monasteries, tithes, canon law, universities and the Latin language held Western Europe together across its kingdoms, directed from Rome.',
    zones=[Z(countries=['Ireland', 'United Kingdom', 'France', 'Spain', 'Portugal', 'Italy', 'Belgium', 'Netherlands', 'Luxembourg', 'Switzerland', 'Austria', 'Germany',
                        'Denmark', 'Norway', 'Sweden', 'Poland', 'Czechia', 'Slovakia', 'Hungary', 'Croatia', 'Slovenia', 'Malta', 'Lithuania', 'Latvia', 'Estonia', 'Finland'])],
    routes=[R([(12.5, 41.9), (7.7, 45.07), (4.83, 45.76), (2.35, 48.85), (1.08, 51.28)]), R([(12.5, 41.9), (11.25, 43.77), (9.19, 45.46), (7.59, 47.56), (6.96, 50.94), (10.69, 53.87)]),
            R([(12.5, 41.9), (4.8, 43.67), (-0.58, 44.84), (-8.54, 42.88)]), R([(6.96, 50.94), (16.86, 48.11), (19.9, 50.06)])],
    nodes=[('Rome', 12.5, 41.9, 'major'), ('Avignon', 4.8, 43.95), ('Cluny', 4.66, 46.43), ('Paris', 2.35, 48.85), ('Canterbury', 1.08, 51.28), ('Cologne', 6.96, 50.94), ('Santiago de Compostela', -8.54, 42.88), ('Kraków', 19.9, 50.06)])

net('Catholic Church worldwide', RELIG, 1521, 2024, 'Catholic Church',
    'A global hierarchy of dioceses, parishes, orders, schools and hospitals, with the Holy See at Rome and the Jesuit and mendicant missions carrying it across the world.',
    zones=[Z(countries=['Spain', 'Portugal', 'Italy', 'France', 'Ireland', 'Poland', 'Austria', 'Belgium', 'Croatia', 'Slovenia', 'Slovakia', 'Lithuania', 'Malta', 'Hungary',
                        'Mexico', 'Guatemala', 'Honduras', 'El Salvador', 'Nicaragua', 'Costa Rica', 'Panama', 'Cuba', 'Dominican Republic', 'Colombia', 'Venezuela', 'Ecuador', 'Peru',
                        'Bolivia', 'Chile', 'Argentina', 'Uruguay', 'Paraguay', 'Brazil', 'Philippines', 'East Timor', 'Angola', 'Democratic Republic of the Congo', 'Republic of the Congo', 'Uganda', 'Burundi', 'Rwanda', 'Equatorial Guinea'])],
    routes=[R([(12.5, 41.9), (-9.14, 38.7), (-38.5, -12.97)], sea=True), R([(12.5, 41.9), (-3.7, 40.4), (-99.13, 19.43)], sea=True), R([(12.5, 41.9), (15.3, -4.3)]), R([(12.5, 41.9), (120.98, 14.6)], sea=True)],
    nodes=[('Rome (Holy See)', 12.5, 41.9, 'major'), ('Mexico City', -99.13, 19.43), ('São Paulo', -46.63, -23.55), ('Kinshasa', 15.3, -4.3), ('Manila', 120.98, 14.6)])

net('Orthodox Christendom', RELIG, 330, 2024, 'Eastern Orthodox Church',
    'A communion of self-governing churches, with patriarchates at Constantinople, Antioch, Alexandria, Jerusalem and Moscow, tying together the Balkans, Rus\', Georgia and Ethiopia.',
    zones=[Z(countries=['Greece', 'Cyprus', 'Bulgaria', 'Serbia', 'Montenegro', 'North Macedonia', 'Romania', 'Moldova', 'Ukraine', 'Belarus', 'Russia', 'Georgia'])],
    routes=[R([(28.98, 41.0), (30.52, 50.45), (37.6, 55.75)]), R([(28.98, 41.0), (22.94, 40.64), (20.46, 44.8)])],
    nodes=[('Constantinople', 28.98, 41.0, 'major'), ('Kyiv', 30.52, 50.45), ('Moscow', 37.6, 55.75, 'major'), ('Mount Athos', 24.33, 40.16), ('Belgrade', 20.46, 44.8)])

net('Steppe nomadic confederations', STATE, -209, 1695, 'Nomadic empire',
    'Successive horse-nomad federations held the grasslands from Manchuria to the Danube: the Xiongnu, Göktürks, Khazars, Mongols and the Golden Horde, living off herds, tribute and taxing the caravans.',
    zones=[Z(poly='Xiongnu', s=-209, e=153), Z(poly='Göktürk Khaganate', s=555, e=659), Z(poly='Khazaria', s=700, e=900), Z(poly='Mongol Empire', s=1206, e=1293), Z(poly='Golden Horde', s=1294, e=1695)],
    nodes=[('Ötükän', 102.0, 47.5), ('Karakorum', 102.8, 47.2, 'major'), ('Itil', 47.9, 46.35), ('Sarai', 46.0, 48.7, 'major')])

net('Chinese tributary system', STATE, 1368, 1911, 'Tributary system of China',
    'Ming and Qing diplomacy made the Chinese court the centre of an order of tributary kingdoms, whose missions carried trade and recognition under imperial supervision.',
    zones=[Z(countries=['South Korea', 'North Korea', 'Vietnam', 'Laos', 'Thailand', 'Myanmar', 'Nepal', 'Mongolia', 'Cambodia', 'Malaysia', 'Brunei', 'Bhutan'])],
    routes=[R([(116.4, 39.9), (126.98, 37.57)]), R([(116.4, 39.9), (105.85, 21.03)]), R([(116.4, 39.9), (127.7, 26.2)], sea=True), R([(116.4, 39.9), (100.5, 13.75)], sea=True)],
    nodes=[('Beijing', 116.4, 39.9, 'major'), ('Hanseong (Seoul)', 126.98, 37.57), ('Thăng Long (Hanoi)', 105.85, 21.03), ('Shuri (Ryukyu)', 127.7, 26.2), ('Ayutthaya', 100.55, 14.35)])

net('Russian-American Company', COMPANY, 1799, 1867, 'Russian-American Company',
    'A chartered fur-trading company that governed Alaska and posts down the Pacific coast to California, supplied by sea from Siberia.',
    zones=[Z([(-168, 54.5), (-141, 60), (-141, 69.5), (-156, 71.3), (-166, 68), (-165, 62), (-162, 58)])],
    routes=[R([(158.65, 53.0), (-179.9, 52.0)], sea=True), R([(179.9, 52.0), (-152.4, 57.8), (-135.3, 57.05), (-123.2, 38.5)], sea=True)],
    nodes=[('Petropavlovsk', 158.65, 53.0), ('Kodiak', -152.4, 57.8), ('Novo-Arkhangelsk (Sitka)', -135.3, 57.05, 'major'), ('Fort Ross', -123.2, 38.5)])

net('NATO', NGO, 1949, 2024, 'NATO',
    'A collective-defence alliance with an integrated command, shared standards, bases and pre-positioned logistics across North America and Europe.',
    zones=[Z(countries=['United States of America', 'Canada', 'United Kingdom', 'France', 'Germany', 'Italy', 'Spain', 'Portugal', 'Belgium', 'Netherlands', 'Luxembourg', 'Denmark', 'Norway',
                        'Iceland', 'Greece', 'Turkey', 'Poland', 'Czechia', 'Hungary', 'Romania', 'Bulgaria', 'Slovakia', 'Slovenia', 'Croatia', 'Albania', 'Montenegro', 'North Macedonia',
                        'Estonia', 'Latvia', 'Lithuania', 'Finland', 'Sweden'])],
    routes=[R([(-77.04, 38.9), (-30.0, 48.0), (4.35, 50.85)], sea=True)],
    nodes=[('Brussels (HQ)', 4.35, 50.85, 'major'), ('Washington', -77.04, 38.9), ('Ramstein', 7.6, 49.44), ('Norfolk', -76.3, 36.85)])

net('Warsaw Pact and Soviet bloc', NGO, 1955, 1991, 'Warsaw Pact',
    'The Soviet-led military alliance and its economic council, with Soviet garrisons, shared railways and gas and oil pipelines binding Eastern Europe to Moscow.',
    zones=[Z(countries=['Russia', 'Ukraine', 'Belarus', 'Poland', 'Czechia', 'Slovakia', 'Hungary', 'Romania', 'Bulgaria', 'Lithuania', 'Latvia', 'Estonia', 'Moldova', 'Georgia', 'Armenia', 'Azerbaijan',
                        'Kazakhstan', 'Uzbekistan', 'Turkmenistan', 'Tajikistan', 'Kyrgyzstan'])],
    routes=[R([(37.6, 55.75), (27.5, 53.9), (21.0, 52.2), (13.4, 52.5)]), R([(37.6, 55.75), (30.52, 50.45), (19.04, 47.5)])],
    nodes=[('Moscow', 37.6, 55.75, 'major'), ('Warsaw', 21.0, 52.2), ('Berlin', 13.4, 52.5), ('Budapest', 19.04, 47.5)])

net('European Union', NGO, 1993, 2024, 'European Union',
    'A union of states with a single market, shared law, common borders and trans-European transport, energy and payment networks.',
    zones=[Z(countries=['France', 'Germany', 'Italy', 'Spain', 'Portugal', 'Belgium', 'Netherlands', 'Luxembourg', 'Ireland', 'Denmark', 'Sweden', 'Finland', 'Austria', 'Greece', 'Poland', 'Czechia',
                        'Slovakia', 'Hungary', 'Slovenia', 'Croatia', 'Romania', 'Bulgaria', 'Estonia', 'Latvia', 'Lithuania', 'Malta', 'Cyprus'])],
    nodes=[('Brussels', 4.35, 50.85, 'major'), ('Strasbourg', 7.75, 48.58), ('Luxembourg', 6.13, 49.61), ('Frankfurt (ECB)', 8.68, 50.11)])

