/**
 * Edit mode toolbar: the world (branch) bar along the top of the map and the inspector for the
 * selected polity or province. Map drawing is done by the host (main.ts); this file owns the
 * branch state and the form.
 */
import {
  type Branch, type Override,
  MAX_YEAR, MIN_YEAR,
  cleanOverride, deleteBranch, exportBranch, getCurrentId, importBranch, ImportError, listBranches,
  missingKeys, newBranch, persistent, saveBranch, setCurrentId,
} from './edit';

/** A real record the user can edit: a polity, or a province (administrative subdivision) of one. */
export interface RealRecord {
  k: number;
  n: string;
  s: number;
  e: number;
  c: string;
  /** Provinces only: the name of the polity they belong to. */
  parent?: string;
}

export interface EditHost {
  /** Edit key of every real record -> its index k. */
  index(): Map<string, number>;
  keyOf(k: number): string | undefined;
  real(k: number): RealRecord | undefined;
  /** Provinces of a polity record. */
  provincesOf(k: number): RealRecord[];
  /** The polity record a province belongs to, if it can be found. */
  parentOf(k: number): number | undefined;
  /** Draw the branch: overrides keyed by the real record's index. Resolves to the number of shapes that could not be loaded. */
  apply(ops: Map<number, Override>): Promise<number>;
  fmtYear(year: number): string;
  setActive(on: boolean): void;
  isPolityLens(): boolean;
  highlight(k: number | null): void;
}

const $ = <T extends HTMLElement>(id: string): T => document.getElementById(id) as T;

export function initEditUi(host: EditHost): { toggle(): void; select(k: number | null): void } {
  const panel = $('edit');
  const tag = $('alt-tag');
  const select = $<HTMLSelectElement>('edit-branch');
  const status = $('edit-status');
  const selText = $('edit-sel');
  const selKind = $('edit-kind');
  const form = $<HTMLFormElement>('edit-form');
  const menu = $('edit-menu');
  const fName = $<HTMLInputElement>('edit-name');
  const fColour = $<HTMLInputElement>('edit-colour');
  const fFrom = $<HTMLInputElement>('edit-from');
  const fTo = $<HTMLInputElement>('edit-to');
  const fHide = $<HTMLInputElement>('edit-hide');
  const fSplit = $<HTMLButtonElement>('edit-split');
  const chips = $('edit-provs');
  const scope = $('edit-scope');
  const file = $<HTMLInputElement>('edit-file');

  const keyToK = host.index();
  const knownKeys = new Set(keyToK.keys());
  const baseVersion = `${keyToK.size}`;

  let branches: Branch[] = [];
  let current: Branch | null = null;
  let selected: RealRecord | null = null;
  let open = false;

  const say = (text: string): void => { status.textContent = text; status.hidden = !text; };

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
      if (failed) say(`${failed} changed shape(s) could not be loaded just now, so the real map is shown there. Check your connection.`);
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
      say('Showing the real map. Choose ⋯ then New to start your own world; the real data is never changed.');
      return;
    }
    const parts: string[] = [];
    const lost = missingKeys(current, knownKeys).length;
    if (!persistent) parts.push('This browser blocks storage, so the world lasts only until you close the page. Export it to keep it.');
    if (lost) parts.push(`${lost} edit(s) point at records the map no longer has and are ignored.`);
    say(parts.join(' '));
  }

  const overrideOf = (k: number): Override | undefined => {
    const key = host.keyOf(k);
    return key && current ? current.ops[key] : undefined;
  };

  function showSelection(): void {
    form.hidden = !selected;
    if (!selected) {
      selKind.textContent = '';
      selText.textContent = host.isPolityLens()
        ? 'Tap a polity on the map. Zoom in to tap one of its provinces.'
        : 'Switch to the Polities lens to select something to edit.';
      return;
    }
    const isProvince = selected.parent !== undefined;
    const o = overrideOf(selected.k);
    selKind.textContent = isProvince ? 'Province' : 'Polity';
    selKind.className = `edit-kind ${isProvince ? 'prov' : 'pol'}`;
    selText.textContent = `${o?.name ?? selected.n} · ${host.fmtYear(selected.s)} – ${host.fmtYear(selected.e)}`;
    scope.textContent = isProvince
      ? `Province of ${selected.parent}. This changes only this province; the polity itself is not touched.`
      : 'This changes the whole polity record. Its provinces keep their own separate edits.';
    fName.value = o?.name ?? selected.n;
    fColour.value = o?.colour ?? selected.c;
    fFrom.value = String(o?.from ?? selected.s);
    fTo.value = String(o?.to ?? selected.e);
    fHide.checked = !!o?.hide;
    $<HTMLButtonElement>('edit-reset').disabled = !o;

    // Provinces: chips to open each one, and the split button.
    chips.replaceChildren();
    fSplit.hidden = true;
    if (!isProvince) {
      const provs = host.provincesOf(selected.k);
      if (provs.length) {
        fSplit.hidden = false;
        fSplit.textContent = o?.split ? `Undo split (${provs.length} provinces)` : `Split into ${provs.length} provinces`;
        fSplit.setAttribute('aria-pressed', String(!!o?.split));
        for (const prov of provs.slice(0, 40)) {
          const chip = document.createElement('button');
          chip.type = 'button';
          chip.className = 'edit-chip';
          chip.textContent = prov.n;
          chip.addEventListener('click', () => api.select(prov.k));
          chips.append(chip);
        }
      }
    } else {
      const parent = host.parentOf(selected.k);
      if (parent !== undefined) {
        const back = document.createElement('button');
        back.type = 'button';
        back.className = 'edit-chip';
        back.textContent = `← ${selected.parent}`;
        back.addEventListener('click', () => api.select(parent));
        chips.append(back);
      }
    }
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

  // ---- branch buttons (in the ⋯ menu)
  const closeMenu = (): void => { menu.hidden = true; $('edit-menu-btn').setAttribute('aria-expanded', 'false'); };
  $('edit-menu-btn').addEventListener('click', () => {
    menu.hidden = !menu.hidden;
    $('edit-menu-btn').setAttribute('aria-expanded', String(!menu.hidden));
  });
  select.addEventListener('change', () => { void choose(branches.find((b) => b.id === select.value) ?? null); });
  $('edit-new').addEventListener('click', () => {
    closeMenu();
    const name = window.prompt('Name your new world:', 'My alt-history');
    if (name) void addBranch(newBranch(name, baseVersion));
  });
  $('edit-copy').addEventListener('click', () => {
    closeMenu();
    if (!current) return;
    const name = window.prompt('Name the copy:', `${current.name} (copy)`);
    if (name) void addBranch(newBranch(name, baseVersion, current));
  });
  $('edit-rename').addEventListener('click', () => {
    closeMenu();
    if (!current) return;
    const name = window.prompt('Rename this world:', current.name);
    if (name?.trim()) { current.name = name.trim().slice(0, 80); void persist(); }
  });
  $('edit-delete').addEventListener('click', () => {
    closeMenu();
    if (!current || !window.confirm(`Delete "${current.name}"? This cannot be undone (export it first to keep a copy).`)) return;
    const gone = current;
    branches = branches.filter((b) => b.id !== gone.id);
    void deleteBranch(gone.id).then(() => choose(null));
  });
  $('edit-export').addEventListener('click', () => {
    closeMenu();
    if (!current) return;
    const blob = new Blob([exportBranch(current)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${current.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'world'}.uob-branch.json`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 4000);
  });
  $('edit-import').addEventListener('click', () => { closeMenu(); file.click(); });
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
  function save(change: (o: Override) => void): void {
    if (!selected) return;
    const real = selected;
    void ensureBranch().then(async (branch) => {
      const key = host.keyOf(real.k);
      if (!key) return;
      const next: Override = { ...(branch.ops[key] ?? {}) };
      change(next);
      const clean = cleanOverride(next, real);
      if (clean) branch.ops[key] = clean;
      else delete branch.ops[key];
      await persist();
      showSelection();
    });
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!selected) return;
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
    say('');
    // Read the form now: creating the first world redraws the form from the real data.
    const values = { name: fName.value, colour: fColour.value, hide: fHide.checked };
    save((o) => { o.name = values.name; o.colour = values.colour; o.from = from; o.to = to; o.hide = values.hide; });
  });
  fSplit.addEventListener('click', () => {
    const on = fSplit.getAttribute('aria-pressed') !== 'true';
    save((o) => { o.split = on; });
  });
  $('edit-reset').addEventListener('click', () => {
    if (!selected || !current) return;
    const key = host.keyOf(selected.k);
    if (key) delete current.ops[key];
    void persist().then(showSelection);
  });
  $('edit-fold').addEventListener('click', () => {
    const folded = form.classList.toggle('folded');
    $('edit-fold').textContent = folded ? '▾' : '▴';
    $('edit-fold').setAttribute('aria-expanded', String(!folded));
  });

  // ---- open / close
  const setOpen = (on: boolean): void => {
    open = on;
    panel.hidden = !on;
    document.body.classList.toggle('editing', on);
    $('edit-btn').setAttribute('aria-pressed', String(on));
    host.setActive(on);
    if (!on) { selected = null; host.highlight(null); closeMenu(); }
    showSelection();
    redraw();
  };
  $('edit-close').addEventListener('click', () => setOpen(false));
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

  const api = {
    toggle: () => setOpen(!open),
    select: (k: number | null) => {
      selected = k === null ? null : host.real(k) ?? null;
      host.highlight(selected ? selected.k : null);
      form.classList.remove('folded');
      $('edit-fold').textContent = '▴';
      showSelection();
    },
  };
  return api;
}
