// Builds public/data/societies.geojson.
//
// The old version used ~8,500 Glottography language polygons. Those are useful
// for a modern language atlas, but they collapse into the same dense mosaic for
// every year between 1500 and 1900 and leave almost no pre-1500 coverage.
//
// This layer is a deliberately broad, curated temporal atlas. Each region has
// six successive society stages, so the map changes across the whole timeline
// instead of showing one static constellation. Shapes are conceptual regions,
// not scholarly borders. Project data, CC BY 4.0.
import { statSync, writeFileSync } from 'node:fs';

const PALETTE = [
  '#7f9b6a', '#5f8fa3', '#b08a56', '#8d7397', '#4f9a8b', '#a46b64', '#7e8fc4',
  '#b39b4f', '#6f9f7c', '#9b7d5c', '#5d8f9f', '#a07b8f', '#849a55', '#6f7e9e',
  '#b06f5a', '#5e9a93', '#8b9d7a', '#6d83a0', '#b58f63', '#8c7d9b',
];

const hash = (value) => {
  let h = 2166136261;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

function ringArea(ring) {
  let area = 0;
  let cx = 0;
  let cy = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [x0, y0] = ring[j];
    const [x1, y1] = ring[i];
    const f = x0 * y1 - x1 * y0;
    area += f;
    cx += (x0 + x1) * f;
    cy += (y0 + y1) * f;
  }
  area /= 2;
  return area === 0
    ? { a: 0, cx: ring[0][0], cy: ring[0][1] }
    : { a: area, cx: cx / (6 * area), cy: cy / (6 * area) };
}

function deriveGeometry(feature) {
  const polygons = feature.geometry.type === 'Polygon'
    ? [feature.geometry.coordinates]
    : feature.geometry.coordinates;
  let best = null;
  let total = 0;
  for (const polygon of polygons) {
    const measurement = ringArea(polygon[0]);
    total += Math.abs(measurement.a);
    if (!best || Math.abs(measurement.a) > Math.abs(best.a)) best = measurement;
  }
  if (!best) return;
  feature.properties.lx = +best.cx.toFixed(2);
  feature.properties.ly = +best.cy.toFixed(2);
  feature.properties.sz = +Math.sqrt(total).toFixed(2);
}

const STAGES = [
  { s: -3400, e: -1000, era: 'Early' },
  { s: -1000, e: 500, era: 'Classical' },
  { s: 500, e: 1500, era: 'Medieval' },
  { s: 1500, e: 1800, era: 'Early modern' },
  { s: 1800, e: 1945, era: 'Modern' },
  { s: 1945, e: 2024, era: 'Contemporary' },
];

// One broad ring per region. Overlap between neighbouring regions is expected:
// these are conceptual culture areas, not mutually exclusive territories.
const REGIONS = [
  {
    key: 'nile',
    article: 'History of Egypt',
    ring: [[24, 32], [35, 32], [35, 22], [31, 22], [24, 24], [24, 32]],
    names: [
      'Early Nile societies', 'Ancient Egyptian society', 'Medieval Egyptian society',
      'Ottoman Egypt', 'Modern Egyptian society', 'Contemporary Egypt',
    ],
  },
  {
    key: 'mesopotamia',
    article: 'History of Mesopotamia',
    ring: [[38, 37.5], [49, 37.5], [49, 29], [44, 29], [40, 31], [38, 34], [38, 37.5]],
    names: [
      'Early Mesopotamian societies', 'Babylonian and Assyrian societies',
      'Medieval Mesopotamian societies', 'Ottoman Iraq', 'Modern Iraqi society',
      'Contemporary Iraq',
    ],
  },
  {
    key: 'anatolia',
    article: 'History of Anatolia',
    ring: [[26, 42], [44, 42], [44, 36], [32, 36], [26, 38], [26, 42]],
    names: [
      'Early Anatolian societies', 'Greek and Roman Anatolia',
      'Byzantine and Turkish Anatolia', 'Ottoman Anatolia', 'Modern Turkish society',
      'Contemporary Turkey',
    ],
  },
  {
    key: 'levant',
    article: 'History of the Levant',
    ring: [[34, 37.5], [39, 37.5], [39, 29], [34, 29], [34, 37.5]],
    names: [
      'Early Levantine societies', 'Israelite and Phoenician societies', 'Islamic Levant',
      'Ottoman Levant', 'Modern Levantine societies', 'Contemporary Levant',
    ],
  },
  {
    key: 'iran',
    article: 'History of Iran',
    ring: [[44, 40], [63, 40], [63, 25], [44, 25], [44, 40]],
    names: [
      'Early Iranian societies', 'Achaemenid and Parthian Iran', 'Sasanian and Islamic Iran',
      'Safavid Iran', 'Modern Iranian society', 'Contemporary Iran',
    ],
  },
  {
    key: 'south-asia',
    article: 'History of South Asia',
    ring: [[60, 35], [78, 35], [92, 35], [92, 8], [77, 8], [60, 20], [60, 35]],
    names: [
      'Early South Asian societies', 'Vedic and Mauryan societies', 'Medieval Indian societies',
      'Mughal India', 'British India', 'Contemporary South Asia',
    ],
  },
  {
    key: 'north-china',
    article: 'History of China',
    ring: [[96, 42], [122, 42], [122, 32], [105, 32], [96, 36], [96, 42]],
    names: [
      'Early Yellow River societies', 'Zhou and Han China', 'Medieval Chinese society',
      'Ming and Qing China', 'Modern China', 'Contemporary China',
    ],
  },
  {
    key: 'south-china',
    article: 'History of China',
    ring: [[100, 32], [122, 32], [122, 20], [108, 20], [100, 25], [100, 32]],
    names: [
      'Early Yangtze societies', 'Southern kingdoms and Han China', 'Medieval southern China',
      'Late imperial south China', 'Modern south China', 'Contemporary south China',
    ],
  },
  {
    key: 'steppe',
    article: 'Eurasian Steppe',
    ring: [[30, 55], [75, 55], [110, 48], [100, 40], [75, 40], [30, 44], [30, 55]],
    names: [
      'Early steppe pastoralists', 'Scythians and Xiongnu', 'Turkic and Mongol steppe',
      'Early modern steppe', 'Imperial steppe', 'Contemporary steppe',
    ],
  },
  {
    key: 'greece',
    article: 'History of Greece',
    ring: [[19, 42], [29, 42], [29, 34], [19, 34], [19, 42]],
    names: [
      'Early Aegean societies', 'Ancient Greek society', 'Byzantine Greek society',
      'Ottoman Greece', 'Modern Greek society', 'Contemporary Greece',
    ],
  },
  {
    key: 'italy',
    article: 'History of Italy',
    ring: [[10, 47], [19, 47], [19, 37], [10, 37], [10, 47]],
    names: [
      'Early Italic societies', 'Roman society', 'Medieval Italian societies',
      'Renaissance Italy', 'Modern Italian society', 'Contemporary Italy',
    ],
  },
  {
    key: 'west-europe',
    article: 'History of Europe',
    ring: [[-5, 55], [16, 55], [16, 43], [-5, 43], [-5, 55]],
    names: [
      'Early European societies', 'Roman and post-Roman Europe', 'Medieval European society',
      'Early modern Europe', 'Industrial Europe', 'Contemporary Europe',
    ],
  },
  {
    key: 'scandinavia',
    article: 'History of Scandinavia',
    ring: [[4, 71], [31, 71], [31, 55], [4, 55], [4, 71]],
    names: [
      'Early Nordic societies', 'Viking and Norse society', 'Medieval Scandinavian society',
      'Early modern Scandinavia', 'Modern Scandinavia', 'Contemporary Scandinavia',
    ],
  },
  {
    key: 'arabia',
    article: 'History of Arabia',
    ring: [[34, 32], [60, 32], [60, 12], [34, 12], [34, 32]],
    names: [
      'Early Arabian societies', 'Bedouin and caravan societies', 'Islamic Arabian society',
      'Ottoman and Wahhabi Arabia', 'Modern Arabian society', 'Contemporary Arabia',
    ],
  },
  {
    key: 'west-africa',
    article: 'History of West Africa',
    ring: [[-17, 20], [16, 20], [16, 5], [-17, 5], [-17, 20]],
    names: [
      'Early West African societies', 'Nok and Sahelian societies', 'Ghana, Mali and Songhai',
      'Atlantic West Africa', 'Colonial West Africa', 'Contemporary West Africa',
    ],
  },
  {
    key: 'east-africa',
    article: 'History of East Africa',
    ring: [[35, 15], [52, 15], [52, -5], [35, -5], [35, 15]],
    names: [
      'Early East African societies', 'Aksum and the Horn', 'Swahili coast and Ethiopian society',
      'Omani and Ethiopian empires', 'Colonial East Africa', 'Contemporary East Africa',
    ],
  },
  {
    key: 'southern-africa',
    article: 'History of Southern Africa',
    ring: [[12, -5], [35, -5], [35, -35], [12, -35], [12, -5]],
    names: [
      'Early Bantu and Khoisan societies', 'Iron Age southern Africa',
      'Great Zimbabwe and Kongo', 'Atlantic and Indian Ocean trade',
      'Colonial southern Africa', 'Contemporary southern Africa',
    ],
  },
  {
    key: 'mesoamerica',
    article: 'Mesoamerica',
    ring: [[-105, 23], [-87, 23], [-87, 14], [-105, 14], [-105, 23]],
    names: [
      'Early Mesoamerican societies', 'Maya and Teotihuacan', 'Toltec and Aztec societies',
      'Colonial New Spain', 'Modern Mexico and Central America', 'Contemporary Mesoamerica',
    ],
  },
  {
    key: 'andes',
    article: 'History of the Andes',
    ring: [[-81, 5], [-65, 5], [-65, -20], [-81, -20], [-81, 5]],
    names: [
      'Early Andean societies', 'Moche and Tiwanaku', 'Inca society',
      'Colonial Peru', 'Modern Andean republics', 'Contemporary Andes',
    ],
  },
  {
    key: 'amazon',
    article: 'Amazon basin',
    ring: [[-75, 5], [-45, 5], [-45, -15], [-75, -15], [-75, 5]],
    names: [
      'Early Amazonian societies', 'Amazonian chiefdoms', 'Forest and river societies',
      'Colonial Amazon', 'Modern Amazon', 'Contemporary Amazon',
    ],
  },
  {
    key: 'east-north-america',
    article: 'History of the United States',
    ring: [[-95, 50], [-70, 50], [-70, 30], [-95, 30], [-95, 50]],
    names: [
      'Early Eastern Woodlands societies', 'Mississippian and Iroquoian societies',
      'Contact-era Eastern nations', 'Colonial and early republic',
      'Industrial United States', 'Contemporary Eastern North America',
    ],
  },
  {
    key: 'west-north-america',
    article: 'History of the Western United States',
    ring: [[-125, 55], [-95, 55], [-95, 30], [-125, 30], [-125, 55]],
    names: [
      'Early Western societies', 'Pueblo and Pacific coast societies',
      'Contact-era Western nations', 'Colonial and frontier West',
      'Modern Western North America', 'Contemporary Western North America',
    ],
  },
  {
    key: 'oceania',
    article: 'History of Oceania',
    ring: [[110, -10], [155, -10], [155, -40], [110, -40], [110, -10]],
    names: [
      'Aboriginal Australian societies', 'Aboriginal and Pacific societies',
      'Pacific voyaging societies', 'Colonial Oceania', 'Modern Oceania',
      'Contemporary Oceania',
    ],
  },
  {
    key: 'japan-korea',
    article: 'History of Japan',
    ring: [[124, 46], [146, 46], [146, 30], [124, 30], [124, 46]],
    names: [
      'Jōmon and Yayoi societies', 'Early Japanese and Korean kingdoms',
      'Medieval Japanese and Korean societies', 'Edo and Joseon',
      'Imperial Japan and modern Korea', 'Contemporary Japan and Korea',
    ],
  },
  {
    key: 'southeast-asia',
    article: 'History of Southeast Asia',
    ring: [[95, 25], [130, 25], [130, -10], [110, -10], [95, 5], [95, 25]],
    names: [
      'Early Southeast Asian societies', 'Funan, Srivijaya and Angkor',
      'Medieval Southeast Asian societies', 'Early modern Southeast Asia',
      'Colonial Southeast Asia', 'Contemporary Southeast Asia',
    ],
  },
  {
    key: 'himalaya',
    article: 'History of Tibet',
    ring: [[75, 38], [100, 38], [100, 26], [75, 26], [75, 38]],
    names: [
      'Early Himalayan societies', 'Tibetan Empire', 'Medieval Tibet',
      'Dalai Lama Tibet', 'Modern Himalayan states', 'Contemporary Himalaya',
    ],
  },
  {
    key: 'caribbean',
    article: 'History of the Caribbean',
    ring: [[-85, 25], [-60, 25], [-60, 10], [-85, 10], [-85, 25]],
    names: [
      'Taíno and Carib societies', 'Contact-era Caribbean', 'Colonial Caribbean',
      'Plantation Caribbean', 'Modern Caribbean', 'Contemporary Caribbean',
    ],
  },
  {
    key: 'siberia',
    article: 'History of Siberia',
    ring: [[60, 70], [160, 70], [160, 50], [60, 50], [60, 70]],
    names: [
      'Early Siberian societies', 'Siberian peoples', 'Siberian khanates',
      'Russian Siberia', 'Modern Siberia', 'Contemporary Siberia',
    ],
  },
];

const out = [];

for (const region of REGIONS) {
  for (let stage = 0; stage < STAGES.length; stage++) {
    const { s, e } = STAGES[stage];
    const name = region.names[stage];
    const feature = {
      type: 'Feature',
      properties: {
        n: name,
        s,
        e,
        w: region.article,
        q: '',
        m: '',
        src: 'Curated regional atlas (project data, CC BY 4.0)',
        kind: stage === 0 ? 'Early society' : 'Society',
        level: 'curated',
        region: region.key,
      },
      geometry: { type: 'Polygon', coordinates: [region.ring] },
    };
    deriveGeometry(feature);
    out.push(feature);
  }
}

// Named examples that should remain visible across several regional stages.
const OVERLAYS = [
  {
    n: 'Bedouin Arabs',
    s: -500,
    e: 2024,
    w: 'Bedouin',
    kind: 'People',
    ring: [
      [34, 12], [43, 11.5], [52, 12.5], [59, 17], [59, 26], [55, 31],
      [47, 33], [41, 34], [37, 32], [34, 29], [33, 24], [34, 12],
    ],
  },
  {
    n: 'Maya',
    s: -2000,
    e: 1500,
    w: 'Maya civilization',
    kind: 'Civilization',
    ring: [
      [-93, 15], [-87, 15], [-86.5, 21.5], [-90, 22.5], [-93.5, 19], [-93, 15],
    ],
  },
  {
    n: 'Swahili coast',
    s: 800,
    e: 1500,
    w: 'Swahili coast',
    kind: 'Historical people',
    ring: [
      [38, -15], [41.5, -15], [42, 0], [41, 4], [39, 4], [38, -5], [38, -15],
    ],
  },
  {
    n: 'Old High German',
    s: 750,
    e: 1050,
    w: 'Old High German',
    kind: 'Language stage',
    ring: [
      [6.5, 46.5], [7, 49.5], [6.8, 51.5], [8, 53.7], [12, 54], [15, 51.5],
      [16.5, 48.5], [15, 46.5], [12, 45.5], [9, 45.5], [6.5, 46.5],
    ],
  },
  {
    n: 'Modern Southern California',
    s: 1945,
    e: 2024,
    w: 'Southern California',
    kind: 'Culture region',
    ring: [
      [-121, 32.5], [-114.5, 32.5], [-114.3, 35], [-117, 35.5], [-119, 35],
      [-120.5, 34], [-121, 32.5],
    ],
  },
];

for (const entry of OVERLAYS) {
  const feature = {
    type: 'Feature',
    properties: {
      n: entry.n,
      s: entry.s,
      e: entry.e,
      w: entry.w,
      q: '',
      m: '',
      src: 'Curated regional atlas (project data, CC BY 4.0)',
      kind: entry.kind,
      level: 'curated',
      region: 'overlay',
    },
    geometry: { type: 'Polygon', coordinates: [entry.ring] },
  };
  deriveGeometry(feature);
  out.push(feature);
}

out.forEach((feature, index) => {
  feature.properties.k = index;
  feature.properties.c = PALETTE[hash(feature.properties.n) % PALETTE.length];
});

const collection = { type: 'FeatureCollection', features: out };
writeFileSync('public/data/societies.geojson', JSON.stringify(collection));
console.log(
  `societies.geojson: ${out.length} features, ` +
    `${(statSync('public/data/societies.geojson').size / 1024).toFixed(1)} KB`,
);
