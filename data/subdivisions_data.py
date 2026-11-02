"""Province definitions for big polities (see docs/SUBDIVISIONS.md).

Each province is a name, a Wikipedia title, the years it existed, and the modern
units it is approximated by. Provinces are *approximations built from modern boundaries*
(Natural Earth admin-0 countries and admin-1 provinces), then clipped to the polity's
Cliopatria shape. They show how a big polity was divided, not exact historical borders.

Member tokens, separated by ';':
    Country          a whole modern country (what is left after other provinces' claims)
    a:Name           a modern first-level unit by name (a:Name@Country when ambiguous)
Specific a: claims always win over a whole-country token in the same polity.
"""

POLITIES = {}


def polity(name, era, text):
    rows = []
    for line in text.strip().splitlines():
        line = line.strip()
        if not line or line.startswith('#'):
            continue
        parts = [p.strip() for p in line.split('|')]
        pname, wiki, start, end, members = parts
        rows.append({
            'name': pname, 'wiki': wiki, 'start': int(start), 'end': int(end),
            'members': [m.strip() for m in members.split(';') if m.strip()],
        })
    POLITIES[name] = {'era': era, 'provinces': rows}


polity('Roman Empire', 'provinces c. 120 CE', """
Britannia | Britannia | 43 | 410 | United Kingdom
Gallia Belgica | Gallia Belgica | -50 | 480 | Belgium; Luxembourg; a:Nord; a:Pas-de-Calais; a:Somme; a:Aisne; a:Ardennes; a:Marne; a:Meuse; a:Oise; a:Aube; a:Haute-Marne; a:Meurthe-et-Moselle; a:Moselle; a:Vosges
Germania Inferior | Germania Inferior | 85 | 480 | Netherlands; a:Nordrhein-Westfalen
Germania Superior | Germania Superior | 85 | 480 | a:Rheinland-Pfalz; a:Hessen; a:Baden-Württemberg; a:Saarland; a:Bas-Rhin; a:Haute-Rhin; a:Doubs; a:Haute-Saône; Switzerland
Raetia | Raetia | -15 | 480 | a:Bayern; a:Tirol; a:Vorarlberg; Liechtenstein; a:Graubünden; a:Sankt Gallen
Noricum | Noricum | -15 | 480 | Austria
Pannonia | Pannonia | -27 | 480 | Hungary; Slovenia; a:Burgenland
Dalmatia | Dalmatia (Roman province) | -27 | 480 | Croatia; Bosnia and Herzegovina; Montenegro
Moesia Superior | Moesia Superior | -27 | 480 | Serbia; Kosovo
Moesia Inferior | Moesia Inferior | -27 | 480 | a:Vidin; a:Montana; a:Vratsa; a:Pleven; a:Lovech; a:Gabrovo; a:Veliko Tarnovo; a:Ruse; a:Razgrad; a:Silistra; a:Dobrich; a:Varna; a:Targovishte; a:Shumen; a:Constanta; a:Tulcea
Dacia | Roman Dacia | 106 | 275 | Romania
Thracia | Thrace (Roman province) | 46 | 480 | Bulgaria; a:Anatoliki Makedonia kai Thraki; a:Edirne; a:Kirklareli; a:Tekirdag
Macedonia | Macedonia (Roman province) | -148 | 480 | North Macedonia; a:Kentriki Makedonia; a:Dytiki Makedonia
Achaea | Achaea (Roman province) | -27 | 480 | a:Attiki; a:Peloponnisos; a:Stereá Elláda; a:Dytiki Ellada; a:Thessalia
Epirus | Epirus (Roman province) | -27 | 480 | a:Ipeiros; a:Ionioi Nisoi; Albania
Creta et Cyrenaica | Crete and Cyrenaica | -67 | 296 | a:Kriti; Libya
Italia | Roman Italy | -27 | 480 | Italy; San Marino; Vatican; Malta
Sicilia | Sicily (Roman province) | -241 | 480 | a:Messina; a:Palermo; a:Agrigento; a:Caltanissetta; a:Catania; a:Enna; a:Ragusa; a:Siracusa; a:Trapani
Sardinia et Corsica | Sardinia and Corsica | -227 | 480 | a:Cagliari; a:Sassari; a:Nuoro; a:Oristrano; a:Carbonia-Iglesias; a:Medio Campidano; a:Ogliastra; a:Olbia-Tempio; a:Haute-Corse; a:Corse-du-Sud
Gallia Lugdunensis | Gallia Lugdunensis | -50 | 480 | a:Calvados; a:Manche; a:Orne; a:Eure; a:Seine-Maritime; a:Finistère; a:Côtes-d'Armor; a:Morbihan; a:Ille-et-Vilaine; a:Mayenne; a:Sarthe; a:Maine-et-Loire; a:Loire-Atlantique; a:Indre-et-Loire; a:Loir-et-Cher; a:Loiret; a:Eure-et-Loir; a:Paris; a:Essonne; a:Yvelines; a:Seien-et-Marne; a:Val-d'Oise; a:Hauts-de-Seine; a:Seine-Saint-Denis; a:Val-de-Marne; a:Yonne; a:Côte-d'Or; a:Saône-et-Loire; a:Rhône; a:Loire; a:Nièvre; a:Ain
Gallia Aquitania | Gallia Aquitania | -50 | 480 | a:Charente; a:Charente-Maritime; a:Deux-Sèvres; a:Vienne; a:Vendée; a:Haute-Vienne; a:Creuse; a:Corrèze; a:Dordogne; a:Gironde; a:Landes; a:Lot-et-Garonne; a:Gers; a:Pyrénées-Atlantiques; a:Hautes-Pyrénées; a:Indre; a:Cher; a:Allier; a:Puy-de-Dôme; a:Cantal; a:Haute-Loire; a:Lot; a:Aveyron; a:Lozère
Gallia Narbonensis | Gallia Narbonensis | -118 | 480 | France; Monaco
Hispania Tarraconensis | Hispania Tarraconensis | -197 | 480 | Spain; Andorra
Hispania Baetica | Hispania Baetica | -197 | 480 | a:Sevilla; a:Cádiz; a:Córdoba; a:Huelva; a:Málaga; a:Granada; a:Jaén; a:Almería
Lusitania | Lusitania | -27 | 480 | Portugal; a:Badajoz; a:Cáceres; a:Salamanca
Mauretania Tingitana | Mauretania Tingitana | 40 | 480 | Morocco
Mauretania Caesariensis | Mauretania Caesariensis | 40 | 480 | Algeria
Numidia | Numidia (Roman province) | 198 | 480 | a:Constantine; a:Annaba; a:Skikda; a:Batna; a:Sétif; a:Guelma; a:Souk Ahras; a:Tébessa; a:Oum el Bouaghi; a:Khenchela; a:Biskra; a:Mila; a:Jijel; a:El Tarf; a:Bordj Bou Arréridj
Africa Proconsularis | Africa (Roman province) | -146 | 480 | Tunisia; a:Tajura' wa an Nawahi al Arba; a:Al Jifarah; a:Az Zawiyah; a:An Nuqat al Khams; a:Al Marqab; a:Misratah
Aegyptus | Aegyptus (Roman province) | -30 | 480 | Egypt
Arabia Petraea | Arabia Petraea | 106 | 480 | Jordan; a:Shamal Sina'; a:Janub Sina'; Saudi Arabia
Judaea | Judaea (Roman province) | 6 | 480 | Israel; Palestine
Syria | Syria (Roman province) | -64 | 480 | Syria; Lebanon; a:Hatay; a:Gaziantep; a:Kilis; a:Adiyaman; a:K. Maras
Mesopotamia | Mesopotamia (Roman province) | 116 | 480 | Iraq; a:Sanliurfa; a:Mardin; a:Diyarbakir; a:Batman; a:Siirt; a:Sirnak
Cilicia | Cilicia (Roman province) | -67 | 480 | a:Adana; a:Mersin; a:Osmaniye
Cyprus | Cyprus (Roman province) | -58 | 480 | Cyprus
Lycia et Pamphylia | Lycia et Pamphylia | 43 | 480 | a:Antalya
Asia | Asia (Roman province) | -133 | 480 | a:Izmir; a:Manisa; a:Aydin; a:Mugla; a:Denizli; a:Usak; a:Kütahya; a:Afyonkarahisar; a:Balikesir; a:Çanakkale; a:Isparta; a:Burdur; a:Bursa; a:Bilecik; a:Notio Aigaio; a:Voreio Aigaio
Bithynia et Pontus | Bithynia and Pontus | -63 | 480 | a:Kocaeli; a:Sakarya; a:Düzce; a:Bolu; a:Zinguldak; a:Karabük; a:Bartın; a:Kastamonu; a:Sinop; a:Samsun; a:Amasya; a:Tokat; a:Ordu; a:Giresun; a:Trabzon; a:Rize; a:Artvin; a:Gümüshane; a:Bayburt; a:Yalova; a:Istanbul
Galatia | Galatia (Roman province) | -25 | 480 | a:Ankara; a:Çankiri; a:Kirsehir; a:Kinkkale; a:Yozgat; a:Eskisehir; a:Konya; a:Aksaray; a:Karaman; a:Çorum
Cappadocia | Cappadocia (Roman province) | 17 | 480 | Turkey; Armenia; Georgia
""")

polity('Achaemenid Empire', 'satrapies c. 500 BCE', """
Persis | Persis | -550 | -330 | a:Fars; a:Bushehr; a:Kohgiluyeh and Buyer Ahmad
Media | Media (region) | -550 | -330 | a:Hamadan; a:Markazi; a:Esfahan; a:Qom; a:Tehran; a:Alborz; a:Qazvin; a:Zanjan; a:Kordestan; a:Kermanshah; a:Lorestan; a:Semnan; a:Yazd; a:East Azarbaijan; a:West Azarbaijan; a:Ardebil
Elam | Elam | -550 | -330 | a:Khuzestan; a:Ilam; a:Chahar Mahall and Bakhtiari
Babylonia | Babylonia | -539 | -330 | a:Baghdad; a:Babil; a:Karbala'; a:An-Najaf; a:Al-Qādisiyyah; a:Al-Muthannia; a:Dhi-Qar; a:Maysan; a:Al-Basrah; a:Wasit; a:Diyala; a:Al-Anbar; Kuwait
Assyria | Assyria | -539 | -330 | a:Ninawa; a:Arbil; a:Dihok; a:As-Sulaymaniyah; a:At-Ta'mim; a:Sala ad-Din
Eber-Nari | Eber-Nari | -539 | -330 | Syria; Lebanon; Israel; Palestine; Jordan; Cyprus
Egypt | Achaemenid conquest of Egypt | -525 | -330 | Egypt
Cyrene | Cyrenaica | -525 | -330 | Libya
Sparda | Sparda | -546 | -330 | a:Izmir; a:Manisa; a:Aydin; a:Mugla; a:Denizli; a:Usak; a:Kütahya; a:Afyonkarahisar; a:Notio Aigaio; a:Voreio Aigaio; a:Balikesir; a:Antalya; a:Isparta; a:Burdur
Hellespontine Phrygia | Hellespontine Phrygia | -546 | -330 | a:Çanakkale; a:Bursa; a:Bilecik; a:Kocaeli; a:Sakarya; a:Düzce; a:Bolu; a:Zinguldak; a:Karabük; a:Bartın; a:Eskisehir; a:Yalova; a:Istanbul
Cilicia | Cilicia (satrapy) | -546 | -330 | a:Adana; a:Mersin; a:Osmaniye; a:Hatay
Cappadocia | Cappadocia | -546 | -330 | Turkey
Armenia | Satrapy of Armenia | -520 | -330 | Armenia; a:Van; a:Erzurum; a:Kars; a:Agri; a:Mus; a:Bitlis; a:Hakkari
Skudra | Skudra | -513 | -480 | Bulgaria; a:Anatoliki Makedonia kai Thraki; a:Edirne; a:Kirklareli; a:Tekirdag; North Macedonia; a:Kentriki Makedonia
Hyrcania | Hyrcania | -550 | -330 | a:Mazandaran; a:Gilan; a:Golestan
Parthia | Parthia | -550 | -330 | a:Razavi Khorasan; a:North Khorasan; a:South Khorasan
Margiana | Margiana | -550 | -330 | Turkmenistan
Aria | Aria (satrapy) | -550 | -330 | a:Hirat; a:Badghis; a:Ghor
Bactria | Bactria | -550 | -330 | a:Balkh; a:Samangan; a:Baghlan; a:Kunduz; a:Takhar; a:Badakhshan; a:Jawzjan; a:Faryab; a:Sari Pul; Tajikistan
Sogdia | Sogdia | -550 | -330 | Uzbekistan; Kyrgyzstan
Saka | Saka | -520 | -330 | Kazakhstan
Arachosia | Arachosia | -520 | -330 | a:Kandahar; a:Zabul; a:Ghazni; a:Uruzgan; a:Paktika; a:Logar; a:Wardak
Drangiana | Drangiana | -520 | -330 | a:Nimroz; a:Farah; a:Hilmand
Gandhara | Gandhara | -520 | -330 | a:Kabul; a:Parwan; a:Kapisa; a:Nangarhar; a:Laghman; a:Kunar; a:Nuristan; a:Khost; a:Paktya; a:K.P.; a:Bamyan
Hindush | Hindush | -516 | -330 | a:Sind; a:Punjab@Pakistan
Carmania | Carmania (ancient region) | -550 | -330 | a:Kerman; a:Hormozgan
Gedrosia | Gedrosia | -550 | -330 | a:Baluchistan; a:Sistan and Baluchestan
""")

polity('Sasanian Empire', 'provinces c. 600 CE', """
Pars | Pars (Sasanian province) | 224 | 651 | a:Fars; a:Bushehr; a:Kohgiluyeh and Buyer Ahmad; a:Hormozgan
Khuzestan | Khuzestan (Sasanian province) | 224 | 651 | a:Khuzestan; a:Ilam; a:Chahar Mahall and Bakhtiari
Asoristan | Asoristan | 224 | 651 | Iraq
Adurbadagan | Atropatene | 224 | 651 | a:East Azarbaijan; a:West Azarbaijan; a:Ardebil; a:Zanjan; a:Kordestan
Armenia and the Caucasus | Sasanian Armenia | 224 | 651 | Armenia; Georgia; Azerbaijan
Jibal | Jibal | 224 | 651 | Iran
Khorasan | Khorasan (Sasanian province) | 224 | 651 | a:Razavi Khorasan; a:North Khorasan; a:South Khorasan; Turkmenistan; a:Golestan; a:Hirat; a:Badghis
Kerman | Kerman Province (Sasanian) | 224 | 651 | a:Kerman
Sakastan | Sakastan | 224 | 651 | a:Sistan and Baluchestan; a:Nimroz; a:Hilmand; a:Farah; a:Kandahar
Tokharistan | Tokharistan | 224 | 651 | Afghanistan; Tajikistan; Uzbekistan
Mazun | Mazun | 224 | 651 | Oman; United Arab Emirates; Qatar; Bahrain; Saudi Arabia
Yemen | Sasanian Yemen | 570 | 632 | Yemen
""")

polity('Ottoman Empire', 'eyalets c. 1580', """
Rumelia | Rumelia Eyalet | 1365 | 1923 | Bulgaria; North Macedonia; Albania; Greece; Serbia; Kosovo; Montenegro
Bosnia | Bosnia Eyalet | 1580 | 1923 | Bosnia and Herzegovina; Croatia
Budin | Budin Eyalet | 1541 | 1699 | Hungary
Temeşvar | Temeşvar Eyalet | 1552 | 1716 | a:Timis; a:Arad; a:Caras-Severin; a:Hunedoara
Wallachia | Wallachia | 1417 | 1859 | Romania
Moldavia | Moldavia | 1456 | 1859 | Moldova; a:Iasi; a:Botosani; a:Neamt; a:Suceava; a:Bacau; a:Vaslui; a:Galati; a:Vrancea
Anatolia | Anatolia Eyalet | 1393 | 1923 | a:Izmir; a:Manisa; a:Aydin; a:Mugla; a:Denizli; a:Usak; a:Kütahya; a:Afyonkarahisar; a:Balikesir; a:Çanakkale; a:Isparta; a:Burdur; a:Bursa; a:Bilecik; a:Eskisehir; a:Ankara; a:Çankiri; a:Kastamonu; a:Bolu; a:Düzce; a:Zinguldak; a:Karabük; a:Bartın; a:Sakarya; a:Kocaeli; a:Yalova; a:Istanbul; a:Antalya; a:Edirne; a:Kirklareli; a:Tekirdag; a:Sinop; a:Kirsehir; a:Kinkkale
Karaman | Karaman Eyalet | 1483 | 1923 | a:Konya; a:Karaman; a:Nigde; a:Mersin; a:Aksaray; a:Nevsehir; a:Kayseri; a:Adana; a:Osmaniye
Sivas | Sivas Eyalet | 1413 | 1923 | a:Sivas; a:Tokat; a:Amasya; a:Çorum; a:Yozgat; a:Samsun; a:Ordu
Trabzon | Trabzon Eyalet | 1461 | 1923 | a:Trabzon; a:Rize; a:Giresun; a:Artvin; a:Gümüshane; a:Bayburt
Erzurum | Erzurum Eyalet | 1533 | 1923 | a:Erzurum; a:Agri; a:Kars; a:Ardahan; a:Iğdir; a:Mus; a:Bitlis; a:Van; a:Hakkari; a:Erzincan; a:Bingöl; a:Tunceli; Armenia; Georgia
Diyarbekir | Diyarbekir Eyalet | 1514 | 1923 | a:Diyarbakir; a:Mardin; a:Batman; a:Siirt; a:Sirnak; a:Elazig; a:Malatya; a:Sanliurfa; a:Adiyaman
Aleppo | Aleppo Eyalet | 1517 | 1923 | a:Aleppo; a:Idlib; a:Ar Raqqah; a:Hatay; a:Gaziantep; a:Kilis; a:K. Maras
Damascus | Damascus Eyalet | 1516 | 1923 | Syria; Lebanon; Israel; Palestine; Jordan
Shahrizor | Shahrizor Eyalet | 1554 | 1923 | a:Ninawa; a:Arbil; a:Dihok; a:As-Sulaymaniyah; a:At-Ta'mim; a:Sala ad-Din
Baghdad | Baghdad Eyalet | 1534 | 1923 | Iraq
Basra | Basra Eyalet | 1546 | 1923 | a:Al-Basrah; a:Maysan; a:Dhi-Qar; a:Al-Muthannia; Kuwait
Egypt | Egypt Eyalet | 1517 | 1914 | Egypt
Habesh | Habesh Eyalet | 1555 | 1923 | Eritrea; Sudan
Hejaz | Hejaz Vilayet | 1517 | 1916 | Saudi Arabia
Yemen | Yemen Eyalet | 1538 | 1918 | Yemen
Tripolitania | Ottoman Tripolitania | 1551 | 1911 | Libya
Tunis | Ottoman Tunisia | 1574 | 1881 | Tunisia
Algiers | Ottoman Algeria | 1517 | 1830 | Algeria
Cyprus | Cyprus Eyalet | 1571 | 1878 | Cyprus
Archipelago | Eyalet of the Archipelago | 1533 | 1923 | a:Notio Aigaio; a:Voreio Aigaio; a:Kriti; a:Ionioi Nisoi
""")

polity('Qing Dynasty', 'provinces c. 1820', """
Zhili | Zhili | 1645 | 1911 | a:Hebei; a:Beijing; a:Tianjin
Shandong | Shandong | 1645 | 1911 | a:Shandong
Shanxi | Shanxi | 1645 | 1911 | a:Shanxi
Henan | Henan | 1645 | 1911 | a:Henan
Jiangsu | Jiangsu | 1667 | 1911 | a:Jiangsu; a:Shanghai
Jiangnan | Jiangnan (Qing province) | 1645 | 1666 | a:Jiangsu; a:Shanghai; a:Anhui
Anhui | Anhui | 1667 | 1911 | a:Anhui
Zhejiang | Zhejiang | 1645 | 1911 | a:Zhejiang
Jiangxi | Jiangxi | 1645 | 1911 | a:Jiangxi
Fujian | Fujian | 1645 | 1911 | a:Fujian
Huguang | Huguang | 1645 | 1663 | a:Hubei; a:Hunan
Hubei | Hubei | 1664 | 1911 | a:Hubei
Hunan | Hunan | 1664 | 1911 | a:Hunan
Shaanxi | Shaanxi | 1645 | 1911 | a:Shaanxi
Gansu | Gansu | 1645 | 1911 | a:Gansu; a:Ningxia
Sichuan | Sichuan | 1645 | 1911 | a:Sichuan; a:Chongqing
Yunnan | Yunnan | 1645 | 1911 | a:Yunnan
Guizhou | Guizhou | 1645 | 1911 | a:Guizhou
Guangdong | Guangdong | 1645 | 1911 | a:Guangdong; a:Hainan
Guangxi | Guangxi | 1645 | 1911 | a:Guangxi
Manchuria | Manchuria | 1645 | 1911 | a:Liaoning; a:Jilin; a:Heilongjiang; a:Amur; a:Khabarovsk; a:Primor'ye; a:Yevrey; a:Sakhalin
Mongolia | Qing rule in Mongolia | 1636 | 1911 | Mongolia; a:Inner Mongol
Xinjiang | Xinjiang | 1759 | 1911 | a:Xinjiang; Kazakhstan; Kyrgyzstan; Tajikistan
Tibet | Qing rule in Tibet | 1720 | 1911 | a:Xizang; a:Qinghai
Taiwan | Qing rule in Taiwan | 1683 | 1895 | Taiwan
""")

polity('Ming Dynasty', 'provinces c. 1500', """
Beizhili | Northern Zhili | 1375 | 1644 | a:Hebei; a:Beijing; a:Tianjin; a:Inner Mongol
Nanzhili | Southern Zhili | 1375 | 1644 | a:Jiangsu; a:Shanghai; a:Anhui
Shandong | Shandong | 1375 | 1644 | a:Shandong
Shanxi | Shanxi | 1375 | 1644 | a:Shanxi
Henan | Henan | 1375 | 1644 | a:Henan
Shaanxi | Shaanxi | 1375 | 1644 | a:Shaanxi; a:Gansu; a:Ningxia; a:Qinghai; a:Xinjiang
Zhejiang | Zhejiang | 1375 | 1644 | a:Zhejiang
Jiangxi | Jiangxi | 1375 | 1644 | a:Jiangxi
Huguang | Huguang | 1375 | 1644 | a:Hubei; a:Hunan
Fujian | Fujian | 1375 | 1644 | a:Fujian
Guangdong | Guangdong | 1375 | 1644 | a:Guangdong; a:Hainan
Guangxi | Guangxi | 1375 | 1644 | a:Guangxi
Sichuan | Sichuan | 1375 | 1644 | a:Sichuan; a:Chongqing
Guizhou | Guizhou | 1413 | 1644 | a:Guizhou
Yunnan | Yunnan | 1375 | 1644 | a:Yunnan
Liaodong | Liaodong Regional Military Commission | 1375 | 1644 | a:Liaoning; a:Jilin; a:Heilongjiang
""")

polity('Han Dynasty', 'provinces c. 2 CE', """
Jizhou | Ji Province | -202 | 237 | a:Hebei; a:Tianjin
Youzhou | You Province | -202 | 237 | a:Beijing; a:Liaoning; a:Jilin
Bingzhou | Bing Province | -202 | 237 | a:Shanxi; a:Inner Mongol
Qingzhou | Qing Province | -202 | 237 | a:Shandong
Xuzhou | Xu Province | -202 | 237 | a:Jiangsu; a:Shanghai
Yuzhou | Yu Province | -202 | 237 | a:Henan
Jingzhou | Jing Province | -202 | 237 | a:Hubei; a:Hunan
Yangzhou | Yang Province | -202 | 237 | a:Anhui; a:Jiangxi; a:Zhejiang; a:Fujian
Yizhou | Yi Province | -202 | 237 | a:Sichuan; a:Chongqing; a:Guizhou; a:Yunnan
Liangzhou | Liang Province | -202 | 237 | a:Gansu; a:Ningxia; a:Qinghai
Yongzhou | Yong Province | -202 | 237 | a:Shaanxi
Jiaozhi | Jiaozhi | -111 | 237 | a:Guangdong; a:Guangxi; a:Hainan; Vietnam
Western Regions | Protectorate of the Western Regions | -60 | 237 | a:Xinjiang
Korean commanderies | Four Commanderies of Han | -108 | 237 | North Korea
""")

polity('Tang Dynasty', 'circuits c. 740 CE', """
Guannei | Guannei Circuit | 627 | 910 | a:Shaanxi
Hedong | Hedong Circuit | 627 | 910 | a:Shanxi
Hebei | Hebei Circuit | 627 | 910 | a:Hebei; a:Beijing; a:Tianjin; a:Liaoning
Henan | Henan Circuit | 627 | 910 | a:Henan; a:Shandong
Shannan | Shannan Circuit | 627 | 910 | a:Hubei; a:Chongqing
Huainan | Huainan Circuit | 627 | 910 | a:Anhui; a:Jiangsu; a:Shanghai
Jiangnan | Jiangnan Circuit | 627 | 910 | a:Zhejiang; a:Fujian; a:Jiangxi; a:Hunan
Jiannan | Jiannan Circuit | 627 | 910 | a:Sichuan; a:Yunnan
Qianzhong | Qianzhong Circuit | 627 | 910 | a:Guizhou
Lingnan | Lingnan Circuit | 627 | 910 | a:Guangdong; a:Guangxi; a:Hainan
Longyou | Longyou Circuit | 627 | 910 | a:Gansu; a:Ningxia; a:Qinghai
Anxi | Protectorate General to Pacify the West | 640 | 910 | a:Xinjiang; Kyrgyzstan; Tajikistan; Uzbekistan; Kazakhstan; Turkmenistan
Beiting | Protectorate General to Pacify the North | 647 | 910 | Mongolia; a:Inner Mongol
Andong | Protectorate General to Pacify the East | 668 | 910 | North Korea; a:Jilin; a:Heilongjiang
Annam | Protectorate General to Pacify the South | 679 | 910 | Vietnam
""")

polity('Mughal Empire', 'subahs c. 1595', """
Delhi | Delhi Subah | 1529 | 1858 | a:Delhi; a:Haryana; a:Uttarakhand
Agra | Agra Subah | 1529 | 1858 | a:Uttar Pradesh
Lahore | Lahore Subah | 1529 | 1858 | a:Punjab@India; a:Himachal Pradesh; a:Chandigarh
Multan | Multan Subah | 1529 | 1858 | a:Punjab@Pakistan
Thatta | Thatta Subah | 1529 | 1858 | a:Sind; a:Baluchistan
Kabul | Kabul Subah | 1529 | 1739 | Afghanistan; a:K.P.
Kashmir | Kashmir Subah | 1586 | 1752 | a:Jammu and Kashmir; a:Ladakh; a:Azad Kashmir; a:Northern Areas
Ajmer | Ajmer Subah | 1529 | 1858 | a:Rajasthan
Malwa | Malwa Subah | 1529 | 1858 | a:Madhya Pradesh; a:Chhattisgarh
Gujarat | Gujarat Subah | 1573 | 1858 | a:Gujarat
Bihar | Bihar Subah | 1529 | 1858 | a:Bihar; a:Jharkhand
Bengal | Bengal Subah | 1529 | 1858 | a:West Bengal; Bangladesh
Orissa | Orissa Subah | 1592 | 1858 | a:Odisha
Khandesh and Berar | Berar Subah | 1601 | 1858 | a:Maharashtra
Hyderabad | Hyderabad Subah | 1636 | 1858 | a:Telangana; a:Andhra Pradesh
Bijapur | Bijapur Subah | 1686 | 1858 | a:Karnataka
Arcot | Carnatic Sultanate | 1690 | 1858 | a:Tamil Nadu; a:Puducherry
""")

polity('British Raj', 'provinces c. 1909', """
Madras | Madras Presidency | 1859 | 1947 | a:Tamil Nadu; a:Andhra Pradesh; a:Telangana; a:Kerala
Bombay | Bombay Presidency | 1859 | 1947 | a:Maharashtra; a:Gujarat; a:Karnataka; a:Goa; a:Sind
Bengal | Bengal Presidency | 1859 | 1947 | a:West Bengal; Bangladesh
Bihar and Orissa | Bihar and Orissa Province | 1912 | 1947 | a:Bihar; a:Odisha; a:Jharkhand
United Provinces | United Provinces of Agra and Oudh | 1859 | 1947 | a:Uttar Pradesh; a:Uttarakhand
Punjab | Punjab Province (British India) | 1859 | 1947 | a:Punjab@India; a:Punjab@Pakistan; a:Haryana; a:Himachal Pradesh; a:Delhi
Central Provinces | Central Provinces and Berar | 1859 | 1947 | a:Madhya Pradesh; a:Chhattisgarh
Assam | Assam Province | 1874 | 1947 | a:Assam; a:Nagaland; a:Meghalaya; a:Mizoram; a:Manipur; a:Tripura; a:Arunachal Pradesh
Burma | British Burma | 1859 | 1947 | Myanmar
North-West Frontier | North-West Frontier Province | 1901 | 1947 | a:K.P.
Balochistan | Chief Commissioner's Province of British Baluchistan | 1859 | 1947 | a:Baluchistan
Rajputana and Kashmir | Rajputana Agency | 1859 | 1947 | a:Rajasthan; a:Jammu and Kashmir; a:Ladakh
""")
