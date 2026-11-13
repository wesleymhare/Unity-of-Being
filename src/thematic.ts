/**
 * Three map lenses drawn on the polity shapes, each answering a different question about a place
 * in a given year:
 *
 *   Ideologies   how it was governed (the governing style, usually but not always per polity)
 *   Worldviews   what its rulers and most of its people took the world to be (faith, philosophy)
 *   Control      who held de facto control there (an overlord, a bloc, an occupier), for Societies
 *
 * Every answer is a Theme with one or more Wikipedia articles stacked in the panel, plus the reason
 * the rule gave. The rules below are this project's own judgement, written as a first pass: named
 * regimes first, then region and era defaults. They are deliberately visible ("why") so a wrong
 * one can be found and fixed here. See docs/THEMATIC-LENSES.md.
 */

export interface Theme {
  id: string;
  name: string;
  colour: string;
  /** English Wikipedia titles, stacked in the panel in this order. */
  articles: string[];
  /** One or two sentences in this project's words. */
  blurb: string;
}

export interface Verdict {
  theme: Theme;
  /** Which rule placed it here, in plain words. */
  why: string;
}

export interface Subject {
  n: string;
  s: number;
  e: number;
  lx: number;
  ly: number;
  /** Realm the polity belongs to, if any. */
  m?: string;
}

const t = (id: string, name: string, colour: string, articles: string[], blurb: string): Theme =>
  ({ id, name, colour, articles, blurb });

// ---- Regions (rough boxes on the polity's label point: west, south, east, north) -------------
type Box = [number, number, number, number];
const R: Record<string, Box[]> = {
  westEurope: [[-11, 35, 16, 61]],
  centralEurope: [[8, 44, 25, 56]],
  scandinavia: [[4, 54, 32, 72]],
  britain: [[-11, 49, 2, 61]],
  iberia: [[-10, 35, 4, 44]],
  italy: [[6, 36, 19, 47.5]],
  balkans: [[13, 34, 30, 47]],
  eastEurope: [[22, 44, 62, 72]],
  caucasus: [[38, 38, 51, 44.5]],
  anatolia: [[25, 35, 45, 42.5]],
  levant: [[32, 29, 39, 37.5]],
  mesopotamia: [[38, 29, 49, 38]],
  iran: [[44, 24, 63, 40]],
  arabia: [[34, 12, 60, 32]],
  egypt: [[24, 21, 37, 32]],
  maghreb: [[-18, 20, 25, 37.5]],
  sahel: [[-18, 8, 38, 21]],
  hornOfAfrica: [[33, 2, 52, 18]],
  subSahara: [[-18, -36, 52, 8]],
  centralAsia: [[50, 35, 80, 52]],
  steppe: [[30, 43, 135, 58]],
  india: [[60, 5, 92, 37]],
  tibet: [[77, 27, 100, 37.5]],
  china: [[97, 18, 124, 42]],
  manchuria: [[118, 38, 135, 50]],
  korea: [[124, 33, 131, 43]],
  japan: [[128, 26, 147, 46]],
  mainlandSEA: [[92, 5, 110, 28]],
  islandSEA: [[95, -11, 141, 8], [116, 4, 127, 21]],
  iceland: [[-25, 62, -12, 67.5]],
  mesoamerica: [[-118, 7, -77, 25]],
  andes: [[-82, -40, -62, 5]],
  northAmerica: [[-170, 24, -50, 75]],
  latinAmerica: [[-118, -56, -34, 33]],
  oceania: [[110, -48, 180, -9], [141, -12, 180, 25], [-180, -48, -130, 25]],
  russia: [[30, 45, 190, 78]],
};

const wrap = (lng: number): number => ((((lng + 180) % 360) + 360) % 360) - 180;

function inRegion(p: Subject, ...names: string[]): boolean {
  const x = wrap(p.lx);
  const y = p.ly;
  return names.some((name) => (R[name] ?? []).some(([w, s, e, n]) => x >= w && x <= e && y >= s && y <= n));
}

const between = (year: number, from: number, to: number): boolean => year >= from && year <= to;

interface NameRule {
  re: RegExp;
  id: string;
  from?: number;
  to?: number;
  why?: string;
}

function byName(rules: NameRule[], p: Subject, year: number): NameRule | null {
  for (const rule of rules) {
    if (rule.re.test(p.n) && year >= (rule.from ?? -1e9) && year <= (rule.to ?? 1e9)) return rule;
  }
  return null;
}

// ================================================================================================
// IDEOLOGIES: the governing style
// ================================================================================================
export const IDEOLOGIES: Record<string, Theme> = {
  chiefdom: t('chiefdom', 'Chiefdom or tribal confederation', '#a8916a', ['Chiefdom', 'Tribal confederation'],
    'Rule by chiefs and councils of lineages; power rests on kinship, prestige and redistribution more than on a standing bureaucracy.'),
  sacral: t('sacral', 'Sacral kingship', '#c9a25a', ['Sacred king', 'Divine right of kings', 'Temple economy'],
    'The ruler stands between the gods and the people; temple and palace run the economy together.'),
  cityState: t('cityState', 'City-state or classical republic', '#4f9f95', ['City-state', 'Classical republicanism', 'Oligarchy'],
    'A city and its hinterland governed by citizens, councils or a narrow oligarchy rather than a single dynasty.'),
  merchantRepublic: t('merchantRepublic', 'Merchant or aristocratic republic', '#3f8f8a', ['Maritime republics', 'Aristocratic republic', 'Classical republicanism'],
    'Councils of merchant and noble families govern, often by election among themselves; trade is policy.'),
  monarchy: t('monarchy', 'Hereditary monarchy', '#b5874f', ['Monarchy', 'Hereditary monarchy'],
    'A dynasty rules by inheritance, with nobles, priests and officials as partners in power.'),
  autocracy: t('autocracy', 'Imperial autocracy', '#b5574f', ['Autocracy', 'Empire'],
    'An emperor or great king rules many peoples through governors, armies and tribute.'),
  bureaucratic: t('bureaucratic', 'Bureaucratic empire (scholar-officials)', '#c46f8d', ['Mandate of Heaven', 'Imperial examination', 'Chinese bureaucracy'],
    'A monarch governs through a trained civil service recruited by examination and justified by Confucian ethics.'),
  feudal: t('feudal', 'Feudal monarchy', '#9a6b52', ['Feudalism', 'Vassal', 'Manorialism'],
    'Land is held in return for military service; power is layered through lords and vassals rather than a central bureaucracy.'),
  steppe: t('steppe', 'Nomadic confederation (khanate)', '#cdb050', ['Nomadic empire', 'Khagan', 'Tribal confederation'],
    'A khan leads a confederation of mounted clans; power is mobile, personal and built on tribute and trade routes.'),
  islamic: t('islamic', 'Islamic sultanate or caliphate', '#5f9e6e', ['Caliphate', 'Sultan', 'Sharia'],
    'A Muslim ruler governs with the backing of religious scholars, law courts based on sharia and a slave or salaried soldiery.'),
  theocracy: t('theocracy', 'Theocracy', '#7a8f3a', ['Theocracy', 'Clergy'],
    'Religious leaders hold the state itself: a pope, lama, imam or order of knights rules in the name of the faith.'),
  absolute: t('absolute', 'Absolute monarchy', '#a0463f', ['Absolute monarchy', 'Enlightened absolutism'],
    'A monarch claims undivided sovereignty and rules through a standing army and a centralised court.'),
  constitutional: t('constitutional', 'Constitutional monarchy', '#6b86c2', ['Constitutional monarchy', 'Parliamentary system'],
    'A monarch reigns but law and an elected or estates parliament limit what the crown can do.'),
  democracy: t('democracy', 'Liberal democracy', '#4f7fc4', ['Liberal democracy', 'Representative democracy', 'Rule of law'],
    'Governments are chosen in competitive elections, with protected rights, a free press and courts that can overrule rulers.'),
  hybrid: t('hybrid', 'Hybrid or illiberal regime', '#8878b8', ['Hybrid regime', 'Illiberal democracy', 'Competitive authoritarianism'],
    'Elections are held but the playing field is tilted: rulers control media, courts or security forces enough to stay in power.'),
  authoritarian: t('authoritarian', 'One-party or personal dictatorship', '#7d4f86', ['Authoritarianism', 'Dominant-party system', 'Dictatorship'],
    'One party, family or strongman holds power without real electoral competition.'),
  communist: t('communist', 'Communist one-party state', '#c23b3b', ['Communist state', 'Marxism–Leninism', 'One-party state'],
    'A Marxist–Leninist party runs the state and the economy; private property and opposition are curtailed.'),
  fascist: t('fascist', 'Fascist or corporatist dictatorship', '#4a4a4a', ['Fascism', 'Totalitarianism', 'Corporatism'],
    'A nationalist dictatorship fuses party, state and army, suppresses opposition and organises society around the nation or race.'),
  military: t('military', 'Military rule or warlordism', '#6f6046', ['Military dictatorship', 'Military junta', 'Warlord'],
    'Officers or armed factions hold power directly, usually after a coup or in a civil war.'),
  colonial: t('colonial', 'Colonial administration', '#8a929a', ['Colonialism', 'Crown colony', 'Indirect rule'],
    'Governed from a distant metropole by appointed officials, often through local rulers, for the benefit of the colonising power.'),
  dependency: t('dependency', 'Dependent territory', '#9ea6ad', ['Dependent territory'],
    'A territory administered by another state, with limited or no self-government in foreign and defence affairs.'),
  unclassified: t('unclassified', 'Not classified yet', '#5c656d', ['Form of government'],
    'No rule in this project covers this polity yet. The Wikipedia article and its infobox say more.'),
};

/** Named regimes, checked first, in order. Year ranges are inclusive. */
const IDEOLOGY_NAMES: NameRule[] = [
  // Communist states
  { re: /^(Union of Soviet Socialist Republics|Mongolian People's Republic|German Democratic Republic|Democratic People's Republic of Korea|Democratic Republic of Vietnam|Socialist Republic of Vietnam|Communist Laos|Communist Cuba|Cuban Communists|Khmer Rouge|People's Republic of Kampuchea|People's Republic of Angola|People's Democratic Republic of Yemen|Hungarian People's Republic|People's Republic of Bulgaria|Socialist Republic of Romania|People's Socialist Republic of Albania|Socialist Federal Republic of Yugoslavia|Communist Party of China|People's Republic of China|China|Vietnam|Laos|Cuba|North Korea)$/, id: 'communist', why: 'Ruled by a Marxist–Leninist party.' },
  { re: /^Czechoslovakia$/, id: 'communist', from: 1948, to: 1989 },
  { re: /^Republic of Poland$/, id: 'communist', from: 1945, to: 1989 },
  { re: /^Afghanistan$/, id: 'communist', from: 1978, to: 1991, why: 'People’s Democratic Party of Afghanistan.' },
  { re: /^Ethiopia$/, id: 'communist', from: 1974, to: 1991, why: 'The Derg, then the Workers’ Party of Ethiopia.' },
  { re: /^Mozambique$/, id: 'communist', from: 1975, to: 1990 },
  // Fascist and corporatist dictatorships
  { re: /^(Nazi Germany|Independent State of Croatia|Vichy France|Francoist Spain|Italian Social Republic)$/, id: 'fascist', why: 'Fascist, Nazi or collaborationist regime.' },
  { re: /^Kingdom of Italy$/, id: 'fascist', from: 1922, to: 1943, why: 'Mussolini’s Fascist regime under the crown.' },
  { re: /^Estado Novo$/, id: 'fascist', from: 1933, to: 1974, why: 'Salazar’s corporatist Estado Novo.' },
  { re: /^Empire of Japan$/, id: 'fascist', from: 1932, to: 1945, why: 'Militarist ultranationalism (Japanese statism).' },
  { re: /^Kingdom of Romania$/, id: 'fascist', from: 1940, to: 1944, why: 'Antonescu’s dictatorship.' },
  // Theocracies
  { re: /^(Papal States|Taliban|Islamic Republic of Iran|Iran|Teutonic Order|State of the Teutonic Order|Livonian Order|Knights Hospitaller|Gaza\/Hamas)$/, id: 'theocracy' },
  { re: /^Tibet$/, id: 'theocracy', from: 1642, to: 1951, why: 'The Ganden Phodrang government of the Dalai Lamas.' },
  { re: /^Afghanistan$/, id: 'theocracy', from: 2021, why: 'The Taliban’s Islamic Emirate.' },
  { re: /Imamate/, id: 'theocracy', why: 'Ruled by an imam as head of the faith and state.' },
  // Military rule and warlordism
  { re: /^(Greek junta|Mujahideen|Union of Myanmar|Libyan Arab Republic|Federated Republic of Brazil|Zaire|Republic of Vietnam|Iraqi Republic|Ba'athist Syria|Arab Socialist Ba'ath Party|United Arab Republic|Republic of Egypt|Arab Republic of Egypt|Egypt|State of Libya|Libya|Chechen Republic|Republic of Sudan|Sudan)$/, id: 'military', why: 'Officers, a ruling military party or armed factions held power.' },
  { re: /^Afghanistan$/, id: 'military', from: 1992, to: 2001, why: 'Civil war between mujahideen factions and warlords.' },
  { re: /^Burma$/, id: 'military', from: 1962, to: 1989 },
  { re: /^Myanmar$/, id: 'military', from: 2021, why: 'The 2021 coup.' },
  { re: /^Myanmar$/, id: 'hybrid', from: 2016, to: 2020 },
  { re: /^Republic of Chile$/, id: 'military', from: 1973, to: 1989 },
  { re: /^Argentine Republic$/, id: 'military', from: 1976, to: 1983 },
  { re: /^Argentine Republic$/, id: 'military', from: 1966, to: 1973 },
  { re: /^Republic of Peru$/, id: 'military', from: 1968, to: 1980 },
  { re: /^Republic of Korea$/, id: 'military', from: 1961, to: 1987 },
  { re: /^Republic of Indonesia$/, id: 'military', from: 1966, to: 1998, why: 'Suharto’s New Order.' },
  { re: /^Islamic Republic of Pakistan$/, id: 'military', from: 1958, to: 1971 },
  { re: /^Islamic Republic of Pakistan$/, id: 'military', from: 1977, to: 1988 },
  { re: /^Islamic Republic of Pakistan$/, id: 'military', from: 1999, to: 2008 },
  { re: /^Kingdom of Thailand$/, id: 'military', from: 1932, to: 1973 },
  { re: /^Kingdom of Thailand$/, id: 'military', from: 1976, to: 1988 },
  { re: /^(Kingdom of Thailand|Thailand)$/, id: 'military', from: 2014, to: 2019 },
  { re: /^(Mali|Burkina Faso|Guinea)$/, id: 'military', from: 2021, why: 'Military junta after a coup.' },
  { re: /^Mali$/, id: 'military', from: 2020 },
  { re: /^(Niger|Gabon)$/, id: 'military', from: 2023, why: 'Military junta after the 2023 coup.' },
  { re: /^Chad$/, id: 'military', from: 2021 },
  { re: /^Republic of Turkey$/, id: 'military', from: 1980, to: 1983 },
  // Absolute monarchies of the modern era (before the broad dictatorship list, which would catch them)
  { re: /^(Kingdom of Saudi Arabia|Saudi Arabia|Oman|Sultanate of Oman|Sultanate of Muscat and Oman|Qatar|State of Qatar|United Arab Emirates|Brunei|Sultanate of Brunei|Eswatini|Swaziland|Bahrain|Kuwait|State of Kuwait|Kingdom of Afghanistan|Kingdom of Libya|North Yemen)$/, id: 'absolute', from: 1900, why: 'The ruling family holds sovereignty; any assembly is advisory.' },
  { re: /^(Kingdom of Bhutan|Bhutan)$/, id: 'absolute', to: 2007 },
  { re: /^(Kingdom of Bhutan|Bhutan)$/, id: 'constitutional', from: 2008 },
  { re: /^Nepal$/, id: 'absolute', from: 1775, to: 1989 },
  { re: /^Nepal$/, id: 'constitutional', from: 1990, to: 2007 },
  { re: /^Nepal$/, id: 'democracy', from: 2008 },
  { re: /^Ethiopia$/, id: 'absolute', from: 1942, to: 1973 },
  { re: /^Ethiopian Empire$/, id: 'absolute', from: 1855 },
  { re: /^Mexico$/, id: 'hybrid', from: 2001 },
  { re: /^(Liechtenstein|Monaco|Canada)$/, id: 'constitutional', from: 1867, why: 'A monarch reigns; an elected parliament governs.' },
  { re: /^(Vatican)$/, id: 'theocracy' },
  { re: /^(San Marino|Tuvalu|Nauru|Seychelles|Saint Kitts|Saint Kitts and Nevis)$/, id: 'democracy', from: 1946 },
  { re: /^(Maldives|Sri Lanka|Lebanon|Papua New Guinea)$/, id: 'hybrid', from: 1943, why: 'Elections are held, with periods of emergency rule, civil war or one-party dominance.' },
  { re: /^(Chad|Niger|Burkina Faso|Guinea|Afghanistan)$/, id: 'hybrid', from: 2002, to: 2020 },
  { re: /^Estado Novo$/, id: 'democracy', from: 1975 },
  { re: /^(South Africa)$/, id: 'hybrid', from: 1910, to: 1947, why: 'Parliamentary rule with the vote restricted mostly to white men.' },
  { re: /^(Free French)$/, id: 'democracy', why: 'The French government-in-exile and its territories.' },
  { re: /^(Éire|Ireland)$/, id: 'democracy', from: 1922 },
  { re: /^(French Consulate|First French Empire|Second French Empire)$/, id: 'authoritarian', why: 'Bonapartist rule confirmed by plebiscites.' },
  { re: /^(French First Republic|French Directory|French Second Republic)$/, id: 'hybrid', why: 'A revolutionary republic with a narrow or unstable franchise.' },
  { re: /^(Haiti)$/, id: 'military', from: 1791, to: 1820, why: 'Revolution and the rule of its generals.' },
  { re: /^(Denmark-Norway)$/, id: 'absolute', from: 1660, why: 'Absolute monarchy under the King’s Law of 1665.' },
  // One-party and personal dictatorships
  { re: /^(Pahlavi Dynasty)$/, id: 'absolute', why: 'Autocratic monarchy of the Shahs.' },
  { re: /^(Rhodesia|Zimbabwe Rhodesia)$/, id: 'authoritarian', why: 'White-minority rule.' },
  { re: /^South Africa$/, id: 'authoritarian', from: 1948, to: 1993, why: 'Apartheid: elections for the white minority only.' },
  { re: /^Republic of China$/, id: 'authoritarian', from: 1928, to: 1987, why: 'Kuomintang one-party rule and martial law.' },
  { re: /^Republic of Turkey$/, id: 'authoritarian', from: 1924, to: 1945, why: 'Single-party rule of the Republican People’s Party.' },
  { re: /^Mexico$/, id: 'authoritarian', from: 1929, to: 2000, why: 'Dominant-party rule of the PRI.' },
  { re: /^Unitary State of Brazil$/, id: 'authoritarian', why: 'Vargas’s Estado Novo.' },
  { re: /^(Syria)$/, id: 'authoritarian', from: 1973, to: 2024, why: 'Assad family and Ba’ath party rule.' },
  { re: /^(Syria)$/, id: 'military', from: 2025, why: 'Transitional rule by the armed opposition that overthrew Assad.' },
  { re: /^(Russia|Russian Federation|Belarus|Republic of Belarus|Kazakhstan|Turkmenistan|Uzbekistan|Republic of Uzbekistan|Tajikistan|Republic of Tajikistan|Azerbaijan|Republic of Azerbaijan|Eritrea|State of Eritrea|Rwanda|Republic of Rwanda|Burundi|Republic of Burundi|Cameroon|Republic of Cameroon|Equatorial Guinea|Djibouti|Republic of Djibouti|Uganda|Republic of Uganda|Zimbabwe|Republic of Zimbabwe|Venezuela|Nicaragua|Algeria|People's Democratic Republic of Algeria|Republic of the Congo|Democratic Republic of the Congo|Angola|Cambodia|Kingdom of Cambodia|Tanzania|Togo|Ethiopia|Republic of Tunisia|Tunisia|Iraq|Republic of Iraq|Yemen|Republic of Yemen|Republic of Chad|South Sudan|Central African Republic|Gabon|Republic of the Niger|Mauritania)$/, id: 'authoritarian', from: 1946, why: 'Elections, where held, do not decide who rules.' },
  // Hybrid regimes (recent)
  { re: /^(Türkiye|Turkey|Hungary|Serbia|Georgia|Kyrgyzstan|Armenia|Bangladesh|Pakistan|Islamic Republic of Pakistan|Sri Lanka|Malaysia|Singapore|Republic of Singapore|Thailand|Philippines|Mexico|Bolivia|Ecuador|Honduras|Guatemala|El Salvador|Haiti|Nigeria|Federal Republic of Nigeria|Kenya|Republic of Kenya|Zambia|Malawi|Madagascar|Mozambique|Tanzania|Liberia|Sierra Leone|Côte d'Ivoire|Senegal|Guinea-Bissau|The Gambia|Lebanon|Jordan|Kingdom of Jordan|Morocco|Somalia|Federal Republic of Somalia|Moldova|Ukraine|Bosnia and Herzegovina|North Macedonia|Macedonia|Montenegro|Albania|Kosovo|Fiji|Papua New Guinea|Solomon Islands|Lesotho|Comoros)$/, id: 'hybrid', from: 2016, why: 'Rated a hybrid or flawed regime in recent democracy indices.' },
  { re: /^(Republic of Turkey)$/, id: 'hybrid', from: 1946 },
  // Liberal democracies (recent and long-standing)
  { re: /^(United States|United States of America|Canada|Australia|Commonwealth of Australia|New Zealand|France|French Fifth Republic|French Fourth Republic|Free French|Germany|Federal Republic of Germany|Federated Republic of Germany|Italy|Republic of Italy|Portugal|Ireland|Éire|Iceland|Republic of Iceland|Finland|Republic of Finland|Switzerland|Swiss Confederation|Austria|Second Republic of Austria|Czechia|Czech Republic|Slovakia|Slovenia|Republic of Slovenia|Poland|Republic of Poland|Lithuania|Republic of Lithuania|Latvia|Republic of Latvia|Estonia|Republic of Estonia|Croatia|Republic of Croatia|Greece|Third Hellenic Republic|Cyprus|Republic of Cyprus|Malta|Bulgaria|Republic of Bulgaria|Romania|South Korea|Republic of Korea|Taiwan|Republic of China|India|Republic of India|Israel|State of Israel|Chile|Republic of Chile|Uruguay|Oriental Republic of Uruguay|Argentina|Argentine Republic|Brazil|Republic of Brazil|Peru|Republic of Peru|Colombia|Republic of Colombia|Panama|Republic of Panama|Costa Rica|Republic of Costa Rica|Dominican Republic|South Africa|Botswana|Republic of Botswana|Namibia|Ghana|Cabo Verde|Mauritius|Jamaica|Trinidad and Tobago|Barbados|Bahamas|Commonwealth of The Bahamas|Indonesia|Republic of Indonesia|Timor-Leste|East Timor|Mongolia|Benin|Republic of Benin|Suriname|Guyana|Paraguay|Belize|Samoa|Vanuatu|Tonga|Kiribati|Micronesia|Palau|Marshall Islands|Saint Lucia|Dominica|Grenada|Saint Vincent and the Grenadines|Saint Kitts and Nevis|Antigua and Barbuda|São Tomé and Principe)$/, id: 'democracy', from: 1946, why: 'Competitive elections and protected civil liberties in this period.' },
  { re: /^(United States of America)$/, id: 'democracy', from: 1776, why: 'An elected republic under the 1787 constitution (the franchise widened over time).' },
  { re: /^(Kingdom of Great Britain|United Kingdom|Kingdom of Sweden|Sweden|Kingdom of Norway|Norway|Denmark|Kingdom of Denmark|Netherlands|Kingdom of Belgium|Belgium|Luxembourg|Kingdom of Spain|Spain|Japan|Principality of Andorra|Andorra)$/, id: 'constitutional', from: 1946, why: 'A monarch reigns; an elected parliament governs.' },
  { re: /^Kingdom of Great Britain$/, id: 'constitutional', from: 1689 },
  { re: /^Kingdom of Sweden$/, id: 'constitutional', from: 1809 },
  { re: /^Kingdom of Norway$/, id: 'constitutional', from: 1814 },
  { re: /^Netherlands$/, id: 'constitutional', from: 1815 },
  { re: /^Kingdom of Belgium$/, id: 'constitutional', from: 1831 },
  { re: /^Kingdom of Spain$/, id: 'constitutional', from: 1876, to: 1922 },
  { re: /^Kingdom of Spain$/, id: 'military', from: 1923, to: 1930, why: 'Primo de Rivera’s dictatorship.' },
  { re: /^Kingdom of Spain$/, id: 'democracy', from: 1931, to: 1938, why: 'The Second Spanish Republic.' },
  { re: /^Kingdom of Spain$/, id: 'constitutional', from: 1976 },
  { re: /^Kingdom of Spain$/, id: 'absolute', from: 1516, to: 1811 },
  { re: /^Kingdom of Italy$/, id: 'constitutional', from: 1861, to: 1921 },
  { re: /^Empire of Japan$/, id: 'constitutional', from: 1890, to: 1931, why: 'The Meiji constitution: an elected Diet under the emperor.' },
  { re: /^Empire of Japan$/, id: 'absolute', to: 1889 },
  { re: /^(Kingdom of Egypt|Kingdom of Iraq|Kingdom of Thailand|Kingdom of Laos|Kingdom of Greece|Kingdom of Romania|Kingdom of Bulgaria|Principality of Bulgaria|Kingdom of Jordan|Morocco|Malaysia|Kingdom of Cambodia|Cambodia|Lesotho|Tonga)$/, id: 'constitutional', from: 1900, why: 'A monarch reigns with a constitution and an assembly, often with wide royal powers.' },
  { re: /^(Hungarian Republic)$/, id: 'authoritarian', why: 'Horthy’s regency.' },
  { re: /^Estado Novo$/, id: 'democracy', from: 1976 },
  { re: /^(Weimar Republic|French Third Republic|French Second Republic|Czechoslovakia|Republic of Finland|Republic of Latvia|Republic of Estonia|Republic of Lithuania|Republic of Cuba|Republic of Haiti|Republic of Liberia)$/, id: 'hybrid', from: 1848, why: 'An elected republic with a restricted franchise or unstable institutions.' },
];

const COLONIAL_NAME = /\b(British|French|Belgian|Dutch|Danish|Portuguese|Spanish|Italian|German|Japanese) (Africa|East Africa|West Africa|Gold Coast|Raj|India|Indochina|Ceylon|Cape Colony|Colonial|Colonies|Louisiana|Guiana|Somaliland|Congo|East Indies|Malaya|Borneo|North Africa)\b|\b(Colony|Protectorate|Mandate|Territory|Territories|Viceroyalty|Captaincy|Presidency)\b|^(Belgian Congo|Dutch East Indies|Netherlands Antilles|New Hebrides|New Netherland|New Caledonia|Greenland|Danish Gold Coast|Danish India|Dutch Gold Coast|Italian Africa|Tangier International Zone|Kingdom of Sarawak)$/;
const COLONIAL_REALM = /British Empire|Spanish Empire|Portuguese Empire|French|Netherlands|Batavian Republic|Vichy France|Kingdom of France|Commonwealth of Nations/;
const DEPENDENCY_2016 = /^(Falkland Islands|French Southern and Antarctic Lands|Puerto Rico|South Georgia and the Islands|French Polynesia|Faroe Islands|Åland|Hong Kong|Macau|Isle of Man|Heard I\. and McDonald Islands|Guam|Curaçao|Aruba|Sint Maarten|Turks and Caicos Islands|Northern Mariana Islands|Cayman Islands|Saint Pierre and Miquelon|Niue|Cook Islands|Greenland|New Caledonia|Western Sahara|Palestine|British Overseas Territories|Jersey|Guernsey|Bermuda|Anguilla|Montserrat|British Virgin Islands|United States Virgin Islands|Saint Helena|American Samoa|Wallis and Futuna Islands|Norfolk Island|Pitcairn Islands|Saint-Martin|Saint-Barthélemy|Ashmore and Cartier Islands|British Indian Ocean Territory|Indian Ocean Territories|Coral Sea Islands|Bajo Nuevo Bank|Serranilla Bank|Scarborough Reef|Spratly Islands)$/;

const STEPPE_NAME = /Khanate|Khaganate|Horde|Xiongnu|Xianbei|Rouran|G[öo]kt[üu]rk|Turkic|Uyghur|Kipchak|Cuman|Pecheneg|Avar|Huns?\b|Scythia|Sarmatia|Yuezhi|Wusun|Kyrgyz|Kimek|Oghuz|Qarlug|Khazar|Mongol|Kazakh|Dzungar|Oirat|Nogai|Kalmyk|Tuyuhun|Kara-Khitan|Chagatai|Moghulistan|Shaybanid/;
const ISLAMIC_NAME = /Caliphate|Sultanate|Sultan|Emirate|Emir|Beylik|Khedivate|Nawab|Nizam|Shahdom|Ottoman|Safavid|Mughal|Abbasid|Umayyad|Fatimid|Ayyubid|Mamluk|Seljuk|Ghaznavid|Ghurid|Almohad|Almoravid|Timurid|Khwarezm|Qajar|Afsharid|Zand|Durrani|Hafsid|Marinid|Idrisid|Aghlabid|Rustamid|Tahirid|Samanid|Buyid|Hamdanid|Zayyanid|Wattasid|Saadi|Alaouite|Karamanli|Qara Qoyunlu|Aq Qoyunlu|Delhi|Lodi|Tughlaq|Khalji|Bahmani|Bijapur|Golconda|Ahmadnagar|Berar|Bidar|Bengal|Gujarat|Malwa|Kashmiri|Adal|Ajuran|Kilwa|Qasimid|Rasulid|Mahdid|Uyunid|Shirvan|Regency of Algiers|Beylik of Tunis|Sunanate|Mataram Sultanate|Aceh|Johor|Malacca|Brunei|Sulu|Maguindanao|Darfur|Funj|Wadai|Bornu|Kanem|Sokoto|Diriyah|Hyderabad|Carnatic|Awadh|Bukhara|Khiva|Kokand|Crimean|Kazan|Astrakhan|Sibir|Qasim|Morocco|Kuwait|Kelantan|Negeri Sembilan|Bahrain|Perak|Kedah|Selangor|Terengganu|Pahang|Jambi|Banjar|Bone\b|Bima|Sambas|Pontianak|Mempawah|Sukadana|Palembang|Banten|Cirebon|Demak|Samudera Pasai/;
const MESO_ANDEAN = /Aztec|Inca|Maya|Mayan|Chimu|Zapotec|Teotihuacan|Michoac[áa]n|Veracruz|Olmec|Mixtec|Toltec|Tiwanaku|Wari|Moche|Nazca/;
const CHIEFDOM_NAME = /Haudenosaunee|Mississippian|Cahokia|Powhatan|Creek|Cherokee|Confederacy|Culture|Tribes|Chiefdom|Viking settlements|Norse|Saxons|Franks|Goths|Gothia|Burgundians|Obotrites|Brythons|Picts|Celts|Germani|Berbers|Barghawata|Garamantes/;
const REPUBLIC_OLD = /Republic|Commonwealth|Confederation|Hanse|League|Commune|Signoria/;
const CITY_STATE = /City-States|City States|Greek|Athens|Sparta|Corinth|Thebes|Syracuse|Carthage|Phoenicia|Tyre|Sidon|Philistia|Etrusca|Sumer|Ur\b|Uruk|Lagash|Kish|Akshak|Isin|Larsa|Mari\b|Ebla|Pyu/;

export function ideologyOf(p: Subject, year: number): Verdict {
  const v = (id: string, why: string): Verdict => ({ theme: IDEOLOGIES[id], why });
  const named = byName(IDEOLOGY_NAMES, p, year);
  if (named) return v(named.id, named.why ?? `Listed regime for ${p.n} in this period.`);

  if (year >= 2016 && DEPENDENCY_2016.test(p.n)) return v('dependency', 'Governed from another state.');
  if (COLONIAL_NAME.test(p.n)) return v('colonial', 'Its name marks a colony, protectorate, mandate or overseas territory.');
  if (p.m && COLONIAL_REALM.test(p.m) && year >= 1450 && !inRegion(p, 'westEurope', 'centralEurope', 'scandinavia', 'italy', 'iberia')) {
    return v('colonial', `Overseas part of the ${p.m}.`);
  }
  if (/Shogunate|Warring States Japan/.test(p.n)) return v('feudal', 'Rule by a military shogun over warrior lords (daimyō).');
  if (/Holy Roman Empire|Duchy|County|Margraviate|Landgraviate|Electorate|Bishopric|Prince-Bishop|Giudicato|Banate|Lordship|Seigneury|Duchies/.test(p.n) && year < 1806) {
    return v('feudal', 'A fief or principality in a layered feudal order.');
  }
  if (STEPPE_NAME.test(p.n)) return v('steppe', 'A khanate or confederation of steppe clans.');
  if (/Papal|Order\b/.test(p.n)) return v('theocracy', 'Ruled by the Church or a religious order.');
  if (MESO_ANDEAN.test(p.n)) return v('sacral', 'Rulers held a sacred office at the centre of state religion.');
  if (CHIEFDOM_NAME.test(p.n)) return v('chiefdom', 'Chiefs, war leaders and kin assemblies rather than a state bureaucracy.');
  if (CITY_STATE.test(p.n) && year < 1500) return v('cityState', 'A city-state or league of cities.');
  if (/Roman Republic/.test(p.n)) return v('cityState', 'Consuls, Senate and assemblies of Roman citizens.');
  if (REPUBLIC_OLD.test(p.n) && year < 1790) return v('merchantRepublic', 'A republic of councils and leading families before the age of revolutions.');

  if (ISLAMIC_NAME.test(p.n) || (year >= 650 && year < 1920 && inRegion(p, 'maghreb', 'egypt', 'arabia', 'levant', 'mesopotamia', 'iran', 'centralAsia') && /Dynasty|Empire|Kingdom|Emirates/.test(p.n))) {
    return year >= 1920 ? v('absolute', 'A modern Muslim monarchy.') : v('islamic', 'A Muslim dynasty ruling with scholars, sharia courts and a professional soldiery.');
  }

  if (year < -1100) return v('sacral', 'Bronze Age kingship: the king as servant or son of the gods.');

  if (inRegion(p, 'china', 'korea') || (inRegion(p, 'mainlandSEA') && /Đại Việt|Lê|Nguyễn|Tây Sơn|Ngô|Trần|Lý/.test(p.n))) {
    if (year < -221) return v('feudal', 'Zhou-era states: a king over hereditary lords holding fiefs.');
    return v('bureaucratic', 'An emperor or king governing through examined scholar-officials.');
  }
  if (inRegion(p, 'japan')) {
    if (year < 1185) return v('bureaucratic', 'The ritsuryō court state modelled on Tang China.');
    if (year < 1868) return v('feudal', 'Shoguns and daimyō under a ceremonial emperor.');
    return v('constitutional', 'Imperial Japan under the Meiji constitution.');
  }
  if (/Empire|Imperial|Reich|Tsardom/.test(p.n)) {
    if (year >= 1815 && inRegion(p, 'westEurope', 'centralEurope', 'scandinavia', 'britain')) return v('constitutional', 'A European empire with a constitution and parliament.');
    return v('autocracy', 'An emperor or great king over many peoples.');
  }
  if (/Kingdom|Dynasty|Principality|Kingdoms|Monarchy|Crown of|Realm|Tsar|Grand Principality|Rajya|Raj\b/.test(p.n) || /^House of/.test(p.n)) {
    const europe = inRegion(p, 'westEurope', 'centralEurope', 'scandinavia', 'britain', 'iberia', 'italy', 'balkans', 'eastEurope');
    if (europe && year >= 800 && year < 1450) return v('feudal', 'A medieval European kingdom held together by vassalage.');
    if (europe && year >= 1450 && year < 1815) return v('absolute', 'An early modern European monarchy centralising power at court.');
    if (europe && year >= 1815) return v('constitutional', 'A nineteenth- or twentieth-century European monarchy under a constitution.');
    if (year >= 1900) return v('absolute', 'A traditional monarchy in the modern era.');
    return v('monarchy', 'A dynasty ruling by inheritance.');
  }
  // Modern states with no regime of their own listed: regional patterns
  if (year >= 1810 && inRegion(p, 'latinAmerica')) return v('hybrid', 'A Latin American republic: elections alternated with caudillo and military rule (no rule for this one).');
  if (year >= 1955 && inRegion(p, 'sahel', 'subSahara', 'hornOfAfrica')) {
    return year < 1991
      ? v('authoritarian', 'Most post-independence African states were one-party or military regimes until about 1990 (no rule for this one).')
      : v('hybrid', 'Multiparty elections returned after 1990, often with a dominant ruling party (no rule for this one).');
  }
  if (year >= 1790 && REPUBLIC_OLD.test(p.n)) return v('hybrid', 'A modern republic; no rule here says how free its elections were.');
  if (year < 1850) {
    if (/Janapada of (Vajji|Malla)|Licchavi|Shakya|Icelandic Commonwealth/.test(p.n)) return v('cityState', 'A republic of clan or chieftain assemblies.');
    const europe = inRegion(p, 'westEurope', 'centralEurope', 'scandinavia', 'britain', 'iberia', 'italy', 'balkans', 'eastEurope');
    if (europe && year >= 800 && year < 1450) return v('feudal', 'A medieval European lordship held together by vassalage (no specific rule).');
    if (europe && year >= 1450) return v('absolute', 'An early modern European monarchy (no specific rule).');
    return v('monarchy', 'Most polities of this age were hereditary monarchies; no specific rule covers this one.');
  }
  return v('unclassified', 'No rule in this project covers this polity yet.');
}

// ================================================================================================
// WORLDVIEWS: faiths and philosophies, often several stacked
// ================================================================================================
export const WORLDVIEWS: Record<string, Theme> = {
  mesopotamian: t('mesopotamian', 'Mesopotamian polytheism', '#c9a25a', ['Ancient Mesopotamian religion', 'Temple economy'],
    'City gods in their temples, a divine order kept by kings and priests, omens and astral learning.'),
  egyptian: t('egyptian', 'Ancient Egyptian religion', '#d0a24a', ['Ancient Egyptian religion', 'Maat'],
    'Maat, cosmic order, upheld by the pharaoh; temples, the afterlife and the gods of the Nile.'),
  canaanite: t('canaanite', 'Levantine and Anatolian polytheism', '#b8956a', ['Ancient Canaanite religion', 'Hittite mythology and religion'],
    'Storm gods, city patrons and household cults of the Bronze and Iron Age Levant and Anatolia.'),
  greekRoman: t('greekRoman', 'Greco-Roman religion and philosophy', '#5a9bb8', ['Ancient Greek religion', 'Religion in ancient Rome', 'Stoicism', 'Hellenistic philosophy'],
    'Civic cults of the Olympian gods, joined by schools of philosophy (Stoic, Epicurean, Platonist) as guides to life.'),
  zoroastrian: t('zoroastrian', 'Zoroastrianism', '#d98a3d', ['Zoroastrianism', 'Ahura Mazda'],
    'The struggle of truth (asha) against the lie; fire temples and a priesthood backing Iranian kingship.'),
  judaism: t('judaism', 'Judaism', '#3f6fae', ['Judaism', 'Second Temple Judaism'],
    'One God bound to Israel by covenant; Torah, Temple and later the rabbinic tradition.'),
  zionist: t('zionist', 'Judaism and Zionism', '#3f6fae', ['Judaism', 'Zionism', 'Secularism in Israel'],
    'A Jewish state that blends religious tradition with a largely secular national movement.'),
  vedic: t('vedic', 'Vedic Brahmanism', '#d4884a', ['Historical Vedic religion', 'Brahmanism'],
    'Sacrifice, Sanskrit hymns and the varna order, kept by Brahmin priests.'),
  hindu: t('hindu', 'Hindu dharma', '#e07b39', ['Hinduism', 'Dharma', 'Bhakti movement'],
    'Dharma, karma and devotion to Vishnu, Shiva or the Goddess; temple kingship and caste.'),
  hinduBuddhistSEA: t('hinduBuddhistSEA', 'Hindu–Buddhist kingship (Indianised states)', '#d9963d', ['Indianization of Southeast Asia', 'Devaraja', 'Hinduism in Southeast Asia'],
    'Kings as god-kings (devaraja) using Sanskrit and Indian rites alongside Buddhism.'),
  buddhistIndia: t('buddhistIndia', 'Buddhist and Jain dharma', '#e0b04a', ['Buddhism', 'Jainism', 'Ashoka'],
    'Renunciant traditions of liberation, patronised by kings beside Brahmanical rites.'),
  theravada: t('theravada', 'Theravada Buddhism', '#e3b23c', ['Theravada', 'Buddhist kingship', 'Sangha'],
    'The monastic Sangha and the king as protector of the Dhamma; merit-making shapes daily life.'),
  tibetan: t('tibetan', 'Tibetan Buddhism', '#b8862d', ['Tibetan Buddhism', 'Vajrayana', 'Dalai Lama'],
    'Vajrayana Buddhism with lineages of lamas and monasteries as centres of power.'),
  threeTeachings: t('threeTeachings', 'Confucian–Daoist–Buddhist synthesis', '#c2574f', ['Three teachings', 'Confucianism', 'Taoism', 'Chinese Buddhism'],
    'Confucian ethics for family and state, Daoist and Buddhist paths for body and soul, ancestor rites for all.'),
  neoConfucian: t('neoConfucian', 'Neo-Confucianism', '#a83f3a', ['Neo-Confucianism', 'Confucianism', 'Ancestor veneration in China'],
    'Zhu Xi’s rationalist Confucianism as state orthodoxy and examination canon.'),
  shinto: t('shinto', 'Shinto–Buddhist syncretism', '#c46f8d', ['Shinbutsu-shūgō', 'Shinto', 'Japanese Buddhism'],
    'Kami and buddhas worshipped together at shrine-temple complexes.'),
  stateShinto: t('stateShinto', 'State Shinto and imperial nationalism', '#a24f6f', ['State Shinto', 'Kokutai'],
    'The emperor as sacred head of the national family; Shinto made a state cult.'),
  tengri: t('tengri', 'Tengrism and steppe shamanism', '#cdb050', ['Tengrism', 'Shamanism'],
    'The Eternal Blue Sky (Tengri), earth spirits and shamans; a ruler’s luck comes from Heaven.'),
  manichaean: t('manichaean', 'Manichaeism', '#9a8a3a', ['Manichaeism'],
    'A dualist world religion of light against darkness; the state faith of the Uyghur Khaganate.'),
  pagan: t('pagan', 'Germanic, Norse and Slavic paganism', '#7f9a5a', ['Germanic paganism', 'Norse religion', 'Slavic paganism'],
    'Gods of sky, war and harvest, sacred groves, sacrifice and the honour of kin.'),
  celtic: t('celtic', 'Celtic polytheism', '#6f9a6a', ['Ancient Celtic religion', 'Druid'],
    'Local gods of land and water, with druids as priests, judges and keepers of lore.'),
  latin: t('latin', 'Latin Christendom (Catholic intellectual tradition)', '#5b86c9', ['Catholic Church', 'Christendom', 'Scholasticism', 'Thomism'],
    'One Church under the pope, monasteries and universities; faith reasoned through Aristotle and Aquinas.'),
  earlyChristian: t('earlyChristian', 'Christian Roman Empire', '#6b8fc0', ['State church of the Roman Empire', 'Christianity in late antiquity', 'Church Fathers'],
    'Christianity made the faith of empire; councils define doctrine and bishops become civic leaders.'),
  orthodox: t('orthodox', 'Eastern Orthodoxy', '#8878b8', ['Eastern Orthodox Church', 'Symphonia (theology)', 'Hesychasm'],
    'Emperor and patriarch in harmony; icons, liturgy and the mystical theology of the Greek fathers.'),
  orientalOrthodox: t('orientalOrthodox', 'Oriental Orthodoxy', '#7a6ca8', ['Oriental Orthodox Churches', 'Ethiopian Orthodox Tewahedo Church', 'Armenian Apostolic Church'],
    'The ancient churches of Armenia, Egypt, Ethiopia and Syria that kept a miaphysite creed.'),
  sunni: t('sunni', 'Sunni Islam', '#3f9a5a', ['Sunni Islam', 'Sharia', 'Ulama'],
    'The community of the Prophet’s way; law schools, scholars and a ruler who upholds sharia.'),
  shia: t('shia', 'Shia Islam', '#2f7a5a', ['Shia Islam', 'Twelver Shiʿism', 'Imamate in Twelver doctrine'],
    'Loyalty to the line of Ali and the imams; in Iran from 1501 a state faith led by its jurists.'),
  ismaili: t('ismaili', 'Ismaili Shia Islam', '#2a8a7a', ['Ismaʿilism', 'Fatimid Caliphate'],
    'The Ismaili imamate: an esoteric reading of revelation, and in Egypt a rival caliphate.'),
  wahhabi: t('wahhabi', 'Wahhabi Sunni Islam', '#4f8a3a', ['Wahhabism', 'Sunni Islam'],
    'A reformist, strictly monotheist Sunni movement allied with the House of Saud.'),
  islamist: t('islamist', 'Islamist government', '#2f6a3a', ['Islamism', 'Guardianship of the Islamic Jurist'],
    'The state claims to rule by Islamic law under clerical or movement leadership.'),
  sikh: t('sikh', 'Sikhism', '#e0a030', ['Sikhism', 'Khalsa'],
    'The Gurus’ path of one God, equality and the armed Khalsa brotherhood.'),
  protestant: t('protestant', 'Protestant Christianity', '#4a7fb0', ['Protestantism', 'Reformation', 'Protestant work ethic'],
    'Scripture alone, faith alone; national churches, Bible reading and a sanctified everyday life.'),
  catholicModern: t('catholicModern', 'Catholic tradition (early modern)', '#5b86c9', ['Catholic Church', 'Counter-Reformation', 'Baroque'],
    'The Church renewed by the Council of Trent, missions and the Baroque, allied with Catholic crowns.'),
  iberianCatholic: t('iberianCatholic', 'Iberian and Latin American Catholicism', '#6a8fd0', ['Catholic Church in Latin America', 'Folk Catholicism', 'Patronato real'],
    'Catholic faith carried by the Spanish and Portuguese crowns, mixed with local devotions and saints.'),
  enlightenment: t('enlightenment', 'Enlightenment deism and skepticism', '#6fa3c8', ['Deism', 'Age of Enlightenment', 'Skepticism'],
    'Reason over revelation: a distant Creator, natural rights, toleration and suspicion of clerical power.'),
  usCivil: t('usCivil', 'Protestant–Enlightenment civil religion', '#5a8fc8', ['American civil religion', 'Protestantism in the United States', 'Deism'],
    'A Protestant majority, a deist founding creed and a civic faith in liberty and providence.'),
  secularLiberal: t('secularLiberal', 'Secular liberalism', '#7fb0d8', ['Secularism', 'Liberalism', 'Secular humanism'],
    'Religion as a private choice; public life justified by rights, consent and reason.'),
  laicite: t('laicite', 'Laïcité and republican secularism', '#7aa0c8', ['Laïcité', 'French Revolution', 'Secularism'],
    'A republic that keeps the churches out of the state and teaches a civic, rational morality.'),
  marxist: t('marxist', 'Marxism–Leninism and state atheism', '#c23b3b', ['Marxism–Leninism', 'State atheism', 'Dialectical materialism'],
    'History as class struggle; religion as an illusion to be overcome by the party’s science of society.'),
  fascistMyth: t('fascistMyth', 'Fascist nationalism', '#4a4a4a', ['Fascism', 'Political religion', 'Ultranationalism'],
    'The nation or race as the highest value; leader cult, rebirth myths and the glorification of struggle.'),
  mesoamerican: t('mesoamerican', 'Mesoamerican religion', '#a8704f', ['Mesoamerican religion', 'Aztec religion', 'Maya religion'],
    'A cosmos of cycles and calendars kept turning by ritual, offerings and sacrifice.'),
  andean: t('andean', 'Andean religion', '#b8956a', ['Inca religion', 'Huaca', 'Inti'],
    'The Sun and the ancestors, sacred places (huacas) and the Inca as child of the Sun.'),
  nativeAmerican: t('nativeAmerican', 'Native North American traditions', '#9a6fa4', ['Native American religions', 'Animism'],
    'Ceremony, kinship with animals and land, and the medicine traditions of many nations.'),
  african: t('african', 'Traditional African religions', '#a65a5a', ['Traditional African religions', 'Ancestor veneration', 'Animism'],
    'A creator above, spirits and ancestors near; divination, healing and sacred kingship.'),
  africanChristian: t('africanChristian', 'African Christianity', '#7a6a9a', ['Christianity in Africa', 'African-initiated church'],
    'Mission and independent churches, now the faith of most people south of the Sahel.'),
  oceanian: t('oceanian', 'Polynesian and Oceanian religion', '#3fa0a0', ['Polynesian mythology', 'Mana', 'Tapu (Polynesian culture)'],
    'Mana and tapu, chiefs descended from gods, voyaging ancestors.'),
  aboriginal: t('aboriginal', 'Aboriginal Australian spirituality', '#a0603a', ['Australian Aboriginal religion and mythology', 'The Dreaming'],
    'The Dreaming: law, land and ancestral beings bound together.'),
  unclassified: t('unclassified', 'Not classified yet', '#5c656d', ['Religion', 'Worldview'],
    'No rule in this project covers this place and time yet.'),
};

const WORLDVIEW_NAMES: NameRule[] = [
  { re: /Uyghur Khaganate/, id: 'manichaean', from: 762, to: 840, why: 'Bögü Qaghan made Manichaeism the state faith in 762.' },
  { re: /Khazar/, id: 'judaism', from: 740, why: 'The Khazar ruling elite converted to Judaism (extent debated).' },
  { re: /Sikh/, id: 'sikh' },
  { re: /Fatimid/, id: 'ismaili' },
  { re: /Nizari|Alamut/, id: 'ismaili' },
  { re: /^(Kingdom of Saudi Arabia|Saudi Arabia|Emirate of Diriyah|Emirate of Nejd)$/, id: 'wahhabi' },
  { re: /^(Islamic Republic of Iran|Iran|Taliban|Gaza\/Hamas)$/, id: 'islamist' },
  { re: /^Afghanistan$/, id: 'islamist', from: 2021 },
  { re: /^(State of Israel|Israel)$/, id: 'zionist' },
  { re: /Kingdom of Israel|Kingdom of Judah|Hasmonean|Judea/, id: 'judaism' },
  { re: /Papal States/, id: 'latin', why: 'Ruled by the pope.' },
  { re: /Safavid|Qajar|Afsharid|Zand|Pahlavi|Buyid|Qara Qoyunlu|Hamdanid|Zaydi|Qasimid|Imamate/, id: 'shia', why: 'A Shia dynasty or imamate.' },
  { re: /^Pahlavi Dynasty$/, id: 'shia' },
  { re: /Tibet/, id: 'tibetan', from: 650 },
  { re: /^(Nazi Germany|Italian Social Republic|Independent State of Croatia)$/, id: 'fascistMyth' },
  { re: /^Kingdom of Italy$/, id: 'fascistMyth', from: 1922, to: 1943 },
  { re: /^Empire of Japan$/, id: 'stateShinto', from: 1868, to: 1945 },
  { re: /^(Union of Soviet Socialist Republics|Mongolian People's Republic|German Democratic Republic|Democratic People's Republic of Korea|Democratic Republic of Vietnam|Socialist Republic of Vietnam|Communist Laos|Communist Cuba|Cuban Communists|Khmer Rouge|People's Republic of Kampuchea|People's Republic of Angola|People's Democratic Republic of Yemen|Hungarian People's Republic|People's Republic of Bulgaria|Socialist Republic of Romania|People's Socialist Republic of Albania|Socialist Federal Republic of Yugoslavia|Communist Party of China|People's Republic of China|China|Vietnam|Laos|Cuba|North Korea)$/, id: 'marxist', why: 'Official Marxist–Leninist ideology and state atheism.' },
  { re: /^Czechoslovakia$/, id: 'marxist', from: 1948, to: 1989 },
  { re: /^Republic of Poland$/, id: 'marxist', from: 1945, to: 1989 },
  { re: /^Afghanistan$/, id: 'marxist', from: 1978, to: 1991 },
  { re: /^Ethiopia$/, id: 'marxist', from: 1974, to: 1991 },
  { re: /^(United States of America|United States)$/, id: 'usCivil' },
  { re: /^(French First Republic|French Directory|French Consulate|French Third Republic|French Fourth Republic|French Fifth Republic|France|Free French)$/, id: 'laicite' },
  { re: /^(Republic of Turkey|Türkiye|Turkey)$/, id: 'laicite', to: 2001, why: 'Kemalist laicism (laiklik).' },
  { re: /^(Republic of Turkey|Türkiye|Turkey)$/, id: 'sunni', from: 2002 },
  { re: /^(Ethiopia|Ethiopian Empire|Zagwe dynasty|Kingdom of Axum|Makuria|Makuria Kingdom|Alodia|Armenia|Kingdom of Armenia|Armenian Kingdom of Cilicia)$/, id: 'orientalOrthodox', from: 330 },
  { re: /Byzantine|Bulgarian Empire|Kievan Rus|Principality of|Grand Principality of Moscow|Tsardom|Russian Empire|Serbia|Kingdom of Georgia|Georgia|Wallachia|Moldavia|Trebizond|Nicaea|Epirus/, id: 'orthodox', from: 500, to: 1916, why: 'An Orthodox Christian state.' },
  { re: /Mughal|Delhi|Lodi|Bengal Sultanate|Sultanate of Bengal|Bahmani|Bijapur|Golconda|Ahmadnagar|Berar|Bidar|Hyderabad|Carnatic|Awadh|Kashmiri Sultanate|Durrani/, id: 'sunni', why: 'A Muslim dynasty ruling a largely Hindu population.' },
  { re: /Vijayanagara|Maratha|Rajput|Chola|Pandya|Chera|Pallava|Hoysala|Yadava|Kakatiya|Chalukya|Rashtrakuta|Gurjara|Paramara|Chandela|Chauhan|Gahadavala|Sena Dynasty|Eastern Ganga|Kamarupa|Kalinga|Satavahana|Gupta|Vakataka|Karkota|Lohara|Kashmir$|Nepal|Kathmandu/, id: 'hindu' },
  { re: /Maurya|Pala Empire|Kushan|Indo-Greek|Greco-Bactrian|Western Satraps/, id: 'buddhistIndia' },
  { re: /^(Russia|Russian Federation|Belarus|Republic of Belarus|Ukraine|Moldova|Republic of Moldova|Russian-occupied territories)$/, id: 'orthodox', from: 1992, why: 'Orthodox churches revived after communism.' },
  { re: /^(Denmark|Kingdom of Denmark|Denmark-Norway|Iceland|Republic of Iceland|Icelandic Commonwealth|Faroe Islands|Greenland|Åland)$/, id: 'latin', to: 1529 },
  { re: /^(Denmark|Kingdom of Denmark|Denmark-Norway|Iceland|Republic of Iceland|Faroe Islands|Greenland|Åland)$/, id: 'protestant', from: 1530, to: 1959 },
  { re: /^(Denmark|Kingdom of Denmark|Iceland|Republic of Iceland|Faroe Islands|Greenland|Åland)$/, id: 'secularLiberal', from: 1960 },
  { re: /Western Regions|Protectorate General/, id: 'threeTeachings', why: 'A Chinese military protectorate in Central Asia.' },
  { re: /^(Mauritius)$/, id: 'hindu', why: 'A Hindu plurality with Christian and Muslim minorities.' },
  { re: /^(Maldives)$/, id: 'sunni' },
  { re: /^(Seychelles|Cabo Verde|Cape Verde|São Tomé and Principe)$/, id: 'africanChristian' },
  { re: /^(Republic of the Philippines|Philippines)$/, id: 'iberianCatholic', why: 'Catholic since Spanish rule.' },
];

export function worldviewOf(p: Subject, year: number): Verdict {
  const v = (id: string, why: string): Verdict => ({ theme: WORLDVIEWS[id], why });
  const named = byName(WORLDVIEW_NAMES, p, year);
  if (named) return v(named.id, named.why ?? `Listed for ${p.n} in this period.`);

  // Muslim dynasties first: the Europe boxes reach into the Maghreb and Anatolia.
  if (ISLAMIC_NAME.test(p.n) && year >= 622 && year < 1923 && !STEPPE_NAME.test(p.n)) {
    if (inRegion(p, 'iran') && year >= 1501) return v('shia', 'Safavid Iran made Twelver Shiʿism the state faith (1501).');
    return v('sunni', 'A Muslim dynasty.');
  }
  if (year >= 622 && inRegion(p, 'maghreb', 'egypt') && !inRegion(p, 'iberia', 'italy') && (year >= 700 || inRegion(p, 'egypt'))) {
    if (year >= 1923 || /Dynasty|dynasty|Kingdom|Regency|Beylik|Empire|Caliphate|Emirate|Sultanate|Morocco|Tunis|Algiers|Tripoli/.test(p.n)) return v('sunni', 'The Muslim Maghreb and Egypt.');
  }

  // Twentieth- and twenty-first-century secular states
  const westernCore = inRegion(p, 'westEurope', 'britain', 'scandinavia', 'centralEurope', 'italy', 'iberia', 'northAmerica', 'oceania');
  if (year >= 1960 && westernCore && !inRegion(p, 'balkans')) {
    if (inRegion(p, 'oceania') && !/Australia|New Zealand/.test(p.n)) return v('oceanian', 'Pacific island societies, now largely Christian.');
    return v('secularLiberal', 'A Western society after the post-war secularisation of public life.');
  }
  if (year >= 1960 && inRegion(p, 'balkans', 'eastEurope', 'caucasus') && year >= 1992) return v('orthodox', 'Orthodox churches revived after communism.');

  if (STEPPE_NAME.test(p.n) && year < 1300) return v('tengri', 'Steppe peoples before their conversion to Islam or Buddhism.');
  if (STEPPE_NAME.test(p.n) && /Oirat|Dzungar|Kalmyk|Mongol Khanate|Northern Yuan/.test(p.n)) {
    return year >= 1576 ? v('tibetan', 'Mongols converted to Tibetan Buddhism from the 1570s.') : v('tengri', 'Mongols before the conversion of the 1570s.');
  }
  if (STEPPE_NAME.test(p.n)) return v('sunni', 'A Turkic or Mongol khanate that had turned to Sunni Islam.');

  if (MESO_ANDEAN.test(p.n)) {
    return /Inca|Chimu|Tiwanaku|Wari|Moche|Nazca/.test(p.n) ? v('andean', 'An Andean state.') : v('mesoamerican', 'A Mesoamerican state.');
  }

  // Europe
  if (inRegion(p, 'westEurope', 'centralEurope', 'britain', 'scandinavia', 'italy', 'iberia', 'balkans', 'eastEurope', 'iceland')) {
    if (year < -800) return v('canaanite', 'Bronze Age Europe and the Aegean (closest match in this list).');
    if (inRegion(p, 'italy', 'balkans') || /Greek|Macedon|Roman|Epirus|Thrac|Illyr|Dacia/.test(p.n)) {
      if (year < 380) return v('greekRoman', 'The Greek and Roman world before Christianity became the state religion.');
    }
    if (year < 380 && /Gaul|Celt|Brit|Iceni|Belgae|Galatia/.test(p.n)) return v('celtic', 'Celtic peoples.');
    if (/Roman Empire|Western Roman/.test(p.n) && year < 476) return v('earlyChristian', 'The Christian Roman Empire after 380.');
    if (inRegion(p, 'scandinavia') && year < 1000) return v('pagan', 'Scandinavia before conversion (about 1000).');
    if (inRegion(p, 'eastEurope') && year < 988) return v('pagan', 'Slavic and Baltic peoples before conversion.');
    if (/Lithuania|Prussia|Livonia|Obotrites|Jersika|Koknese|Samogitia/.test(p.n) && year < 1387) return v('pagan', 'Baltic and Wendish peoples before conversion.');
    if (year < 500 && !inRegion(p, 'italy', 'balkans')) return v(inRegion(p, 'britain', 'westEurope') ? 'celtic' : 'pagan', 'Northern Europe before Christianisation.');
    if (inRegion(p, 'eastEurope', 'balkans') && !inRegion(p, 'centralEurope', 'italy') && /Russia|Rus|Muscov|Moscow|Serb|Bulgar|Georgia|Wallach|Moldav|Novgorod|Pskov|Ryazan|Tver|Smolensk|Kiev|Chernigov|Halych|Volhynia|Polotsk|Minsk|Turov|Pereyaslavl|Rostov|Vladimir|Drutsk/.test(p.n)) {
      return v('orthodox', 'An Orthodox Christian state.');
    }
    if (inRegion(p, 'balkans', 'anatolia') && year >= 476 && year < 1453 && !inRegion(p, 'italy')) return v('orthodox', 'The Byzantine Orthodox world.');
    if (year >= 1789 && year < 1815 && /French|Batavian|Helvetic|Cisalpine|Cispadane|Ligurian|Septinsular|Napoleonic/.test(p.n)) return v('enlightenment', 'Revolutionary and Napoleonic states inspired by the Enlightenment.');
    if (year >= 1530) {
      const protestant = inRegion(p, 'scandinavia', 'britain') || /Prussia|Brandenburg|Saxony|Hanover|Dutch Republic|Netherlands|Hesse|Württemberg|Swiss|Sweden|Denmark|Norway|England|Great Britain|Scotland|Palatinate|Batavian|Holstein|Mecklenburg|Pomerania|Finland|Estonia|Latvia|Iceland/.test(p.n);
      if (protestant && !/Ireland|Éire/.test(p.n)) {
        if (year >= 1700 && year < 1960 && /Prussia|Great Britain/.test(p.n)) return v('protestant', 'A Protestant state of the Enlightenment era.');
        return v('protestant', 'A Protestant state after the Reformation.');
      }
      if (year < 1800) return v('catholicModern', 'A Catholic state of the Counter-Reformation.');
      return v('catholicModern', 'A Catholic-majority state.');
    }
    return v('latin', 'Medieval Latin Christendom.');
  }

  // Anatolia, Levant, Mesopotamia, Iran, Arabia, Egypt, North Africa
  if (inRegion(p, 'egypt') && year < -30) return v('egyptian', 'Pharaonic and Ptolemaic Egypt.');
  if (inRegion(p, 'sahel', 'subSahara') && /Kush|Meroe|Napata/.test(p.n)) return v('egyptian', 'Kush shared the gods and kingship of Egypt.');
  if (inRegion(p, 'mesopotamia') && year < -330) return v('mesopotamian', 'Sumer, Akkad, Babylon and Assyria.');
  if (inRegion(p, 'iran') && year < -550) return v('mesopotamian', 'Elam and the early Iranian plateau (closest match).');
  if (inRegion(p, 'levant', 'anatolia') && year < -330) return v('canaanite', 'Bronze and Iron Age Levant and Anatolia.');
  if ((inRegion(p, 'iran', 'mesopotamia') || /Achaemenid|Parthian|Sasanian|Sassanid|Median|Media\b|Persia/.test(p.n)) && year < 651) {
    if (/Seleucid/.test(p.n)) return v('greekRoman', 'A Hellenistic kingdom.');
    return v('zoroastrian', 'Iranian empires and their fire-temple religion.');
  }
  if (inRegion(p, 'anatolia', 'levant', 'egypt', 'maghreb') && year < 640) {
    if (year < 380) return v('greekRoman', 'The Hellenistic and Roman eastern Mediterranean.');
    return v('earlyChristian', 'The Christian late-Roman and Byzantine Near East.');
  }
  if (inRegion(p, 'arabia') && year < 630) return v('canaanite', 'Pre-Islamic Arabian religions (closest match in this list).');
  if (inRegion(p, 'maghreb', 'egypt', 'arabia', 'levant', 'mesopotamia', 'iran', 'centralAsia', 'anatolia', 'caucasus') || ISLAMIC_NAME.test(p.n)) {
    if (inRegion(p, 'iran') && year >= 1501) return v('shia', 'Safavid Iran made Twelver Shiʿism the state faith (1501).');
    if (year >= 1923 && /Republic|Syria|Iraq|Egypt|Tunisia|Algeria|Libya/.test(p.n)) return v('sunni', 'A Muslim-majority republic (often officially secular or Arab-nationalist).');
    return v('sunni', 'The Sunni Muslim world.');
  }
  if (inRegion(p, 'hornOfAfrica')) return year >= 330 ? v('orientalOrthodox', 'Ethiopian highland Christianity.') : v('african', 'Northeast Africa before Christianity.');

  // South and Central Asia
  if (inRegion(p, 'tibet')) return year >= 650 ? v('tibetan', 'Tibetan Buddhism.') : v('tengri', 'Pre-Buddhist Tibet (Bon) — closest match.');
  if (inRegion(p, 'india')) {
    if (year < -500) return v('vedic', 'The Vedic age.');
    if (year < 600 && /Maurya|Kushan|Pala|Satavahana/.test(p.n)) return v('buddhistIndia', 'Buddhist royal patronage.');
    if (year >= 1206 && ISLAMIC_NAME.test(p.n)) return v('sunni', 'A Muslim sultanate.');
    if (year >= 1858 && /British|Raj/.test(p.n)) return v('hindu', 'Majority Hindu society under British rule.');
    if (/Ceylon|Sri Lanka|Anur[āa]dhapura|Polonnaruwa|Kandy|Kotte|Jaffna/.test(p.n)) return /Jaffna/.test(p.n) ? v('hindu', 'Tamil Hindu kingdom.') : v('theravada', 'Sinhalese Theravada Buddhism.');
    if (/Pakistan|Bangladesh/.test(p.n)) return v('sunni', 'A Muslim-majority state.');
    return v('hindu', 'Hindu kingdoms of South Asia.');
  }
  if (inRegion(p, 'centralAsia') && year < 750) return v('zoroastrian', 'Sogdian and Bactrian Iranian religion, with Buddhism (closest match).');

  // East Asia
  if (inRegion(p, 'china', 'manchuria') && !inRegion(p, 'korea')) {
    if (year >= 1949 && !/Republic of China|Taiwan/.test(p.n)) return v('marxist', 'The People’s Republic.');
    if (year >= 960) return v('neoConfucian', 'Song to Qing China: Neo-Confucian orthodoxy.');
    return v('threeTeachings', 'Classical and medieval China.');
  }
  if (inRegion(p, 'korea')) return year >= 1392 ? v('neoConfucian', 'Joseon Korea made Neo-Confucianism its creed.') : v('threeTeachings', 'Korea before Joseon: Buddhism with Confucian statecraft.');
  if (inRegion(p, 'japan')) return year >= 1946 ? v('secularLiberal', 'Post-war secular Japan.') : v('shinto', 'Japan before the Meiji state.');

  // Southeast Asia
  if (inRegion(p, 'mainlandSEA', 'islandSEA')) {
    if (/Đại Việt|Lê|Nguyễn|Tây Sơn|Ngô|Trần|Lý|Vietnam|Annam|Tonkin/.test(p.n)) return v('threeTeachings', 'Vietnam’s Confucian–Buddhist court culture.');
    if (ISLAMIC_NAME.test(p.n) || (inRegion(p, 'islandSEA') && year >= 1500 && !/Bali|Philippines|Tondo|Namayan|Timor/.test(p.n))) return v('sunni', 'Muslim sultanates of the archipelago.');
    if (inRegion(p, 'mainlandSEA') && year >= 1250) return v('theravada', 'Theravada Buddhist kingdoms.');
    if (/Philippines|Tondo|Namayan/.test(p.n) && year >= 1570) return v('iberianCatholic', 'Spanish Catholic Philippines.');
    return v('hinduBuddhistSEA', 'Indianised kingdoms of Southeast Asia.');
  }

  // Africa south of the Sahara
  if (inRegion(p, 'sahel') && year >= 1000) return v('sunni', 'Sahelian Muslim kingdoms.');
  if (inRegion(p, 'sahel', 'subSahara')) {
    if (year >= 1950) return v('africanChristian', 'Africa south of the Sahel after the mission century.');
    if (/Kongo/.test(p.n) && year >= 1491) return v('latin', 'The Christian Kingdom of Kongo.');
    return v('african', 'Traditional African religion.');
  }

  // Americas and Oceania
  if (inRegion(p, 'latinAmerica') && year >= 1520) return v('iberianCatholic', 'Catholic Latin America.');
  if (inRegion(p, 'northAmerica') && year >= 1600 && /Canada|New France|Louisiana|New Netherland|British|Mexico/.test(p.n)) {
    return /New France|Louisiana|Mexico/.test(p.n) ? v('iberianCatholic', 'Catholic colonial America.') : v('protestant', 'Protestant colonial North America.');
  }
  if (inRegion(p, 'northAmerica')) return v('nativeAmerican', 'Native North America.');
  if (inRegion(p, 'oceania')) return /Australia/.test(p.n) ? v(year >= 1960 ? 'secularLiberal' : 'protestant', 'Australia after British settlement.') : v('oceanian', 'Pacific Islands.');
  return v('unclassified', 'No rule in this project covers this place and time yet.');
}

// ================================================================================================
// DE FACTO CONTROL (Societies lens): who actually ran the place
// ================================================================================================
export const BLOCS: Record<string, Theme> = {
  sovietBloc: t('sovietBloc', 'Soviet bloc', '#c23b3b', ['Eastern Bloc', 'Warsaw Pact', 'Comecon'],
    'States run by communist parties under Soviet military and economic tutelage.'),
  usAlliance: t('usAlliance', 'US-led alliance system', '#4f7fc4', ['NATO', 'Pax Americana', 'United States military deployments'],
    'States bound to the United States by treaty, bases and dollar finance.'),
  axis: t('axis', 'Axis powers and occupied Europe', '#4a4a4a', ['Axis powers', 'German-occupied Europe', 'Greater East Asia Co-Prosperity Sphere'],
    'Germany, Italy, Japan and the regimes they installed or controlled during the Second World War.'),
  russianSphere: t('russianSphere', 'Russian sphere (CSTO and occupied lands)', '#a0463f', ['Collective Security Treaty Organization', 'Russian-occupied territories', 'Near abroad'],
    'States and territories held by Russian troops, treaties or client rulers after 1991.'),
  chineseSphere: t('chineseSphere', 'Chinese sphere', '#c96f3a', ['Belt and Road Initiative', 'China–North Korea relations'],
    'China and its treaty ally North Korea, bound by party ties, trade and security.'),
  resistanceAxis: t('resistanceAxis', 'Iran-led "Axis of Resistance"', '#2f6a3a', ['Axis of Resistance', 'Islamic Revolutionary Guard Corps'],
    'Iran and the governments and militias it arms and directs.'),
  britishEmpire: t('britishEmpire', 'British Empire', '#d0607a', ['British Empire', 'Crown colony', 'Indirect rule'],
    'Ruled or protected from London, directly or through local princes and chartered companies.'),
  frenchEmpire: t('frenchEmpire', 'French colonial empire', '#5a7fd0', ['French colonial empire', 'Mission civilisatrice'],
    'Ruled from Paris (or Vichy, 1940–44) as colonies, protectorates and mandates.'),
  spanishEmpire: t('spanishEmpire', 'Spanish Empire', '#d0a040', ['Spanish Empire', 'Council of the Indies', 'Viceroyalty'],
    'Ruled by the Spanish crown through viceroys, audiencias and the Church.'),
  portugueseEmpire: t('portugueseEmpire', 'Portuguese Empire', '#3f9a7a', ['Portuguese Empire', 'Estado da Índia'],
    'A maritime empire of forts, trading posts and colonies ruled from Lisbon.'),
  dutchEmpire: t('dutchEmpire', 'Dutch colonial empire', '#e08a3a', ['Dutch Empire', 'Dutch East India Company'],
    'Run by the Dutch East and West India Companies and later by the Dutch state.'),
  belgianItalianEmpire: t('belgianItalianEmpire', 'Belgian and Italian colonial rule', '#8a7a5a', ['Belgian colonial empire', 'Italian colonial empire'],
    'Late colonial empires in Central and East Africa and Libya.'),
  mongolEmpire: t('mongolEmpire', 'Mongol Empire and its uluses', '#cdb050', ['Mongol Empire', 'Division of the Mongol Empire', 'Pax Mongolica'],
    'Lands ruled by Chinggis Khan’s heirs and their tributaries.'),
  roman: t('roman', 'Roman Empire and client kingdoms', '#a0463f', ['Roman Empire', 'Client state', 'Roman client kingdoms in Asia Minor'],
    'Lands ruled by Rome or by kings who held their thrones by Rome’s leave.'),
  ottoman: t('ottoman', 'Ottoman Empire and vassals', '#3f9a5a', ['Ottoman Empire', 'Vassal and tributary states of the Ottoman Empire'],
    'The sultan’s lands and the princes who paid him tribute and followed his foreign policy.'),
  napoleonic: t('napoleonic', 'Napoleonic France and client states', '#4f5fa0', ['First French Empire', 'Client state', 'Continental System'],
    'France and the sister republics and kingdoms it installed between 1795 and 1814.'),
  usSphere: t('usSphere', 'US sphere of influence (before 1945)', '#6a8fd0', ['Banana Wars', 'Monroe Doctrine', 'Platt Amendment'],
    'Caribbean and Central American states occupied by US Marines or bound by US-imposed treaties.'),
  realm: t('realm', 'Dynastic realm or union', '#9a6b52', ['Personal union', 'Composite monarchy'],
    'Several polities held together by one dynasty or crown.'),
  self: t('self', 'Self-governing', '#5c656d', ['Sovereignty', 'De facto'],
    'No outside power is recorded here as running this polity in this year.'),
};

const CONTROL_NAMES: NameRule[] = [
  // Second World War
  { re: /^(Nazi Germany|Kingdom of Italy|Empire of Japan|Vichy France|Independent State of Croatia|Italian Social Republic|Kingdom of Romania|Hungarian Republic|Principality of Bulgaria|Kingdom of Bulgaria|Republic of Finland|Kingdom of Thailand|Manchukuo|Slovak Republic)$/, id: 'axis', from: 1940, to: 1945, why: 'An Axis power, ally or occupied regime.' },
  { re: /^(French Africa|French Indochina|Italian Africa)$/, id: 'axis', from: 1940, to: 1942 },
  // Cold War, 1945-1991
  { re: /^(Union of Soviet Socialist Republics|Mongolian People's Republic|German Democratic Republic|Hungarian People's Republic|People's Republic of Bulgaria|Socialist Republic of Romania)$/, id: 'sovietBloc', from: 1945, to: 1991 },
  { re: /^(Republic of Poland|Hungary|Czechoslovakia)$/, id: 'sovietBloc', from: 1947, to: 1989 },
  { re: /^People's Socialist Republic of Albania$/, id: 'sovietBloc', from: 1946, to: 1961 },
  { re: /^Afghanistan$/, id: 'sovietBloc', from: 1979, to: 1989, why: 'Soviet military occupation.' },
  { re: /^(Democratic Republic of Vietnam|Socialist Republic of Vietnam|Communist Cuba|Communist Laos|People's Republic of Kampuchea|People's Democratic Republic of Yemen|People's Republic of Angola)$/, id: 'sovietBloc', from: 1960, to: 1991, why: 'A Soviet client state.' },
  { re: /^(United States of America|Canada|Kingdom of Great Britain|France|French Fourth Republic|French Fifth Republic|Federal Republic of Germany|Republic of Italy|Kingdom of Belgium|Netherlands|Luxembourg|Kingdom of Norway|Denmark|Republic of Iceland|Estado Novo|Portugal|Third Hellenic Republic|Kingdom of Greece|Republic of Turkey|Japan|Republic of Korea|Commonwealth of Australia|New Zealand|Republic of the Philippines|Republic of China|Republic of Vietnam|Federated Republic of Germany|Kingdom of Spain)$/, id: 'usAlliance', from: 1949, why: 'A US treaty ally (NATO, ANZUS or a bilateral treaty).' },
  { re: /^(Republic of Poland|Czech Republic|Hungary|Republic of Lithuania|Republic of Latvia|Republic of Estonia|Romania|Republic of Bulgaria|Slovakia|Republic of Slovenia|Republic of Albania|Republic of Croatia)$/, id: 'usAlliance', from: 1999, why: 'Joined NATO after the Cold War.' },
  // Present day
  { re: /^(United States|Canada|United Kingdom|France|Germany|Italy|Belgium|Netherlands|Luxembourg|Norway|Denmark|Iceland|Portugal|Spain|Greece|Türkiye|Turkey|Poland|Czechia|Hungary|Slovakia|Slovenia|Croatia|Albania|Montenegro|North Macedonia|Romania|Bulgaria|Lithuania|Latvia|Estonia|Japan|South Korea|Australia|New Zealand|Philippines|Taiwan|Israel)$/, id: 'usAlliance', from: 2016, why: 'A US treaty ally or major non-NATO partner.' },
  { re: /^Finland$/, id: 'usAlliance', from: 2023 },
  { re: /^Sweden$/, id: 'usAlliance', from: 2024 },
  { re: /^(Russia|Russian Federation|Belarus|Republic of Belarus|Kazakhstan|Kyrgyzstan|Tajikistan|Republic of Tajikistan|Russian-occupied territories|Chechen Republic)$/, id: 'russianSphere', from: 1992 },
  { re: /^(Armenia|Republic of Armenia)$/, id: 'russianSphere', from: 1992, to: 2023 },
  { re: /^(Central African Republic)$/, id: 'russianSphere', from: 2018, why: 'Wagner Group and Russian security deals.' },
  { re: /^(Mali|Burkina Faso|Niger)$/, id: 'russianSphere', from: 2022, why: 'Juntas backed by Russian forces (Wagner, Africa Corps).' },
  { re: /^(Syria)$/, id: 'resistanceAxis', from: 2012, to: 2024, why: 'The Assad government survived through Iranian, Hezbollah and Russian forces.' },
  { re: /^(Islamic Republic of Iran|Iran|Gaza\/Hamas)$/, id: 'resistanceAxis', from: 1979 },
  { re: /^(China|People's Republic of China|North Korea|Democratic People's Republic of Korea)$/, id: 'chineseSphere', from: 1992 },
  // Older empires
  { re: /Mongol Empire|Golden Horde|Ilkhanate|Chagatai Khanate|Yuan Dynasty/, id: 'mongolEmpire', from: 1206, to: 1368 },
  { re: /^(Grand Principality of Moscow|Grand Principality of Vladimir|Principality of Ryazan|Ryazan|Principality of Tver|Principality of Rostov-Suzdal|Principality of Smolensk|Principality of Chernigov|Principality of Kiev|Principality of Pereyaslavl|Principality of Turov and Pinsk|Principality of Polotsk|Principality of Halych|Principality of Volhynia|Halych-Volhynia occupation|Novgorod Republic|Pskov Republic|Principality of Minsk|Principality of Drutsk)$/, id: 'mongolEmpire', from: 1240, to: 1480, why: 'A Rus’ principality paying tribute to the Golden Horde, whose khans confirmed its princes.' },
  { re: /^(Roman Empire|Roman Republic|Western Roman Empire)$/, id: 'roman' },
  { re: /^(Cimmerian Bosporus|Lazica|Caucasian Iberia|Kingdom of Armenia|Mauretania|Kingdom of Pontus|Kingdom of Cappadocia|Galatia|Paphlagonia|Kingdom of Commagene|Nabataean Kingdom|Herodian Kingdom|Kingdom of Judea|Osroene|Kingdom of Sophene|Thrace|Kingdom of Bithynia)$/, id: 'roman', from: -63, to: 395, why: 'A client kingdom whose rulers held power by Rome’s leave.' },
  { re: /^(Ottoman Empire)$/, id: 'ottoman' },
  { re: /^(Principality of Wallachia|Principality of Moldavia)$/, id: 'ottoman', from: 1456, to: 1858, why: 'Christian principalities paying tribute to the sultan.' },
  { re: /^(Crimean Khanate)$/, id: 'ottoman', from: 1478, to: 1774 },
  { re: /^(Regency of Algiers|Beylik of Tunis|Karamanli Dynasty|Sharifate of Mecca)$/, id: 'ottoman', why: 'Autonomous provinces under Ottoman suzerainty.' },
  { re: /^(French First Republic|French Directory|French Consulate|First French Empire|Batavian Republic|Helvetic Republic|Cisalpine Republic|Cispadane Republic|Ligurian Republic|Roman Republic \(1798\)|Parthenopean Republic|Kingdom of Holland|Kingdom of Westphalia|Duchy of Warsaw|Confederation of the Rhine|Kingdom of Italy \(Napoleonic\)|Kingdom of Naples \(Napoleonic\))$/, id: 'napoleonic', from: 1795, to: 1814 },
  { re: /^(Hyderabad State|Nawab of Awadh|Kashmir and Jammu|Kingdom of Mysore)$/, id: 'britishEmpire', from: 1798, why: 'A princely state bound to Britain by a subsidiary alliance.' },
  { re: /^(Republic of Cuba)$/, id: 'usSphere', from: 1902, to: 1934 },
  { re: /^(Republic of Nicaragua)$/, id: 'usSphere', from: 1912, to: 1933 },
  { re: /^(Republic of Haiti|Haiti)$/, id: 'usSphere', from: 1915, to: 1934 },
  { re: /^(Dominican Republic)$/, id: 'usSphere', from: 1916, to: 1924 },
  { re: /^(Republic of Panama)$/, id: 'usSphere', from: 1903, to: 1939 },
  { re: /^(Protectorate of the Western Regions)$/, id: 'self', why: 'Shown as its own unit; it was a Han military protectorate.' },
];

/** Realm groups in the border data that are only collective names, not a power that ran its members. */
const COLLECTIVE_REALMS = /Spring and Autumn States|Warring States China|Mahajanapadas|Eighteen Kingdoms|Five Dynasties and Ten Kingdoms|Taifas of Iberia|Brythonic Kingdoms|Anglo-Saxon England|Duchies of Poland/;

const COLONY_BLOC: [RegExp, string][] = [
  [/British|Gold Coast|Cape Colony|Ceylon|Raj\b/, 'britishEmpire'],
  [/French|Tangier/, 'frenchEmpire'],
  [/Spanish|New Spain|Peru|Granada|La Plata/, 'spanishEmpire'],
  [/Portuguese/, 'portugueseEmpire'],
  [/Dutch|Netherlands|New Netherland|Batavian/, 'dutchEmpire'],
  [/Belgian|Italian/, 'belgianItalianEmpire'],
];

const REALM_BLOC: [RegExp, string][] = [
  [/British Empire|Commonwealth of Nations/, 'britishEmpire'],
  [/Spanish Empire/, 'spanishEmpire'],
  [/Portuguese Empire/, 'portugueseEmpire'],
  [/Netherlands|Batavian Republic/, 'dutchEmpire'],
  [/Vichy France|French/, 'frenchEmpire'],
];

/** Who held de facto control, or the "self-governing" theme. Realms not listed get a dynastic-realm theme. */
export function controlOf(p: Subject, year: number): Verdict {
  const v = (id: string, why: string): Verdict => ({ theme: BLOCS[id], why });
  const named = byName(CONTROL_NAMES, p, year);
  if (named) return v(named.id, named.why ?? `Recorded for ${p.n} in this period.`);
  if (p.m && !COLLECTIVE_REALMS.test(p.m)) {
    for (const [re, id] of REALM_BLOC) if (re.test(p.m)) return v(id, `Part of the ${p.m}.`);
    return { theme: { ...BLOCS.realm, id: `realm:${p.m}`, name: p.m }, why: `Held with the other lands of the ${p.m}.` };
  }
  if (COLONIAL_NAME.test(p.n)) {
    for (const [re, id] of COLONY_BLOC) if (re.test(p.n)) return v(id, 'A colony, protectorate or mandate.');
  }
  return v('self', 'No outside power is recorded here as running this polity in this year.');
}
