"""Societies: de facto networks of control, exchange and affiliation (see docs/SOCIETIES.md).

A Society here is not a people (that is a Civilization) and not a legal state (that is a
Polity). It is who actually moves things and holds things together, whatever the legal map
says: trade networks, logistics and communications systems, companies, factions and parties,
diasporas and communities, pilgrimage systems, clandestine networks.

In the sense of Marxist and world-society theory, a society is any group held together by a
network of exchange, communication and organisation: a state, an NGO, a party, an ethnic or
religious group, a company, a diaspora. Kinds are descriptive, not exclusive.

Each entity is drawn from three kinds of element:
    routes   lines between hubs (land or sea)           R([(lng, lat), ...], sea=False)
    nodes    hubs: cities, ports, posts, bases           ('Name', lng, lat) or ('Name', lng, lat, 'major')
    zones    areas of de facto presence or control       Z([(lng, lat), ...])
Any element can carry its own years (s=, e=); otherwise it uses the entity's.
Coordinates are approximate; routes are schematic, not surveyed.
"""
import math

KINDS = {
    'Trade network': '#e0a63a',
    'Company or maritime system': '#5b95d6',
    'Communications and logistics': '#52bcd0',
    'State or confederacy': '#c2b280',
    'Faction or party': '#d9645c',
    'Community, diaspora or ethnic group': '#a982d6',
    'Religious network': '#6fc47e',
    'NGO or international organisation': '#e58bb8',
    'Clandestine network': '#d8d4c8',
}

ENTITIES = []


def R(pts, sea=False, s=None, e=None):
    return {'pts': pts, 'sea': sea, 'e': e, 's': s}


def Z(pts=None, s=None, e=None, poly=None, countries=None):
    """An area. Give it as a polygon (pts), as the shape of a historic polity (poly='Inca Empire',
    the largest Cliopatria record inside the years), or as a union of modern countries."""
    return {'pts': pts, 's': s, 'e': e, 'poly': poly, 'countries': countries}


def blob(lon, lat, rx, ry, n=14):
    return [[round(lon + rx * math.cos(2 * math.pi * i / n), 2),
             round(lat + ry * math.sin(2 * math.pi * i / n), 2)] for i in range(n)]


def net(name, kind, s, e, wiki, note, routes=(), nodes=(), zones=()):
    assert kind in KINDS, kind
    ENTITIES.append({
        'name': name, 'kind': kind, 's': s, 'e': e, 'wiki': wiki, 'note': note,
        'routes': list(routes), 'nodes': list(nodes), 'zones': list(zones),
    })


# ---- Earliest networks ------------------------------------------------------------------------------
net('Uruk expansion', 'Trade network', -3400, -3100, 'Uruk period',
    'Southern Mesopotamian colonies and trading posts planted far up the rivers and across the highlands, '
    'the first long-distance urban network.',
    routes=[R([(45.64, 31.32), (45.0, 33.0), (43.0, 35.0), (40.0, 36.0), (38.1, 36.1)]),
            R([(45.64, 31.32), (47.0, 32.4), (48.1, 34.4)])],
    nodes=[('Uruk', 45.64, 31.32, 'major'), ('Habuba Kabira', 38.1, 36.1), ('Godin Tepe', 48.1, 34.4), ('Susa', 48.25, 32.19)])

net('Indus–Mesopotamia trade (Meluhha)', 'Trade network', -2600, -1900, 'Indus–Mesopotamia relations',
    'Carnelian, lapis, copper and timber carried by sea between the Indus cities, Oman, Bahrain (Dilmun) and Ur.',
    routes=[R([(68.1, 27.3), (66.5, 25.2), (62.0, 24.8), (58.0, 24.6), (56.3, 25.6), (50.55, 26.2), (48.5, 29.5), (47.0, 30.5)], sea=True),
            R([(72.25, 22.5), (69.5, 22.0), (66.0, 24.0), (62.0, 24.8)], sea=True)],
    nodes=[('Mohenjo-daro', 68.1, 27.3, 'major'), ('Lothal', 72.25, 22.5), ('Dilmun (Bahrain)', 50.55, 26.2), ('Magan (Oman)', 56.5, 23.6), ('Ur', 46.1, 30.96, 'major')])

net('Phoenician and Carthaginian network', 'Trade network', -1200, -146, 'Phoenicia',
    'Tyrian and later Carthaginian ports strung across the Mediterranean to the Atlantic coast of Iberia and Morocco.',
    routes=[R([(35.2, 33.27), (33.63, 34.92), (27.0, 35.4), (18.0, 35.6), (14.5, 35.9), (10.32, 36.85), (5.0, 37.2), (-2.0, 36.5), (-6.29, 36.53)], sea=True),
            R([(10.32, 36.85), (12.5, 37.87)], sea=True), R([(10.32, 36.85), (9.0, 38.99), (1.43, 38.9), (-0.98, 37.6)], sea=True),
            R([(-6.29, 36.53), (-8.5, 33.5), (-9.77, 31.5)], sea=True)],
    nodes=[('Tyre', 35.2, 33.27, 'major'), ('Kition', 33.63, 34.92), ('Carthage', 10.32, 36.85, 'major'), ('Motya', 12.5, 37.87),
           ('Nora', 9.0, 38.99), ('Ibiza', 1.43, 38.9), ('Gadir (Cádiz)', -6.29, 36.53, 'major'), ('Mogador', -9.77, 31.5)])

net('Greek colonial network', 'Trade network', -800, -300, 'Greek colonisation',
    'Hundreds of Greek city-founded colonies and trading ports around the Mediterranean and the Black Sea.',
    routes=[R([(23.73, 37.98), (25.5, 37.5), (27.28, 37.53)], sea=True),
            R([(27.28, 37.53), (27.5, 40.0), (28.98, 41.0), (31.0, 42.5), (35.15, 42.03), (36.5, 45.35)], sea=True),
            R([(28.98, 41.0), (30.5, 44.0), (31.9, 46.7)], sea=True),
            R([(23.73, 37.98), (21.5, 37.0), (19.92, 39.62), (17.5, 38.5), (15.29, 37.07)], sea=True),
            R([(17.5, 38.5), (14.25, 40.85), (9.0, 42.8), (5.37, 43.3), (3.12, 42.13)], sea=True)],
    nodes=[('Athens', 23.73, 37.98, 'major'), ('Miletus', 27.28, 37.53), ('Byzantion', 28.98, 41.0), ('Sinope', 35.15, 42.03),
           ('Olbia', 31.9, 46.7), ('Panticapaeum', 36.5, 45.35), ('Syracuse', 15.29, 37.07, 'major'), ('Neapolis', 14.25, 40.85),
           ('Massalia', 5.37, 43.3, 'major'), ('Emporion', 3.12, 42.13)])

net('Incense Route', 'Trade network', -900, 300, 'Incense Route',
    'Frankincense and myrrh carried by camel caravan from southern Arabia along the Hejaz to Gaza and the Mediterranean.',
    routes=[R([(54.4, 17.0), (50.0, 16.0), (47.0, 15.0), (45.3, 15.45), (44.1, 17.5), (42.5, 19.5), (39.8, 21.4), (39.6, 24.5),
               (37.9, 26.6), (36.5, 28.5), (35.45, 30.3), (34.45, 31.5)])],
    nodes=[('Sumhuram', 54.4, 17.0), ('Shabwa', 47.0, 15.0), ('Marib', 45.3, 15.45, 'major'), ('Najran', 44.1, 17.5), ('Mecca', 39.8, 21.4),
           ('Dedan (AlUla)', 37.9, 26.6), ('Petra', 35.45, 30.3, 'major'), ('Gaza', 34.45, 31.5)])

# ---- Classical and medieval ---------------------------------------------------------------------------
net('Royal Road', 'Communications and logistics', -500, -330, 'Royal Road',
    'The Achaemenid imperial post road with way stations and relay riders from Sardis to Susa.',
    routes=[R([(28.04, 38.49), (30.0, 39.2), (31.99, 39.65), (34.5, 39.5), (36.5, 38.5), (38.5, 37.5), (40.7, 37.2), (43.15, 36.36), (45.0, 35.4), (48.25, 32.19)])],
    nodes=[('Sardis', 28.04, 38.49, 'major'), ('Gordion', 31.99, 39.65), ('Samosata', 38.5, 37.5), ('Nineveh', 43.15, 36.36), ('Susa', 48.25, 32.19, 'major')])

net('Silk Road (overland)', 'Trade network', -130, 1450, 'Silk Road',
    'The overland web of caravan routes joining China, Central Asia, Persia and the Mediterranean.',
    routes=[R([(108.9, 34.3), (103.8, 36.1), (94.7, 40.1), (89.2, 42.9), (80.0, 41.5), (75.99, 39.47), (72.8, 40.5), (66.97, 39.65), (64.4, 39.77),
               (62.2, 37.6), (58.8, 36.2), (51.4, 35.6), (48.5, 34.8), (44.4, 33.3), (41.0, 33.8), (38.3, 34.55), (36.15, 36.2)]),
            R([(94.7, 40.1), (88.9, 39.2), (79.9, 37.1), (77.25, 38.4), (75.99, 39.47)]),
            R([(36.15, 36.2), (32.5, 37.9), (28.98, 41.0)]),
            R([(66.97, 39.65), (66.9, 36.75), (62.2, 37.6)])],
    nodes=[("Chang'an", 108.9, 34.3, 'major'), ('Dunhuang', 94.7, 40.1), ('Turpan', 89.2, 42.9), ('Khotan', 79.9, 37.1), ('Kashgar', 75.99, 39.47, 'major'),
           ('Samarkand', 66.97, 39.65, 'major'), ('Bukhara', 64.4, 39.77), ('Balkh', 66.9, 36.75), ('Merv', 62.2, 37.6, 'major'), ('Rayy', 51.4, 35.6),
           ('Baghdad', 44.4, 33.3, 'major'), ('Palmyra', 38.3, 34.55), ('Antioch', 36.15, 36.2), ('Constantinople', 28.98, 41.0, 'major')])

net('Indian Ocean trade network', 'Trade network', -100, 1500, 'Indian Ocean trade',
    'Monsoon-driven sea routes joining China, Southeast Asia, India, the Gulf, the Red Sea and East Africa.',
    routes=[R([(113.3, 23.1), (111.0, 20.0), (108.3, 15.9), (107.5, 11.0), (104.5, 8.0), (104.0, 1.3), (102.2, 2.2)], sea=True),
            R([(102.2, 2.2), (98.0, 5.5), (92.0, 6.5), (85.0, 6.0), (79.85, 6.9), (77.5, 8.0), (75.8, 11.25)], sea=True),
            R([(75.8, 11.25), (68.0, 14.0), (62.0, 19.0), (58.4, 23.6), (57.0, 26.0), (54.0, 26.5), (51.5, 27.5), (49.5, 29.2), (47.8, 30.5)], sea=True),
            R([(75.8, 11.25), (66.0, 12.0), (58.0, 12.0), (50.0, 12.3), (45.0, 12.8), (42.8, 14.0), (40.0, 19.0), (39.2, 21.5), (35.5, 26.5), (32.55, 29.97)], sea=True),
            R([(45.0, 12.8), (51.3, 11.8), (50.5, 8.0), (47.0, 4.0), (45.3, 2.05), (40.1, -3.2), (39.7, -4.05), (39.2, -6.2), (39.5, -8.95)], sea=True)],
    nodes=[('Guangzhou', 113.3, 23.1, 'major'), ('Quanzhou', 118.6, 24.9), ('Malacca', 102.2, 2.2, 'major'), ('Colombo', 79.85, 6.9), ('Calicut', 75.8, 11.25, 'major'),
           ('Muscat', 58.4, 23.6), ('Hormuz', 56.5, 27.1), ('Basra', 47.8, 30.5), ('Aden', 45.0, 12.8, 'major'), ('Jeddah', 39.2, 21.5), ('Mogadishu', 45.3, 2.05),
           ('Mombasa', 39.7, -4.05), ('Kilwa', 39.5, -8.95)])

net('Hajj caravans', 'Religious network', 650, 1900, 'Hajj',
    'Annual pilgrim caravans from Damascus, Cairo, Baghdad and Yemen converging on Mecca, with organised water stops and escorts.',
    routes=[R([(36.3, 33.5), (35.74, 30.2), (36.57, 28.38), (39.6, 24.5), (39.83, 21.42)]),
            R([(31.24, 30.04), (33.5, 29.5), (35.0, 28.8), (37.0, 27.5), (39.6, 24.5)]),
            R([(44.4, 33.3), (44.4, 32.0), (42.5, 27.0), (40.5, 25.0), (39.6, 24.5)]),
            R([(44.2, 15.35), (43.0, 18.0), (41.5, 20.0), (39.83, 21.42)])],
    nodes=[('Damascus', 36.3, 33.5, 'major'), ('Cairo', 31.24, 30.04, 'major'), ('Kufa', 44.4, 32.0), ('Sana\'a', 44.2, 15.35), ('Medina', 39.6, 24.5, 'major'), ('Mecca', 39.83, 21.42, 'major')])

net('Trans-Saharan trade', 'Trade network', 300, 1900, 'Trans-Saharan trade',
    'Camel caravans carrying gold, salt, cloth and people between the Maghreb, Egypt and the Sahel.',
    routes=[R([(-4.3, 31.3), (-4.0, 27.0), (-4.0, 23.6), (-6.9, 17.3), (-3.0, 16.77)]),
            R([(-3.0, 16.77), (0.04, 16.27)]), R([(-3.0, 16.77), (-4.0, 15.0), (-4.55, 13.9)]),
            R([(13.2, 32.9), (9.5, 30.1), (10.2, 25.0), (7.99, 16.97), (8.5, 12.0)]),
            R([(31.25, 30.05), (25.0, 29.5), (21.3, 29.1), (13.9, 25.9), (12.9, 18.7), (14.5, 13.5)])],
    nodes=[('Sijilmasa', -4.3, 31.3), ('Taghaza', -4.0, 23.6), ('Timbuktu', -3.0, 16.77, 'major'), ('Gao', 0.04, 16.27), ('Djenné', -4.55, 13.9),
           ('Tripoli', 13.2, 32.9), ('Ghadames', 9.5, 30.1), ('Agadez', 7.99, 16.97), ('Kano', 8.5, 12.0, 'major'), ('Cairo', 31.25, 30.05), ('Njimi (Kanem)', 14.5, 13.5)])

net('Swahili coast trade network', 'Trade network', 800, 1500, 'Swahili coast',
    'Stone-built port towns trading gold from the Zimbabwe plateau, ivory and slaves for Indian Ocean cloth, beads and ceramics.',
    routes=[R([(45.3, 2.05), (40.9, -2.27), (40.1, -3.2), (39.7, -4.05), (39.2, -6.2), (39.5, -8.95), (40.7, -15.0), (34.7, -20.2)], sea=True),
            R([(34.7, -20.2), (32.5, -20.2), (30.93, -20.27)])],
    nodes=[('Mogadishu', 45.3, 2.05), ('Lamu', 40.9, -2.27), ('Mombasa', 39.7, -4.05, 'major'), ('Zanzibar', 39.2, -6.2), ('Kilwa', 39.5, -8.95, 'major'),
           ('Sofala', 34.7, -20.2), ('Great Zimbabwe', 30.93, -20.27, 'major')])

net('Varangian and Volga river routes', 'Trade network', 750, 1100, 'Trade route from the Varangians to the Greeks',
    'Rus\' and Scandinavian traders carried furs, slaves and silver along the rivers to Constantinople and, by the Volga, to Baghdad.',
    routes=[R([(17.54, 59.34), (24.0, 59.9), (30.3, 59.95), (32.3, 59.99), (31.27, 58.52), (32.04, 54.78), (30.52, 50.45), (31.5, 46.6), (28.98, 41.0)]),
            R([(32.3, 59.99), (36.0, 58.5), (40.0, 57.0), (49.05, 54.9), (47.9, 46.35), (51.0, 41.5), (54.4, 36.8), (51.4, 35.6), (44.4, 33.3)])],
    nodes=[('Birka', 17.54, 59.34), ('Staraya Ladoga', 32.3, 59.99), ('Novgorod', 31.27, 58.52, 'major'), ('Smolensk', 32.04, 54.78), ('Kyiv', 30.52, 50.45, 'major'),
           ('Constantinople', 28.98, 41.0, 'major'), ('Bolghar', 49.05, 54.9), ('Itil', 47.9, 46.35), ('Baghdad', 44.4, 33.3)])

net('Hanseatic League', 'Trade network', 1241, 1669, 'Hanseatic League',
    'A league of north German and Baltic trading towns with walled trading posts (kontore) from London to Novgorod.',
    routes=[R([(10.69, 53.9), (12.5, 54.6), (15.0, 55.3), (18.3, 57.64), (22.5, 57.3), (24.1, 56.95)], sea=True),
            R([(18.3, 57.64), (21.0, 59.0), (24.75, 59.44), (28.0, 59.8), (30.3, 59.95), (31.27, 58.52)], sea=True),
            R([(10.69, 53.9), (14.0, 54.7), (18.65, 54.35), (20.5, 54.7)], sea=True),
            R([(10.69, 53.9), (9.99, 53.55), (8.0, 54.2), (5.0, 53.8), (3.5, 52.4), (3.22, 51.3), (1.5, 51.2), (0.7, 51.5), (-0.09, 51.51)], sea=True),
            R([(9.99, 53.55), (8.0, 55.5), (8.0, 57.5), (5.0, 59.0), (5.32, 60.39)], sea=True)],
    nodes=[('Lübeck', 10.69, 53.87, 'major'), ('Hamburg', 9.99, 53.55), ('Cologne', 6.96, 50.94), ('Bruges', 3.22, 51.21, 'major'), ('London (Steelyard)', -0.09, 51.51, 'major'),
           ('Bergen', 5.32, 60.39, 'major'), ('Novgorod', 31.27, 58.52, 'major'), ('Danzig', 18.65, 54.35), ('Riga', 24.1, 56.95), ('Visby', 18.3, 57.64),
           ('Reval (Tallinn)', 24.75, 59.44), ('Königsberg', 20.5, 54.7)])

net('Venetian maritime network', 'Company or maritime system', 1000, 1797, 'Stato da Màr',
    'Venice\'s string of fortified ports, galley convoys and trading quarters from the Adriatic to the Black Sea and the Levant.',
    routes=[R([(12.33, 45.44), (14.0, 43.5), (15.2, 44.1), (19.9, 39.6), (21.7, 36.8), (25.13, 35.34), (28.2, 36.4), (33.95, 35.1), (35.07, 32.93)], sea=True),
            R([(25.13, 35.34), (26.0, 38.0), (26.5, 40.0), (28.98, 41.0), (31.0, 43.0), (35.0, 45.0), (39.2, 47.2)], sea=True),
            R([(25.13, 35.34), (27.0, 33.5), (29.9, 31.2)], sea=True)],
    nodes=[('Venice', 12.33, 45.44, 'major'), ('Zara', 15.2, 44.1), ('Corfu', 19.9, 39.6), ('Modon', 21.7, 36.8), ('Candia', 25.13, 35.34, 'major'),
           ('Famagusta', 33.95, 35.1), ('Acre', 35.07, 32.93), ('Alexandria', 29.9, 31.2), ('Constantinople', 28.98, 41.0, 'major'), ('Tana', 39.2, 47.2)])

net('Genoese trading network', 'Company or maritime system', 1100, 1600, 'Republic of Genoa',
    'Genoese colonies and banking houses from the western Mediterranean to Caffa on the Black Sea.',
    routes=[R([(8.93, 44.41), (8.5, 42.0), (11.0, 38.0), (10.17, 36.8)], sea=True),
            R([(8.93, 44.41), (9.0, 40.0), (15.0, 37.0), (21.0, 37.0), (26.1, 38.4), (26.5, 40.0), (28.97, 41.02), (31.0, 43.0), (35.38, 45.03)], sea=True),
            R([(8.93, 44.41), (5.0, 40.0), (0.0, 38.0), (-2.0, 36.3), (-6.0, 36.1), (-6.3, 36.5), (-5.99, 37.39)], sea=True)],
    nodes=[('Genoa', 8.93, 44.41, 'major'), ('Tunis', 10.17, 36.8), ('Chios', 26.1, 38.4), ('Pera (Galata)', 28.97, 41.02, 'major'), ('Caffa', 35.38, 45.03, 'major'), ('Seville', -5.99, 37.39)])

net('Mongol yam relay system', 'Communications and logistics', 1206, 1368, 'Yam (route)',
    'A continental relay of post stations with horses, riders and passports linking the Mongol khanates.',
    routes=[R([(116.4, 39.9), (102.8, 47.2), (89.1, 44.1), (80.6, 44.0), (68.3, 42.9), (59.2, 42.3), (46.0, 48.7), (40.0, 52.0), (37.6, 55.75)]),
            R([(68.3, 42.9), (66.97, 39.65), (62.2, 37.6), (55.0, 36.5), (46.3, 38.1)])],
    nodes=[('Khanbaliq (Beijing)', 116.4, 39.9, 'major'), ('Karakorum', 102.8, 47.2, 'major'), ('Almaliq', 80.6, 44.0), ('Otrar', 68.3, 42.9), ('Urgench', 59.2, 42.3),
           ('Sarai', 46.0, 48.7, 'major'), ('Tabriz', 46.3, 38.1, 'major'), ('Moscow', 37.6, 55.75)])

net('Qhapaq Ñan (Inca road system)', 'Communications and logistics', 1400, 1535, 'Inca road system',
    'Some 40,000 km of imperial roads with relay runners (chasqui), storehouses and way stations linking Cusco to the four quarters.',
    routes=[R([(-71.97, -13.52), (-74.0, -10.0), (-77.0, -8.0), (-78.5, -7.16), (-79.5, -4.0), (-78.5, -0.2)]),
            R([(-71.97, -13.52), (-69.3, -15.9), (-68.1, -16.5), (-65.75, -19.58), (-66.0, -24.0), (-69.5, -30.0), (-70.65, -33.45)])],
    nodes=[('Cusco', -71.97, -13.52, 'major'), ('Cajamarca', -78.5, -7.16), ('Quito', -78.5, -0.2, 'major'), ('Lake Titicaca', -69.3, -15.9), ('Potosí', -65.75, -19.58), ('Santiago', -70.65, -33.45)])

# ---- Early modern ---------------------------------------------------------------------------------------
net('Carreira da Índia (Portuguese India route)', 'Company or maritime system', 1498, 1700, 'Carreira da Índia',
    'The Portuguese state\'s annual armada route round Africa, with fortified ports (feitorias) from Mozambique to Macau and Japan.',
    routes=[R([(-9.14, 38.7), (-14.0, 25.0), (-20.0, 5.0), (-5.0, -20.0), (18.4, -34.4), (35.0, -26.0), (40.7, -15.0), (48.0, -2.0), (60.0, 8.0), (73.8, 15.5)], sea=True),
            R([(73.8, 15.5), (76.27, 9.97), (85.0, 6.0), (95.0, 5.0), (102.2, 2.2), (108.0, 10.0), (113.54, 22.2), (125.0, 28.0), (129.9, 32.7)], sea=True),
            R([(73.8, 15.5), (65.0, 20.0), (58.4, 23.6), (56.5, 27.1)], sea=True)],
    nodes=[('Lisbon', -9.14, 38.7, 'major'), ('Mozambique Island', 40.7, -15.0), ('Goa', 73.8, 15.5, 'major'), ('Cochin', 76.27, 9.97), ('Malacca', 102.2, 2.2, 'major'),
           ('Macau', 113.54, 22.2, 'major'), ('Nagasaki', 129.9, 32.7), ('Hormuz', 56.5, 27.1)])

net('Spanish treasure fleets (Carrera de Indias)', 'Company or maritime system', 1530, 1790, 'Spanish treasure fleet',
    'Convoyed fleets carrying silver and goods between Seville and the Spanish Indies through a few licensed ports.',
    routes=[R([(-5.99, 37.39), (-6.3, 36.5), (-15.0, 28.0), (-40.0, 20.0), (-61.0, 15.0), (-72.0, 12.0), (-75.5, 10.4)], sea=True),
            R([(-61.0, 15.0), (-80.0, 10.0), (-79.9, 9.35)], sea=True),
            R([(-75.5, 10.4), (-82.4, 23.1)], sea=True), R([(-96.0, 19.2), (-90.0, 21.5), (-82.4, 23.1)], sea=True),
            R([(-82.4, 23.1), (-78.0, 28.0), (-60.0, 36.0), (-30.0, 39.0), (-9.14, 38.0), (-5.99, 37.39)], sea=True)],
    nodes=[('Seville', -5.99, 37.39, 'major'), ('Cartagena de Indias', -75.5, 10.4), ('Portobelo', -79.65, 9.55), ('Veracruz', -96.13, 19.2), ('Havana', -82.4, 23.1, 'major')])

net('Manila galleon route', 'Company or maritime system', 1565, 1815, 'Manila galleon',
    'Annual galleons carrying Chinese silk and porcelain and Mexican silver across the Pacific between Manila and Acapulco.',
    routes=[R([(120.98, 14.6), (125.0, 20.0), (140.0, 30.0), (160.0, 36.0), (179.9, 40.0)], sea=True),
            R([(-179.9, 40.0), (-150.0, 40.0), (-130.0, 34.0), (-110.0, 22.0), (-99.9, 16.85)], sea=True)],
    nodes=[('Manila', 120.98, 14.6, 'major'), ('Acapulco', -99.9, 16.85, 'major')])

net('Dutch East India Company network (VOC)', 'Company or maritime system', 1602, 1799, 'Dutch East India Company',
    'The Dutch chartered company\'s fleet, forts and factories from the Cape to Batavia, Ceylon and Dejima.',
    routes=[R([(4.9, 52.37), (-3.0, 48.0), (-10.0, 38.0), (-18.0, 10.0), (-12.0, -20.0), (10.0, -35.0), (18.42, -33.92)], sea=True),
            R([(18.42, -33.92), (50.0, -35.0), (80.0, -20.0), (105.0, -8.0), (106.85, -6.2)], sea=True),
            R([(18.42, -33.92), (60.0, -25.0), (75.0, -5.0), (79.85, 6.9)], sea=True),
            R([(106.85, -6.2), (110.0, 2.0), (115.0, 10.0), (120.0, 20.0), (126.0, 28.0), (129.73, 32.75)], sea=True),
            R([(106.85, -6.2), (115.0, -7.5), (128.2, -3.7)], sea=True)],
    nodes=[('Amsterdam', 4.9, 52.37, 'major'), ('Cape Town', 18.42, -33.92, 'major'), ('Colombo', 79.85, 6.9), ('Batavia', 106.85, -6.2, 'major'),
           ('Dejima (Nagasaki)', 129.73, 32.75, 'major'), ('Ambon', 128.2, -3.7)])

net('Hudson\'s Bay fur-trade network', 'Company or maritime system', 1670, 1870, 'Fur trade',
    'Company posts, canoe brigades and river portages carrying furs from the Canadian interior to Hudson Bay and Montreal.',
    routes=[R([(-0.12, 51.5), (-30.0, 56.0), (-60.0, 60.5), (-80.0, 59.0), (-92.43, 57.0)], sea=True),
            R([(-92.43, 57.0), (-97.8, 53.97), (-102.3, 53.96), (-113.5, 53.5), (-119.0, 52.9), (-122.67, 45.62)]),
            R([(-73.57, 45.5), (-79.0, 46.0), (-84.0, 46.5), (-89.2, 48.4), (-94.0, 48.6), (-97.14, 49.9), (-97.8, 53.97)])],
    nodes=[('York Factory', -92.43, 57.0, 'major'), ('Norway House', -97.8, 53.97), ('Fort Edmonton', -113.5, 53.5), ('Fort Vancouver', -122.67, 45.62),
           ('Montreal', -73.57, 45.5, 'major'), ('Fort William', -89.2, 48.4), ('Red River (Winnipeg)', -97.14, 49.9)])

net('Transatlantic slave trade', 'Trade network', 1501, 1866, 'Atlantic slave trade',
    'The forced shipment of some 12 million Africans to the Americas along fixed commercial routes, run by European merchant houses, '
    'chartered companies and African coastal and inland suppliers.',
    routes=[R([(-17.4, 14.7), (-35.0, 13.0), (-55.0, 13.0), (-59.6, 13.1)], sea=True),
            R([(-1.35, 5.08), (-10.0, 3.0), (-25.0, 2.0), (-35.0, -6.0), (-38.5, -12.97)], sea=True),
            R([(13.2, -8.8), (0.0, -12.0), (-25.0, -14.0), (-43.2, -22.9)], sea=True),
            R([(-3.0, 53.4), (-12.0, 45.0), (-17.4, 14.7)], sea=True),
            R([(-59.6, 13.1), (-70.0, 17.0), (-76.8, 17.97), (-82.4, 23.1)], sea=True),
            R([(-76.8, 17.97), (-80.0, 25.0), (-79.93, 32.78)], sea=True)],
    nodes=[('Liverpool', -3.0, 53.4), ('Gorée', -17.4, 14.7), ('Elmina', -1.35, 5.08, 'major'), ('Luanda', 13.2, -8.8, 'major'), ('Salvador', -38.5, -12.97, 'major'),
           ('Rio de Janeiro', -43.2, -22.9), ('Bridgetown', -59.6, 13.1), ('Kingston', -76.8, 17.97), ('Charleston', -79.93, 32.78), ('Havana', -82.4, 23.1)])

# ---- Modern -------------------------------------------------------------------------------------------------
net('Communist International (Comintern)', 'Faction or party', 1919, 1943, 'Communist International',
    'A Moscow-directed network of national communist parties, couriers and front organisations.',
    routes=[R([(37.6, 55.75), (13.4, 52.5)]), R([(37.6, 55.75), (2.35, 48.85)]), R([(37.6, 55.75), (121.47, 31.23)]), R([(37.6, 55.75), (-99.13, 19.43)]),
            R([(37.6, 55.75), (-3.7, 40.4)]), R([(37.6, 55.75), (-0.12, 51.5)])],
    nodes=[('Moscow', 37.6, 55.75, 'major'), ('Berlin', 13.4, 52.5), ('Paris', 2.35, 48.85), ('Shanghai', 121.47, 31.23), ('Mexico City', -99.13, 19.43), ('Madrid', -3.7, 40.4), ('London', -0.12, 51.5)])

net('Chinese Communist base areas and Long March', 'Faction or party', 1927, 1949, 'Long March',
    'Rural base areas held by the Red Army and party, and the 1934-35 retreat between them.',
    routes=[R([(116.03, 25.88), (111.0, 26.0), (106.9, 27.7), (102.2, 29.9), (100.0, 32.0), (102.7, 32.2), (108.2, 36.9), (109.5, 36.6)], s=1934, e=1936)],
    zones=[Z(blob(116.0, 26.0, 1.2, 1.0), s=1931, e=1934), Z(blob(109.5, 36.6, 1.5, 1.2), s=1936, e=1948)],
    nodes=[('Ruijin (Jiangxi Soviet)', 116.03, 25.88, 'major'), ('Zunyi', 106.9, 27.7), ('Luding Bridge', 102.2, 29.9), ("Yan'an", 109.5, 36.6, 'major')])


import societies_more  # noqa: E402,F401  (more networks, registered on import)
