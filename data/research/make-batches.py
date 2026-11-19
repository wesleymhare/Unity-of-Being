"""Writes the Markdown batch files you paste into a chat model (DeepSeek, ChatGPT...).

Each file holds the instructions plus a table of polities and the years to answer for. The reply
(one JSON array) comes back to data/research/ingest.py, which checks it and merges it into
public/data/polity-stats.json. See docs/RESEARCH-BATCHES.md.

Run from the repo root:
    python data/research/make-batches.py                  # polities that lasted 100+ years, 15 per file
    python data/research/make-batches.py --min-years 50 --size 12
"""
import argparse
import json
import math
import os
import sys
from collections import defaultdict

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from schema import ALLOWED_ARMS, ALLOWED_TECH, WEALTH_BASES  # noqa: E402

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
PROPS = os.path.join(ROOT, 'public', 'data', 'polities-props.json')
OUT = os.path.join(ROOT, 'data', 'research', 'batches')


def fmt_year(y):
    return f'{-y} BCE' if y < 0 else f'{y or 1} CE'


RUN_GAP = 60  # records closer than this many years belong to one continuous run


def polities():
    """One entry per continuous run of a polity (Wikidata id).

    The map's records are time slices, and one Wikidata id can carry unrelated periods (the Roman
    Republic and a Napoleonic namesake). Records are joined into runs, split where there is a gap of
    more than RUN_GAP years, and each run is asked about separately, only for years the map really covers.
    """
    groups = defaultdict(list)
    for p in json.load(open(PROPS, encoding='utf-8')):
        if p.get('g') or not p.get('q'):  # realm-group label shapes are not polities
            continue
        groups[p['q']].append(p)
    out = []
    for qid, recs in groups.items():
        recs.sort(key=lambda r: r['s'])
        runs = []
        for r in recs:
            if runs and r['s'] <= runs[-1][-1]['e'] + RUN_GAP:
                runs[-1].append(r)
            else:
                runs.append([r])
        for run in runs:
            first = run[0]
            big = max(run, key=lambda r: r.get('sz', 0))  # the centre of its largest shape
            out.append({
                'qid': qid, 'name': first['n'], 'wiki': first.get('w') or first['n'],
                's': min(r['s'] for r in run), 'e': max(r['e'] for r in run),
                'lng': big['lx'], 'lat': big['ly'],
                'size': max(r.get('sz', 0) for r in run),
                'covered': [(r['s'], r['e']) for r in run],
            })
    return out


def snap_to_map(y, covered):
    """The nearest year the map has a shape for (a gap such as the Xin interregnum is skipped)."""
    if any(s <= y <= e for s, e in covered):
        return y
    best = min(covered, key=lambda c: min(abs(y - c[0]), abs(y - c[1])))
    return best[0] if abs(y - best[0]) <= abs(y - best[1]) else best[1]


def sample_years(s, e, covered):
    """One to three years spread through the run (none is year 0, which does not exist)."""
    span = e - s
    if span < 30:
        fractions = [0.5]
    elif span < 150:
        fractions = [0.25, 0.75]
    else:
        fractions = [0.15, 0.5, 0.85]
    years = []
    for f in fractions:
        y = s + span * f
        y = int(round(y / 5.0) * 5) if span >= 30 else int(round(y))
        y = snap_to_map(min(max(y, s), e), covered)
        if y == 0:
            y = 1
        if y not in years:
            years.append(y)
    return years


PROMPT = f"""You are a careful historian filling a worldbuilding database. For each polity below and each
year listed for it, give your best estimates of the fields below. Accuracy matters more than completeness.

RULES
- Unknown means null. Never invent a figure to fill a gap. A rough, honest estimate is fine; a made-up one is not.
- Every snapshot needs `src`: a real work (author, year, title) or a Wikipedia article title. Do not write
  "general knowledge", "various" or "n/a". Every snapshot needs `conf`: "high", "medium" or "low".
- Answer for the exact year listed, for this polity only (not the whole region or later periods).

FIELDS (per polity and year)
- `population`: people in the polity (number).
- `troops`: standing or permanently embodied troops (number), `troops_note`: 2 to 6 words on what they were.
- `tech`: one or two of {json.dumps(ALLOWED_TECH)}: the most advanced material in regular military use.
  `main_arm`: one of {json.dumps(ALLOWED_ARMS)}.
- `wealth_t_gold`: wealth in TONNES OF GOLD-EQUIVALENT (number). Use annual economic output if you can estimate it
  (`wealth_basis`: "GDP"), else annual state revenue ("revenue"), else the treasury ("treasury").
  Convert with the period's own coinage and metal ratios; show it briefly in `wealth_note`
  (for example "about 20bn sesterces; 1 aureus = 100 sesterces = 7.3 g gold").
- `cities`: up to 5 largest cities, each {{"name": ..., "pop": number}}.
- `lingua`: language(s) of administration or lingua franca (up to 3 short strings).
  `writing`: administrative script(s) or writing system(s) (up to 3 short strings).

Allowed `wealth_basis`: {json.dumps(WEALTH_BASES)}.

OUTPUT: reply with ONLY one JSON array inside a single ```json code block, no other text, in this shape:
[{{"qid": "Q12544", "name": "Name as given", "snapshots": [
  {{"year": 150, "population": 60000000, "troops": 400000, "troops_note": "legions and auxiliaries",
   "tech": ["Iron"], "main_arm": "infantry", "wealth_t_gold": 1500, "wealth_basis": "GDP",
   "wealth_note": "about 20bn sesterces; 1 aureus = 100 sesterces = 7.3 g gold",
   "cities": [{{"name": "Rome", "pop": 1000000}}], "lingua": ["Latin", "Greek"], "writing": ["Latin alphabet", "Greek alphabet"],
   "src": "Scheidel and Friesen 2009; Wikipedia: Demographics of the Roman Empire", "conf": "low"}}]}}]
Leave a field out (or null) when you do not know it. Keep the order of the table."""


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--min-years', type=int, default=100, help='only polities that lasted this long')
    ap.add_argument('--size', type=int, default=15, help='polities per file')
    args = ap.parse_args()

    chosen = [p for p in polities() if p['e'] - p['s'] >= args.min_years and p['qid']]
    # Big, long-lived polities first.
    chosen.sort(key=lambda p: -(p['size'] * math.sqrt(max(p['e'] - p['s'], 1))))
    os.makedirs(OUT, exist_ok=True)
    for old in os.listdir(OUT):
        if old.startswith('batch-') and old.endswith('.md'):
            os.remove(os.path.join(OUT, old))
    count = math.ceil(len(chosen) / args.size)
    for i in range(count):
        part = chosen[i * args.size:(i + 1) * args.size]
        rows = []
        for n, p in enumerate(part, 1):
            years = ', '.join(str(y) for y in sample_years(p['s'], p['e'], p['covered']))
            rows.append(
                f"| {n} | {p['qid']} | {p['name']} (Wikipedia: {p['wiki']}) | {fmt_year(p['s'])} to {fmt_year(p['e'])} "
                f"| {p['lat']:.1f}, {p['lng']:.1f} | {years} |"
            )
        text = (
            f'# Batch {i + 1:03d} of {count:03d}: polities that lasted {args.min_years}+ years\n\n'
            f'{PROMPT}\n\n## Polities\n\n'
            '| # | Wikidata | Polity | Existed | Centre (lat, lng) | Years to answer (CE/BCE) |\n'
            '|---|---|---|---|---|---|\n' + '\n'.join(rows) + '\n\n'
            'Reply now with only the JSON array.\n'
        )
        with open(os.path.join(OUT, f'batch-{i + 1:03d}.md'), 'w', encoding='utf-8', newline='\n') as f:
            f.write(text)
    print(f'{len(chosen)} polity runs -> {count} files in data/research/batches/ ({args.size} per file)')


if __name__ == '__main__':
    main()
