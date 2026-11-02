/**
 * Biome lens: the Köppen–Geiger climate map, shifted through time.
 *
 * Data: public/data/koppen.bin is the modern (1951–2000 reference) Köppen–Geiger
 * map at 1/6 degree, one byte per cell, run-length encoded (see
 * data/build-biomes.py). Class numbers follow the kgcpy table (1 = Af ... 31 = ET).
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
interface Keyframe { year: number; warm: number; humid: number }

// `warm` is in degrees of latitude (positive = warmer than the 1951–2000
// reference). About 1.25 degrees of latitude is roughly 1 °C. Values follow the
// general shape of Holocene temperature reconstructions and are deliberately
// small and smooth.
const KEYFRAMES: Keyframe[] = [
  { year: -3400, warm: 1.3, humid: 0.85 },
  { year: -3000, warm: 1.1, humid: 0.65 },
  { year: -2500, warm: 0.9, humid: 0.42 },
  { year: -2000, warm: 0.8, humid: 0.26 },
  { year: -1500, warm: 0.6, humid: 0.14 },
  { year: -1000, warm: 0.1, humid: 0.05 },
  { year: -750, warm: -0.4, humid: 0 },
  { year: -500, warm: -0.2, humid: 0 },
  { year: -250, warm: 0.3, humid: 0 },
  { year: 1, warm: 0.7, humid: 0 },
  { year: 200, warm: 0.6, humid: 0 },
  { year: 400, warm: 0.2, humid: 0 },
  { year: 550, warm: -0.5, humid: 0 },
  { year: 700, warm: -0.2, humid: 0 },
  { year: 900, warm: 0.4, humid: 0 },
  { year: 1050, warm: 0.8, humid: 0 },
  { year: 1200, warm: 0.6, humid: 0 },
  { year: 1300, warm: 0.2, humid: 0 },
  { year: 1400, warm: -0.3, humid: 0 },
  { year: 1550, warm: -0.9, humid: 0 },
  { year: 1650, warm: -1.2, humid: 0 },
  { year: 1750, warm: -1.0, humid: 0 },
  { year: 1850, warm: -0.6, humid: 0 },
  { year: 1900, warm: -0.3, humid: 0 },
  { year: 1975, warm: 0, humid: 0 },
  { year: 2024, warm: 0.5, humid: 0 },
];

const ERAS: { to: number; label: string }[] = [
  { to: -2500, label: 'Mid-Holocene warmth and the African Humid Period' },
  { to: -1000, label: 'Late Holocene drying' },
  { to: -250, label: 'Iron Age cool phase' },
  { to: 400, label: 'Roman Warm Period' },
  { to: 900, label: 'Late Antique cold phase' },
  { to: 1300, label: 'Medieval Climate Anomaly' },
  { to: 1850, label: 'Little Ice Age' },
  { to: 1975, label: 'Industrial-era warming' },
  { to: 9999, label: 'Modern reference period' },
];

export interface ClimateShift {
  warm: number;
  humid: number;
  era: string;
}

export function climateShift(year: number): ClimateShift {
  let a = KEYFRAMES[0];
  let b = KEYFRAMES[KEYFRAMES.length - 1];
  for (let i = 0; i < KEYFRAMES.length - 1; i++) {
    if (year >= KEYFRAMES[i].year && year <= KEYFRAMES[i + 1].year) {
      a = KEYFRAMES[i];
      b = KEYFRAMES[i + 1];
      break;
    }
  }
  const t = b.year === a.year ? 0 : Math.min(1, Math.max(0, (year - a.year) / (b.year - a.year)));
  const smooth = t * t * (3 - 2 * t);
  const era = (ERAS.find((e) => year < e.to) ?? ERAS[ERAS.length - 1]).label;
  return {
    warm: a.warm + (b.warm - a.warm) * smooth,
    humid: a.humid + (b.humid - a.humid) * smooth,
    era,
  };
}

// ---- Grid ------------------------------------------------------------------
const CELLS_PER_DEGREE = 6;
const HUMID_REACH_DEGREES = 8;
const CANVAS_SIZE = 2048;
const MERCATOR_LIMIT = 85.0511287798;

const smoothstep = (edge0: number, edge1: number, x: number): number => {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
};

export class BiomeModel {
  readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly image: ImageData;
  private readonly pixels: Uint32Array;
  private readonly palette = new Uint32Array(CLASSES.length);
  private readonly width: number;
  private readonly height: number;
  private readonly grid: Uint8Array;
  private readonly rowOfY = new Int32Array(CANVAS_SIZE);
  private readonly colOfX = new Int32Array(CANVAS_SIZE);
  private lastKey = '';

  constructor(buffer: ArrayBuffer) {
    const view = new DataView(buffer);
    this.width = view.getUint16(0, true);
    this.height = view.getUint16(2, true);
    this.grid = new Uint8Array(this.width * this.height);
    const bytes = new Uint8Array(buffer);
    let at = 0;
    for (let i = 4; i + 2 < bytes.length && at < this.grid.length; i += 3) {
      const value = bytes[i];
      const run = bytes[i + 1] | (bytes[i + 2] << 8);
      this.grid.fill(value, at, at + run);
      at += run;
    }
    if (at !== this.grid.length) throw new Error('koppen.bin is truncated');

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
      const r = parseInt(klass.colour.slice(1, 3), 16);
      const g = parseInt(klass.colour.slice(3, 5), 16);
      const b = parseInt(klass.colour.slice(5, 7), 16);
      this.palette[index] = ((255 << 24) | (b << 16) | (g << 8) | r) >>> 0;
    });

    for (let y = 0; y < CANVAS_SIZE; y++) {
      const lat = this.latOfY(y);
      this.rowOfY[y] = Math.min(this.height - 1, Math.max(0, Math.floor((90 - lat) * CELLS_PER_DEGREE)));
    }
    for (let x = 0; x < CANVAS_SIZE; x++) {
      this.colOfX[x] = Math.min(this.width - 1, Math.floor(((x + 0.5) / CANVAS_SIZE) * this.width));
    }
  }

  static get bounds(): [[number, number], [number, number], [number, number], [number, number]] {
    return [
      [-180, MERCATOR_LIMIT], [180, MERCATOR_LIMIT],
      [180, -MERCATOR_LIMIT], [-180, -MERCATOR_LIMIT],
    ];
  }

  private latOfY(y: number): number {
    const n = Math.PI * (1 - (2 * (y + 0.5)) / CANVAS_SIZE);
    return (Math.atan(Math.sinh(n)) * 180) / Math.PI;
  }

  /** Weight (0 to 1) of the warm/cold swing at a latitude: none in the tropics. */
  private static warmWeight(lat: number): number {
    return smoothstep(15, 35, Math.abs(lat));
  }

  /** Weight of the African Humid Period belt at a latitude and longitude. */
  private static humidWeight(lat: number, lng: number): number {
    const band = smoothstep(8, 15, lat) * (1 - smoothstep(30, 36, lat));
    const east = 1 - 0.65 * smoothstep(62, 80, lng) - 0.35 * smoothstep(80, 90, lng);
    const west = smoothstep(-26, -18, lng);
    return band * Math.max(0, east) * west;
  }

  /** Class number at a grid cell after the shifts for a year. */
  private sample(row: number, col: number, lat: number, lng: number, shift: ClimateShift): number {
    const warmRows = shift.warm * BiomeModel.warmWeight(lat) * CELLS_PER_DEGREE;
    const humidRows = shift.humid * HUMID_REACH_DEGREES * BiomeModel.humidWeight(lat, lng) * CELLS_PER_DEGREE;
    const direction = lat >= 0 ? 1 : -1;
    const at = (scale: number): number => {
      const moved = row + Math.round((warmRows * direction + humidRows) * scale);
      const r = Math.min(this.height - 1, Math.max(0, moved));
      return this.grid[r * this.width + col];
    };
    let value = at(1);
    if (value === 0) value = at(0.5);
    if (value === 0) value = this.grid[row * this.width + col];
    return value;
  }

  /** The class at a place in a year (0 means open sea). */
  classAt(lng: number, lat: number, year: number): number {
    const shift = climateShift(year);
    const row = Math.min(this.height - 1, Math.max(0, Math.floor((90 - lat) * CELLS_PER_DEGREE)));
    const wrapped = ((((lng + 180) % 360) + 360) % 360) - 180;
    const col = Math.min(this.width - 1, Math.floor(((wrapped + 180) / 360) * this.width));
    return this.sample(row, col, lat, wrapped, shift);
  }

  /** Draw the map for a year. Returns false when nothing changed since last time. */
  render(year: number): boolean {
    const shift = climateShift(year);
    const key = `${Math.round(shift.warm * 12)}|${Math.round(shift.humid * 40)}`;
    if (key === this.lastKey) return false;
    this.lastKey = key;

    const { grid, width, height, pixels, palette } = this;
    const warmRowsBase = shift.warm * CELLS_PER_DEGREE;
    const humidRowsBase = shift.humid * HUMID_REACH_DEGREES * CELLS_PER_DEGREE;

    const lonOfCol = new Float32Array(CANVAS_SIZE);
    for (let x = 0; x < CANVAS_SIZE; x++) lonOfCol[x] = ((x + 0.5) / CANVAS_SIZE) * 360 - 180;

    for (let y = 0; y < CANVAS_SIZE; y++) {
      const lat = this.latOfY(y);
      const row = this.rowOfY[y];
      const warmRows = warmRowsBase * BiomeModel.warmWeight(lat) * (lat >= 0 ? 1 : -1);
      const humidBand = humidRowsBase !== 0 ? humidRowsBase * BiomeModel.humidWeight(lat, 0) : 0;
      const needsLon = humidRowsBase !== 0 && lat > 6 && lat < 38;
      const offset = y * CANVAS_SIZE;

      for (let x = 0; x < CANVAS_SIZE; x++) {
        const col = this.colOfX[x];
        let rows = warmRows;
        if (needsLon && humidBand !== 0) {
          rows += humidRowsBase * BiomeModel.humidWeight(lat, lonOfCol[x]);
        }
        let moved = row + Math.round(rows);
        if (moved < 0) moved = 0;
        else if (moved >= height) moved = height - 1;
        let value = grid[moved * width + col];
        if (value === 0 && rows !== 0) {
          moved = row + Math.round(rows * 0.5);
          value = grid[Math.min(height - 1, Math.max(0, moved)) * width + col];
          if (value === 0) value = grid[row * width + col];
        }
        pixels[offset + x] = palette[value];
      }
    }
    this.ctx.putImageData(this.image, 0, 0);
    return true;
  }
}
