/**
 * Puts the Wikipedia infobox into the same order for every polity.
 *
 * An article's infobox lists rows in whatever order its editors chose. Here every row is
 * classified by its label (and the section it sits in):
 *   - rows that match a stat-sheet row (capital, government, population...) become fallback
 *     values for that row, used when Wikidata and the World Bank have nothing;
 *   - dated rows ("Population  • 117 CE  56,800,000") keep their year, so the one nearest the
 *     slider year can be chosen;
 *   - everything else is sorted into fixed groups, in a fixed order.
 */
import type { InfoboxRow, InfoboxSection } from './wiki';

export type RowKey =
  | 'government' | 'capital' | 'existed' | 'population' | 'languages' | 'religion'
  | 'area' | 'economy' | 'currency' | 'army' | 'before' | 'after';

export interface Candidate {
  text: string;
  year?: number;
}

export const GROUP_ORDER = [
  'Government and rulers', 'Dates and events', 'Geography', 'People', 'Economy', 'Military', 'Reference',
] as const;
export type GroupName = (typeof GROUP_ORDER)[number];

export interface ExtraRow {
  group: GroupName;
  label: string;
  value: Node;
}

export interface OrganisedInfobox {
  /** Candidate values per stat-sheet row, in the article's own words. */
  mapped: Partial<Record<RowKey, Candidate[]>>;
  /** Rows not used by the sheet, grouped in a fixed order. */
  extras: ExtraRow[];
}

/** Plain text of a cell, with line breaks as separators and footnote marks removed. */
export function nodeText(node: Node): string {
  const parts: string[] = [];
  const walk = (n: Node): void => {
    if (n.nodeType === Node.TEXT_NODE) parts.push(n.textContent ?? '');
    else if (n.nodeName === 'BR') parts.push(' · ');
    else n.childNodes.forEach(walk);
  };
  walk(node);
  return parts.join('').replace(/\[[^\]]*\]/g, '').replace(/\s+/g, ' ').replace(/(?: · )+/g, ' · ').replace(/^ · | · $/g, '').trim();
}

/** A year in a label or value: "117 CE", "c. 150", "1500", "27 BC". */
export function yearIn(text: string): number | undefined {
  const m = /(?:^|[^\d])(\d{1,4})\s*(BCE|BC|CE|AD)?(?!\d)/i.exec(text);
  if (!m) return undefined;
  const n = Number.parseInt(m[1], 10);
  if (!Number.isFinite(n)) return undefined;
  const era = (m[2] ?? '').toUpperCase();
  // Bare numbers under 100 are not years (counts, percentages) unless an era is given.
  if (!era && n < 100) return undefined;
  return era === 'BCE' || era === 'BC' ? -n : n;
}

const RULES: [RowKey, RegExp][] = [
  ['government', /^(government|government type|form of government|political system|status)\b/i],
  ['capital', /^capital\b|^seat\b/i],
  ['population', /^(total )?population\b|^census\b/i],
  ['area', /^(total )?area\b|^land area\b/i],
  ['languages', /\blanguages?\b/i],
  ['religion', /^(official |state |common )?religions?\b/i],
  ['currency', /^currency\b/i],
  ['economy', /^gdp\b|^gdp \(|\bgross domestic\b/i],
  ['army', /^(active personnel|armed forces|army|military|standing army|strength|troops)\b/i],
  ['before', /^(preceded|predecessor|replaces)\b/i],
  ['after', /^(succeeded|successor|replaced by)\b/i],
  ['existed', /^(established|founded|formation|dissolved|existed)\b/i],
];

const SECTION_RULES: [RowKey, RegExp][] = [
  ['population', /^population\b/i],
  ['area', /^area\b/i],
  ['economy', /^gdp\b/i],
  ['army', /^(armed forces|military)\b/i],
  ['before', /^preceded by\b/i],
  ['after', /^succeeded by\b/i],
  ['languages', /^languages?\b/i],
];

const GROUP_RULES: [GroupName, RegExp][] = [
  ['Government and rulers', /leader|monarch|king|queen|emperor|president|prime minister|chancellor|sultan|caliph|tsar|shah|regent|governor|viceroy|head of|executive|legislat|parliament|senate|assembly|house|council|constitution|dynasty|ruler|chief|status|government/i],
  ['Dates and events', /established|founded|formation|dissol|independ|event|history|declared|conquest|treaty|annex|abolish|reign|period|era|from|until|ended|began/i],
  ['Geography', /area|territor|located|location|coordinates|today part|modern|extent|border|region|continent|elevation|water|coast/i],
  ['People', /population|density|ethnic|demonym|language|religion|official|common|literacy|life expectancy/i],
  ['Economy', /gdp|currency|hdi|gini|income|economy|trade|per capita|unit of account/i],
  ['Military', /army|navy|air force|military|armed|forces|personnel|war|battle|conflict|strength|troops|fleet/i],
];

function groupFor(label: string, section: string): GroupName {
  const text = `${section} ${label}`;
  for (const [group, rule] of GROUP_RULES) if (rule.test(label)) return group;
  for (const [group, rule] of GROUP_RULES) if (rule.test(text)) return group;
  return 'Reference';
}

function push(mapped: OrganisedInfobox['mapped'], key: RowKey, c: Candidate): void {
  (mapped[key] ??= []).push(c);
}

export function organiseInfobox(sections: InfoboxSection[] | null): OrganisedInfobox {
  const out: OrganisedInfobox = { mapped: {}, extras: [] };
  if (!sections) return out;
  const clip = (t: string): string => (t.length > 200 ? `${t.slice(0, 197).trimEnd()}…` : t);

  for (const section of sections) {
    const sectionKey = SECTION_RULES.find(([, rule]) => rule.test(section.title))?.[0];
    section.rows.forEach((row: InfoboxRow) => {
      const label = row.label ? nodeText(row.label) : '';
      const text = clip(nodeText(row.value));
      if (!text) return;
      // Rows under a "Population" or "Area" heading: the label is the year.
      if (sectionKey && (!label || /^[•·\-–\s]*(c\.?|circa|est\.?)?\s*[\d,]+/i.test(label) || yearIn(label) !== undefined)) {
        push(out.mapped, sectionKey, { text, year: yearIn(label) ?? yearIn(text) });
        return;
      }
      const key = RULES.find(([, rule]) => rule.test(label))?.[0];
      if (key) {
        push(out.mapped, key, { text, year: key === 'population' || key === 'area' || key === 'economy' ? yearIn(text) ?? yearIn(label) : undefined });
        return;
      }
      if (!label) {
        out.extras.push({ group: groupFor('', section.title), label: section.title || 'Note', value: row.value });
        return;
      }
      out.extras.push({ group: groupFor(label, section.title), label, value: row.value });
    });
  }
  // Fixed group order; inside a group keep the article's order.
  out.extras.sort((a, b) => GROUP_ORDER.indexOf(a.group) - GROUP_ORDER.indexOf(b.group));
  return out;
}

/** The candidate whose year is nearest the slider year (undated candidates last). */
export function bestCandidate(list: Candidate[] | undefined, year: number): { c: Candidate; distance: number } | null {
  if (!list?.length) return null;
  let best: { c: Candidate; distance: number } | null = null;
  for (const c of list) {
    const distance = c.year === undefined ? Infinity : Math.abs(c.year - year);
    if (!best || distance < best.distance) best = { c, distance };
  }
  return best;
}
