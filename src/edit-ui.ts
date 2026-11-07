/**
 * Edit mode panel: the world (branch) bar and the inspector for the selected polity.
 * Map drawing is done by the host (main.ts); this file owns the branch state and the form.
 */
import {
  type Branch, type Override, type RecordLike,
  MAX_YEAR, MIN_YEAR,
  cleanOverride, deleteBranch, exportBranch, getCurrentId, importBranch, ImportError, listBranches,
  missingKeys, newBranch, persistent, recordKey, saveBranch, setCurrentId,
} from './edit';

export interface RealRecord extends RecordLike {
  k: number;
  c: string;
}

export interface EditHost {
  records(): (RealRecord | undefined)[];
  /** Draw the branch: overrides keyed by the real record's index. */
  apply(ops: Map<number, Override>): Promise<number>;
  year(): number;
  fmtYear(year: number): string;
  setActive(on: boolean): void;
  isPolityLens(): boolean;
  highlight(k: number | null): void;
}

const $ = <T extends HTMLElement>(id: string): T => document.getElementById(id) as T;

export function initEditUi(host: EditHost): { toggle(): void; select(p: RealRecord | null): void } {
  const panel = $('edit');
  const body = $('edit-body');
  const tag = $('alt-tag');
  const select = $<HTMLSelectElement>('edit-branch');
  const status = $('edit-status');
  const sel = $('edit-sel');
  const form = $<HTMLFormElement>('edit-form');
  const fName = $<HTMLInputElement>('edit-name');
  const fColour = $<HTMLInputElement>('edit-colour');
  const fFrom = $<HTMLInputElement>('edit-from');
  const fTo = $<HTMLInputElement>('edit-to');
  const fHide = $<HTMLInputElement>('edit-hide');
  const file = $<HTMLInputElement>('edit-file');

  const records = host.records();
  const keyToK = new Map<string, number>();
  records.forEach((r, k) => { if (r) keyToK.set(recordKey(r), k); });
  const knownKeys = new Set(keyToK.keys());
  const baseVersion = `${records.length}`;

  let branches: Branch[] = [];
  let current: Branch | null = null;
  let selected: RealRecord | null = null;
  let open = false;

  const say = (text: string): void => { status.textContent = text; };

  /** Overrides of the current branch as {record index: override}, dropping keys that no longer exist. */
  function opsByIndex(): Map<number, Override> {
    const out = new Map<number, Override>();
    if (!current) return out;
    for (const [key, o] of Object.entries(current.ops)) {
      const k = keyToK.get(key);
      if (k !== undefined) out.set(k, o);
    }
    return out;
  }

  function redraw(): void {
    void host.apply(opsByIndex()).then((failed) => {
      if (failed) say(`${failed} changed shape(s) could not be loaded just now, so the real polity is shown instead. Check your connection.`);
    });
    const count = current ? Object.keys(current.ops).length : 0;
    tag.hidden = !current || open;
    tag.textContent = current ? `Alt-history: ${current.name}${count ? ` · ${count} edit${count === 1 ? '' : 's'}` : ''}` : '';
    $('edit-btn').classList.toggle('on-branch', !!current);
  }

  function fillSelect(): void {
    select.replaceChildren();
    const real = document.createElement('option');
    real.value = '';
    real.textContent = 'Real history (no edits)';
    select.append(real);
    for (const b of branches.slice().sort((a, c) => c.updated - a.updated)) {
      const option = document.createElement('option');
      option.value = b.id;
      option.textContent = b.name;
      select.append(option);
    }
    select.value = current?.id ?? '';
    for (const id of ['edit-rename', 'edit-copy', 'edit-delete', 'edit-export']) $<HTMLButtonElement>(id).disabled = !current;
  }

  function describe(): void {
    if (!current) {
      say('Showing the real map. Choose New to start your own world; the real data is never changed.');
    } else {
      const lost = missingKeys(current, knownKeys).length;
      const parts = [`${Object.keys(current.ops).length} edit(s) in this world.`];
      if (!persistent) parts.push('This browser blocks storage, so the world is kept only until you close the page. Export it to keep it.');
      if (lost) parts.push(`${lost} edit(s) point at records the map no longer has and are ignored.`);
      say(parts.join(' '));
    }
  }

  function showSelection(): void {
    form.hidden = !selected;
    if (!selected) {
      sel.textContent = host.isPolityLens()
        ? 'Click a polity on the map to edit it.'
        : 'This first version edits polities. Switch to the Polities lens to select one.';
      return;
    }
    const o = current?.ops[recordKey(selected)];
    sel.textContent = `${o?.name ?? selected.n} · real record: ${selected.n}, ${host.fmtYear(selected.s)} – ${host.fmtYear(selected.e)}`;
    fName.value = o?.name ?? selected.n;
    fColour.value = o?.colour ?? selected.c;
    fFrom.value = String(o?.from ?? selected.s);
    fTo.value = String(o?.to ?? selected.e);
    fHide.checked = !!o?.hide;
    $<HTMLButtonElement>('edit-reset').disabled = !o;
  }

  async function choose(next: Branch | null): Promise<void> {
    current = next;
    setCurrentId(next?.id ?? null);
    fillSelect();
    describe();
    showSelection();
    redraw();
  }

  async function addBranch(branch: Branch): Promise<void> {
    branches.push(branch);
    await saveBranch(branch);
    await choose(branch);
  }

  async function ensureBranch(): Promise<Branch> {
    if (current) return current;
    const branch = newBranch('My alt-history', baseVersion);
    await addBranch(branch);
    return branch;
  }

  async function persist(): Promise<void> {
    if (!current) return;
    current.baseVersion = baseVersion;
    await saveBranch(current);
    fillSelect();
    describe();
    redraw();
  }

  // ---- branch buttons
  select.addEventListener('change', () => { void choose(branches.find((b) => b.id === select.value) ?? null); });
  $('edit-new').addEventListener('click', () => {
    const name = window.prompt('Name your new world:', 'My alt-history');
    if (name) void addBranch(newBranch(name, baseVersion));
  });
  $('edit-copy').addEventListener('click', () => {
    if (!current) return;
    const name = window.prompt('Name the copy:', `${current.name} (copy)`);
    if (name) void addBranch(newBranch(name, baseVersion, current));
  });
  $('edit-rename').addEventListener('click', () => {
    if (!current) return;
    const name = window.prompt('Rename this world:', current.name);
    if (name?.trim()) { current.name = name.trim().slice(0, 80); void persist(); }
  });
  $('edit-delete').addEventListener('click', () => {
    if (!current || !window.confirm(`Delete "${current.name}"? This cannot be undone (export it first to keep a copy).`)) return;
    const gone = current;
    branches = branches.filter((b) => b.id !== gone.id);
    void deleteBranch(gone.id).then(() => choose(null));
  });
  $('edit-export').addEventListener('click', () => {
    if (!current) return;
    const blob = new Blob([exportBranch(current)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${current.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'world'}.uob-branch.json`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 4000);
  });
  $('edit-import').addEventListener('click', () => file.click());
  file.addEventListener('change', () => {
    const chosen = file.files?.[0];
    file.value = '';
    if (!chosen) return;
    void chosen.text().then(async (text) => {
      try {
        await addBranch(importBranch(text, baseVersion));
      } catch (error) {
        say(error instanceof ImportError ? error.message : 'Could not read that file.');
      }
    });
  });

  // ---- inspector
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!selected) return;
    const real = selected;
    const from = Number.parseInt(fFrom.value, 10);
    const to = Number.parseInt(fTo.value, 10);
    if (![from, to].every((v) => Number.isFinite(v) && v >= MIN_YEAR && v <= MAX_YEAR)) {
      say(`Years must be whole numbers from ${MIN_YEAR} (3400 BCE) to ${MAX_YEAR}. Negative means BCE.`);
      return;
    }
    if (from > to) {
      say('"From" must not be later than "To".');
      return;
    }
    const clean = cleanOverride({ name: fName.value, colour: fColour.value, from, to, hide: fHide.checked }, real);
    void ensureBranch().then(async (branch) => {
      const key = recordKey(real);
      if (clean) branch.ops[key] = clean;
      else delete branch.ops[key];
      await persist();
      showSelection();
    });
  });
  $('edit-reset').addEventListener('click', () => {
    if (!selected || !current) return;
    delete current.ops[recordKey(selected)];
    void persist().then(showSelection);
  });

  // ---- open / close
  const setOpen = (on: boolean): void => {
    open = on;
    panel.hidden = !on;
    $('edit-btn').setAttribute('aria-pressed', String(on));
    host.setActive(on);
    if (!on) { selected = null; host.highlight(null); }
    showSelection();
    redraw();
  };
  $('edit-close').addEventListener('click', () => setOpen(false));
  $('edit-min').addEventListener('click', () => {
    body.hidden = !body.hidden;
    $('edit-min').textContent = body.hidden ? '+' : '–';
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && open && !(event.target instanceof HTMLInputElement)) setOpen(false);
  });

  void listBranches().then((all) => {
    branches = all;
    const remembered = getCurrentId();
    current = all.find((b) => b.id === remembered) ?? null;
    fillSelect();
    describe();
    showSelection();
    redraw();
  });

  return {
    toggle: () => setOpen(!open),
    select: (p) => { selected = p; showSelection(); },
  };
}
