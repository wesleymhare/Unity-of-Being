// Open data lookups for the polity panel.
// Wikipedia text is CC BY-SA; Wikidata statements are CC0; Commons media is
// under the licence shown on its file page.

const WP = 'https://en.wikipedia.org';
const WP_API = `${WP}/w/api.php`;
const WP_REST = `${WP}/api/rest_v1`;
const WD_API = 'https://www.wikidata.org/w/api.php';
const COMMONS = 'https://commons.wikimedia.org';

export interface WikiImage {
  source: string;
  width?: number;
  height?: number;
}

export interface WikiSummary {
  title: string;
  extract: string;
  description?: string;
  type: string;
  url: string;
  thumbnail?: WikiImage;
  originalimage?: WikiImage;
  wikibase?: string;
}

export interface WikiSearchHit {
  title: string;
  snippet: string;
}

export interface WikiFact {
  label: string;
  value: string;
}

export interface Leader {
  name: string;
  office?: string;
  start: number;
  end?: number;
}

export interface DatedImage {
  file: string;
  start?: number;
  end?: number;
}

export interface WikiFacts {
  qid: string;
  description?: string;
  facts: WikiFact[];
  image?: string;
  /** Flags (P41) and coats of arms (P94), with the years they were in use when Wikidata says. */
  flags?: DatedImage[];
  arms?: DatedImage[];
  enwikiTitle?: string;
}

interface SummaryResponse {
  title?: string;
  extract?: string;
  description?: string;
  type?: string;
  content_urls?: { desktop?: { page?: string } };
  thumbnail?: WikiImage;
  originalimage?: WikiImage;
  wikibase_item?: string;
}

export interface WikidataClaim {
  rank?: string;
  mainsnak?: { datavalue?: { value?: unknown } };
  /** Qualifiers are bare snaks (they have `datavalue` directly, not a `mainsnak`). */
  qualifiers?: Record<string, { datavalue?: { value?: unknown } }[]>;
}

export interface SnakValue {
  id?: string;
  amount?: string;
  unit?: string;
  time?: string;
}

export interface WikidataEntity {
  missing?: string;
  labels?: Record<string, { value?: string }>;
  descriptions?: Record<string, { value?: string }>;
  claims?: Record<string, WikidataClaim[]>;
  sitelinks?: Record<string, { title?: string }>;
}

const summaryCache = new Map<string, WikiSummary | null>();
const searchCache = new Map<string, WikiSearchHit[]>();
const factsCache = new Map<string, WikiFacts | null>();
const leaderCache = new Map<string, Leader[]>();
const nf = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });

/** Convert a stored Wikipedia value (title or a full Wikipedia URL) to a title. */
export function wikiTitle(raw: string | undefined | null): string | null {
  if (!raw) return null;
  const value = raw.trim();
  if (!value) return null;

  const urlTitle = value.match(/(?:^|\/\/)[a-z-]+\.wikipedia\.org\/wiki\/(.+)$/i);
  if (urlTitle) {
    try {
      return decodeURIComponent(urlTitle[1]).replace(/_/g, ' ');
    } catch {
      return urlTitle[1].replace(/_/g, ' ');
    }
  }

  if (/^https?:\/\//i.test(value)) {
    try {
      const url = new URL(value);
      const match = url.pathname.match(/\/wiki\/(.+)$/);
      if (match) return decodeURIComponent(match[1]).replace(/_/g, ' ');
    } catch {
      /* not a usable URL */
    }
    return null;
  }

  return value;
}

export function wikiUrl(title: string): string {
  return `${WP}/wiki/${encodeURIComponent(title.trim().replace(/ /g, '_'))}`;
}

export function wikiSearchUrl(query: string): string {
  return `${WP}/w/index.php?search=${encodeURIComponent(query)}`;
}

export function commonsPageUrl(filename: string): string {
  return `${COMMONS}/wiki/File:${encodeURIComponent(filename.replace(/ /g, '_'))}`;
}

export function commonsFilePath(filename: string, width = 720): string {
  return `${COMMONS}/wiki/Special:FilePath/${encodeURIComponent(filename.replace(/ /g, '_'))}?width=${width}`;
}

/** The Commons (or enwiki) file page for an upload.wikimedia.org image URL. */
export function commonsPageForImage(src?: string): string | null {
  if (!src) return null;
  try {
    const url = new URL(src);
    const match = url.pathname.match(/\/(?:thumb\/)?[0-9a-f]\/[0-9a-f]{2}\/([^/]+)/);
    if (!match) return null;
    const filename = decodeURIComponent(match[1]).replace(/ /g, '_');
    if (url.pathname.includes('/wikipedia/commons/')) {
      return `${COMMONS}/wiki/File:${encodeURIComponent(filename)}`;
    }
    if (url.pathname.includes('/wikipedia/en/')) {
      return `${WP}/wiki/File:${encodeURIComponent(filename)}`;
    }
  } catch {
    /* not an upload URL */
  }
  return null;
}

export async function getJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, {
    signal,
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) throw new Error(`Request failed (${response.status})`);
  return (await response.json()) as T;
}

function stripHtml(html: string): string {
  if (!html) return '';
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return (doc.body.textContent ?? '').replace(/\s+/g, ' ').trim();
}

export function isAbort(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError';
}

/** A standard Wikipedia summary, or null for missing/disambiguation pages. */
export async function getSummary(
  title: string,
  signal?: AbortSignal,
): Promise<WikiSummary | null> {
  const key = title.trim().toLowerCase();
  if (!key) return null;
  if (summaryCache.has(key)) return summaryCache.get(key) ?? null;

  const url = `${WP_REST}/page/summary/${encodeURIComponent(title.trim().replace(/ /g, '_'))}`;
  let response: Response;
  try {
    response = await fetch(url, {
      signal,
      headers: { Accept: 'application/json' },
    });
  } catch (error) {
    if (isAbort(error)) throw error;
    return null;
  }

  if (response.status === 404) {
    summaryCache.set(key, null);
    return null;
  }
  if (!response.ok) throw new Error(`Wikipedia ${response.status}`);

  const data = (await response.json()) as SummaryResponse;
  const extract = (data.extract ?? '').trim();
  const type = data.type ?? 'standard';
  if (!extract || type === 'disambiguation' || type === 'no-extract') {
    summaryCache.set(key, null);
    return null;
  }

  const summary: WikiSummary = {
    title: data.title ?? title,
    extract,
    description: data.description,
    type,
    url: data.content_urls?.desktop?.page ?? wikiUrl(data.title ?? title),
    thumbnail: data.thumbnail,
    originalimage: data.originalimage,
    wikibase: data.wikibase_item,
  };
  summaryCache.set(key, summary);
  return summary;
}

/** Full-text search used when a polity has no dedicated article. */
export async function searchArticles(
  query: string,
  signal?: AbortSignal,
): Promise<WikiSearchHit[]> {
  const q = query.trim();
  if (!q) return [];
  const key = q.toLowerCase();
  const cached = searchCache.get(key);
  if (cached) return cached;

  const url = `${WP_API}?action=query&format=json&origin=*&list=search&srnamespace=0` +
    `&srlimit=4&srprop=snippet&srsearch=${encodeURIComponent(q)}`;

  try {
    const data = await getJson<{
      query?: { search?: { title?: string; snippet?: string }[] };
    }>(url, signal);
    const hits = (data.query?.search ?? [])
      .filter((hit) => hit.title)
      .map((hit) => ({
        title: hit.title as string,
        snippet: stripHtml(hit.snippet ?? ''),
      }));
    searchCache.set(key, hits);
    return hits;
  } catch (error) {
    if (isAbort(error)) throw error;
    return [];
  }
}

export function preferredClaims(
  claims: Record<string, WikidataClaim[]>,
  property: string,
): WikidataClaim[] {
  const all = claims[property] ?? [];
  const preferred = all.filter((claim) => claim.rank === 'preferred');
  return preferred.length ? preferred : all.filter((claim) => claim.rank !== 'deprecated');
}

/** The value of a claim's first qualifier for a property (for example P580 start time). */
export function qualifierValue(claim: WikidataClaim | undefined, property: string): SnakValue | undefined {
  const value = claim?.qualifiers?.[property]?.[0]?.datavalue?.value;
  return value && typeof value === 'object' ? (value as SnakValue) : undefined;
}

export function snakValue(claim: WikidataClaim | undefined): SnakValue | undefined {
  const value = claim?.mainsnak?.datavalue?.value;
  return value && typeof value === 'object' ? (value as SnakValue) : undefined;
}

function stringValue(claim: WikidataClaim | undefined): string | undefined {
  const value = claim?.mainsnak?.datavalue?.value;
  return typeof value === 'string' ? value : undefined;
}

function datedImages(claims: Record<string, WikidataClaim[]>, property: string): DatedImage[] {
  const result: DatedImage[] = [];
  for (const claim of (claims[property] ?? []).filter((item) => item.rank !== 'deprecated')) {
    const file = stringValue(claim);
    if (!file) continue;
    result.push({
      file,
      start: yearFromTime(qualifierValue(claim, 'P580')?.time) ?? undefined,
      end: yearFromTime(qualifierValue(claim, 'P582')?.time) ?? undefined,
    });
  }
  return result;
}

/** The image whose dates cover the year; otherwise the undated one, otherwise the nearest. */
export function imageAtYear(images: DatedImage[] | undefined, year: number): string | undefined {
  if (!images?.length) return undefined;
  const covering = images.filter(
    (item) => (item.start === undefined || item.start <= year) && (item.end === undefined || item.end >= year),
  );
  if (covering.length) {
    // The most specific (latest start) wins.
    return covering.sort((a, b) => (b.start ?? -Infinity) - (a.start ?? -Infinity))[0].file;
  }
  const distance = (item: DatedImage): number =>
    Math.min(Math.abs((item.start ?? year) - year), Math.abs((item.end ?? year) - year));
  return [...images].sort((a, b) => distance(a) - distance(b))[0].file;
}

function formatWikidataYear(time: string): string {
  const match = /^([+-])(\d{1,6})-/.exec(time);
  if (!match) return '';
  const year = Number.parseInt(match[2], 10) * (match[1] === '-' ? -1 : 1);
  if (year > 0) return `${year} CE`;
  return `${1 - year} BCE`;
}

/** Open, structured facts from Wikidata (CC0). */
export async function getWikidata(
  qid: string,
  signal?: AbortSignal,
): Promise<WikiFacts | null> {
  if (!/^Q\d+$/.test(qid)) return null;
  if (factsCache.has(qid)) return factsCache.get(qid) ?? null;

  const url = `${WD_API}?action=wbgetentities&format=json&origin=*&ids=${qid}` +
    '&props=claims%7Cdescriptions%7Csitelinks&languages=en&sitefilter=enwiki';

  let data: { entities?: Record<string, WikidataEntity> };
  try {
    data = await getJson(url, signal);
  } catch (error) {
    if (isAbort(error)) throw error;
    return null;
  }

  const entity = data.entities?.[qid];
  if (!entity || entity.missing !== undefined) {
    factsCache.set(qid, null);
    return null;
  }

  const claims = entity.claims ?? {};
  const ids = new Set<string>();
  for (const property of ['P31', 'P36', 'P37', 'P140', 'P122']) {
    for (const claim of preferredClaims(claims, property).slice(0, 4)) {
      const id = snakValue(claim)?.id;
      if (id && /^Q\d+$/.test(id)) ids.add(id);
    }
  }

  const labels = new Map<string, string>();
  if (ids.size) {
    const labelsUrl = `${WD_API}?action=wbgetentities&format=json&origin=*` +
      `&props=labels&languages=en&ids=${encodeURIComponent([...ids].join('|'))}`;
    try {
      const labelData = await getJson<{
        entities?: Record<string, { labels?: Record<string, { value?: string }> }>;
      }>(labelsUrl, signal);
      for (const [id, item] of Object.entries(labelData.entities ?? {})) {
        const label = item.labels?.en?.value ?? item.labels?.mul?.value;
        if (label) labels.set(id, label);
      }
    } catch (error) {
      if (isAbort(error)) throw error;
    }
  }

  const values = (property: string, max = 2): string => {
    const result: string[] = [];
    for (const claim of preferredClaims(claims, property)) {
      const id = snakValue(claim)?.id;
      if (!id) continue;
      const label = labels.get(id) ?? id;
      if (!result.includes(label)) result.push(label);
      if (result.length >= max) break;
    }
    return result.join(', ');
  };

  const facts: WikiFact[] = [];
  const add = (label: string, value: string): void => {
    if (value) facts.push({ label, value });
  };

  add('Type', values('P31'));
  add('Capital', values('P36'));
  add('Languages', values('P37'));
  add('Religion', values('P140'));
  add('Government', values('P122'));

  const areaValue = snakValue(preferredClaims(claims, 'P2046')[0]);
  if (areaValue?.amount) {
    const amount = Number.parseFloat(areaValue.amount);
    if (Number.isFinite(amount) && amount > 0) {
      let km2 = amount;
      if (areaValue.unit?.endsWith('Q253276')) km2 = amount / 1_000_000;
      else if (areaValue.unit?.endsWith('Q35852')) km2 = amount / 100;
      add('Area', `${nf.format(Math.round(km2))} km²`);
    }
  }

  const populationClaim = preferredClaims(claims, 'P1082')[0];
  const population = snakValue(populationClaim);
  if (population?.amount) {
    const amount = Number.parseFloat(population.amount);
    if (Number.isFinite(amount) && amount > 0) {
      const time = qualifierValue(populationClaim, 'P585')?.time;
      const year = time ? formatWikidataYear(time) : '';
      add('Population', `${nf.format(Math.round(amount))}${year ? ` (${year})` : ''}`);
    }
  }

  const result: WikiFacts = {
    qid,
    description: entity.descriptions?.en?.value,
    facts,
    image: stringValue(preferredClaims(claims, 'P18')[0]),
    flags: datedImages(claims, 'P41'),
    arms: datedImages(claims, 'P94'),
    enwikiTitle: entity.sitelinks?.enwiki?.title,
  };

  factsCache.set(qid, result);
  return result;
}

interface SparqlBinding {
  personLabel?: { value?: string };
  officeLabel?: { value?: string };
  start?: { value?: string };
  end?: { value?: string };
}

export function yearFromTime(time: string | undefined): number | null {
  if (!time) return null;
  const match = /^([+-]?)(\d{1,6})-/.exec(time);
  if (!match) return null;
  const value = Number.parseInt(match[2], 10);
  return match[1] === '-' ? -value : value;
}

export function leadersAtYear(leaders: Leader[], year: number): Leader[] {
  const active = leaders.filter((leader) => leader.start <= year);
  const dated = active.filter(
    (leader) => leader.end !== undefined && leader.end >= year,
  );
  let result = dated;

  // Missing end dates are common in historical Wikidata. Only show them when
  // no explicitly dated reign covers the year, and then only the latest one.
  if (!result.length) {
    const open = active.filter((leader) => leader.end === undefined);
    if (open.length) {
      const latest = Math.max(...open.map((leader) => leader.start));
      result = open.filter((leader) => leader.start === latest);
    }
  }

  return result
    .sort((a, b) => a.start - b.start || a.name.localeCompare(b.name))
    .slice(0, 6);
}

async function fetchLeadersForOffices(
  officeIds: string[],
  signal?: AbortSignal,
): Promise<Leader[]> {
  if (!officeIds.length) return [];
  const values = officeIds.map((id) => `wd:${id}`).join(' ');
  const query = `SELECT ?person ?personLabel ?officeLabel ?start ?end WHERE {
  VALUES ?office { ${values} }
  ?person p:P39 ?statement .
  ?statement ps:P39 ?office .
  OPTIONAL { ?statement pq:P580 ?start }
  OPTIONAL { ?statement pq:P582 ?end }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
} LIMIT 1000`;
  const url = 'https://query.wikidata.org/sparql?format=json&origin=*&query=' +
    encodeURIComponent(query);
  const data = await getJson<{
    results?: { bindings?: SparqlBinding[] };
  }>(url, signal);

  const leaders: Leader[] = [];
  for (const row of data.results?.bindings ?? []) {
    const name = row.personLabel?.value?.trim();
    const start = yearFromTime(row.start?.value);
    if (!name || /^Q\d+$/.test(name) || start === null) continue;
    leaders.push({
      name,
      office: row.officeLabel?.value?.trim() || undefined,
      start,
      end: yearFromTime(row.end?.value) ?? undefined,
    });
  }
  return leaders;
}

async function fetchDirectLeaders(
  claims: Record<string, WikidataClaim[]>,
  signal?: AbortSignal,
): Promise<Leader[]> {
  const candidates: { id: string; start: number; end?: number; office?: string }[] = [];
  for (const [property, office] of [
    ['P35', 'Head of state'],
    ['P6', 'Head of government'],
  ] as const) {
    for (const claim of preferredClaims(claims, property)) {
      const id = snakValue(claim)?.id;
      const start = yearFromTime(qualifierValue(claim, 'P580')?.time);
      if (!id || start === null) continue;
      candidates.push({
        id,
        start,
        end: yearFromTime(qualifierValue(claim, 'P582')?.time) ?? undefined,
        office,
      });
    }
  }
  if (!candidates.length) return [];

  const ids = [...new Set(candidates.map((candidate) => candidate.id))].slice(0, 50);
  const labels = new Map<string, string>();
  try {
    const url = `${WD_API}?action=wbgetentities&format=json&origin=*` +
      `&props=labels&languages=en&ids=${encodeURIComponent(ids.join('|'))}`;
    const data = await getJson<{
      entities?: Record<string, { labels?: Record<string, { value?: string }> }>;
    }>(url, signal);
    for (const [id, entity] of Object.entries(data.entities ?? {})) {
      const label = entity.labels?.en?.value ?? entity.labels?.mul?.value;
      if (label) labels.set(id, label);
    }
  } catch (error) {
    if (isAbort(error)) throw error;
  }

  return candidates
    .map((candidate) => ({
      name: labels.get(candidate.id) ?? candidate.id,
      office: candidate.office,
      start: candidate.start,
      end: candidate.end,
    }))
    .filter((leader) => !/^Q\d+$/.test(leader.name));
}

/**
 * Full ruler history for a polity. Uses Wikidata's head-of-state office
 * (P1906) plus dated officeholders (P39), with direct P35/P6 fallbacks for
 * polities whose current head-of-state statement is not modelled.
 */
export async function getLeaderHistory(
  qid: string,
  signal?: AbortSignal,
): Promise<Leader[]> {
  if (!/^Q\d+$/.test(qid)) return [];
  const cached = leaderCache.get(qid);
  if (cached) return cached;

  let leaders: Leader[] = [];
  try {
    const url = `${WD_API}?action=wbgetentities&format=json&origin=*&ids=${qid}&props=claims`;
    const data = await getJson<{
      entities?: Record<string, WikidataEntity>;
    }>(url, signal);
    const claims = data.entities?.[qid]?.claims ?? {};
    const offices = new Set<string>();
    for (const claim of preferredClaims(claims, 'P1906')) {
      const id = snakValue(claim)?.id;
      if (id && /^Q\d+$/.test(id)) offices.add(id);
    }

    if (offices.size) {
      try {
        leaders = await fetchLeadersForOffices([...offices], signal);
      } catch (error) {
        if (isAbort(error)) throw error;
      }
    }
    if (!leaders.length) {
      try {
        leaders = await fetchDirectLeaders(claims, signal);
      } catch (error) {
        if (isAbort(error)) throw error;
      }
    }

    const deduped = new Map<string, Leader>();
    for (const leader of leaders) {
      const key = `${leader.name}|${leader.office ?? ''}|${leader.start}`;
      const existing = deduped.get(key);
      if (!existing || (leader.end ?? Infinity) > (existing.end ?? Infinity)) {
        deduped.set(key, leader);
      }
    }
    leaders = [...deduped.values()].sort(
      (a, b) => a.start - b.start || a.name.localeCompare(b.name),
    );
    leaderCache.set(qid, leaders);
  } catch (error) {
    if (isAbort(error)) throw error;
    return [];
  }

  return leaders;
}

export async function getLeaders(
  qid: string,
  year: number,
  signal?: AbortSignal,
): Promise<Leader[]> {
  return leadersAtYear(await getLeaderHistory(qid, signal), year);
}


// ---- Article images (non-map) ---------------------------------------------------

const MAP_LIKE = /(^|[\s_(-])(map|maps|locator|location|distribution|extent|borders?|territor(y|ies)|ecoregions?|biomes?_map|wwf|realm|k[oö]ppen)[\s_.)-]|\.svg(\.png)?$|\.tiff?$|\.gif$|\.webm$|\.ogv$|icon|logo|symbol|stub|commons-|question_book|wiktionary|flag_of|coat_of_arms|diagram|chart|graph|climate/i;
const mediaCache = new Map<string, string | null>();

/** First real photograph in an article (maps, charts, icons and logos skipped). */
export async function getArticlePhoto(title: string, signal?: AbortSignal): Promise<string | null> {
  const key = title.trim().toLowerCase();
  if (mediaCache.has(key)) return mediaCache.get(key) ?? null;
  const url = `${WP_REST}/page/media-list/${encodeURIComponent(title.trim().replace(/ /g, '_'))}`;
  let data: { items?: { title?: string; type?: string; leadImage?: boolean }[] };
  try {
    data = await getJson(url, signal);
  } catch (error) {
    if (isAbort(error)) throw error;
    mediaCache.set(key, null);
    return null;
  }
  const items = (data.items ?? []).filter((item) => item.type === 'image' && item.title);
  const usable = items
    .map((item) => (item.title as string).replace(/^File:/i, ''))
    .filter((name) => /\.(jpe?g|png|webp)$/i.test(name) && !MAP_LIKE.test(name));
  const photo = usable[0] ?? null;
  mediaCache.set(key, photo);
  return photo;
}

/** True when a thumbnail's file name looks like a map, so it can be skipped. */
export function looksLikeMap(src: string | undefined): boolean {
  if (!src) return true;
  const last = src.split('?')[0].split('/').filter(Boolean).pop() ?? '';
  let name = last;
  try {
    name = decodeURIComponent(last);
  } catch {
    /* keep raw */
  }
  return MAP_LIKE.test(name);
}

// ---- Infobox --------------------------------------------------------------------

export interface InfoboxRow {
  label: Node | null;
  value: Node;
}

export interface InfoboxSection {
  title: string;
  rows: InfoboxRow[];
}

const infoboxCache = new Map<string, InfoboxSection[] | null>();
const SKIP_LABELS = /^(flag|coat of arms|motto|anthem|seal|image|map|logo)$/i;

/** Copy a cell into safe DOM: text, line breaks, and links into Wikipedia only. */
function cleanCell(cell: Element): DocumentFragment {
  const out = document.createDocumentFragment();
  const walk = (node: Node, target: Node): void => {
    if (node.nodeType === Node.TEXT_NODE) {
      target.appendChild(document.createTextNode(node.textContent ?? ''));
      return;
    }
    if (!(node instanceof Element)) return;
    const tag = node.tagName;
    if (['STYLE', 'SCRIPT', 'SUP', 'IMG', 'FIGURE', 'SVG'].includes(tag)) return;
    if (node.matches('.reference, .noprint, .mw-empty-elt, .nowrap-hidden, .navbar, [style*="display:none"]')) return;
    if (tag === 'BR') {
      target.appendChild(document.createElement('br'));
      return;
    }
    if (tag === 'A') {
      const href = node.getAttribute('href') ?? '';
      const anchor = document.createElement('a');
      if (/^\/wiki\/(?!(File|Special|Help|Category|Template|Wikipedia|Talk):)/i.test(href)) {
        anchor.href = `${WP}${href.split('#')[0]}`;
        anchor.target = '_blank';
        anchor.rel = 'noopener noreferrer';
        for (const child of node.childNodes) walk(child, anchor);
        if (anchor.textContent?.trim()) target.appendChild(anchor);
        return;
      }
      for (const child of node.childNodes) walk(child, target);
      return;
    }
    const block = tag === 'LI' || tag === 'DIV' || tag === 'P';
    if (block && target.lastChild && target.lastChild.nodeName !== 'BR') {
      target.appendChild(document.createElement('br'));
    }
    for (const child of node.childNodes) walk(child, target);
  };
  for (const child of cell.childNodes) walk(child, out);
  return out;
}

const cellText = (cell: Element): string =>
  (cell.textContent ?? '').replace(/\[[^\]]*\]/g, '').replace(/\s+/g, ' ').trim();

/**
 * The infobox of an article, as sections of label/value rows. Ruler lists and
 * "preceded by / succeeded by" rows come through as ordinary rows.
 */
export async function getInfobox(title: string, signal?: AbortSignal): Promise<InfoboxSection[] | null> {
  const key = title.trim().toLowerCase();
  if (!key) return null;
  if (infoboxCache.has(key)) return infoboxCache.get(key) ?? null;
  const url = `${WP_API}?action=parse&format=json&origin=*&redirects=1&prop=text&section=0` +
    `&disableeditsection=1&disablelimitreport=1&disabletoc=1&page=${encodeURIComponent(title.trim().replace(/ /g, '_'))}`;
  let html = '';
  try {
    const data = await getJson<{ parse?: { text?: { '*'?: string } | string } }>(url, signal);
    const text = data.parse?.text;
    html = typeof text === 'string' ? text : text?.['*'] ?? '';
  } catch (error) {
    if (isAbort(error)) throw error;
    return null;
  }
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const box = doc.querySelector('table.infobox');
  if (!box) {
    infoboxCache.set(key, null);
    return null;
  }

  const sections: InfoboxSection[] = [];
  let current: InfoboxSection = { title: '', rows: [] };
  const flush = (): void => {
    if (current.rows.length) sections.push(current);
  };
  for (const row of box.querySelectorAll(':scope > tbody > tr, :scope > tr')) {
    const th = row.querySelector(':scope > th');
    const td = row.querySelector(':scope > td');
    if (th && !td) {
      const text = cellText(th);
      if (!text || row.querySelector('.infobox-title')) continue;
      flush();
      current = { title: text, rows: [] };
      continue;
    }
    if (th && td) {
      const label = cellText(th);
      if (SKIP_LABELS.test(label)) continue;
      const value = cleanCell(td);
      if (!value.textContent?.trim()) continue;
      current.rows.push({ label: cleanCell(th), value });
      continue;
    }
    if (td && !th) {
      // Full-width cell: a header block or a note; keep text-only ones.
      if (td.querySelector('img, .infobox-image, .locmap, .ib-settlement-map')) continue;
      const value = cleanCell(td);
      if (value.textContent && value.textContent.trim().length > 1) current.rows.push({ label: null, value });
    }
  }
  flush();

  const result = sections.length ? sections.slice(0, 24) : null;
  infoboxCache.set(key, result);
  return result;
}

// ---- Administrative subdivisions -------------------------------------------------

export interface Subdivision {
  name: string;
  title: string;
  start?: number;
  end?: number;
  lng?: number;
  lat?: number;
}

const subdivisionCache = new Map<string, Subdivision[]>();

/** Subdivisions (P150) of a polity that have English Wikipedia articles. */
export async function getSubdivisions(qid: string, signal?: AbortSignal): Promise<Subdivision[]> {
  if (!/^Q\d+$/.test(qid)) return [];
  const cached = subdivisionCache.get(qid);
  if (cached) return cached;
  const query = `SELECT ?sub ?subLabel ?start ?end ?coord ?article WHERE {
  wd:${qid} p:P150 ?st .
  ?st ps:P150 ?sub .
  ?article schema:about ?sub ; schema:isPartOf <https://en.wikipedia.org/> .
  OPTIONAL { ?st pq:P580 ?start }
  OPTIONAL { ?st pq:P582 ?end }
  OPTIONAL { ?sub wdt:P625 ?coord }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
} LIMIT 400`;
  const url = 'https://query.wikidata.org/sparql?format=json&origin=*&query=' + encodeURIComponent(query);
  let data: { results?: { bindings?: Record<string, { value?: string } | undefined>[] } };
  try {
    data = await getJson(url, signal);
  } catch (error) {
    if (isAbort(error)) throw error;
    return [];
  }
  const seen = new Map<string, Subdivision>();
  for (const row of data.results?.bindings ?? []) {
    const name = row.subLabel?.value?.trim();
    const article = row.article?.value;
    if (!name || !article || /^Q\d+$/.test(name)) continue;
    const title = decodeURIComponent(article.split('/wiki/')[1] ?? '').replace(/_/g, ' ');
    if (!title) continue;
    const point = /Point\(([-\d.eE+]+) ([-\d.eE+]+)\)/.exec(row.coord?.value ?? '');
    const item: Subdivision = {
      name,
      title,
      start: yearFromTime(row.start?.value) ?? undefined,
      end: yearFromTime(row.end?.value) ?? undefined,
      lng: point ? Number.parseFloat(point[1]) : undefined,
      lat: point ? Number.parseFloat(point[2]) : undefined,
    };
    const existing = seen.get(title);
    if (!existing) seen.set(title, item);
  }
  const list = [...seen.values()].sort((a, b) => a.name.localeCompare(b.name));
  subdivisionCache.set(qid, list);
  return list;
}

export function subdivisionsAtYear(list: Subdivision[], year: number): Subdivision[] {
  return list.filter(
    (item) => (item.start === undefined || item.start <= year) && (item.end === undefined || item.end >= year),
  );
}
