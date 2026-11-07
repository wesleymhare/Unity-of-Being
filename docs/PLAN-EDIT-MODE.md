# Plan: Edit mode (alt-history and worldbuilding)

Status: **phase 1 is built (7 November 2026)**: worlds saved in the browser with export and import, and
per-polity rename, recolour, change of years and removal. Phases 2 to 5 are not started.

How phase 1 differs from the plan below:
- A world's content is `ops`, **one override per real polity record**, keyed by `name|start|end` of the
  record (computed in the browser, so the 26 MB data file did not change). Entity spans and the add, split,
  merge and copy operations come with phase 2 and 3.
- Changed records are taken out of the real layers with a filter on their index and drawn from the small
  `polities-edit` source, outlined in amber. Realm outlines of a changed record are not redrawn.
- Code: `src/edit.ts` (model, validation, storage), `src/edit-ui.ts` (panel), `applyEdits` in `src/main.ts`.

## Decisions
| Question | Decision |
|---|---|
| Where edits live | In the browser (IndexedDB, with export and import as a file). No accounts, no server, so it works on GitHub Pages as it is. |
| What is editable first | **Alt-history:** change the real data, never destroying it. The real map stays underneath and can always be restored. |
| Branches | Many named **branches** of a world can be saved, switched, renamed, duplicated and deleted. |
| Time | An edit applies over a **span of years** (for example 1300 to 1450), not a single year. An entity can have several spans with their own shape and properties. |
| Drawing | Draw polygons, lines and points by hand, **and start from real shapes** (copy a real polity or country, then reshape, split or merge it). |
| Overlay layer | A **separate Markdown mode** for notes and lore attached to a place, an entity or a span, plus one "world bible" document per branch. |

## Principles
1. **The real data is never edited.** A branch is a list of operations applied on top of it.
2. **Everything is reversible.** Undo and redo while editing; "reset this entity to real" at any time.
3. **A branch is one file.** Export gives a single JSON file with a version number; import validates it.
4. **Honest labelling.** An edited world is marked "Alt-history: <branch name>" so it is never mistaken for the real map.
5. **Safe by default.** Imported files and Markdown are sanitised; nothing from a branch is run as code.

## Data model
- **Stable ids.** Base features need an `id` that survives a rebuild (a hash of lens, name, start and
  end). The build adds it. Without this a branch cannot point at "the Roman Empire, 27 BCE to 14 CE".
- **Entity with spans.** `{ id, lens, name, spans: [{ from, to, geometry, props }] }`, the same shape the
  Civilizations data already uses for stages.
- **Operations** (the content of a branch), each with a year span:
  `add` (new entity), `modify` (override name, colour, years, links or geometry of a real entity),
  `hide` (remove a real entity for those years), `split` (end one entity at a year and start another),
  `merge` (combine entities from a year), `copy` (clone a real shape under a new id).
- **Branch** `{ id, name, created, parent, baseVersion, ops, notes }`. `parent` lets a branch fork from another;
  `baseVersion` warns when the real data has since been rebuilt.
- **Notes** `{ id, anchor: {entityId | point | polygon}, from, to, markdown }`, plus the branch's world bible.

## How it fits the current code
- A function `applyBranch(base, ops)` yields the features to draw; edited features go in their own small
  GeoJSON sources, and the base features they replace are hidden with a filter on `id`.
- The label engine already takes plain arrays, so edited entities get labels the same way.
- Drawing and reshaping use an existing MapLibre-compatible editor (Terra Draw is the leading candidate;
  MIT-licensed) and geometry operations use Turf (union, difference, intersect, simplify). Both are npm
  packages; to be checked for size and licence before adding.

## UI
- The Edit button toggles Edit mode. A branch bar at the top (current branch, new, duplicate, rename,
  delete, export, import); a left toolbar (select, draw area, draw line, draw point, reshape, split, merge,
  delete); an inspector (name, colour, years and spans, links).
- **Year handling:** every edit shows "applies from X to Y" with the slider year as the default start, so a
  span is set by dragging or typing, never implied.
- **Markdown mode:** a separate tab for notes and the world bible, with a live preview, shown in the
  panel when an anchored entity is clicked.

## Phases
1. **Foundations.** Stable ids in the build. Branch manager (create, switch, rename, duplicate, delete),
   storage in IndexedDB, export and import. Non-geometry edits: rename, recolour, change years, hide.
2. **Geometry.** Draw areas, lines and points; reshape; copy a real shape and reshape it.
3. **Operations on real data.** Split and merge, with an option to trim neighbours so borders do not overlap.
4. **Markdown mode.** Notes anchored to places and spans; the world bible; safe rendering.
5. **Polish.** Undo and redo history, a diff between two branches, small branches shareable as a link.

## Risks
- **Size and speed.** The base polities file is about 26 MB; editing must not copy it. Only operations are stored.
- **Id stability.** If ids change when the base is rebuilt, old branches break; hence `baseVersion` and a warning.
- **Geometry.** Merging and trimming shapes can fail on messy borders; use repair steps and show errors plainly.
- **Storage limits.** Use IndexedDB, not localStorage, and warn before a branch gets large.
- **Scope creep.** Phase 1 should be useful by itself before geometry work starts.

## Open questions
- Should an edited world be allowed past 2026 (alt-futures)? That means extending the timeline per branch.
- Should Biomes be editable (for example a different climate)? Not planned; Biomes stay real.
- Merging two branches into one (like git): not planned for the first release.
