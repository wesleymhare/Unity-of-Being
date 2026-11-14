/**
 * Genetic lineage tags for Peoples: the commonest paternal (Y-DNA) and maternal (mtDNA) haplogroups
 * reported for each people. Shown in the panel as blue (Y-DNA, father to son) and pink (mtDNA,
 * mother to child) chips.
 *
 * What these are, and are not:
 *   - The most frequent lineages in published samples, in rough order, for the people as a whole.
 *     Individuals vary; most peoples carry many lineages at lower frequencies.
 *   - `basis: 'ancient'` means ancient DNA from remains of that people or culture (the study is named
 *     in `src`); `'modern'` means samples of present-day members.
 *   - A haplogroup is one line of descent among thousands of ancestors. It is not an identity, an
 *     ethnicity or a measure of anyone's ancestry as a whole.
 *
 * First pass, 13 November 2026, from the broad consensus of population-genetic surveys and the
 * ancient-DNA papers named in `src`. To be checked against the Allen Ancient DNA Resource (AADR) and
 * the cited papers before any figure is quoted. Keyed by the exact people name (`n`) in
 * public/data/civilizations.geojson. See docs/CIVILIZATIONS.md, "Genetic lineages".
 */
export interface Lineages {
  y: string[];
  mt: string[];
  basis: 'ancient' | 'modern';
  /** Study or survey behind the tags, short form. */
  src?: string;
  note?: string;
}

const M = (y: string[], mt: string[], src?: string, note?: string): Lineages => ({ y, mt, basis: 'modern', src, note });
const A = (y: string[], mt: string[], src: string, note?: string): Lineages => ({ y, mt, basis: 'ancient', src, note });

// Shared profiles for groups of related peoples
const NATIVE_AMERICAN = M(['Q-M3', 'Q-M242'], ['A2', 'B2', 'C1', 'D1'], 'Surveys of Indigenous American populations');
const POLYNESIAN = M(['C-M38 (C1b2a)', 'K2b1 (M, S)', 'O-M175'], ['B4a1a1 ("Polynesian motif")'], 'Kayser et al. 2006; Pacific surveys');
const BANTU = M(['E-V38 (E1b1a)', 'B2a'], ['L2a', 'L3e', 'L0a', 'L1c'], 'Surveys of Bantu-speaking populations');
const WEST_AFRICAN = M(['E-V38 (E1b1a)'], ['L2a', 'L3e', 'L1b'], 'Surveys of West African populations');
const EAST_SLAV = M(['R1a-Z280', 'I2a-Din (I-CTS10228)', 'N-M46 (N1c)'], ['H', 'U5', 'T'], 'Balanovsky et al. 2008');
const SOUTH_SLAV = M(['I2a-Din (I-CTS10228)', 'R1a-Z280', 'E-V13'], ['H', 'U5', 'J'], 'Surveys of Balkan populations');
const WEST_GERMANIC = M(['R1b-U106', 'R1b-P312', 'I1', 'R1a'], ['H', 'U5', 'J', 'T2'], 'Surveys of German and Dutch populations');
const EAST_GERMAN = M(['R1b-U106', 'R1a', 'I1', 'R1b-P312'], ['H', 'U5', 'J', 'T2'], 'Kayser et al. 2005; Rębała et al. 2013', 'R1a is a little commoner than in western Germany.');
const POLISH = M(['R1a-M458', 'R1a-Z280', 'R1b', 'I2a'], ['H', 'U5', 'J', 'T'], 'Surveys of Polish populations');
const FRENCH = M(['R1b-P312', 'I1', 'E-V13', 'J2'], ['H', 'U5', 'K', 'J'], 'Surveys of French populations');
const SCANDINAVIAN =M(['I1', 'R1b-U106', 'R1a-Z284', 'N-M46 (N1c)'], ['H', 'U5', 'T2', 'J'], 'Surveys of Scandinavian populations');
const IBERIAN = M(['R1b-DF27', 'R1b-P312', 'E-M81', 'J2', 'I2'], ['H', 'U5', 'J', 'T2'], 'Adams et al. 2008; Iberian surveys');
const BRITISH_ISLES = M(['R1b-L21', 'R1b-U106', 'I1'], ['H', 'U5', 'J', 'K'], 'People of the British Isles project');
const ITALIAN = M(['R1b-P312', 'J2a', 'E-V13', 'G2a', 'I2'], ['H', 'J', 'T2', 'U5', 'K'], 'Surveys of Italian populations');
const ARAB = M(['J1 (J-P58)', 'E-M34', 'J2', 'E-M78'], ['H', 'J', 'T', 'U6', 'L3'], 'Surveys of Arabic-speaking populations');
const AMAZIGH = M(['E-M81 (E1b1b1b)', 'J1'], ['H', 'U6', 'M1', 'L3'], 'Surveys of North African Amazigh populations');
const KURDISH = M(['J2', 'R1b-Z2103', 'J1', 'R1a', 'G'], ['H', 'U', 'J', 'T'], 'Nasidze et al. 2005');
const IRANIAN = M(['J2', 'R1a-Z93', 'R1b-Z2103', 'G2'], ['H', 'U', 'J', 'T'], 'Grugni et al. 2012');
const NORTH_INDIAN = M(['R1a-Z93', 'H1a (H-M69)', 'J2', 'L1a'], ['M (M3, M5, M30)', 'U2', 'R5', 'H'], 'Surveys of South Asian populations');
const SOUTH_INDIAN = M(['H1a (H-M69)', 'L1a', 'R1a-Z93', 'J2'], ['M (M2, M3, M5)', 'U2', 'R5', 'R30'], 'Surveys of Dravidian-speaking populations');
const HAN = M(['O2 (O-M122)', 'O1b (O-M268)', 'O1a', 'C2'], ['D4', 'B4', 'F', 'M7'], 'Surveys of Han Chinese populations');
const SOUTH_CHINA = M(['O1b (O-M268)', 'O2', 'O1a'], ['B4', 'F1', 'M7', 'R9'], 'Surveys of southern Chinese populations');
const MAINLAND_SEA = M(['O1b1 (O-M95)', 'O2'], ['B5', 'F1', 'M7', 'R9'], 'Surveys of mainland Southeast Asian populations');
const ISLAND_SEA = M(['O1a (O-M119)', 'O2', 'O1b', 'C1b'], ['B4a', 'E', 'M7c', 'F1'], 'Surveys of Island Southeast Asian populations');
const TURKIC_STEPPE = M(['C2 (C-M217)', 'R1a-Z93', 'N', 'O2'], ['D', 'C', 'H', 'U5'], 'Surveys of Central Asian Turkic populations');
const MONGOLIC = M(['C2 (C-M217)', 'O2', 'N'], ['D4', 'C4', 'G', 'A'], 'Surveys of Mongolic-speaking populations');
const SIBERIAN = M(['N-M46 (N1c)', 'C2', 'Q'], ['C', 'D', 'Z'], 'Surveys of Siberian populations');
const ABORIGINAL = M(['C-M347 (C1b2b)', 'K2b1 (M, S)'], ['M42', 'N13', 'S', 'O', 'P'], 'Surveys of Aboriginal Australian populations');
const PAPUAN = M(['M (K2b1)', 'S (K2b1)', 'C1b2'], ['P', 'Q'], 'Surveys of New Guinea populations');

export const LINEAGES: Record<string, Lineages> = {
  // ---- Ancient peoples and cultures (ancient DNA) -------------------------------------------
  'Yamnaya steppe peoples': A(['R1b-Z2103', 'I2a'], ['U5', 'H', 'W', 'T2', 'U4'], 'Haak et al. 2015; Mathieson et al. 2015'),
  'Corded Ware and Bell Beaker peoples': A(['R1a-M417 (Corded Ware)', 'R1b-P312 (Bell Beaker)'], ['U5', 'H', 'K', 'T2', 'J'], 'Haak et al. 2015; Olalde et al. 2018'),
  'Megalith builders': A(['I2a', 'G2a'], ['H', 'K1', 'J', 'U5'], 'Sánchez-Quinto et al. 2019'),
  'Cucuteni and Danubian farmers': A(['G2a', 'I2', 'C1a2'], ['N1a', 'K', 'T2', 'J', 'H'], 'Haak et al. 2010; Mathieson et al. 2018'),
  'Hittites and Luwians': A(['J2', 'G2a'], ['H', 'K', 'U', 'T'], 'Lazaridis et al. 2022', 'Bronze Age Anatolia as a whole.'),
  'Ancient Egyptians': A(['J', 'E1b1b'], ['M1', 'U6', 'J', 'T', 'H'], 'Schuenemann et al. 2017 (Abusir el-Meleq)', 'Few genomes, mostly from one Middle Egyptian site.'),
  'Minoans': A(['J2a', 'G2a'], ['H', 'K', 'U5', 'J'], 'Lazaridis et al. 2017'),
  'Mycenaean Greeks': A(['J2a', 'G2a', 'R1b-Z2103'], ['H', 'K', 'U5', 'J'], 'Lazaridis et al. 2017, 2022'),
  'Etruscans': A(['R1b-P312', 'J2', 'G2a'], ['H', 'U5', 'J', 'T'], 'Posth et al. 2021'),
  'Latins and Romans': A(['R1b-P312', 'J2', 'G2a', 'E-V13'], ['H', 'J', 'T', 'U5'], 'Antonio et al. 2019'),
  'Celts': A(['R1b-L21', 'R1b-P312'], ['H', 'U5', 'K'], 'Patterson et al. 2022; Fischer et al. 2022'),
  'Britons and Gaels': A(['R1b-L21'], ['H', 'U5', 'K'], 'Patterson et al. 2022'),
  'Germanic peoples': A(['I1', 'R1b-U106', 'R1a'], ['H', 'U5', 'T2'], 'Gretzinger et al. 2022'),
  'Anglo-Saxons and Danelaw': A(['I1', 'R1b-U106', 'R1b-L21'], ['H', 'U5', 'K'], 'Gretzinger et al. 2022'),
  'Norse of the Viking Age': A(['I1', 'R1b-U106', 'R1a-Z284'], ['H', 'U5', 'T2', 'J'], 'Margaryan et al. 2020'),
  'Scythians': A(['R1a-Z93', 'R1b', 'Q1a'], ['U5', 'H', 'C', 'D'], 'Unterländer et al. 2017; Järve et al. 2019'),
  'Sarmatians': A(['R1b-Z2103', 'R1a-Z93'], ['U5', 'H', 'C'], 'Krzewińska et al. 2018'),
  'Xiongnu': A(['Q1a', 'N', 'C2', 'R1a'], ['D4', 'C4', 'H', 'U'], 'Jeong et al. 2020; Lee et al. 2023', 'A mixed confederation; lineages vary by site and rank.'),
  'Tocharians': A(['R1a1a'], ['C4', 'H', 'K'], 'Li et al. 2010 (Xiaohe)', 'Bronze Age Tarim Basin burials; their link to Tocharian speakers is uncertain.'),
  'Jōmon peoples': A(['D-M64.1 (D1a2a)', 'C1a1'], ['N9b', 'M7a'], 'Kanzawa-Kiriyama et al. 2019'),
  'Yayoi peoples': A(['O1b2', 'O2'], ['D4', 'B4'], 'Cooke et al. 2021'),
  'Yellow River Neolithic cultures': A(['O2 (O-M122)', 'N1'], ['D4', 'B4', 'A'], 'Ning et al. 2020'),
  'Liangzhu and Yangtze Neolithic': A(['O1 (O-M119)'], ['D4', 'B4', 'F'], 'Li et al. 2007'),
  'Huaxia': A(['O2 (O-M122)', 'N1', 'Q'], ['D4', 'B4', 'A'], 'Ning et al. 2020'),
  'Lapita peoples': A(['O-M175 (few samples)'], ['B4a1a1 ("Polynesian motif")'], 'Skoglund et al. 2016'),
  'Indus Valley peoples': A([], ['U2b2'], 'Shinde et al. 2019 (Rakhigarhi)', 'One genome; ancestry related to Iranian farmers and hunter-gatherers.'),
  'Canaanites and Phoenicians': A(['J1', 'J2'], ['H', 'J', 'T', 'U'], 'Haber et al. 2017, 2020', 'Bronze Age Sidon and Levant.'),
  'Inca (Tawantinsuyu)': NATIVE_AMERICAN,
  'Mexica (Aztecs) and the Triple Alliance': NATIVE_AMERICAN,
  'Classic Maya': NATIVE_AMERICAN,
  'Olmecs': NATIVE_AMERICAN,

  // ---- Europe (present-day samples) --------------------------------------------------------
  Germans: WEST_GERMANIC,
  'Alemanni and Swabians': WEST_GERMANIC,
  'Bavarians and Austrians': M(['R1b-P312', 'R1b-U106', 'I1', 'R1a', 'E-V13'], ['H', 'U5', 'J', 'T2'], 'Surveys of Austrian and Bavarian populations'),
  Frisians: M(['R1b-U106', 'I1', 'R1b-P312'], ['H', 'U5', 'J'], 'Surveys of Dutch and Frisian populations'),
  'Dutch and Flemings': WEST_GERMANIC,
  Swiss: M(['R1b-P312', 'I1', 'E-V13', 'J2'], ['H', 'U5', 'J'], 'Surveys of Swiss populations'),
  'Alsatians and Lorrainers': WEST_GERMANIC,
  // Finer regional peoples (data/civilizations_more_5.py). Expelled or emigrant groups
  // with no survey of their own (East Prussians, Pomeranians, German Silesians, Sudeten,
  // Baltic, Danube, Volga and Transylvanian Germans, Old Prussians, Masurians) stay untagged.
  'Old Saxons': A(['I1', 'R1b-U106', 'R1a'], ['H', 'U5', 'T2'], 'Gretzinger et al. 2022 (early medieval northern Germany)'),
  'Lower Saxons': WEST_GERMANIC,
  Westphalians: WEST_GERMANIC,
  'Holsteiners and Mecklenburgers': WEST_GERMANIC,
  'Upper Saxons': EAST_GERMAN,
  'Brandenburgers and Berliners': EAST_GERMAN,
  Thuringians: WEST_GERMANIC,
  Franconians: WEST_GERMANIC,
  Hessians: WEST_GERMANIC,
  Rhinelanders: WEST_GERMANIC,
  Palatines: WEST_GERMANIC,
  Luxembourgers: WEST_GERMANIC,
  Tyroleans: M(['R1b-P312', 'R1b-U106', 'I1', 'R1a', 'E-V13'], ['H', 'U5', 'J', 'T2'], 'Surveys of Austrian and Bavarian populations'),
  Sorbs: M(['R1a-M458', 'R1a-Z280', 'I1', 'R1b-U106'], ['H', 'U5', 'J'], 'Rębała et al. 2013', 'Paternal lines closer to Poles and Czechs than to the Germans around them.'),
  'Silesians (Upper Silesia)': POLISH,
  Kashubians: POLISH,
  Gorals: POLISH,
  Moravians: M(['R1a-M458', 'R1b', 'I2a', 'E-V13'], ['H', 'U5', 'J'], 'Surveys of Czech populations'),
  Rusyns: EAST_SLAV,
  Hutsuls: EAST_SLAV,
  Pomors: M(['N-M46 (N1c)', 'R1a-Z280', 'I2a'], ['H', 'U5', 'T'], 'Balanovsky et al. 2008 (northern Russians)', 'Northern Russians carry more Finnic N lines than southern Russians.'),
  'Northumbrians and Geordies': BRITISH_ISLES,
  'Yorkshire folk': BRITISH_ISLES,
  'West Country folk': BRITISH_ISLES,
  Walloons: M(['R1b-P312', 'R1b-U106', 'I1'], ['H', 'U5', 'J'], 'Surveys of Belgian populations'),
  Picards: FRENCH,
  Burgundians: FRENCH,
  Provençals: FRENCH,
  Auvergnats: FRENCH,
  Gascons: M(['R1b-DF27', 'R1b-P312', 'I2'], ['H', 'U5', 'J'], 'Surveys of south-western French populations', 'Close to their Basque neighbours.'),
  Asturians: IBERIAN,
  Aragonese: IBERIAN,
  Guanches: A(['E-M81 (E1b1b1b)', 'J1'], ['H', 'U6', 'T2'], 'Rodríguez-Varela et al. 2017; Fregel et al. 2009'),
  Canarians: M(['R1b-DF27', 'E-M81', 'J2'], ['H', 'U6', 'L3'], 'Fregel et al. 2009', 'Paternal lines mostly European; maternal lines keep much Guanche ancestry (U6).'),
  Friulians: ITALIAN,
  'Ligurians and Genoese': ITALIAN,
  'Emilians and Romagnols': ITALIAN,
  Cretans: M(['J2a', 'R1b', 'E-V13', 'G2a'], ['H', 'J', 'K', 'U'], 'King et al. 2008'),
  Faroese: M(['I1', 'R1a-Z284', 'R1b-L21'], ['H', 'U5', 'K'], 'Jorgensen et al. 2004; Als et al. 2006', 'Paternal lines mostly Scandinavian, maternal lines mostly from the British Isles.'),
  Scandinavians: SCANDINAVIAN,
  Swedes: SCANDINAVIAN,
  Norwegians: M(['R1a-Z284', 'I1', 'R1b-U106'], ['H', 'U5', 'T2', 'J'], 'Surveys of Norwegian populations'),
  Danes: SCANDINAVIAN,
  Icelanders: M(['R1b-L21', 'I1', 'R1a-Z284'], ['H', 'U5', 'J', 'T2'], 'Helgason et al. 2000', 'Paternal lines mostly Norse, maternal lines more Gaelic.'),
  Finns: M(['N-M46 (N1c)', 'I1', 'R1a'], ['H', 'U5b', 'V', 'J'], 'Surveys of Finnish populations'),
  Sámi: M(['N-M46 (N1c)', 'I1', 'R1a'], ['U5b1b', 'V', 'Z'], 'Tambets et al. 2004'),
  English: BRITISH_ISLES,
  Irish: M(['R1b-L21'], ['H', 'U5', 'J', 'K'], 'Surveys of Irish populations'),
  Welsh: M(['R1b-L21'], ['H', 'U5', 'J'], 'People of the British Isles project'),
  'Scottish Highlanders and Gaels': M(['R1b-L21', 'I1', 'R1a-Z284'], ['H', 'U5', 'J'], 'Surveys of Scottish populations'),
  'Lowland Scots': BRITISH_ISLES,
  Cornish: M(['R1b-L21'], ['H', 'U5'], 'People of the British Isles project'),
  Bretons: M(['R1b-L21', 'R1b-DF27'], ['H', 'U5', 'J'], 'Surveys of Breton populations'),
  'Celtic fringe': M(['R1b-L21'], ['H', 'U5', 'J'], 'People of the British Isles project'),
  French: FRENCH,
  'Spanish and Portuguese': IBERIAN,
  Castilians: IBERIAN,
  'Catalans and Valencians': IBERIAN,
  'Galicians and Portuguese': IBERIAN,
  Andalusians: IBERIAN,
  Basques: M(['R1b-DF27'], ['H', 'U5', 'J'], 'Surveys of Basque populations', 'Very high R1b-DF27; Iron Age Basques already looked like modern Basques (Olalde et al. 2019).'),
  Italians: ITALIAN,
  Tuscans: ITALIAN,
  Venetians: ITALIAN,
  'Lombards and Piedmontese': ITALIAN,
  'Neapolitans and southern Italians': M(['J2a', 'R1b-P312', 'E-V13', 'G2a'], ['H', 'J', 'T2', 'K'], 'Surveys of southern Italian populations'),
  Sicilians: M(['R1b-P312', 'J2a', 'E-V13', 'G2a', 'E-M81'], ['H', 'J', 'T2', 'U', 'K'], 'Sarno et al. 2014'),
  Sardinians: M(['I2a1a (I-M26)', 'R1b-V88', 'G2a'], ['H', 'U5', 'J', 'K'], 'Chiang et al. 2016', 'Among the European populations closest to early Neolithic farmers.'),
  Corsicans: ITALIAN,
  Maltese: M(['J2', 'R1b', 'E-V13'], ['H', 'J', 'T', 'U'], 'Surveys of Maltese populations'),
  Greeks: M(['J2a', 'E-V13', 'R1b', 'I2'], ['H', 'J', 'K', 'U'], 'Surveys of Greek populations'),
  Albanians: M(['E-V13', 'J2b', 'R1b-Z2103'], ['H', 'U', 'J'], 'Surveys of Albanian populations'),
  Ghegs: M(['E-V13', 'J2b', 'R1b-Z2103'], ['H', 'U', 'J'], 'Surveys of Albanian populations'),
  Tosks: M(['E-V13', 'J2b', 'R1b-Z2103'], ['H', 'U', 'J'], 'Surveys of Albanian populations'),
  'Kosovo Albanians': M(['E-V13', 'J2b', 'R1b-Z2103'], ['H', 'U', 'J'], 'Surveys of Albanian populations'),
  'Russians and East Slavs': EAST_SLAV,
  'East Slavs': EAST_SLAV,
  Ukrainians: EAST_SLAV,
  Belarusians: EAST_SLAV,
  Poles: POLISH,
  'West Slavs': M(['R1a-M458', 'R1a-Z280', 'R1b', 'I2a'], ['H', 'U5', 'J'], 'Surveys of West Slavic populations'),
  Czechs: M(['R1a-M458', 'R1b', 'I2a', 'E-V13'], ['H', 'U5', 'J'], 'Surveys of Czech populations'),
  'South Slavs': SOUTH_SLAV,
  Serbs: SOUTH_SLAV,
  Croats: SOUTH_SLAV,
  Bosniaks: SOUTH_SLAV,
  Bulgarians: M(['E-V13', 'I2a-Din (I-CTS10228)', 'R1a', 'J2'], ['H', 'U5', 'J', 'T'], 'Karachanak et al. 2013'),
  Romanians: M(['I2a-Din (I-CTS10228)', 'R1a', 'E-V13', 'R1b'], ['H', 'U5', 'J', 'T'], 'Surveys of Romanian populations'),
  Hungarians: M(['R1a', 'R1b', 'I2a', 'E-V13'], ['H', 'U5', 'J', 'T'], 'Surveys of Hungarian populations', 'The Conquest-era elite carried more N and Asian lineages (Neparáczki et al. 2019).'),
  Balts: M(['R1a-Z280', 'N-M46 (N1c)'], ['H', 'U5', 'J'], 'Surveys of Baltic populations'),
  Georgians: M(['G2a', 'J2', 'R1b'], ['H', 'U', 'K'], 'Surveys of Georgian populations'),
  Armenians: M(['R1b-Z2103', 'J2', 'J1', 'G2'], ['H', 'U', 'K', 'T'], 'Haber et al. 2016'),
  'Circassians (Adyghe)': M(['G2a', 'J2', 'R1a'], ['H', 'U', 'K'], 'Surveys of North Caucasian populations'),
  'Chechens and Nakh peoples': M(['J2a', 'J1', 'G2'], ['H', 'U', 'K'], 'Surveys of North Caucasian populations'),
  'Dagestani peoples': M(['J1', 'J2', 'G2'], ['H', 'U', 'K'], 'Surveys of Dagestani populations'),
  'Ossetians and Alans': M(['G2a', 'R1a', 'J2'], ['H', 'U', 'K'], 'Surveys of Ossetian populations'),
  'Ashkenazi Jews': M(['J1', 'J2', 'E-M123', 'R1a-Y2619', 'G2'], ['K1a1b1a', 'K1a9', 'N1b', 'H'], 'Behar et al. 2006; Hammer et al. 2009'),
  'Romani people': M(['H1a (H-M82)', 'I2a', 'J2'], ['M5a1', 'H', 'U'], 'Mendizabal et al. 2012', 'H-M82 and M5a1 trace back to South Asia.'),

  // ---- Middle East and North Africa ---------------------------------------------------------
  'Arabs and the Arabic-speaking world': ARAB,
  'Early Arab-Islamic civilization': ARAB,
  'Medieval Bedouin': M(['J1 (J-P58)', 'E-M34'], ['H', 'J', 'T', 'L3'], 'Surveys of Arabian Bedouin populations'),
  'Bedouin of the Ottoman and modern era': M(['J1 (J-P58)', 'E-M34'], ['H', 'J', 'T', 'L3'], 'Surveys of Arabian Bedouin populations'),
  'Yemenis and Hadhramis': M(['J1 (J-P58)', 'E-M78'], ['L3', 'R0a', 'N1', 'J'], 'Surveys of Yemeni populations'),
  'Sudanese Arabs': M(['J1', 'E-M78', 'E-V32'], ['L3', 'L2', 'M1', 'H'], 'Surveys of Sudanese populations'),
  Egyptians: M(['E-M78 (E-V22, E-V12)', 'J1', 'J2', 'T'], ['H', 'M1', 'L3', 'U6', 'J'], 'Surveys of Egyptian populations'),
  Copts: M(['E-M78', 'J1', 'J2'], ['H', 'M1', 'L3', 'J'], 'Surveys of Coptic populations'),
  Berbers: AMAZIGH,
  Kabyles: AMAZIGH,
  'Chleuh and Rif Amazigh': AMAZIGH,
  Tuareg: M(['E-M81 (E1b1b1b)'], ['H1', 'L', 'U6'], 'Surveys of Tuareg populations'),
  Sahrawis: AMAZIGH,
  'Anatolian Turks': M(['J2', 'R1b-Z2103', 'G2', 'E-M78', 'R1a'], ['H', 'U', 'J', 'T'], 'Cinnioğlu et al. 2004', 'Central Asian lineages are a minority; most lines are older Anatolian.'),
  'Persians and Iranians': IRANIAN,
  'Sasanian Persians (Zoroastrian Iran)': IRANIAN,
  'Medes and early Persians': IRANIAN,
  Parsis: M(['J2', 'R1a', 'L1a'], ['M (South Asian)', 'U', 'H'], 'Chaubey et al. 2017', 'Paternal lines largely Iranian, maternal lines largely South Asian.'),
  'Lurs and Bakhtiari': IRANIAN,
  'Kurds under Ottoman and Safavid rule': KURDISH,
  'Medieval Kurds': KURDISH,
  'Kurds of Iran (Rojhelat)': KURDISH,
  'Kurmanji Kurds of Diyarbakır and Turkish Kurdistan': KURDISH,
  'Sorani Kurds of Iraqi Kurdistan': KURDISH,
  'Kurds of Syria (Rojava)': KURDISH,
  'Zaza and Alevi Kurds of Dersim': KURDISH,
  Kurds: KURDISH,
  Yazidis: KURDISH,
  Assyrians: M(['J1', 'J2', 'R1b', 'E-M123'], ['H', 'U', 'J', 'T'], 'Surveys of Assyrian populations'),
  Azerbaijanis: M(['J2', 'R1b-Z2103', 'G2', 'R1a'], ['H', 'U', 'J'], 'Surveys of Azerbaijani populations'),
  Pashtuns: M(['R1a-Z93', 'L1a', 'J2'], ['H', 'U', 'M', 'J'], 'Haber et al. 2012'),
  Baloch: M(['R1a-Z93', 'J2', 'L1a', 'E-M78'], ['M', 'H', 'U', 'L3'], 'Surveys of Baloch populations'),
  Hazaras: M(['C2 (C-M217)', 'R1a', 'O2'], ['D', 'C', 'H', 'M'], 'Surveys of Hazara populations'),
  'Sogdians and Tajiks': M(['R1a-Z93', 'J2', 'R1b'], ['H', 'U', 'T', 'J'], 'Surveys of Tajik populations'),

  // ---- Africa south of the Sahara ------------------------------------------------------------
  'Bantu peoples': BANTU,
  'Zulu and Nguni': M(['E-V38 (E1b1a)', 'B2a', 'A1b1'], ['L0d', 'L0a', 'L2a', 'L3e'], 'Surveys of Nguni populations', 'Maternal L0d lines come partly from Khoisan neighbours.'),
  'Sotho and Tswana': BANTU,
  Shona: BANTU,
  Kongo: BANTU,
  'Luba and Lunda': BANTU,
  Kikuyu: BANTU,
  Swahili: M(['E-V38 (E1b1a)', 'J1', 'R1a'], ['L0a', 'L2', 'L3', 'M'], 'Brielle et al. 2023', 'Medieval Swahili elites had African mothers and many Persian and Indian fathers.'),
  'Baganda and Great Lakes kingdoms': BANTU,
  Yoruba: WEST_AFRICAN,
  Igbo: WEST_AFRICAN,
  Akan: WEST_AFRICAN,
  'Fon and Dahomey': WEST_AFRICAN,
  'Edo (Benin)': WEST_AFRICAN,
  Mossi: WEST_AFRICAN,
  Hausa: M(['E-V38 (E1b1a)', 'R1b-V88', 'E-M78'], ['L3e', 'L2a', 'L1b'], 'Surveys of Hausa populations'),
  Kanuri: M(['E-V38 (E1b1a)', 'R1b-V88'], ['L3e', 'L2a'], 'Surveys of Chadic and Saharan populations'),
  Fula: M(['E-M132 (E1b1a1)', 'E-M81', 'R1b-V88'], ['L1b', 'L2', 'L3', 'H', 'U6'], 'Surveys of Fulani populations'),
  'Mandé peoples': WEST_AFRICAN,
  Mandinka: WEST_AFRICAN,
  Wolof: WEST_AFRICAN,
  Songhai: WEST_AFRICAN,
  Khoisan: M(['A1b1 (A-M51)', 'B2b', 'E-M293'], ['L0d', 'L0k'], 'Schlebusch et al. 2017'),
  'Forest peoples of the Congo basin': M(['B2b', 'E-V38'], ['L1c'], 'Patin et al. 2009'),
  Somalis: M(['E-V32 (E-M78)', 'T'], ['L', 'M1', 'R0a'], 'Sanchez et al. 2005'),
  Oromo: M(['E-V32 (E-M78)', 'A', 'T', 'J1'], ['L3', 'M1', 'L0a'], 'Surveys of Ethiopian populations'),
  'Habesha (Ethiopian Semitic) peoples': M(['E-M78', 'J1', 'A', 'T'], ['L3', 'M1', 'N', 'L0a'], 'Surveys of Ethiopian populations'),
  Amhara: M(['E-M78', 'J1', 'A', 'T'], ['L3', 'M1', 'N'], 'Surveys of Ethiopian populations'),
  Tigrayans: M(['E-M78', 'J1', 'A', 'T'], ['L3', 'M1', 'N'], 'Surveys of Ethiopian populations'),
  'Cushitic peoples': M(['E-V32 (E-M78)', 'A', 'T'], ['L3', 'M1', 'L0a'], 'Surveys of Cushitic-speaking populations'),
  'Nilotic peoples': M(['A3b2', 'B2a', 'E-M2'], ['L2', 'L3', 'L0a'], 'Surveys of Nilotic populations'),
  Maasai: M(['E-V32', 'A3b2', 'E-V38'], ['L3', 'L0a', 'L2'], 'Surveys of Maasai populations'),
  Nubians: M(['J1', 'E-M78', 'A', 'B'], ['L', 'M1', 'H'], 'Surveys of Nubian populations'),
  'Madagascar Malagasy': M(['E-V38', 'O1a', 'O2'], ['B4a1a1 ("Polynesian motif")', 'M7c', 'L3', 'L0a'], 'Pierron et al. 2014', 'About half Austronesian (Borneo) and half East African ancestry.'),
  Merina: M(['O1a', 'O2', 'E-V38'], ['B4a1a1 ("Polynesian motif")', 'M7c', 'L3'], 'Pierron et al. 2014'),

  // ---- South Asia ---------------------------------------------------------------------------
  'Indo-Aryan peoples': NORTH_INDIAN,
  'Hindi-Urdu belt of India and Pakistan': NORTH_INDIAN,
  'Hindustani-speaking Indo-Muslim civilization': NORTH_INDIAN,
  Punjabis: M(['R1a-Z93', 'L1a', 'J2', 'H1a'], ['M', 'U2', 'H', 'U7'], 'Surveys of Punjabi populations'),
  Sindhis: NORTH_INDIAN,
  Gujaratis: NORTH_INDIAN,
  Marathas: NORTH_INDIAN,
  Bengalis: M(['R1a-Z93', 'O2', 'H1a', 'J2'], ['M', 'U2', 'R', 'D4'], 'Surveys of Bengali populations'),
  Kashmiris: M(['R1a-Z93', 'J2', 'L1a'], ['H', 'U', 'M', 'J'], 'Surveys of Kashmiri populations'),
  'Dravidian peoples': SOUTH_INDIAN,
  Tamils: SOUTH_INDIAN,
  'Sri Lankan Tamils': SOUTH_INDIAN,
  Telugus: SOUTH_INDIAN,
  Kannadigas: SOUTH_INDIAN,
  Malayalis: SOUTH_INDIAN,
  Sinhalese: M(['H1a', 'R1a-Z93', 'L1a', 'R2'], ['M', 'U7', 'R30'], 'Surveys of Sri Lankan populations'),
  'Munda peoples': M(['O1b1 (O-M95)', 'H1a'], ['M (South Asian)', 'R'], 'Chaubey et al. 2011', 'Paternal O-M95 links them to Austroasiatic speakers of Southeast Asia.'),
  'Gond and other Central Indian tribal peoples': M(['H1a', 'O1b1', 'R1a'], ['M (South Asian)'], 'Surveys of Central Indian tribal populations'),
  'Newars and Nepali hill peoples': M(['O2', 'R1a', 'D'], ['M9a', 'D4', 'M'], 'Surveys of Nepalese populations'),

  // ---- East and Southeast Asia --------------------------------------------------------------
  'Han Chinese': HAN,
  'Wu Chinese (Jiangnan)': HAN,
  'Hokkien and Min Chinese': SOUTH_CHINA,
  'Cantonese (Lingnan)': SOUTH_CHINA,
  Hakka: HAN,
  'Hui Muslims': M(['O2', 'O1b', 'R1a', 'J2'], ['D4', 'B4', 'H', 'U'], 'Surveys of Hui populations'),
  Zhuang: SOUTH_CHINA,
  'Baiyue peoples': SOUTH_CHINA,
  'Yi peoples': M(['O2', 'D1a1', 'Q'], ['D4', 'B4', 'M7'], 'Surveys of Yi populations'),
  Tibetans: M(['D-M174 (D1a1)', 'O2'], ['M9a', 'D4', 'F', 'A'], 'Qi et al. 2013', 'D-M174 is very old in the plateau.'),
  Mongols: MONGOLIC,
  'Xianbei and early Mongols': A(['C2 (C-M217)', 'O2', 'N'], ['D4', 'C4'], 'Jeong et al. 2020'),
  'Kalmyks and Oirats': MONGOLIC,
  Buryats: M(['C2 (C-M217)', 'N-M46 (N1c)'], ['D4', 'C4', 'G'], 'Surveys of Buryat populations'),
  'Jurchen and Manchus': M(['C2 (C-M217)', 'O2', 'N'], ['D4', 'B4', 'A'], 'Surveys of Manchu populations'),
  Koreans: M(['O2', 'O1b2', 'C2'], ['D4', 'B4', 'A', 'M7'], 'Surveys of Korean populations'),
  Japanese: M(['D-M64.1 (D1a2a)', 'O1b2', 'O2'], ['D4', 'B4', 'M7a', 'N9b'], 'Surveys of Japanese populations', 'D-M64.1 comes from the Jōmon; O lines mostly from the Yayoi.'),
  Ryukyuans: M(['D-M64.1 (D1a2a)', 'O1b2', 'O2'], ['M7a', 'D4', 'B4'], 'Surveys of Ryukyuan populations'),
  Ainu: M(['D-M64.1 (D1a2a)', 'C1a1'], ['N9b', 'Y1', 'M7a'], 'Tajima et al. 2004'),
  Vietnamese: M(['O2', 'O1b1 (O-M95)'], ['M7', 'F1', 'B5', 'R9'], 'Surveys of Vietnamese populations'),
  'Tai peoples': MAINLAND_SEA,
  'Thai and Lao': MAINLAND_SEA,
  Shan: MAINLAND_SEA,
  Khmer: M(['O1b1 (O-M95)', 'O2'], ['B5', 'F1', 'R9', 'M7'], 'Surveys of Khmer populations'),
  Mon: MAINLAND_SEA,
  Burmans: M(['O2', 'O1b1', 'D'], ['M', 'R9', 'F', 'B'], 'Surveys of Burmese populations'),
  'Karen peoples': MAINLAND_SEA,
  'Malays and Indonesians': ISLAND_SEA,
  Javanese: ISLAND_SEA,
  Sundanese: ISLAND_SEA,
  Balinese: ISLAND_SEA,
  Minangkabau: ISLAND_SEA,
  'Bugis and Makassar seafarers': ISLAND_SEA,
  'Tagalog and Luzon Filipinos': ISLAND_SEA,
  Visayans: ISLAND_SEA,
  'Moros of Mindanao and Sulu': ISLAND_SEA,
  'Taiwanese indigenous peoples': M(['O1a (O-M119)', 'O2'], ['B4a', 'E', 'F3b', 'M7c'], 'Surveys of Taiwanese Austronesian populations', 'The likely homeland of the Austronesian expansion.'),
  'Austronesian peoples': ISLAND_SEA,
  Cham: ISLAND_SEA,

  // ---- Central Asia and Siberia --------------------------------------------------------------
  'Turkic peoples': TURKIC_STEPPE,
  Kazakhs: M(['C2 (C-M217)', 'R1a-Z93', 'O2', 'N'], ['D', 'C', 'H', 'U5'], 'Surveys of Kazakh populations'),
  Kyrgyz: M(['R1a-Z93', 'C2', 'O2'], ['D', 'C', 'H'], 'Surveys of Kyrgyz populations'),
  Uzbeks: TURKIC_STEPPE,
  Turkmen: M(['Q1a', 'R1a-Z93', 'J2'], ['H', 'U', 'D'], 'Surveys of Turkmen populations'),
  Uyghurs: M(['R1a-Z93', 'J2', 'C2', 'O2'], ['H', 'D', 'U', 'M'], 'Surveys of Uyghur populations'),
  'Volga Tatars': M(['R1a-Z280', 'N-M46 (N1c)', 'J2'], ['H', 'U5', 'T'], 'Surveys of Tatar populations'),
  'Crimean Tatars': M(['R1a', 'J2', 'G2', 'R1b'], ['H', 'U', 'K'], 'Surveys of Crimean Tatar populations'),
  Tuvans: M(['Q1a', 'N-M46 (N1c)', 'C2'], ['C', 'D'], 'Surveys of Tuvan populations'),
  Yakuts: M(['N-M178 (N1c)'], ['C', 'D'], 'Pakendorf et al. 2006', 'Nearly all Yakut men share N-M178 from a small founding group.'),
  Evenks: SIBERIAN,
  'Tungusic peoples': SIBERIAN,
  'Samoyedic and Ob-Ugric peoples': M(['N-P43 (N1b)', 'N-M46 (N1c)', 'Q'], ['U4', 'C', 'D', 'Z'], 'Surveys of West Siberian populations'),
  Nenets: M(['N-P43 (N1b)', 'N-M46 (N1c)'], ['U4', 'C', 'D', 'Z'], 'Surveys of Nenets populations'),
  'Uralic peoples': M(['N-M46 (N1c)', 'R1a'], ['U5', 'H', 'C', 'D'], 'Surveys of Uralic-speaking populations'),
  'Chukchi and Kamchatkans': M(['N', 'Q1a', 'C2'], ['C', 'D', 'G', 'A'], 'Surveys of Chukotka populations'),

  // ---- Americas and Oceania ------------------------------------------------------------------
  Maya: NATIVE_AMERICAN,
  'Maya today': NATIVE_AMERICAN,
  'Postclassic Maya': NATIVE_AMERICAN,
  'Nahua peoples': NATIVE_AMERICAN,
  'Zapotecs and Mixtecs': NATIVE_AMERICAN,
  'Mixtec and Zapotec of Oaxaca': NATIVE_AMERICAN,
  Purépecha: NATIVE_AMERICAN,
  'Quechua and Aymara': M(['Q-M3'], ['B2', 'A2', 'C1', 'D1'], 'Surveys of Andean populations'),
  Aymara: M(['Q-M3'], ['B2', 'A2', 'C1', 'D1'], 'Surveys of Andean populations'),
  Mapuche: M(['Q-M3'], ['D1', 'C1', 'B2', 'A2'], 'Surveys of Mapuche populations'),
  Guaraní: NATIVE_AMERICAN,
  'Tupi–Guarani peoples': NATIVE_AMERICAN,
  'Amazonian peoples': NATIVE_AMERICAN,
  Yanomami: M(['Q-M3'], ['B2', 'C1', 'A2'], 'Surveys of Yanomami populations'),
  'Algonquian peoples': M(['Q-M3', 'C2', 'R1 (post-contact)'], ['A2', 'C1', 'X2a', 'B2'], 'Surveys of Algonquian populations'),
  Iroquois: M(['Q-M3', 'C2'], ['A2', 'X2a', 'C1'], 'Surveys of Northeastern Native populations'),
  'Dene (Athabaskan) peoples': M(['C2 (C-P39)', 'Q-M3'], ['A2', 'D'], 'Surveys of Na-Dene populations'),
  'Navajo and Apache': M(['C2 (C-P39)', 'Q-M3'], ['A2', 'B2', 'C1', 'D1'], 'Surveys of Southern Athabaskan populations'),
  'Lakota and Dakota': NATIVE_AMERICAN,
  'Plains peoples': NATIVE_AMERICAN,
  'Eastern Woodlands peoples': NATIVE_AMERICAN,
  'Cherokee and Muskogean peoples': NATIVE_AMERICAN,
  'Pueblo peoples': NATIVE_AMERICAN,
  'Ancestral Puebloans': A(['Q-M3'], ['B2', 'A2', 'C1'], 'Kennett et al. 2017'),
  Inuit: M(['Q1b (Q-M3)'], ['A2a', 'D3'], 'Surveys of Inuit populations'),
  'Alaska Natives': M(['Q1b (Q-M3)', 'C2'], ['A2', 'D3'], 'Surveys of Alaska Native populations'),
  'Aboriginal Australians': ABORIGINAL,
  Noongar: ABORIGINAL,
  'Kulin nation': ABORIGINAL,
  'Yolngu (Arnhem Land)': ABORIGINAL,
  'Papuan peoples': PAPUAN,
  'Highlands peoples of New Guinea': PAPUAN,
  Melanesians: M(['M (K2b1)', 'S (K2b1)', 'C1b2', 'O-M175'], ['P', 'Q', 'B4a1a1'], 'Surveys of Melanesian populations'),
  Fijians: M(['C-M38 (C1b2a)', 'M (K2b1)', 'O-M175'], ['B4a1a1 ("Polynesian motif")', 'P', 'Q'], 'Surveys of Fijian populations'),
  'Eastern Polynesians': POLYNESIAN,
  'Samoans and Tongans': POLYNESIAN,
  Samoans: POLYNESIAN,
  Tongans: POLYNESIAN,
  Māori: POLYNESIAN,
  Hawaiians: POLYNESIAN,
  'Rapa Nui': POLYNESIAN,
  'Society Islands and Marquesas': POLYNESIAN,
  Micronesians: M(['O-M175', 'C-M38', 'M (K2b1)'], ['B4a1a1', 'E', 'M7c'], 'Surveys of Micronesian populations'),
  Chamorro: M(['O-M175', 'C-M38'], ['E', 'B4'], 'Surveys of Chamorro populations'),
};

export function lineagesOf(name: string): Lineages | undefined {
  return LINEAGES[name];
}
