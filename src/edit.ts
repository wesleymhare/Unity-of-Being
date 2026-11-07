/**
 * Edit mode, phase 1: alt-history branches kept in the browser (docs/PLAN-EDIT-MODE.md).
 *
 * A branch never changes the real data. It is a small list of overrides, one per real polity record,
 * applied on top when drawing: rename, recolour, change the years, or hide. This file holds the
 * data model, validation, import/export and storage; it knows nothing about the map.
 */

/** Overrides for one real polity record. Absent fields mean "as in the real data". */
export interface Override {
  name?: string;
  colour?: string;
  from?: number;
  to?: number;
  hide?: boolean;
}

export interface Branch {
  id: string;
  name: string;
  created: number;
  updated: number;
  /** The branch this was duplicated from, if any. */
  parent?: string;
  /** Size of the real polity data when the branch was last saved, to warn after a rebuild. */
  baseVersion: string;
  /** Overrides keyed by `recordKey` (name, start and end of the real record). */
  ops: Record<string, Override>;
}

export const FORMAT = 'unity-of-being-branch';
export const FORMAT_VERSION = 1;
export const MAX_OPS = 5000;
export const MAX_NAME = 80;
export const MIN_YEAR = -3400;
export const MAX_YEAR = 2026;

export interface RecordLike {
  n: string;
  s: number;
  e: number;
}

/** Stable name of a real polity record; it survives rebuilds that keep the record's name and years. */
export const recordKey = (p: RecordLike): string => `${p.n}|${p.s}|${p.e}`;

const COLOUR = /^#[0-9a-f]{6}$/i;

export const isEmptyOverride = (o: Override): boolean =>
  o.name === undefined && o.colour === undefined && o.from === undefined && o.to === undefined && !o.hide;

/** A clean copy of an override with only valid fields, or null when nothing is left. */
export function cleanOverride(input: unknown, real?: RecordLike): Override | null {
  if (typeof input !== 'object' || input === null) return null;
  const raw = input as Record<string, unknown>;
  const out: Override = {};
  if (typeof raw.name === 'string') {
    const name = raw.name.replace(/\s+/g, ' ').trim().slice(0, MAX_NAME);
    if (name && (!real || name !== real.n)) out.name = name;
  }
  if (typeof raw.colour === 'string' && COLOUR.test(raw.colour)) out.colour = raw.colour.toLowerCase();
  const year = (v: unknown): number | undefined =>
    typeof v === 'number' && Number.isFinite(v) ? Math.min(MAX_YEAR, Math.max(MIN_YEAR, Math.round(v))) : undefined;
  const from = year(raw.from);
  const to = year(raw.to);
  if (from !== undefined && (!real || from !== real.s)) out.from = from;
  if (to !== undefined && (!real || to !== real.e)) out.to = to;
  if (raw.hide === true) out.hide = true;
  return isEmptyOverride(out) ? null : out;
}

/** The years a record covers once overrides are applied (swapped if the user entered them backwards). */
export function effectiveYears(real: RecordLike, o: Override | undefined): { s: number; e: number } {
  const s = o?.from ?? real.s;
  const e = o?.to ?? real.e;
  return s <= e ? { s, e } : { s: e, e: s };
}

export function newBranch(name: string, baseVersion: string, parent?: Branch): Branch {
  const now = Date.now();
  return {
    id: `b${now.toString(36)}${Math.random().toString(36).slice(2, 7)}`,
    name: name.trim().slice(0, MAX_NAME) || 'Untitled world',
    created: now,
    updated: now,
    parent: parent?.id,
    baseVersion,
    ops: parent ? structuredClone(parent.ops) : {},
  };
}

/** How many overrides point at records that no longer exist in the real data. */
export function missingKeys(branch: Branch, known: Set<string>): string[] {
  return Object.keys(branch.ops).filter((key) => !known.has(key));
}

// ---- Export and import ----------------------------------------------------------------------

export function exportBranch(branch: Branch): string {
  return JSON.stringify({ format: FORMAT, version: FORMAT_VERSION, branch }, null, 1);
}

export class ImportError extends Error {}

/** Validate a file's text and return a new branch with a fresh id. Throws ImportError with a plain message. */
export function importBranch(text: string, baseVersion: string): Branch {
  if (text.length > 5_000_000) throw new ImportError('That file is too large to be a branch.');
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new ImportError('That file is not valid JSON.');
  }
  const file = data as { format?: unknown; version?: unknown; branch?: unknown } | null;
  if (!file || file.format !== FORMAT) throw new ImportError('That is not a Unity of Being branch file.');
  if (typeof file.version !== 'number' || file.version > FORMAT_VERSION) {
    throw new ImportError('That branch was saved by a newer version of the site.');
  }
  const src = file.branch as { name?: unknown; ops?: unknown; baseVersion?: unknown } | null;
  if (!src || typeof src !== 'object' || typeof src.ops !== 'object' || src.ops === null) {
    throw new ImportError('The branch in that file is damaged.');
  }
  const entries = Object.entries(src.ops as Record<string, unknown>);
  if (entries.length > MAX_OPS) throw new ImportError(`That branch has more than ${MAX_OPS} edits.`);
  const branch = newBranch(typeof src.name === 'string' ? src.name : 'Imported world', baseVersion);
  if (typeof src.baseVersion === 'string') branch.baseVersion = src.baseVersion.slice(0, 40);
  for (const [key, value] of entries) {
    if (typeof key !== 'string' || key.length > 200 || key === '__proto__') continue;
    const clean = cleanOverride(value);
    if (clean) branch.ops[key] = clean;
  }
  return branch;
}

// ---- Storage (IndexedDB, falling back to memory when the browser blocks it) ------------------

const DB_NAME = 'unity-of-being-edit';
const STORE = 'branches';
const CURRENT_KEY = 'uob-edit-current';
const memory = new Map<string, Branch>();
let dbPromise: Promise<IDBDatabase | null> | null = null;

function openDb(): Promise<IDBDatabase | null> {
  dbPromise ??= new Promise((resolve) => {
    try {
      const request = indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = () => request.result.createObjectStore(STORE, { keyPath: 'id' });
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
      request.onblocked = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
  return dbPromise;
}

function run<T>(db: IDBDatabase, mode: IDBTransactionMode, work: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    const request = work(db.transaction(STORE, mode).objectStore(STORE));
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/** True when branches survive a reload (IndexedDB works); false when they only last this visit. */
export let persistent = true;

export async function listBranches(): Promise<Branch[]> {
  const db = await openDb();
  if (!db) {
    persistent = false;
    return [...memory.values()];
  }
  try {
    return await run<Branch[]>(db, 'readonly', (store) => store.getAll());
  } catch {
    persistent = false;
    return [...memory.values()];
  }
}

export async function saveBranch(branch: Branch): Promise<void> {
  branch.updated = Date.now();
  memory.set(branch.id, branch);
  const db = await openDb();
  if (!db) {
    persistent = false;
    return;
  }
  try {
    await run(db, 'readwrite', (store) => store.put(branch));
  } catch {
    persistent = false;
  }
}

export async function deleteBranch(id: string): Promise<void> {
  memory.delete(id);
  const db = await openDb();
  if (!db) return;
  try {
    await run(db, 'readwrite', (store) => store.delete(id));
  } catch {
    persistent = false;
  }
}

export function getCurrentId(): string | null {
  try {
    return localStorage.getItem(CURRENT_KEY);
  } catch {
    return null;
  }
}

export function setCurrentId(id: string | null): void {
  try {
    if (id) localStorage.setItem(CURRENT_KEY, id);
    else localStorage.removeItem(CURRENT_KEY);
  } catch {
    // storage blocked: the choice just is not remembered
  }
}
