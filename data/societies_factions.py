"""Factions and movements: the groups that held ground, routes or markets without de jure borders.

Sects and schismatic churches, rebel and breakaway movements, communes and leagues, warlords,
pirates, mafias and cartels, and parties and movements that governed places the law did not
give them. They pass the same test as every Society (affinity, control, network) but not the
scale rule: a local faction may be smaller than 1,000 km across and needs only one hub or an area.
The build tags each one 'faction' (under 1,000 km, or fewer than two hubs) or 'network'.
See docs/SOCIETIES.md ("Factions and movements").

Rules for the modern entries: an organisation, never a living person; only what courts, UN or
government bodies or major reporting document; hedged wording; years end 2026 only when the group
still exists as far as the sources show.
"""
from societies_data import R, Z, blob, net  # noqa: E402
from societies_groups import GROUP_OF, POWER_OF  # noqa: E402

SECT = 'Sect or dissenting church'
REBEL = 'Rebel or insurgent movement'
UNDER = 'Warlord, pirate or criminal organisation'
FACTION, RELIG, CLAND, STATE = 'Faction or party', 'Religious network', 'Clandestine network', 'State or confederacy'

DISSENT = 'Dissenting and schismatic movements'
INSURG = 'Insurgents, rebels and breakaway movements'
OUTLAW = 'Warlords, cartels and the underworld'


def fac(name, kind, sphere, power, s, e, wiki, note, routes=(), nodes=(), zones=()):
    GROUP_OF[name] = sphere
    POWER_OF[name] = power
    net(name, kind, s, e, wiki, note, routes=routes, nodes=nodes, zones=zones)


# ---- Dissenting churches, sects and schismatics ---------------------------------------------------------------
fac('Cathars', SECT, DISSENT, 'IP', 1140, 1330, 'Catharism',
    'A dualist Christian church with its own bishops and houses in Languedoc and Lombardy, crushed by the Albigensian Crusade (1209-29) and the Inquisition. Links to the Bosnian Church are debated.',
    routes=[R([(1.44, 43.6), (4.8, 43.9), (7.7, 45.07), (10.02, 45.13)]), R([(10.02, 45.13), (13.0, 45.6), (16.0, 45.8), (18.18, 43.99)])],
    nodes=[('Toulouse', 1.44, 43.6, 'major'), ('Albi', 2.15, 43.93), ('Carcassonne', 2.35, 43.21), ('Montségur', 1.83, 42.87), ('Cremona', 10.02, 45.13, 'major'), ('Visoko (Bosnia)', 18.18, 43.99)],
    zones=[Z(blob(2.0, 43.6, 1.6, 0.9))])

fac('Waldensians', SECT, DISSENT, 'I', 1177, 1700, 'Waldensians',
    'Poor lay preachers from Lyon who built a hidden church of Alpine valley communities with branches in Provence, Bohemia and Calabria, and joined the Reformation in 1532.',
    routes=[R([(4.83, 45.76), (7.23, 44.82)]), R([(7.23, 44.82), (11.0, 47.0), (14.42, 50.09)]), R([(7.23, 44.82), (12.0, 41.9), (16.0, 39.4)])],
    nodes=[('Lyon', 4.83, 45.76, 'major'), ('Torre Pellice', 7.23, 44.82, 'major'), ('Prague', 14.42, 50.09), ('Guardia Piemontese', 16.0, 39.4)],
    zones=[Z(blob(7.1, 44.85, 0.5, 0.35))])

fac('Hussites (Taborites and Utraquists)', SECT, DISSENT, 'IMP', 1419, 1436, 'Hussite Wars',
    'Czech reformers whose field armies held Bohemia against five crusades and raided as far as the Baltic coast and Franconia in the "Beautiful Rides".',
    routes=[R([(14.42, 50.09), (14.68, 49.41)]), R([(14.42, 50.09), (17.0, 51.1), (18.0, 52.4), (18.65, 54.35)], s=1429, e=1433)],
    nodes=[('Prague', 14.42, 50.09, 'major'), ('Tábor', 14.68, 49.41, 'major'), ('Hradec Králové', 15.83, 50.21), ('Gdańsk', 18.65, 54.35)],
    zones=[Z(blob(14.8, 49.9, 1.8, 0.9))])

fac('Lollards', SECT, DISSENT, 'I', 1380, 1530, 'Lollardy',
    'Followers of Wycliffe who circulated the English Bible in secret, with clusters in Oxford, Leicester, Norwich, Coventry and London.',
    routes=[R([(-1.26, 51.75), (-1.5, 52.41), (-1.13, 52.64), (1.3, 52.63)]), R([(-1.26, 51.75), (-0.12, 51.5)])],
    nodes=[('Oxford', -1.26, 51.75, 'major'), ('Leicester', -1.13, 52.64), ('Norwich', 1.3, 52.63), ('Coventry', -1.5, 52.41), ('London', -0.12, 51.5)])

fac('Anabaptist communities', SECT, DISSENT, 'I', 1525, 1580, 'Anabaptism',
    'Believers-baptist congregations from Zürich to Strasbourg, Münster, the Netherlands and Moravia (the Hutterite colonies), hunted by Catholic and Protestant authorities alike.',
    routes=[R([(8.54, 47.37), (7.75, 48.58), (7.63, 51.96), (4.9, 52.37)]), R([(8.54, 47.37), (13.0, 47.8), (16.9, 49.15)])],
    nodes=[('Zürich', 8.54, 47.37, 'major'), ('Strasbourg', 7.75, 48.58), ('Münster', 7.63, 51.96, 'major'), ('Amsterdam', 4.9, 52.37), ('Austerlitz (Moravia)', 16.9, 49.15)])

fac('Bogomils', SECT, DISSENT, 'I', 927, 1463, 'Bogomilism',
    'A dualist Christian movement born in Bulgaria that spread to Constantinople and Bosnia and is often linked to the later Cathars.',
    routes=[R([(26.8, 43.16), (24.75, 42.15), (21.0, 43.0), (18.18, 43.99)]), R([(24.75, 42.15), (28.98, 41.0)])],
    nodes=[('Preslav', 26.8, 43.16), ('Philippopolis (Plovdiv)', 24.75, 42.15, 'major'), ('Constantinople', 28.98, 41.0), ('Visoko (Bosnia)', 18.18, 43.99)])

fac('Old Believers', SECT, DISSENT, 'IE', 1666, 2026, 'Old Believers',
    'Russian Orthodox who refused the church reforms of 1666-67 and formed their own communities, from the Solovetsky Monastery to Siberia, Poland-Lithuania and the Danube delta.',
    routes=[R([(37.6, 55.75), (35.7, 65.03)]), R([(37.6, 55.75), (31.2, 52.6)]), R([(37.6, 55.75), (68.3, 58.2)]), R([(37.6, 55.75), (29.6, 45.4)])],
    nodes=[('Moscow (Rogozhskoye)', 37.6, 55.75, 'major'), ('Solovetsky Monastery', 35.7, 65.03), ('Vetka', 31.2, 52.6), ('Tobolsk', 68.3, 58.2), ('Vilkovo (Danube delta)', 29.6, 45.4)])

fac('Donatists', SECT, DISSENT, 'IP', 311, 430, 'Donatism',
    'A rigorist North African church that split from Rome-backed bishops, strong in Numidia, with its own bishops and hardline wandering bands (the Circumcellions) until suppressed after 411.',
    routes=[R([(10.32, 36.85), (7.76, 36.9), (6.61, 36.37), (6.47, 35.48)])],
    nodes=[('Carthage', 10.32, 36.85), ('Hippo Regius', 7.76, 36.9), ('Cirta (Constantine)', 6.61, 36.37, 'major'), ('Thamugadi (Timgad)', 6.47, 35.48, 'major')],
    zones=[Z(blob(6.9, 36.0, 2.2, 0.9))])

fac('Western Schism (rival popes)', RELIG, 'Latin Christendom and the Catholic world', 'IP', 1378, 1417, 'Western Schism',
    'Two and then three rival papal courts, at Rome, Avignon and Pisa, each with its own kingdoms, tax collectors and cardinals, until the Council of Constance.',
    routes=[R([(4.81, 43.95), (2.35, 48.85)]), R([(4.81, 43.95), (2.17, 41.39)]), R([(12.5, 41.9), (11.0, 47.5), (14.42, 50.09)]), R([(12.5, 41.9), (10.4, 43.72)])],
    nodes=[('Rome', 12.5, 41.9, 'major'), ('Avignon', 4.81, 43.95, 'major'), ('Pisa', 10.4, 43.72), ('Constance', 9.18, 47.66)])

fac('Huguenot refuge network', RELIG, DISSENT, 'IE', 1562, 1750, 'Huguenots',
    'French Protestants who held fortified cities such as La Rochelle and, after 1685, carried their trade and craft to Geneva, Amsterdam, London, Berlin, the Cape and the Carolinas.',
    routes=[R([(-1.15, 46.16), (-0.12, 51.5), (4.9, 52.37)], sea=True), R([(4.9, 52.37), (13.4, 52.5)]), R([(-1.15, 46.16), (-9.0, 36.0), (18.42, -33.92)], sea=True), R([(-1.15, 46.16), (-79.93, 32.78)], sea=True)],
    nodes=[('La Rochelle', -1.15, 46.16, 'major'), ('Geneva', 6.14, 46.2, 'major'), ('Amsterdam', 4.9, 52.37), ('London', -0.12, 51.5), ('Berlin', 13.4, 52.5), ('Cape Town', 18.42, -33.92), ('Charleston', -79.93, 32.78)])

# ---- Sects, rebels and movements of Asia and the Middle East -----------------------------------------------
fac('Lingayat (Veerashaiva) movement', SECT, 'Buddhist and Indic world', 'IEP', 1150, 1800, 'Lingayatism',
    'A devotional movement begun by Basava at Kalyana that rejected caste hierarchy; its monasteries (mathas) and merchant and farming followers held much of northern Karnataka.',
    routes=[R([(76.95, 17.88), (75.9, 16.17), (74.5, 15.0)]), R([(76.95, 17.88), (78.87, 16.07)])],
    nodes=[('Basavakalyan', 76.95, 17.88, 'major'), ('Kudalasangama', 75.9, 16.17), ('Ulavi', 74.5, 15.0), ('Srisailam', 78.87, 16.07)],
    zones=[Z(blob(76.0, 15.3, 2.2, 1.6))])

fac('Sikh misls', FACTION, 'Buddhist and Indic world', 'MP', 1748, 1799, 'Misl',
    'Twelve Sikh warrior bands (misls) that pooled raiding and protection levies and divided the Punjab between them before they were merged into one kingdom.',
    routes=[R([(74.87, 31.63), (74.34, 31.55)]), R([(74.87, 31.63), (76.4, 30.34)])],
    nodes=[('Amritsar', 74.87, 31.63, 'major'), ('Lahore', 74.34, 31.55), ('Patiala', 76.4, 30.34), ('Kapurthala', 75.38, 31.38)],
    zones=[Z(blob(75.2, 31.0, 1.8, 1.2))])

fac('Nizari Ismaili strongholds (Assassins)', SECT, 'Islamic world and the Sahel', 'IMP', 1090, 1273, 'Order of Assassins',
    'A chain of mountain fortresses from Alamut in northern Iran to Masyaf in Syria, held by Nizari Ismailis against Seljuk, Crusader and finally Mongol armies.',
    routes=[R([(50.58, 36.44), (46.3, 35.3), (40.0, 35.5), (36.34, 35.07)])],
    nodes=[('Alamut', 50.58, 36.44, 'major'), ('Gerdkuh', 54.1, 36.0), ('Masyaf', 36.34, 35.07, 'major'), ('Quhistan (Birjand)', 59.2, 32.87)])

fac('Qarmatians of Bahrain', SECT, 'Islamic world and the Sahel', 'IMP', 899, 1077, 'Qarmatians',
    'An Ismaili community that ran an egalitarian, state-like polity in eastern Arabia and raided Basra, Kufa and the pilgrim roads; it carried off the Black Stone from Mecca in 930.',
    routes=[R([(49.6, 25.4), (47.78, 30.5)], s=900, e=1000), R([(49.6, 25.4), (44.4, 32.03)], s=900, e=1000), R([(49.6, 25.4), (39.83, 21.42)], s=930, e=952)],
    nodes=[('Al-Ahsa (Hajar)', 49.6, 25.4, 'major'), ('Basra', 47.78, 30.5), ('Kufa', 44.4, 32.03), ('Mecca (raid of 930)', 39.83, 21.42)],
    zones=[Z(blob(49.6, 25.4, 1.6, 1.2))])

fac('Zanj Rebellion', REBEL, INSURG, 'MP', 869, 883, 'Zanj Rebellion',
    'A revolt of enslaved labourers on the Basra marshes that built its own fortified capital and took Basra before the Abbasids crushed it.',
    routes=[R([(47.78, 30.5), (48.67, 31.32)]), R([(47.78, 30.5), (46.3, 32.17)])],
    nodes=[('Basra', 47.78, 30.5, 'major'), ('Ahvaz', 48.67, 31.32), ('Wasit', 46.3, 32.17)],
    zones=[Z(blob(47.9, 30.6, 1.2, 0.9))])

fac('Red Turban Rebellions', REBEL, INSURG, 'MP', 1351, 1368, 'Red Turban Rebellions',
    'Millenarian White Lotus armies that rose against the Yuan along the Yellow and Yangzi rivers; one of their commanders took Nanjing and founded the Ming.',
    routes=[R([(115.8, 32.9), (114.3, 30.55), (104.07, 30.67)]), R([(115.8, 32.9), (118.8, 32.06)])],
    nodes=[('Yingzhou (Fuyang)', 115.8, 32.9, 'major'), ('Wuchang', 114.3, 30.55), ('Nanjing', 118.8, 32.06, 'major'), ('Chengdu', 104.07, 30.67)])

fac('White Lotus Rebellion', REBEL, INSURG, 'MP', 1794, 1804, 'White Lotus Rebellion',
    'A decade-long rising of White Lotus sectarians and impoverished settlers in the hills between Hubei, Sichuan and Shaanxi, put down by militia and Qing armies.',
    routes=[R([(112.14, 32.04), (107.03, 33.07), (106.1, 30.8)])],
    nodes=[('Xiangyang', 112.14, 32.04, 'major'), ('Hanzhong', 107.03, 33.07), ('Nanchong', 106.1, 30.8), ('Yichang', 111.3, 30.7)])

fac('Boxer movement', REBEL, INSURG, 'IM', 1899, 1901, 'Boxer Rebellion',
    'A rural militia movement of northern China, backed in 1900 by the Qing court, that besieged the Beijing legations before an eight-nation army relieved them.',
    routes=[R([(116.2, 36.6), (117.2, 39.1), (116.4, 39.9)]), R([(116.4, 39.9), (112.55, 37.87)])],
    nodes=[('Shandong (Chiping)', 116.2, 36.6), ('Tianjin', 117.2, 39.1, 'major'), ('Beijing (legation siege)', 116.4, 39.9, 'major'), ('Taiyuan', 112.55, 37.87)])

fac('Warlord Era cliques (China)', UNDER, OUTLAW, 'MP', 1916, 1928, 'Warlord Era',
    'Rival generals and their cliques (Zhili, Anhui, Fengtian and provincial rulers) that held Chinese provinces and the Beijing government by force between Yuan Shikai and the Northern Expedition.',
    routes=[R([(123.43, 41.8), (116.4, 39.9)]), R([(115.46, 38.87), (116.4, 39.9)]), R([(117.28, 31.86), (118.8, 32.06)])],
    nodes=[('Beijing', 116.4, 39.9, 'major'), ('Mukden (Fengtian clique)', 123.43, 41.8, 'major'), ('Baoding (Zhili clique)', 115.46, 38.87), ('Hefei (Anhui clique)', 117.28, 31.86), ('Taiyuan (Shanxi)', 112.55, 37.87), ('Kunming (Yunnan)', 102.7, 25.04), ('Chengdu (Sichuan)', 104.07, 30.67)])

fac('Afghan mujahideen parties', REBEL, 'Islamic world and the Sahel', 'MP', 1979, 1996, 'Mujahideen',
    'Resistance parties based in Peshawar and rear bases in Pakistan that held valleys, cities and supply routes in Afghanistan against Soviet and then each other.',
    routes=[R([(71.57, 34.0), (70.45, 34.43), (69.2, 34.5)]), R([(69.2, 34.5), (69.5, 35.3)])],
    nodes=[('Peshawar', 71.57, 34.0, 'major'), ('Jalalabad', 70.45, 34.43), ('Kabul', 69.2, 34.5), ('Panjshir', 69.5, 35.3), ('Herat', 62.2, 34.35), ('Kandahar', 65.7, 31.6)])

fac('Khmer Rouge', FACTION, 'Communist movement', 'MP', 1968, 1999, 'Khmer Rouge',
    'The Communist Party of Kampuchea: ruled Cambodia 1975-79, then held forest and border strongholds such as Pailin and Anlong Veng until 1998-99.',
    routes=[R([(104.92, 11.55), (102.6, 12.85)], s=1975, e=1979), R([(102.6, 12.85), (104.1, 14.25)], s=1979, e=1998)],
    nodes=[('Phnom Penh', 104.92, 11.55, 'major'), ('Pailin', 102.6, 12.85), ('Anlong Veng', 104.1, 14.25)])

fac('Ho Chi Minh Trail and the NLF', REBEL, 'Communist movement', 'MP', 1959, 1975, 'Ho Chi Minh trail',
    'The road, river and footpath supply network through Laos and Cambodia that fed the National Liberation Front and North Vietnamese units in the south.',
    routes=[R([(105.85, 21.03), (105.68, 18.67), (105.9, 17.4), (106.2, 16.65), (106.9, 15.5), (107.5, 13.5), (106.9, 12.0), (106.5, 11.0)])],
    nodes=[('Hanoi', 105.85, 21.03, 'major'), ('Vinh', 105.68, 18.67), ('Tchepone', 106.2, 16.65), ('Củ Chi', 106.5, 11.0), ('Saigon', 106.7, 10.78, 'major')])

fac('FARC', REBEL, 'Communist movement', 'MP', 1964, 2016, 'FARC',
    'A Colombian Marxist guerrilla army that held rural zones in the south and east, including the Caguán demilitarised zone (1999-2002), until the 2016 peace accord.',
    routes=[R([(-75.6, 3.2), (-74.3, 3.2), (-74.77, 2.12)])],
    nodes=[('Marquetalia', -75.6, 3.2), ('La Uribe', -74.3, 3.2, 'major'), ('San Vicente del Caguán', -74.77, 2.12)],
    zones=[Z(blob(-74.6, 2.3, 1.2, 1.0), s=1999, e=2002)])

fac('Liberation Tigers of Tamil Eelam', REBEL, INSURG, 'MP', 1976, 2009, 'Liberation Tigers of Tamil Eelam',
    'A Tamil separatist army that ran its own administration, courts and ports in the Jaffna peninsula and the Vanni until its defeat in 2009.',
    routes=[R([(80.0, 9.67), (80.4, 9.4), (80.82, 9.27), (81.23, 8.57)])],
    nodes=[('Jaffna', 80.0, 9.67), ('Kilinochchi', 80.4, 9.4, 'major'), ('Mullaitivu', 80.82, 9.27), ('Trincomalee', 81.23, 8.57)],
    zones=[Z(blob(80.4, 9.2, 0.7, 0.5), s=1990, e=2009)])

fac('Muslim Brotherhood', FACTION, 'Islamic world and the Sahel', 'IEP', 1928, 2026, 'Muslim Brotherhood',
    'A religious and political movement founded at Ismailia that built schools, clinics, unions and party branches across the Arab world, outlawed in some states and in office in others.',
    routes=[R([(32.27, 30.6), (31.24, 30.04), (35.93, 31.95), (36.3, 33.5)]), R([(31.24, 30.04), (32.53, 15.5)])],
    nodes=[('Ismailia', 32.27, 30.6), ('Cairo', 31.24, 30.04, 'major'), ('Amman', 35.93, 31.95), ('Damascus', 36.3, 33.5), ('Khartoum', 32.53, 15.5)])

fac("Ba'ath Party", FACTION, 'Islamic world and the Sahel', 'IMP', 1947, 2024, 'Ba\'ath Party',
    'An Arab nationalist party that ruled Syria from 1963 and Iraq from 1968 (to 2003) through cells in the army, unions and schools.',
    routes=[R([(36.3, 33.5), (40.0, 33.4), (44.4, 33.3)]), R([(44.4, 33.3), (43.7, 34.6)])],
    nodes=[('Damascus', 36.3, 33.5, 'major'), ('Baghdad', 44.4, 33.3, 'major'), ('Aleppo', 37.16, 36.2), ('Tikrit', 43.7, 34.6)])

fac('Hezbollah', FACTION, INSURG, 'IMP', 1982, 2026, 'Hezbollah',
    'A Lebanese Shia party and armed movement that runs social services, media and security in Beirut\'s southern suburbs, the Bekaa and the south, alongside its seats in parliament.',
    routes=[R([(35.5, 33.85), (36.2, 34.0)]), R([(35.5, 33.85), (35.2, 33.27)])],
    nodes=[('Beirut (Dahieh)', 35.5, 33.85, 'major'), ('Baalbek', 36.2, 34.0), ('Nabatieh', 35.48, 33.38), ('Tyre', 35.2, 33.27)],
    zones=[Z(blob(35.6, 33.6, 0.5, 0.45))])

fac('Hamas administration in Gaza', FACTION, INSURG, 'IMP', 2007, 2026, 'Hamas',
    'A Palestinian Islamist movement that won the 2006 elections and has run the Gaza Strip\'s government, police and tunnels since 2007; its control since the 2023-24 war is contested.',
    routes=[R([(34.45, 31.5), (34.3, 31.35), (34.25, 31.29)])],
    nodes=[('Gaza City', 34.45, 31.5, 'major'), ('Khan Yunis', 34.3, 31.35), ('Rafah', 34.25, 31.29)],
    zones=[Z(blob(34.4, 31.4, 0.12, 0.2))])

fac('Zapatista autonomous municipalities', REBEL, INSURG, 'IP', 1994, 2026, 'Zapatista Army of National Liberation',
    'Indigenous communities of Chiapas that rose in 1994 and run their own councils, schools and clinics (the Caracoles) in rebel territory outside state authority.',
    routes=[R([(-92.64, 16.74), (-92.5, 16.9), (-92.1, 16.9), (-91.37, 16.22)])],
    nodes=[('San Cristóbal de las Casas', -92.64, 16.74), ('Oventik', -92.5, 16.9, 'major'), ('Ocosingo', -92.1, 16.9), ('La Realidad', -91.37, 16.22, 'major')],
    zones=[Z(blob(-92.0, 16.7, 1.2, 0.8))])

fac('Libyan rebels and militias', REBEL, INSURG, 'MP', 2011, 2026, 'First Libyan Civil War',
    'The February 2011 uprising, its National Transitional Council in Benghazi, the besieged port of Misrata and the Nafusa mountain towns; afterwards town-based militias and, from 2014, rival authorities in Tripoli and the east held the ground.',
    routes=[R([(20.07, 32.12), (15.09, 32.38)], sea=True, s=2011, e=2011), R([(12.25, 31.93), (13.19, 32.89)], s=2011, e=2011)],
    nodes=[('Benghazi', 20.07, 32.12, 'major'), ('Misrata', 15.09, 32.38, 'major'), ('Zintan', 12.25, 31.93), ('Tripoli', 13.19, 32.89, 'major'), ('Tobruk', 23.97, 32.08), ('Sirte', 16.59, 31.21)])

# ---- Communes, leagues, risings and counter-revolutions ---------------------------------------------------------
fac('Communes of 1870-71 (Paris Commune)', REBEL, INSURG, 'MP', 1870, 1871, 'Paris Commune',
    'The Paris Commune of March-May 1871 and the short-lived communes of Lyon, Marseille, Toulouse, Narbonne and Saint-Étienne that rose with it.',
    routes=[R([(2.35, 48.85), (4.83, 45.76), (5.37, 43.3)])],
    nodes=[('Paris', 2.35, 48.85, 'major'), ('Lyon', 4.83, 45.76), ('Marseille', 5.37, 43.3), ('Toulouse', 1.44, 43.6), ('Narbonne', 3.0, 43.18), ('Saint-Étienne', 4.39, 45.44)])

fac('Lombard League', STATE, 'Latin Christendom and the Catholic world', 'EMP', 1167, 1250, 'Lombard League',
    'An alliance of north Italian city communes (Milan, Cremona, Bologna, Verona, Padua...) with a shared army and treasury that beat the emperor at Legnano in 1176.',
    routes=[R([(9.19, 45.46), (10.02, 45.13), (11.34, 44.49)]), R([(9.19, 45.46), (10.99, 45.44), (11.88, 45.41)])],
    nodes=[('Milan', 9.19, 45.46, 'major'), ('Cremona', 10.02, 45.13), ('Bologna', 11.34, 44.49, 'major'), ('Verona', 10.99, 45.44), ('Padua', 11.88, 45.41), ('Brescia', 10.22, 45.54)],
    zones=[Z(blob(10.6, 45.2, 1.8, 0.7))])

fac("German Peasants' War", REBEL, INSURG, 'MP', 1524, 1525, "German Peasants' War",
    'Bands of peasants and townspeople that drew up the Twelve Articles and held territory from Swabia and Franconia to Thuringia and Salzburg before the princes crushed them.',
    routes=[R([(10.18, 47.99), (10.45, 51.21)]), R([(10.18, 47.99), (13.04, 47.8)])],
    nodes=[('Memmingen', 10.18, 47.99, 'major'), ('Mühlhausen', 10.45, 51.21), ('Frankenhausen', 11.1, 51.4), ('Salzburg', 13.04, 47.8)])

fac('Vendée royalist and Catholic army', REBEL, 'Latin Christendom and the Catholic world', 'MP', 1793, 1796, 'War in the Vendée',
    'Peasants and nobles of western France who rose against the Revolution, held the countryside south of the Loire and failed before Nantes in 1793.',
    routes=[R([(-0.88, 47.06), (-1.02, 47.37), (-1.55, 47.22)]), R([(-1.55, 47.22), (-1.95, 47.36)])],
    nodes=[('Cholet', -0.88, 47.06, 'major'), ('Saint-Florent-le-Vieil', -1.02, 47.37), ('Nantes', -1.55, 47.22), ('Savenay', -1.95, 47.36)],
    zones=[Z(blob(-1.0, 46.9, 1.0, 0.7))])

fac('Sanfedisti (Army of the Holy Faith)', FACTION, 'Latin Christendom and the Catholic world', 'MP', 1799, 1799, 'Sanfedisti',
    'A Calabrian peasant and brigand army raised by Cardinal Ruffo that marched north to Naples in 1799 and overthrew the Parthenopean Republic.',
    routes=[R([(15.85, 38.36), (16.25, 39.3), (16.55, 40.83), (15.09, 41.15), (14.27, 40.85)])],
    nodes=[('Palmi', 15.85, 38.36, 'major'), ('Cosenza', 16.25, 39.3), ('Altamura', 16.55, 40.83), ('Naples', 14.27, 40.85, 'major')])

fac('Makhnovshchina (Revolutionary Insurgent Army of Ukraine)', REBEL, INSURG, 'MP', 1918, 1921, 'Makhnovshchina',
    'An anarchist peasant army and free soviets that ran a large part of south-eastern Ukraine, fighting Whites, Reds and Germans in turn.',
    routes=[R([(36.27, 47.66), (36.79, 46.75)]), R([(36.27, 47.66), (35.14, 47.84), (35.05, 48.46)])],
    nodes=[('Huliaipole', 36.27, 47.66, 'major'), ('Berdiansk', 36.79, 46.75), ('Oleksandrivsk', 35.14, 47.84), ('Katerynoslav', 35.05, 48.46)],
    zones=[Z(blob(36.3, 47.4, 1.8, 0.8))])

fac('Spanish Revolution of 1936 (collectives)', FACTION, INSURG, 'EMP', 1936, 1939, 'Spanish Revolution of 1936',
    'Anarchist and socialist unions that ran Barcelona\'s industry and hundreds of rural collectives in Aragon and the Levante during the Civil War.',
    routes=[R([(2.17, 41.39), (-0.04, 41.23), (-0.38, 39.47)])],
    nodes=[('Barcelona', 2.17, 41.39, 'major'), ('Caspe', -0.04, 41.23), ('Valencia', -0.38, 39.47)],
    zones=[Z(blob(0.0, 41.3, 2.0, 0.9))])

fac('Carbonari', CLAND, INSURG, 'IP', 1800, 1831, 'Carbonari',
    'A secret society of local lodges (vendite) that plotted liberal revolutions in Naples, Piedmont, France and Spain.',
    routes=[R([(14.27, 40.85), (9.19, 45.46), (7.69, 45.07), (2.35, 48.85)]), R([(2.35, 48.85), (-3.7, 40.4)])],
    nodes=[('Naples', 14.27, 40.85, 'major'), ('Milan', 9.19, 45.46), ('Turin', 7.69, 45.07), ('Paris', 2.35, 48.85, 'major'), ('Madrid', -3.7, 40.4)])

fac('Maroon communities of the Americas', REBEL, INSURG, 'MP', 1600, 1800, 'Maroon (people)',
    'Settlements of self-liberated enslaved people, from Palmares in Brazil and the Blue Mountains of Jamaica to Suriname, Cartagena and the Great Dismal Swamp, that held their own ground.',
    routes=[R([(-35.83, -9.1), (-55.4, 4.0), (-75.2, 10.1), (-76.4, 18.1)], sea=True)],
    nodes=[('Palmares', -35.83, -9.1, 'major'), ('Saramaka (Suriname)', -55.4, 4.0), ('San Basilio de Palenque', -75.2, 10.1), ('Nanny Town (Blue Mountains)', -76.4, 18.1, 'major'), ('Great Dismal Swamp', -76.4, 36.6)])

fac('Underground Railroad', CLAND, INSURG, 'I', 1830, 1865, 'Underground Railroad',
    'A secret network of safe houses, guides and routes that moved people out of slavery in the US South to free states and Canada.',
    routes=[R([(-76.0, 38.5), (-75.17, 39.95), (-76.15, 43.05), (-79.2, 43.16)]), R([(-85.76, 38.25), (-84.5, 39.1), (-83.05, 42.33), (-83.04, 42.3)])],
    nodes=[('Philadelphia', -75.17, 39.95, 'major'), ('Cincinnati', -84.5, 39.1, 'major'), ('Syracuse', -76.15, 43.05), ('Detroit–Windsor', -83.05, 42.33), ('St. Catharines', -79.2, 43.16)])

# ---- Warlords, raiders, mafias and cartels --------------------------------------------------------------------------
fac('Wokou maritime raiders and smugglers', UNDER, 'Maritime Asia and the Pacific', 'EM', 1350, 1600, 'Wokou',
    'Mixed Japanese, Chinese and Portuguese crews and merchants that raided and smuggled along the East Asian coast from bases such as Shuangyu and Hirado.',
    routes=[R([(129.55, 33.37), (122.1, 30.0), (118.1, 24.5)], sea=True)],
    nodes=[('Hirado', 129.55, 33.37, 'major'), ('Shuangyu (Zhoushan)', 122.1, 30.0, 'major'), ('Hakata', 130.4, 33.6), ('Xiamen coast', 118.1, 24.5)])

fac('Barbary corsairs', UNDER, 'Islamic world and the Sahel', 'EM', 1500, 1830, 'Barbary pirates',
    'Privateer fleets of Algiers, Tunis, Tripoli and Salé that raided shipping and coasts as far as Ireland and Iceland and sold captives in North African markets.',
    routes=[R([(3.06, 36.75), (-6.0, 37.0), (-9.4, 51.5)], sea=True), R([(3.06, 36.75), (-12.0, 45.0), (-20.3, 63.4)], sea=True, s=1627, e=1627)],
    nodes=[('Algiers', 3.06, 36.75, 'major'), ('Tunis', 10.18, 36.8), ('Tripoli', 13.19, 32.89), ('Salé', -6.8, 34.05), ('Baltimore (Ireland)', -9.4, 51.5)])

fac('Caribbean pirates (Brethren of the Coast)', UNDER, OUTLAW, 'EM', 1650, 1726, 'Golden Age of Piracy',
    'Buccaneer and pirate crews based at Tortuga, Port Royal, Nassau and, on the "Pirate Round", Madagascar, preying on Spanish, Dutch and English shipping.',
    routes=[R([(-77.35, 25.05), (-30.0, 10.0), (-5.0, -33.0), (18.4, -34.4), (49.85, -17.0)], sea=True)],
    nodes=[('Port Royal', -76.84, 17.94, 'major'), ('Tortuga', -72.8, 20.05), ('Nassau', -77.35, 25.05, 'major'), ('Île Sainte-Marie (Madagascar)', 49.85, -17.0)])

fac('Cossack hosts', STATE, 'Russian empire', 'MP', 1550, 1775, 'Cossacks',
    'Self-governing frontier hosts of free warriors on the Dnieper, Don and Yaik, living by raiding, service and fishing between Poland, Russia and the Tatar khanates.',
    routes=[R([(35.1, 47.8), (40.0, 47.2), (46.0, 48.7), (51.37, 51.2)])],
    nodes=[('Zaporozhian Sich (Khortytsia)', 35.1, 47.8, 'major'), ('Cherkassk (Don)', 40.0, 47.2, 'major'), ('Yaik (Uralsk)', 51.37, 51.2)])

fac('Sicilian Mafia and Cosa Nostra', UNDER, OUTLAW, 'EMP', 1860, 2026, 'Sicilian Mafia',
    'Clan-based criminal organisations that protected estates and markets in western Sicily and, through emigrant ties, in New York; documented by Italian courts (the 1986-87 Maxi Trial) and US prosecutions.',
    routes=[R([(13.36, 38.12), (-30.0, 38.0), (-74.0, 40.71)], sea=True)],
    nodes=[('Palermo', 13.36, 38.12, 'major'), ('Corleone', 13.3, 37.8), ('Trapani', 12.5, 38.0), ('Agrigento', 13.58, 37.31), ('New York', -74.0, 40.71, 'major')],
    zones=[Z(blob(13.3, 37.9, 1.0, 0.5))])

fac('Medellín Cartel', UNDER, OUTLAW, 'EM', 1976, 1993, 'Medellín Cartel',
    'A Colombian cocaine syndicate that ran processing, flights through the Bahamas and Panama, and distribution in Florida; documented in US and Colombian court records.',
    routes=[R([(-75.58, 6.25), (-79.52, 8.98), (-76.8, 24.6), (-80.19, 25.76)])],
    nodes=[('Medellín', -75.58, 6.25, 'major'), ('Panama City', -79.52, 8.98), ('Norman\'s Cay (Bahamas)', -76.8, 24.6), ('Miami', -80.19, 25.76, 'major')])

fac('Cali Cartel', UNDER, OUTLAW, 'EP', 1977, 1995, 'Cali Cartel',
    'A Colombian drug syndicate run as a corporate network, exporting through Buenaventura to New York and Europe and corrupting officials; documented in US and Colombian prosecutions.',
    routes=[R([(-76.53, 3.45), (-77.07, 3.88)]), R([(-77.07, 3.88), (-75.0, 15.0), (-74.0, 40.71)], sea=True)],
    nodes=[('Cali', -76.53, 3.45, 'major'), ('Buenaventura', -77.07, 3.88), ('New York', -74.0, 40.71)])

fac('Sinaloa Cartel', UNDER, OUTLAW, 'EM', 1989, 2026, 'Sinaloa Cartel',
    'A Mexican trafficking federation based in Sinaloa that moves drugs through Pacific ports and border crossings to US cities, according to US and Mexican prosecutors and UN reports.',
    routes=[R([(-107.39, 24.81), (-115.47, 32.65)]), R([(-107.39, 24.81), (-106.49, 31.69), (-87.63, 41.88)]), R([(-107.39, 24.81), (-104.34, 19.05)])],
    nodes=[('Culiacán', -107.39, 24.81, 'major'), ('Mexicali', -115.47, 32.65), ('Ciudad Juárez', -106.49, 31.69), ('Manzanillo', -104.34, 19.05), ('Chicago', -87.63, 41.88)])

fac('Somali clan militias and warlords', UNDER, OUTLAW, 'MP', 1991, 2006, 'Somali Civil War',
    'Clan-based militias that divided Mogadishu, the ports and the roads after the state collapsed in 1991, taxing checkpoints and aid.',
    routes=[R([(45.34, 2.04), (43.65, 3.12)]), R([(45.34, 2.04), (42.55, -0.36)]), R([(45.34, 2.04), (47.43, 6.77)])],
    nodes=[('Mogadishu', 45.34, 2.04, 'major'), ('Baidoa', 43.65, 3.12), ('Kismayo', 42.55, -0.36), ('Galkayo', 47.43, 6.77)])
