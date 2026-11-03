/**
 * Biome lens: the Köppen–Geiger climate map, shifted through time.
 *
 * Data: public/data/koppen.bin is the modern (1951–2000 reference) Köppen–Geiger
 * map at 1/12 degree, one byte per cell, run-length encoded (see
 * data/build-biomes.py). Class numbers follow the kgcpy table (1 = Af ... 31 = ET).
 * public/data/ecoregions.bin holds WWF-style ecoregion ids on the same grid. An
 * ecoregion is split wherever the Köppen class changes, so every patch is named
 * "<class> <ecoregion>", for example "Af North Western Ghats montane rain forests".
 * Those patches are recomputed in the browser for each climate state, so a patch
 * changes class as the climate shifts.
 *
 * Time: there is no global gridded reconstruction behind this. The past maps
 * are the modern map moved by two small, documented adjustments, so they show
 * the direction and rough size of well-known climate swings and nothing finer:
 *
 *  1. Warm/cold swings (`warm`, in degrees of latitude). In a warmer age a
 *     place has the climate that lies that many degrees nearer the equator
 *     today; in a colder age, nearer the pole. It fades out in the tropics,
 *     where temperature barely sorts the Köppen classes.
 *  2. The African Humid Period (`humid`, 0 to 1). Until about 3000 BCE the Sahara,
 *     Arabia and the Thar were wetter, so dry classes there take the class found
 *     up to 8 degrees further south today. The signal fades out by about 1000 BCE.
 *
 * Coastlines, sea level, mountains and rainfall elsewhere are not adjusted.
 */

export interface KoppenClass {
  code: string;
  name: string;
  group: 'A' | 'B' | 'C' | 'D' | 'E';
  colour: string;
  temp: string;
  rain: string;
  veg: string;
  wiki: string;
}

export const GROUPS: Record<KoppenClass['group'], string> = {
  A: 'Tropical',
  B: 'Dry',
  C: 'Temperate',
  D: 'Continental',
  E: 'Polar',
};

const K = (
  code: string, name: string, group: KoppenClass['group'], colour: string,
  temp: string, rain: string, veg: string, wiki: string,
): KoppenClass => ({ code, name, group, colour, temp, rain, veg, wiki });

// Index = class number in koppen.bin (0 is ocean and is not drawn).
export const CLASSES: (KoppenClass | null)[] = [
  null,
  K('Af', 'Tropical rainforest', 'A', '#1f4fd8', 'Hot all year (every month above 18 °C)', 'Wet all year (every month 60 mm or more)', 'Evergreen rainforest', 'Tropical rainforest climate'),
  K('Am', 'Tropical monsoon', 'A', '#3d86ee', 'Hot all year', 'Short dry season, very heavy wet season', 'Monsoon forest', 'Tropical monsoon climate'),
  K('As', 'Tropical savanna (dry summer)', 'A', '#7db4f0', 'Hot all year', 'Dry season in the high-sun months', 'Savanna and dry woodland', 'Tropical savanna climate'),
  K('Aw', 'Tropical savanna (dry winter)', 'A', '#7db4f0', 'Hot all year', 'Distinct dry winter, wet summer', 'Savanna grassland with scattered trees', 'Tropical savanna climate'),
  K('BSh', 'Hot semi-arid (steppe)', 'B', '#e8a53a', 'Hot; yearly mean 18 °C or more', 'Low and unreliable, above desert level', 'Dry grassland and thorn scrub', 'Semi-arid climate'),
  K('BSk', 'Cold semi-arid (steppe)', 'B', '#ecd278', 'Cool to cold winters; yearly mean under 18 °C', 'Low, above desert level', 'Steppe grassland', 'Semi-arid climate'),
  K('BWh', 'Hot desert', 'B', '#d9473f', 'Very hot summers; yearly mean 18 °C or more', 'Under roughly 250 mm a year', 'Sparse desert scrub, bare ground', 'Desert climate'),
  K('BWk', 'Cold desert', 'B', '#eba3a0', 'Hot summers, cold winters; yearly mean under 18 °C', 'Under roughly 250 mm a year', 'Sparse desert scrub, bare ground', 'Desert climate'),
  K('Cfa', 'Humid subtropical', 'C', '#c7e65a', 'Hot summers, mild winters', 'Rain in every season', 'Mixed and broadleaf forest, grassland', 'Humid subtropical climate'),
  K('Cfb', 'Temperate oceanic', 'C', '#7fdc62', 'Warm summers, mild winters', 'Rain in every season', 'Deciduous and mixed forest', 'Oceanic climate'),
  K('Cfc', 'Subpolar oceanic', 'C', '#4fb34a', 'Short cool summers, mild winters', 'Rain in every season', 'Moorland and cool conifer forest', 'Subpolar oceanic climate'),
  K('Csa', 'Hot-summer Mediterranean', 'C', '#f2e243', 'Hot dry summers, mild wet winters', 'Winter rain, dry summer', 'Evergreen scrub and oak woodland', 'Mediterranean climate'),
  K('Csb', 'Warm-summer Mediterranean', 'C', '#cfc531', 'Warm dry summers, mild wet winters', 'Winter rain, dry summer', 'Evergreen scrub and woodland', 'Mediterranean climate'),
  K('Csc', 'Cold-summer Mediterranean', 'C', '#99983a', 'Short cool dry summers', 'Winter rain, dry summer', 'Cool-climate woodland', 'Mediterranean climate'),
  K('Cwa', 'Monsoon-influenced humid subtropical', 'C', '#a8f0a8', 'Hot summers, mild dry winters', 'Wet summer, dry winter', 'Subtropical forest and farmland', 'Humid subtropical climate'),
  K('Cwb', 'Subtropical highland', 'C', '#6fcf78', 'Warm summers, cool dry winters', 'Wet summer, dry winter', 'Highland forest and grassland', 'Subtropical highland climate'),
  K('Cwc', 'Cold subtropical highland', 'C', '#3f9a4a', 'Cool summers, cold dry winters', 'Wet summer, dry winter', 'Highland scrub and grassland', 'Subtropical highland climate'),
  K('Dfa', 'Hot-summer humid continental', 'D', '#2ad8d8', 'Hot summers, cold winters', 'Rain in every season, snow in winter', 'Broadleaf forest, prairie', 'Humid continental climate'),
  K('Dfb', 'Warm-summer humid continental', 'D', '#47b8ee', 'Warm summers, cold winters', 'Rain in every season, snow in winter', 'Mixed forest', 'Humid continental climate'),
  K('Dfc', 'Subarctic (boreal)', 'D', '#1f8a8f', 'Short cool summers, long cold winters', 'Moderate, falls as snow in winter', 'Boreal conifer forest (taiga)', 'Subarctic climate'),
  K('Dfd', 'Extremely cold subarctic', 'D', '#1b5568', 'Short summers, winters below −38 °C', 'Low, falls as snow in winter', 'Larch taiga', 'Subarctic climate'),
  K('Dsa', 'Hot-summer Mediterranean continental', 'D', '#e85de0', 'Hot dry summers, cold winters', 'Dry summer', 'Dry woodland and scrub', 'Humid continental climate'),
  K('Dsb', 'Warm-summer Mediterranean continental', 'D', '#bf45bf', 'Warm dry summers, cold winters', 'Dry summer', 'Mountain forest', 'Humid continental climate'),
  K('Dsc', 'Mediterranean subarctic', 'D', '#955a9d', 'Short cool dry summers, cold winters', 'Dry summer', 'Mountain conifer forest', 'Subarctic climate'),
  K('Dsd', 'Extremely cold Mediterranean subarctic', 'D', '#85648f', 'Short summers, extremely cold winters', 'Dry summer', 'Mountain conifer forest', 'Subarctic climate'),
  K('Dwa', 'Monsoon-influenced hot-summer continental', 'D', '#a6aaf5', 'Hot summers, very cold winters', 'Wet summer, dry winter', 'Farmland, broadleaf forest', 'Humid continental climate'),
  K('Dwb', 'Monsoon-influenced warm-summer continental', 'D', '#6c88dc', 'Warm summers, very cold winters', 'Wet summer, dry winter', 'Mixed forest', 'Humid continental climate'),
  K('Dwc', 'Monsoon-influenced subarctic', 'D', '#5560b8', 'Short cool summers, very cold winters', 'Wet summer, dry winter', 'Boreal conifer forest', 'Subarctic climate'),
  K('Dwd', 'Extremely cold monsoon-influenced subarctic', 'D', '#3a2a86', 'Short summers, winters below −38 °C', 'Wet summer, dry winter', 'Larch taiga', 'Subarctic climate'),
  K('EF', 'Ice cap', 'E', '#f1f1f1', 'Every month below 0 °C', 'Little precipitation, stays frozen', 'Permanent ice, no vegetation', 'Ice cap climate'),
  K('ET', 'Tundra', 'E', '#b7bcc2', 'Warmest month between 0 and 10 °C', 'Low', 'Moss, lichen and low shrubs', 'Tundra'),
];
// kgcpy numbers EF = 30 and ET = 31; keep that order in the table above.
{
  const ef = CLASSES.findIndex((c) => c?.code === 'EF');
  const et = CLASSES.findIndex((c) => c?.code === 'ET');
  if (ef !== 30 || et !== 31) throw new Error('Köppen class table is out of order');
}

// ---- Climate through time --------------------------------------------------
//
// There is no global gridded reconstruction behind this (see
// docs/PLAN-REALISTIC-CLIMATE.md for the data-based plan). The map for any year is the
// modern map *resampled from a different place*: each cell takes the class that
// the modern map has at an offset position. The offset has two parts:
//
//  1. Temperature: a global warm/cold series (in degrees of latitude, about 1.25
//     degrees of latitude per °C) scaled by region: stronger in the North Atlantic
//     and Europe and in the Arctic, weaker in the Southern Hemisphere, and absent
//     in the tropics. A high-latitude Northern Hemisphere extra gives the early
//     Holocene warm period.
//  2. Regional events: rainfall changes with their own area, direction and
//     timeline, taken from well-documented palaeoclimate history (the African
//     Humid Period, the 4.2 ka drought, the Late Bronze Age drought, a stronger
//     Asian monsoon, the Medieval megadrought in the American Southwest, the Classic
//     Maya drought, a wetter Mediterranean in the Little Ice Age).
//
// All of it is rough: it shows the direction, place and rough size of events.
// Class borders can be wrong by hundreds of kilometres.

interface Keyframe { year: number; warm: number }

// Global warm (+) or cold (-) in degrees of latitude relative to 1951-2000.
const KEYFRAMES: Keyframe[] = [
  { year: -3400, warm: 0.9 }, { year: -3000, warm: 0.8 }, { year: -2500, warm: 0.6 },
  { year: -2000, warm: 0.5 }, { year: -1500, warm: 0.4 }, { year: -1000, warm: 0.0 },
  { year: -750, warm: -0.4 }, { year: -500, warm: -0.2 }, { year: -250, warm: 0.3 },
  { year: 1, warm: 0.6 }, { year: 200, warm: 0.5 }, { year: 400, warm: 0.1 },
  { year: 550, warm: -0.5 }, { year: 700, warm: -0.2 }, { year: 900, warm: 0.3 },
  { year: 1050, warm: 0.6 }, { year: 1200, warm: 0.5 }, { year: 1300, warm: 0.1 },
  { year: 1400, warm: -0.3 }, { year: 1550, warm: -0.8 }, { year: 1650, warm: -1.0 },
  { year: 1750, warm: -0.8 }, { year: 1850, warm: -0.5 }, { year: 1900, warm: -0.3 },
  { year: 1975, warm: 0 }, { year: 2024, warm: 0.5 },
];

// Extra warmth at high northern latitudes in the early Holocene (degrees of latitude).
const HIGH_LAT_EXTRA: [number, number][] = [[-3400, 1.0], [-2500, 0.7], [-1800, 0.3], [-1000, 0]];

interface Region {
  id: string;
  /** Shown when the event is active. */
  label: string;
  lon: number;
  lat: number;
  /** Radii in degrees. */
  rx: number;
  ry: number;
  /** At full strength, each cell takes the modern class from this far east and north (degrees). */
  dx: number;
  dy: number;
  /** [year, strength 0 to 1] keyframes. */
  curve: [number, number][];
}

const REGIONS: Region[] = [
  { id: 'ahp-africa', label: 'African Humid Period: wetter Sahara and Arabia', lon: 22, lat: 21, rx: 46, ry: 11, dx: 0, dy: -11,
    curve: [[-3400, 0.85], [-3000, 0.62], [-2600, 0.4], [-2250, 0.14], [-1800, 0.14], [-1200, 0.06], [-600, 0]] },
  { id: 'ahp-thar', label: 'Stronger Indian monsoon: wetter Thar and Indus', lon: 71, lat: 26, rx: 11, ry: 7, dx: 5, dy: -5,
    curve: [[-3400, 0.8], [-2600, 0.6], [-2250, 0.2], [-1800, 0.3], [-1200, 0.1], [-600, 0]] },
  { id: 'monsoon-china', label: 'Stronger East Asian monsoon: wetter northern China and Mongolia', lon: 108, lat: 40, rx: 24, ry: 9, dx: 4, dy: -4,
    curve: [[-3400, 0.65], [-2500, 0.5], [-2100, 0.25], [-1500, 0.3], [-1000, 0.12], [-300, 0]] },
  { id: 'drought-4200', label: '4.2 ka drought: drier Mesopotamia, Levant and Iran', lon: 42, lat: 34, rx: 24, ry: 8, dx: 0, dy: -4,
    curve: [[-2400, 0], [-2200, 0.9], [-2000, 0.85], [-1900, 0.45], [-1700, 0]] },
  { id: 'drought-lba', label: 'Late Bronze Age drought: drier Anatolia and the eastern Mediterranean', lon: 33, lat: 37, rx: 14, ry: 6, dx: 0, dy: -3,
    curve: [[-1300, 0], [-1200, 0.75], [-1100, 0.5], [-1000, 0]] },
  { id: 'wet-lia-med', label: 'Wetter Mediterranean', lon: 14, lat: 40, rx: 28, ry: 6, dx: 0, dy: 2.5,
    curve: [[1400, 0], [1550, 0.5], [1650, 1], [1800, 0.5], [1860, 0]] },
  { id: 'drought-sw', label: 'Megadrought in the American Southwest and Plains', lon: -106, lat: 37, rx: 18, ry: 8, dx: -3, dy: -4,
    curve: [[850, 0], [1000, 0.5], [1150, 0.9], [1300, 0.9], [1380, 0.3], [1450, 0]] },
  { id: 'drought-maya', label: 'Classic Maya drought', lon: -90, lat: 18, rx: 6, ry: 4, dx: -3, dy: 3,
    curve: [[740, 0], [800, 0.5], [900, 0.95], [1000, 0.9], [1100, 0.3], [1200, 0]] },
];

const ERAS: { to: number; label: string }[] = [
  { to: -2500, label: 'Mid-Holocene warmth' },
  { to: -1000, label: 'Late Holocene drying' },
  { to: -250, label: 'Iron Age cool phase' },
  { to: 400, label: 'Roman Warm Period' },
  { to: 900, label: 'Late Antique cold phase' },
  { to: 1300, label: 'Medieval Climate Anomaly' },
  { to: 1850, label: 'Little Ice Age' },
  { to: 1975, label: 'Industrial-era warming' },
  { to: 9999, label: 'Modern reference period' },
];

function curveAt(curve: [number, number][], year: number): number {
  if (year <= curve[0][0]) return curve[0][1];
  for (let i = 0; i < curve.length - 1; i++) {
    const [y0, v0] = curve[i];
    const [y1, v1] = curve[i + 1];
    if (year <= y1) {
      const t = (year - y0) / (y1 - y0);
      return v0 + (v1 - v0) * (t * t * (3 - 2 * t));
    }
  }
  return curve[curve.length - 1][1];
}

export interface ClimateShift {
  /** Global warm (+) or cold (-) in degrees of latitude. */
  warm: number;
  /** Era name. */
  era: string;
  /** Strength (0 to 1) of every regional event, in REGIONS order. */
  strengths: number[];
  /** Labels of the regional events that are noticeably active. */
  events: string[];
}

export function climateShift(year: number): ClimateShift {
  const warm = curveAt(KEYFRAMES.map((k): [number, number] => [k.year, k.warm]), year);
  const strengths = REGIONS.map((region) => curveAt(region.curve, year));
  const events = REGIONS.filter((_, i) => strengths[i] > 0.25).map((region) => region.label);
  const era = (ERAS.find((e) => year < e.to) ?? ERAS[ERAS.length - 1]).label;
  return { warm, era, strengths, events };
}

// ---- Grid ------------------------------------------------------------------
const CELLS_PER_DEGREE = 12;
/** Cells per side of the blocks the climate offset is computed on (0.5 degree). */
const BLOCK = 6;
const CANVAS_SIZE = 2048;
const MERCATOR_LIMIT = 85.0511287798;
const MIN_PATCH_CELLS = 10;

const smoothstep = (edge0: number, edge1: number, x: number): number => {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
};

/** Soft elliptical weight (1 at the centre, 0 at and beyond the edge), wrapping around the date line. */
function ellipseWeight(lon: number, lat: number, cx: number, cy: number, rx: number, ry: number): number {
  let dx = lon - cx;
  if (dx > 180) dx -= 360;
  else if (dx < -180) dx += 360;
  const d2 = (dx / rx) ** 2 + ((lat - cy) / ry) ** 2;
  if (d2 >= 1) return 0;
  const f = 1 - d2;
  return f * f;
}

/** Names and groupings of the ecoregions, from public/data/ecoregions.json. */
export interface EcoMeta {
  biomes: string[];
  realms: string[];
  /** [name, biome index, realm index]; ecoregion id n is entry n - 1. */
  eco: [string, number, number][];
}

/** One patch of an ecoregion that has a single Köppen class. */
export interface EcoPatch {
  n: string;
  s: number;
  e: number;
  lx: number;
  ly: number;
  cw: number;
  ch: number;
  sz: number;
  k: number;
  /** Köppen class number and ecoregion id. */
  cls: number;
  eco: number;
}

/** Number of lightness shades an ecoregion can take within its Köppen colour. */
const SHADES = 6;
/** Total lightness range covered by the shades (0 to 1). */
const SHADE_SPAN = 0.34;

function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  if (d === 0) return [0, 0, l];
  const sat = d / (1 - Math.abs(2 * l - 1));
  let h: number;
  if (max === r) h = ((g - b) / d + 6) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  return [h * 60, sat, l];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  const [r, g, b] =
    h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] :
    h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
}

function decodeRuns(buffer: ArrayBuffer, wide: boolean): { width: number; height: number; data: Uint8Array | Uint16Array } {
  const view = new DataView(buffer);
  const width = view.getUint16(0, true);
  const height = view.getUint16(2, true);
  const data = wide ? new Uint16Array(width * height) : new Uint8Array(width * height);
  const step = wide ? 4 : 3;
  let at = 0;
  for (let i = 4; i + step <= buffer.byteLength && at < data.length; i += step) {
    const value = wide ? view.getUint16(i, true) : view.getUint8(i);
    const run = wide ? view.getUint16(i + 2, true) : view.getUint8(i + 1) | (view.getUint8(i + 2) << 8);
    data.fill(value, at, at + run);
    at += run;
  }
  if (at !== data.length) throw new Error('biome grid is truncated');
  return { width, height, data };
}

export class BiomeModel {
  readonly canvas: HTMLCanvasElement;
  readonly meta: EcoMeta;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly image: ImageData;
  private readonly pixels: Uint32Array;
  /** Packed colour per (Köppen class, ecoregion shade). */
  private readonly palette = new Uint32Array(CLASSES.length * SHADES);
  /** Shade (0 to SHADES - 1) of each ecoregion id, chosen so neighbours differ. */
  private readonly shadeOfEco: Uint8Array;
  private readonly width: number;
  private readonly height: number;
  private readonly grid: Uint8Array;
  private readonly eco: Uint16Array;
  /** Köppen class per cell for the current climate state. */
  private readonly cls: Uint8Array;
  private readonly rowOfY = new Int32Array(CANVAS_SIZE);
  private readonly colOfX = new Int32Array(CANVAS_SIZE);
  /** Per 0.5-degree block: latitude, temperature scale, high-latitude weight, and each region's weight. */
  private readonly blockLat: Float32Array;
  private readonly blockTemp: Float32Array;
  private readonly blockHigh: Float32Array;
  private readonly blockRegion: Float32Array[];
  private readonly rowShift: Int16Array;
  private readonly colShift: Int16Array;
  private lastKey = '';

  constructor(koppen: ArrayBuffer, ecoregions: ArrayBuffer, meta: EcoMeta) {
    const k = decodeRuns(koppen, false);
    const e = decodeRuns(ecoregions, true);
    if (k.width !== e.width || k.height !== e.height) throw new Error('biome grids differ in size');
    this.width = k.width;
    this.height = k.height;
    this.grid = k.data as Uint8Array;
    this.eco = e.data as Uint16Array;
    this.meta = meta;
    this.cls = new Uint8Array(this.grid.length);

    this.canvas = document.createElement('canvas');
    this.canvas.width = CANVAS_SIZE;
    this.canvas.height = CANVAS_SIZE;
    const ctx = this.canvas.getContext('2d');
    if (!ctx) throw new Error('2D canvas is not available');
    this.ctx = ctx;
    this.image = ctx.createImageData(CANVAS_SIZE, CANVAS_SIZE);
    this.pixels = new Uint32Array(this.image.data.buffer);

    CLASSES.forEach((klass, index) => {
      if (!klass) return;
      const [h, sat, light] = hexToHsl(klass.colour);
      // Keep the lightest and darkest shade inside a readable range.
      const centre = Math.min(0.92 - SHADE_SPAN / 2, Math.max(0.12 + SHADE_SPAN / 2, light));
      for (let shade = 0; shade < SHADES; shade++) {
        const l = centre + (shade / (SHADES - 1) - 0.5) * SHADE_SPAN;
        const [r, g, b] = hslToRgb(h, sat, l);
        this.palette[index * SHADES + shade] = ((255 << 24) | (b << 16) | (g << 8) | r) >>> 0;
      }
    });
    this.shadeOfEco = this.chooseShades(meta.eco.length);

    for (let y = 0; y < CANVAS_SIZE; y++) {
      this.rowOfY[y] = this.rowOfLat(BiomeModel.latOfY(y));
    }
    for (let x = 0; x < CANVAS_SIZE; x++) {
      this.colOfX[x] = Math.min(this.width - 1, Math.floor(((x + 0.5) / CANVAS_SIZE) * this.width));
    }

    // Per-block weights for the temperature scaling and the regional events.
    const bw = Math.floor(this.width / BLOCK);
    const bh = Math.floor(this.height / BLOCK);
    this.blockLat = new Float32Array(bw * bh);
    this.blockTemp = new Float32Array(bw * bh);
    this.blockHigh = new Float32Array(bw * bh);
    this.blockRegion = REGIONS.map(() => new Float32Array(bw * bh));
    this.rowShift = new Int16Array(bw * bh);
    this.colShift = new Int16Array(bw * bh);
    for (let by = 0; by < bh; by++) {
      const lat = 90 - ((by + 0.5) * BLOCK) / CELLS_PER_DEGREE;
      for (let bx = 0; bx < bw; bx++) {
        const lon = -180 + ((bx + 0.5) * BLOCK) / CELLS_PER_DEGREE;
        const i = by * bw + bx;
        this.blockLat[i] = lat;
        // Temperature: none in the tropics, half as strong in the south, stronger over the
        // North Atlantic and Europe and in the Arctic.
        const warmW = smoothstep(15, 35, Math.abs(lat));
        const hemi = lat >= 0 ? 0.8 : 0.4;
        const atlantic = lat > 0 ? ellipseWeight(lon, lat, -8, 56, 50, 22) : 0;
        const arctic = lat > 0 ? smoothstep(55, 75, lat) : 0;
        this.blockTemp[i] = warmW * hemi * (1 + 0.5 * atlantic + 0.4 * arctic);
        this.blockHigh[i] = lat > 0 ? smoothstep(45, 65, lat) : 0;
        REGIONS.forEach((region, r) => {
          this.blockRegion[r][i] = ellipseWeight(lon, lat, region.lon, region.lat, region.rx, region.ry);
        });
      }
    }
  }

  /**
   * Give every ecoregion one of SHADES lightness levels so that neighbours look as
   * different as possible. Neighbours that share a Köppen class (so the same hue) count
   * most; neighbours of another class already differ in hue and count less.
   */
  private chooseShades(count: number): Uint8Array {
    const n = count + 1; // ids are 1-based
    const hard = new Uint16Array(n * n); // adjacent cells with the same class
    const soft = new Uint16Array(n * n); // adjacent cells with different classes
    const { eco, grid, width, height } = this;
    const touch = (a: number, ca: number, b: number, cb: number): void => {
      if (a === b || a === 0 || b === 0) return;
      const m = ca === cb ? hard : soft;
      if (m[a * n + b] < 65535) { m[a * n + b]++; m[b * n + a]++; }
    };
    for (let row = 0; row < height; row++) {
      const offset = row * width;
      for (let col = 0; col < width; col++) {
        const i = offset + col;
        const a = eco[i];
        if (a === 0) continue;
        const right = col + 1 < width ? i + 1 : offset;
        touch(a, grid[i], eco[right], grid[right]);
        if (row + 1 < height) touch(a, grid[i], eco[i + width], grid[i + width]);
      }
    }
    // Colour the most-connected ecoregions first.
    const degree = new Int32Array(n);
    for (let a = 1; a < n; a++) {
      for (let b = 1; b < n; b++) if (hard[a * n + b] > 4 || soft[a * n + b] > 4) degree[a]++;
    }
    const order = Array.from({ length: count }, (_, k) => k + 1).sort((a, b) => degree[b] - degree[a]);
    const shade = new Int8Array(n).fill(-1);
    for (const a of order) {
      let best = 0;
      let bestHard = -1;
      let bestSoft = -1;
      for (let candidate = 0; candidate < SHADES; candidate++) {
        let nearestHard = SHADES;
        let softSum = 0;
        for (let b = 1; b < n; b++) {
          if (shade[b] < 0) continue;
          const gap = Math.abs(candidate - shade[b]);
          if (hard[a * n + b] > 4 && gap < nearestHard) nearestHard = gap;
          if (soft[a * n + b] > 4) softSum += gap;
        }
        if (nearestHard > bestHard || (nearestHard === bestHard && softSum > bestSoft)) {
          best = candidate;
          bestHard = nearestHard;
          bestSoft = softSum;
        }
      }
      shade[a] = best;
    }
    const out = new Uint8Array(n);
    for (let a = 1; a < n; a++) out[a] = Math.max(0, shade[a]);
    return out;
  }

  static get bounds(): [[number, number], [number, number], [number, number], [number, number]] {
    return [
      [-180, MERCATOR_LIMIT], [180, MERCATOR_LIMIT],
      [180, -MERCATOR_LIMIT], [-180, -MERCATOR_LIMIT],
    ];
  }

  private static latOfY(y: number): number {
    const n = Math.PI * (1 - (2 * (y + 0.5)) / CANVAS_SIZE);
    return (Math.atan(Math.sinh(n)) * 180) / Math.PI;
  }

  private rowOfLat(lat: number): number {
    return Math.min(this.height - 1, Math.max(0, Math.floor((90 - lat) * CELLS_PER_DEGREE)));
  }

  /**
   * Work out the Köppen class of every cell for a year. Returns false when the
   * climate state is the same as last time (so nothing needs redrawing).
   */
  update(year: number): boolean {
    const shift = climateShift(year);
    const high = curveAt(HIGH_LAT_EXTRA, year);
    const key = `${Math.round(shift.warm * 10)}|${Math.round(high * 10)}|${shift.strengths.map((v) => Math.round(v * 20)).join(',')}`;
    if (key === this.lastKey) return false;
    this.lastKey = key;

    const { grid, cls, width, height, blockLat, blockTemp, blockHigh, blockRegion, rowShift, colShift } = this;
    const bw = Math.floor(width / BLOCK);
    const bh = Math.floor(height / BLOCK);
    const active = REGIONS.map((_, r) => r).filter((r) => shift.strengths[r] > 0.02);

    // Offset (in cells) of the place each block takes its class from.
    for (let i = 0; i < bw * bh; i++) {
      const lat = blockLat[i];
      const warm = shift.warm * blockTemp[i] + high * blockHigh[i];
      let dyDeg = lat >= 0 ? -warm : warm; // warmer: take the class from nearer the equator
      let dxDeg = 0;
      for (const r of active) {
        const weight = shift.strengths[r] * blockRegion[r][i];
        if (weight < 0.003) continue;
        dyDeg += weight * REGIONS[r].dy;
        dxDeg += weight * REGIONS[r].dx;
      }
      rowShift[i] = Math.round(-dyDeg * CELLS_PER_DEGREE); // rows grow southward
      colShift[i] = Math.round(dxDeg * CELLS_PER_DEGREE);
    }

    for (let by = 0; by < bh; by++) {
      for (let bx = 0; bx < bw; bx++) {
        const i = by * bw + bx;
        const rs = rowShift[i];
        const cs = colShift[i];
        for (let r = 0; r < BLOCK; r++) {
          const row = by * BLOCK + r;
          const offset = row * width;
          for (let c = 0; c < BLOCK; c++) {
            const col = bx * BLOCK + c;
            const base = grid[offset + col];
            if (base === 0 || (rs === 0 && cs === 0)) {
              cls[offset + col] = base;
              continue;
            }
            let movedRow = row + rs;
            if (movedRow < 0) movedRow = 0;
            else if (movedRow >= height) movedRow = height - 1;
            let movedCol = col + cs;
            if (movedCol < 0) movedCol += width;
            else if (movedCol >= width) movedCol -= width;
            let value = grid[movedRow * width + movedCol];
            if (value === 0) {
              // Landed in the sea: try half the distance, then keep the modern class.
              const halfRow = Math.min(height - 1, Math.max(0, row + (rs >> 1)));
              value = grid[halfRow * width + col] || base;
            }
            cls[offset + col] = value;
          }
        }
      }
    }
    return true;
  }

  /** Draw the current climate state onto the canvas. */
  draw(): void {
    const { cls, eco, shadeOfEco, width, pixels, palette, rowOfY, colOfX } = this;
    for (let y = 0; y < CANVAS_SIZE; y++) {
      const rowStart = rowOfY[y] * width;
      const offset = y * CANVAS_SIZE;
      for (let x = 0; x < CANVAS_SIZE; x++) {
        const cell = rowStart + colOfX[x];
        pixels[offset + x] = palette[cls[cell] * SHADES + shadeOfEco[eco[cell]]];
      }
    }
    this.ctx.putImageData(this.image, 0, 0);
  }

  private cellAt(lng: number, lat: number): number {
    const wrapped = ((((lng + 180) % 360) + 360) % 360) - 180;
    const col = Math.min(this.width - 1, Math.floor(((wrapped + 180) / 360) * this.width));
    return this.rowOfLat(lat) * this.width + col;
  }

  /** Köppen class number at a place in the current climate state (0 means open sea). */
  classAt(lng: number, lat: number): number {
    return this.cls[this.cellAt(lng, lat)];
  }

  /** Ecoregion id at a place (0 means open sea). Names are in `meta.eco[id - 1]`. */
  ecoAt(lng: number, lat: number): number {
    return this.eco[this.cellAt(lng, lat)];
  }

  /**
   * One patch per connected area of a single (ecoregion, Köppen class) pair in the
   * current climate state, each with a label anchor and the free width and height
   * there (degrees as drawn on a Mercator map), like the polity and civilization labels.
   */
  patches(): EcoPatch[] {
    const { cls, eco, width, height, meta } = this;
    let cap = 1 << 19;
    type Ints = Int32Array<ArrayBuffer>;
    let rowOf: Ints = new Int32Array(cap);
    let x0: Ints = new Int32Array(cap);
    let x1: Ints = new Int32Array(cap);
    let keyOf: Ints = new Int32Array(cap);
    let parent: Ints = new Int32Array(cap);
    let count = 0;
    const rowStart = new Int32Array(height + 1);

    for (let row = 0; row < height; row++) {
      rowStart[row] = count;
      const offset = row * width;
      let col = 0;
      while (col < width) {
        const e = eco[offset + col];
        const c = cls[offset + col];
        if (e === 0 || c === 0) {
          col++;
          continue;
        }
        const key = e * 32 + c;
        let end = col + 1;
        while (end < width && eco[offset + end] === e && cls[offset + end] === c) end++;
        if (count === cap) {
          cap *= 2;
          const grow = (old: Ints): Ints => {
            const next = new Int32Array(cap);
            next.set(old);
            return next;
          };
          rowOf = grow(rowOf);
          x0 = grow(x0);
          x1 = grow(x1);
          keyOf = grow(keyOf);
          parent = grow(parent);
        }
        rowOf[count] = row;
        x0[count] = col;
        x1[count] = end - 1;
        keyOf[count] = key;
        parent[count] = count;
        count++;
        col = end;
      }
    }
    rowStart[height] = count;

    const find = (i: number): number => {
      while (parent[i] !== i) {
        parent[i] = parent[parent[i]];
        i = parent[i];
      }
      return i;
    };
    for (let row = 1; row < height; row++) {
      let a = rowStart[row - 1];
      const aEnd = rowStart[row];
      let b = aEnd;
      const bEnd = rowStart[row + 1];
      while (a < aEnd && b < bEnd) {
        if (keyOf[a] === keyOf[b] && x0[a] <= x1[b] && x0[b] <= x1[a]) {
          const ra = find(a);
          const rb = find(b);
          if (ra !== rb) parent[rb] = ra;
        }
        if (x1[a] < x1[b]) a++;
        else b++;
      }
    }

    // Per patch: area and vertical centre, then the best run to hang the label on.
    const area = new Float64Array(count);
    const rowSum = new Float64Array(count);
    for (let i = 0; i < count; i++) {
      const root = find(i);
      const len = x1[i] - x0[i] + 1;
      area[root] += len;
      rowSum[root] += rowOf[i] * len;
    }
    const bestScore = new Float64Array(count).fill(-1e9);
    const bestRun = new Int32Array(count).fill(-1);
    for (let i = 0; i < count; i++) {
      const root = find(i);
      if (area[root] < MIN_PATCH_CELLS) continue;
      const centre = rowSum[root] / area[root];
      const score = (x1[i] - x0[i] + 1) - 1.5 * Math.abs(rowOf[i] - centre);
      if (score > bestScore[root]) {
        bestScore[root] = score;
        bestRun[root] = i;
      }
    }

    const out: EcoPatch[] = [];
    for (let root = 0; root < count; root++) {
      const run = bestRun[root];
      if (run < 0) continue;
      const row = rowOf[run];
      const col = (x0[run] + x1[run]) >> 1;
      const key = keyOf[run];
      const idx = row * width + col;
      let up = row;
      while (up > 0 && eco[(up - 1) * width + col] * 32 + cls[(up - 1) * width + col] === key) up--;
      let down = row;
      while (down < height - 1 && eco[(down + 1) * width + col] * 32 + cls[(down + 1) * width + col] === key) down++;

      const lat = 90 - (row + 0.5) / CELLS_PER_DEGREE;
      const stretch = 1 / Math.max(0.2, Math.cos((Math.min(Math.abs(lat), 80) * Math.PI) / 180));
      const klass = CLASSES[cls[idx]];
      const ecoId = eco[idx];
      if (!klass || ecoId === 0) continue;
      out.push({
        n: `${klass.code} ${meta.eco[ecoId - 1][0]}`,
        s: -9999,
        e: 9999,
        lx: -180 + (col + 0.5) / CELLS_PER_DEGREE,
        ly: lat,
        cw: (x1[run] - x0[run] + 1) / CELLS_PER_DEGREE,
        ch: ((down - up + 1) / CELLS_PER_DEGREE) * stretch,
        sz: Math.sqrt((area[root] / (CELLS_PER_DEGREE * CELLS_PER_DEGREE)) * stretch),
        k: out.length,
        cls: cls[idx],
        eco: ecoId,
      });
    }
    return out;
  }
}
