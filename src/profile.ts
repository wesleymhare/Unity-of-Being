/**
 * The polity stat sheet: the same rows, in the same order, for every polity.
 *
 * Sources, in order of preference for each row:
 *   1. data/polity-stats.json  hand-curated figures with a source note (optional file)
 *   2. World Bank open data    modern states only: population, GDP, armed forces, spending
 *   3. Wikidata (CC0)          dated population and area, capital, government, language...
 * A row with no value shows a dash, so every polity has an identical layout. Values taken
 * from a different year than the one on the slider say so ("c. 1520").
 */
import {
  getJson,
  leadersAtYear,
  type Leader,
  isAbort,
  preferredClaims,
  qualifierValue,
  snakValue,
  yearFromTime,
  type WikidataClaim,
  type WikidataEntity,
} from './wiki';
import { bestCandidate, type OrganisedInfobox } from './infobox-map';

const WD_API = 'https://www.wikidata.org/w/api.php';
const WB_API = 'https://api.worldbank.org/v2';
const nf = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });

export interface ProfileRow {
  label: string;
  value: string;
  /** Where the figure comes from or which year it is for. */
  note?: string;
  /** The figure is from a year far from the one shown. */
  far?: boolean;
  source?: string;
}

export interface ProfileGroup {
  title: string;
  rows: ProfileRow[];
  /** Rulers through time, drawn as a fold-out under the group. */
  timeline?: { history: Leader[]; current: Leader[] };
}

interface DatedItem {
  id: string;
  start?: number;
  end?: number;
}

interface DatedNumber {
  year?: number;
  value: number;
}

/** Facts read from Wikidata, kept until the year changes. */
export interface ProfileData {
  qid: string;
  iso?: string;
  capital: DatedItem[];
  currency: DatedItem[];
  government: string[];
  languages: string[];
  religion: string[];
  before: string[];
  after: string[];
  population: DatedNumber[];
  area: DatedNumber[];
  inception?: number;
  dissolved?: number;
  labels: Map<string, string>;
}

type WbSeries = Map<number, number>;
export interface WorldBank {
  population: WbSeries;
  gdp: WbSeries;
  gdpPerCapita: WbSeries;
  armed: WbSeries;
  spendShare: WbSeries;
  spendUsd: WbSeries;
}

interface CuratedEntry {
  y?: number;
  v: string;
  src?: string;
}
export type Curated = Record<string, Partial<Record<'population' | 'area' | 'army' | 'economy' | 'spending', CuratedEntry[]>>>;

const dataCache = new Map<string, ProfileData | null>();
const wbCache = new Map<string, WorldBank | null>();
let curatedPromise: Promise<Curated> | null = null;

// ---- Formatting -----------------------------------------------------------------
const fmtYear = (y: number): string => (y < 0 ? `${-y} BCE` : `${y === 0 ? 1 : y} CE`);

export function fmtCount(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1e12) return `${(value / 1e12).toFixed(1)} trillion`;
  if (abs >= 1e9) return `${(value / 1e9).toFixed(abs >= 1e10 ? 0 : 1)} billion`;
  if (abs >= 1e6) return `${(value / 1e6).toFixed(abs >= 1e7 ? 0 : 1)} million`;
  return nf.format(Math.round(value));
}

function nearest<T extends { year?: number; start?: number; end?: number }>(
  list: T[],
  year: number,
): { item: T; distance: number } | null {
  if (!list.length) return null;
  let best: { item: T; distance: number } | null = null;
  for (const item of list) {
    const at = item.year;
    const distance = at === undefined ? Infinity : Math.abs(at - year);
    if (!best || distance < best.distance) best = { item, distance };
  }
  return best && best.distance === Infinity ? { item: best.item, distance: Infinity } : best;
}

function noteFor(
  pick: { distance: number; item: { year?: number } },
  year: number,
): { note?: string; far?: boolean } {
  if (pick.distance === Infinity) return { note: 'undated', far: true };
  const y = pick.item.year as number;
  if (pick.distance <= 1) return { note: y === year ? undefined : fmtYear(y) };
  return { note: `c. ${fmtYear(y)}`, far: pick.distance > 120 };
}

// ---- Wikidata ---------------------------------------------------------------------
function timeOf(claim: WikidataClaim, property: 'P580' | 'P582' | 'P585'): number | undefined {
  return yearFromTime(qualifierValue(claim, property)?.time) ?? undefined;
}

function itemIds(claims: Record<string, WikidataClaim[]>, property: string, max: number): string[] {
  const out: string[] = [];
  for (const claim of preferredClaims(claims, property)) {
    const id = snakValue(claim)?.id;
    if (id && /^Q\d+$/.test(id) && !out.includes(id)) out.push(id);
    if (out.length >= max) break;
  }
  return out;
}

function datedItems(claims: Record<string, WikidataClaim[]>, property: string): DatedItem[] {
  const out: DatedItem[] = [];
  for (const claim of preferredClaims(claims, property)) {
    const id = snakValue(claim)?.id;
    if (id && /^Q\d+$/.test(id)) out.push({ id, start: timeOf(claim, 'P580'), end: timeOf(claim, 'P582') });
  }
  return out;
}

function numbers(claims: Record<string, WikidataClaim[]>, property: string, unitScale: (unit?: string) => number): DatedNumber[] {
  const out: DatedNumber[] = [];
  for (const claim of preferredClaims(claims, property)) {
    const snak = snakValue(claim);
    if (!snak?.amount) continue;
    const amount = Number.parseFloat(snak.amount) * unitScale(snak.unit);
    if (!Number.isFinite(amount) || amount <= 0) continue;
    out.push({ year: timeOf(claim, 'P585'), value: amount });
  }
  return out;
}

const areaScale = (unit?: string): number => {
  if (unit?.endsWith('Q253276')) return 1 / 1_000_000; // square metre
  if (unit?.endsWith('Q35852')) return 1 / 100; // hectare
  return 1; // km² or unspecified
};

function stringClaim(claims: Record<string, WikidataClaim[]>, property: string): string | undefined {
  const value = preferredClaims(claims, property)[0]?.mainsnak?.datavalue?.value;
  return typeof value === 'string' ? value : undefined;
}

export async function getProfileData(qid: string, signal?: AbortSignal): Promise<ProfileData | null> {
  if (!/^Q\d+$/.test(qid)) return null;
  if (dataCache.has(qid)) return dataCache.get(qid) ?? null;
  let entity: WikidataEntity | undefined;
  try {
    const url = `${WD_API}?action=wbgetentities&format=json&origin=*&ids=${qid}&props=claims&languages=en`;
    entity = (await getJson<{ entities?: Record<string, WikidataEntity> }>(url, signal)).entities?.[qid];
  } catch (error) {
    if (isAbort(error)) throw error;
    return null;
  }
  if (!entity || entity.missing !== undefined) {
    dataCache.set(qid, null);
    return null;
  }
  const claims = entity.claims ?? {};
  const capital = datedItems(claims, 'P36');
  const currency = datedItems(claims, 'P38');
  const government = itemIds(claims, 'P122', 2);
  const languages = itemIds(claims, 'P37', 3);
  const religion = itemIds(claims, 'P140', 2);
  const before = [...itemIds(claims, 'P155', 2), ...itemIds(claims, 'P1365', 2)].slice(0, 3);
  const after = [...itemIds(claims, 'P156', 2), ...itemIds(claims, 'P1366', 2)].slice(0, 3);

  const ids = new Set<string>([
    ...capital.map((c) => c.id), ...currency.map((c) => c.id), ...government, ...languages, ...religion, ...before, ...after,
  ]);
  const labels = new Map<string, string>();
  if (ids.size) {
    try {
      const url = `${WD_API}?action=wbgetentities&format=json&origin=*&props=labels&languages=en` +
        `&ids=${encodeURIComponent([...ids].slice(0, 50).join('|'))}`;
      const data = await getJson<{ entities?: Record<string, { labels?: Record<string, { value?: string }> }> }>(url, signal);
      for (const [id, item] of Object.entries(data.entities ?? {})) {
        const label = item.labels?.en?.value ?? item.labels?.mul?.value;
        if (label) labels.set(id, label);
      }
    } catch (error) {
      if (isAbort(error)) throw error;
    }
  }

  const result: ProfileData = {
    qid,
    iso: stringClaim(claims, 'P298'),
    capital, currency, government, languages, religion, before, after, labels,
    population: numbers(claims, 'P1082', () => 1),
    area: numbers(claims, 'P2046', areaScale),
    inception: yearFromTime(preferredClaims(claims, 'P571')[0]?.mainsnak?.datavalue?.value
      ? (preferredClaims(claims, 'P571')[0].mainsnak?.datavalue?.value as { time?: string }).time : undefined) ?? undefined,
    dissolved: yearFromTime(preferredClaims(claims, 'P576')[0]?.mainsnak?.datavalue?.value
      ? (preferredClaims(claims, 'P576')[0].mainsnak?.datavalue?.value as { time?: string }).time : undefined) ?? undefined,
  };
  dataCache.set(qid, result);
  return result;
}

// ---- World Bank (CC BY 4.0), modern states only ---------------------------------------------
async function wbSeries(iso: string, indicator: string, signal?: AbortSignal): Promise<WbSeries> {
  const out: WbSeries = new Map();
  try {
    const url = `${WB_API}/country/${encodeURIComponent(iso)}/indicator/${indicator}?format=json&per_page=100&date=1960:2026`;
    const data = await getJson<unknown>(url, signal);
    const rows = Array.isArray(data) ? (data[1] as { date?: string; value?: number | null }[] | null) : null;
    for (const row of rows ?? []) {
      const year = Number.parseInt(row.date ?? '', 10);
      if (Number.isFinite(year) && typeof row.value === 'number') out.set(year, row.value);
    }
  } catch (error) {
    if (isAbort(error)) throw error;
  }
  return out;
}

export async function getWorldBank(iso: string | undefined, signal?: AbortSignal): Promise<WorldBank | null> {
  if (!iso || !/^[A-Z]{3}$/.test(iso)) return null;
  if (wbCache.has(iso)) return wbCache.get(iso) ?? null;
  const [population, gdp, gdpPerCapita, armed, spendShare, spendUsd] = await Promise.all([
    wbSeries(iso, 'SP.POP.TOTL', signal), wbSeries(iso, 'NY.GDP.MKTP.CD', signal),
    wbSeries(iso, 'NY.GDP.PCAP.CD', signal), wbSeries(iso, 'MS.MIL.TOTL.P1', signal),
    wbSeries(iso, 'MS.MIL.XPND.GD.ZS', signal), wbSeries(iso, 'MS.MIL.XPND.CD', signal),
  ]);
  const result = { population, gdp, gdpPerCapita, armed, spendShare, spendUsd };
  wbCache.set(iso, result);
  return result;
}

/** The latest value at or before a year (a few years of lag allowed past the last data). */
function wbAt(series: WbSeries | undefined, year: number): { value: number; at: number } | null {
  if (!series?.size) return null;
  let best: number | null = null;
  for (const y of series.keys()) if (y <= year && (best === null || y > best)) best = y;
  return best === null ? null : { value: series.get(best) as number, at: best };
}

// ---- Curated figures ------------------------------------------------------------------------
export function getCurated(base: string): Promise<Curated> {
  curatedPromise ??= fetch(`${base}data/polity-stats.json`)
    .then((r) => (r.ok ? (r.json() as Promise<Curated>) : {}))
    .catch(() => ({}));
  return curatedPromise;
}

function curatedAt(entries: CuratedEntry[] | undefined, year: number): { row: ProfileRow } | null {
  if (!entries?.length) return null;
  let best = entries[0];
  let distance = Infinity;
  for (const entry of entries) {
    const d = entry.y === undefined ? 500 : Math.abs(entry.y - year);
    if (d < distance) { distance = d; best = entry; }
  }
  const note = best.y === undefined ? undefined : (distance <= 1 ? undefined : `c. ${fmtYear(best.y)}`);
  return { row: { label: '', value: best.v, note, far: distance > 120, source: best.src ?? 'Curated' } };
}

// ---- Rulers -----------------------------------------------------------------------------------
export function fmtReign(leader: Leader): string {
  const start = fmtYear(leader.start);
  return leader.end === undefined ? `from ${start}` : `${start} – ${fmtYear(leader.end)}`;
}

export const isHeadOfGovernment = (leader: Leader): boolean =>
  /government|prime minister|premier|chancellor|president of the council|vizier|regent/i.test(leader.office ?? '');

function rulerText(list: Leader[]): string {
  return list.slice(0, 3).map((l) => `${l.name} (${fmtReign(l)})`).join('; ');
}

// ---- The sheet ----------------------------------------------------------------------------------
const DASH = '—';

export interface SheetInput {
  year: number;
  data: ProfileData | null;
  wb: WorldBank | null;
  curated: Curated[string] | undefined;
  /** Realm this polity belongs to, from the map data. */
  realm?: string;
  /** The Wikipedia infobox, sorted into sheet rows (fallbacks and dated values). */
  infobox?: OrganisedInfobox;
  /** Full ruler history from Wikidata. */
  leaders?: Leader[];
}

export function buildSheet(input: SheetInput): ProfileGroup[] {
  const { year, data, wb, curated, realm, infobox, leaders } = input;
  const label = (id: string): string => data?.labels.get(id) ?? id;
  const list = (ids: string[] | undefined): string => (ids ?? []).map(label).filter((x) => !/^Q\d+$/.test(x)).join(', ');
  const row = (name: string, value: string | undefined, extra: Partial<ProfileRow> = {}): ProfileRow =>
    ({ label: name, value: value || DASH, ...(value ? extra : {}) });

  /** Text from the infobox for a row when no structured source has one. */
  const fromInfobox = (key: keyof OrganisedInfobox['mapped']): string | undefined => {
    const best = bestCandidate(infobox?.mapped[key], year);
    return best ? best.c.text : undefined;
  };

  // capital and currency: the dated entry covering the year, else the undated one
  const dated = (items: DatedItem[] | undefined): string => {
    if (!items?.length) return '';
    const covering = items.filter((i) => (i.start === undefined || i.start <= year) && (i.end === undefined || i.end >= year));
    const pool = covering.length ? covering : items.filter((i) => i.start === undefined && i.end === undefined);
    return (pool.length ? pool : [])
      .map((i) => label(i.id)).filter((x, n, a) => a.indexOf(x) === n && !/^Q\d+$/.test(x)).slice(0, 2).join(', ');
  };

  // population: exact for modern years, else curated, else the nearest dated Wikidata value
  let population: ProfileRow;
  const wbPop = wbAt(wb?.population, year);
  const curatedPop = curatedAt(curated?.population, year);
  if (wbPop && year - wbPop.at <= 3) {
    population = row('Population', fmtCount(wbPop.value), { note: wbPop.at === year ? undefined : String(wbPop.at), source: 'World Bank' });
  } else if (curatedPop) {
    population = { ...curatedPop.row, label: 'Population' };
  } else {
    const pick = data ? nearest(data.population, year) : null;
    const box = bestCandidate(infobox?.mapped.population, year);
    if (box && box.c.year !== undefined && (!pick || (box.distance < pick.distance && box.distance <= 200))) {
      population = row('Population', box.c.text, { ...noteFor({ distance: box.distance, item: { year: box.c.year } }, year), source: 'Wikipedia infobox' });
    } else if (pick) {
      population = row('Population', fmtCount(pick.item.value), { ...noteFor(pick, year), source: 'Wikidata' });
    } else {
      population = row('Population', box ? box.c.text : undefined, { source: 'Wikipedia infobox', ...(box?.c.year === undefined ? {} : { note: `c. ${fmtYear(box.c.year)}` }) });
    }
  }

  let area: ProfileRow;
  const curatedArea = curatedAt(curated?.area, year);
  if (curatedArea) area = { ...curatedArea.row, label: 'Area' };
  else {
    const pick = data ? nearest(data.area, year) : null;
    const box = bestCandidate(infobox?.mapped.area, year);
    if (box && box.c.year !== undefined && (!pick || (box.distance < pick.distance && box.distance <= 200))) {
      area = row('Area', box.c.text, { ...noteFor({ distance: box.distance, item: { year: box.c.year } }, year), source: 'Wikipedia infobox' });
    } else if (pick) {
      area = row('Area', `${nf.format(Math.round(pick.item.value))} km²`, { ...noteFor(pick, year), source: 'Wikidata' });
    } else {
      area = row('Area', box ? box.c.text : undefined, { source: 'Wikipedia infobox', ...(box?.c.year === undefined ? {} : { note: `c. ${fmtYear(box.c.year)}` }) });
    }
  }

  const gdp = wbAt(wb?.gdp, year);
  const gdpPc = wbAt(wb?.gdpPerCapita, year);
  const curatedEco = curatedAt(curated?.economy, year);
  let economy: ProfileRow;
  if (curatedEco) economy = { ...curatedEco.row, label: 'Economy' };
  else if (gdp && year - gdp.at <= 3) {
    const pc = gdpPc ? `, $${nf.format(Math.round(gdpPc.value))} per person` : '';
    economy = row('Economy', `GDP $${fmtCount(gdp.value)}${pc}`, { note: gdp.at === year ? undefined : String(gdp.at), source: 'World Bank' });
  } else economy = row('Economy', fromInfobox('economy'), { source: 'Wikipedia infobox' });

  const armed = wbAt(wb?.armed, year);
  const curatedArmy = curatedAt(curated?.army, year);
  let army: ProfileRow;
  if (curatedArmy) army = { ...curatedArmy.row, label: 'Armed forces' };
  else if (armed && year - armed.at <= 6) {
    army = row('Armed forces', `${fmtCount(armed.value)} personnel`, { note: armed.at === year ? undefined : String(armed.at), source: 'World Bank' });
  } else army = row('Armed forces', fromInfobox('army'), { source: 'Wikipedia infobox' });

  const share = wbAt(wb?.spendShare, year);
  const usd = wbAt(wb?.spendUsd, year);
  const curatedSpend = curatedAt(curated?.spending, year);
  let spending: ProfileRow;
  if (curatedSpend) spending = { ...curatedSpend.row, label: 'Military spending' };
  else if (share && year - share.at <= 6) {
    const money = usd ? `$${fmtCount(usd.value)}, ` : '';
    spending = row('Military spending', `${money}${share.value.toFixed(1)}% of GDP`, { note: share.at === year ? undefined : String(share.at), source: 'World Bank' });
  } else spending = row('Military spending', undefined);

  const existed = data && (data.inception !== undefined || data.dissolved !== undefined)
    ? `${data.inception !== undefined ? fmtYear(data.inception) : '?'} – ${data.dissolved !== undefined ? fmtYear(data.dissolved) : 'present'}`
    : undefined;

  const current = leaders ? leadersAtYear(leaders, year) : [];
  const heads = current.filter((l) => !isHeadOfGovernment(l));
  const govs = current.filter(isHeadOfGovernment);
  const waiting = leaders === undefined;

  return [
    { title: 'Government', timeline: leaders && leaders.length > 1 ? { history: leaders, current } : undefined, rows: [
      row('Government', list(data?.government) || fromInfobox('government'), { source: 'Wikidata / Wikipedia infobox' }),
      waiting ? { label: 'Head of state', value: '…' } : row('Head of state', rulerText(heads), { source: 'Wikidata' }),
      waiting ? { label: 'Head of government', value: '…' } : row('Head of government', rulerText(govs), { source: 'Wikidata' }),
      row('Capital', dated(data?.capital) || fromInfobox('capital'), { source: 'Wikidata / Wikipedia infobox' }),
      row('Existed', existed || fromInfobox('existed'), { source: 'Wikidata / Wikipedia infobox' }),
    ] },
    { title: 'People', rows: [
      population,
      row('Languages', list(data?.languages) || fromInfobox('languages'), { source: 'Wikidata / Wikipedia infobox' }),
      row('Religion', list(data?.religion) || fromInfobox('religion'), { source: 'Wikidata / Wikipedia infobox' }),
    ] },
    { title: 'Land and economy', rows: [
      area,
      economy,
      row('Currency', dated(data?.currency) || fromInfobox('currency'), { source: 'Wikidata / Wikipedia infobox' }),
    ] },
    { title: 'Military', rows: [army, spending] },
    { title: 'Lineage', rows: [
      row('Preceded by', list(data?.before) || fromInfobox('before'), { source: 'Wikidata / Wikipedia infobox' }),
      row('Succeeded by', list(data?.after) || fromInfobox('after'), { source: 'Wikidata / Wikipedia infobox' }),
      row('Part of', realm),
    ] },
  ];
}

/** The same sheet with every value empty, shown while data loads. */
export function emptySheet(): ProfileGroup[] {
  return buildSheet({ year: 0, data: null, wb: null, curated: undefined }).map((group) => ({
    title: group.title,
    rows: group.rows.map((r) => ({ label: r.label, value: '…' })),
  }));
}
