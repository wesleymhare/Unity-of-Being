"""Checks a chat model's reply to a batch file and merges the good parts into public/data/polity-stats.json.

    python data/research/ingest.py data/research/replies/batch-001.json [more files...]
    python data/research/ingest.py --dry-run data/research/replies/batch-001.json

A reply file is the model's JSON array (a ```json fence around it is fine). Checking is field by field:
a bad field is dropped and reported, the rest of the snapshot is kept; a snapshot with no usable source,
confidence or year is dropped whole. Everything accepted is stored with by="ai", so the app shows it as
unverified. Nothing is merged into curated (by="curated") entries. Rejections go to
data/research/ingest-log.md.
"""
import argparse
import json
import os
import re
import sys
from datetime import date

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from schema import (ALLOWED_ARMS, ALLOWED_TECH, BAD_SOURCES, CONFIDENCE, TECH_NOT_BEFORE,  # noqa: E402
                    WEALTH_BASES)

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
PROPS = os.path.join(ROOT, 'public', 'data', 'polities-props.json')
STATS = os.path.join(ROOT, 'public', 'data', 'polity-stats.json')
LOG = os.path.join(ROOT, 'data', 'research', 'ingest-log.md')


def count_text(n):
    """'about 60 million', 'about 45,000'."""
    n = float(n)
    if n >= 1e9:
        return f'about {n / 1e9:.1f} billion'.replace('.0 ', ' ')
    if n >= 1e6:
        digits = 1 if n < 1e7 else 0
        return f'about {n / 1e6:.{digits}f} million'.replace('.0 ', ' ')
    if n >= 1e4:
        return f'about {int(round(n, -3)):,}'
    return f'about {int(round(n, -1 if n >= 100 else 0)):,}'


def gold_text(t):
    t = float(t)
    if t >= 100:
        return f'{int(round(t, -1 if t < 1000 else -2)):,}'
    return f'{t:.1f}'.rstrip('0').rstrip('.') if t < 10 else f'{int(round(t))}'


def num(value):
    return isinstance(value, (int, float)) and not isinstance(value, bool) and value == value


def short_list(value, limit=3, width=60):
    if not isinstance(value, list):
        return None
    items = [str(x).strip() for x in value if isinstance(x, str) and 1 <= len(x.strip()) <= width]
    return items[:limit] or None


def load_reply(path):
    text = open(path, encoding='utf-8').read()
    fence = re.search(r'```(?:json)?\s*(.*?)```', text, re.S)
    return json.loads(fence.group(1) if fence else text)


def known_polities():
    """Wikidata id -> (name, [(start, end) of every map record]); a year must fall inside one of them."""
    spans = {}
    for p in json.load(open(PROPS, encoding='utf-8')):
        if p.get('g') or not p.get('q'):
            continue
        name, runs = spans.setdefault(p['q'], (p['n'], []))
        runs.append((p['s'], p['e']))
    return spans


def check_snapshot(snap, runs, problems):
    """Returns {key: entry} for the fields of one snapshot that pass, or {} if it cannot be used."""
    year = snap.get('year')
    if not isinstance(year, int) or isinstance(year, bool) or year == 0 or not any(s <= year <= e for s, e in runs):
        problems.append(f'year {year!r} is not a year the map has this polity; snapshot dropped')
        return {}
    src = snap.get('src')
    if not isinstance(src, str) or len(src.strip()) < 8 or src.strip().lower().rstrip('.') in BAD_SOURCES:
        problems.append(f'{year}: no real source ({src!r}); snapshot dropped')
        return {}
    conf = snap.get('conf')
    if conf not in CONFIDENCE:
        problems.append(f'{year}: confidence {conf!r} is not one of {CONFIDENCE}; snapshot dropped')
        return {}
    base = {'y': year, 'src': src.strip(), 'conf': conf, 'by': 'ai'}
    out = {}

    pop = snap.get('population')
    if pop is not None:
        if num(pop) and 100 <= pop <= 2.5e9:
            out['population'] = {**base, 'v': count_text(pop), 'n': pop}
        else:
            problems.append(f'{year}: population {pop!r} out of range (100 to 2.5 billion); field dropped')
            pop = None

    troops = snap.get('troops')
    if troops is not None:
        # Standing forces: never more than a quarter of the people, and never beyond what any state kept
        # permanently under arms (about 1.5 million before 1700, 15 million after).
        limit = min(0.25 * pop if num(pop) else 1e9, 1.5e6 if year < 1700 else 1.5e7)
        if num(troops) and 0 <= troops <= limit:
            note = snap.get('troops_note')
            note = f' ({note.strip()})' if isinstance(note, str) and 2 <= len(note.strip()) <= 60 else ''
            out['army'] = {**base, 'v': f'{count_text(troops)}{note}', 'n': troops}
        else:
            problems.append(f'{year}: troops {troops!r} is not a number, or is over a quarter of the population or beyond any standing army of the era; field dropped')

    tech = snap.get('tech')
    if tech is not None:
        tags = tech if isinstance(tech, list) else [tech]
        bad = [t for t in tags if t not in ALLOWED_TECH or year < TECH_NOT_BEFORE.get(t, -10 ** 9)]
        arm = snap.get('main_arm')
        if tags and len(tags) <= 2 and not bad and (arm is None or arm in ALLOWED_ARMS):
            out['tech'] = {**base, 'v': ', '.join(tags) + (f' · {arm}' if arm else '')}
        else:
            problems.append(f'{year}: tech {tech!r}/{arm!r} not in the allowed lists or too early for {year}; field dropped')

    wealth = snap.get('wealth_t_gold')
    if wealth is not None:
        basis = snap.get('wealth_basis')
        if num(wealth) and 0 < wealth <= 2e6 and basis in WEALTH_BASES:
            unit = {'GDP': 'a year (economic output)', 'revenue': 'a year (state revenue)', 'treasury': '(treasury)'}[basis]
            note = snap.get('wealth_note')
            note = f'; {note.strip()}' if isinstance(note, str) and 3 <= len(note.strip()) <= 120 else ''
            out['wealth'] = {**base, 'v': f'about {gold_text(wealth)} t of gold-equivalent {unit}{note}', 'n': wealth}
        else:
            problems.append(f'{year}: wealth {wealth!r}/{basis!r} not a positive tonnage with basis {WEALTH_BASES}; field dropped')

    cities = snap.get('cities')
    if cities is not None:
        good = []
        city_cap = 2e6 if year < 1800 else 4e7  # no city before 1800 passed about a million and a half
        if isinstance(cities, list):
            for c in cities[:5]:
                if (isinstance(c, dict) and isinstance(c.get('name'), str) and 1 <= len(c['name'].strip()) <= 40
                        and num(c.get('pop')) and 0 < c['pop'] <= city_cap and (not num(pop) or c['pop'] <= pop)):
                    good.append(f"{c['name'].strip()} {count_text(c['pop'])}")
        if good:
            out['cities'] = {**base, 'v': '; '.join(good)}
        else:
            problems.append(f'{year}: no valid city (needs a name and a population not above the polity\'s); field dropped')

    lingua = short_list(snap.get('lingua'))
    writing = short_list(snap.get('writing'))
    if lingua or writing:
        text = ', '.join(lingua) if lingua else ''
        if writing:
            text += (' · writing: ' if text else 'writing: ') + ', '.join(writing)
        out['lingua'] = {**base, 'v': text}
    elif snap.get('lingua') is not None or snap.get('writing') is not None:
        problems.append(f'{year}: lingua/writing are not short lists of strings; field dropped')
    return out


def merge(stats, qid, year_entries):
    for key, entry in year_entries.items():
        slot = stats.setdefault(qid, {}).setdefault(key, [])
        # Replace an earlier AI figure for the same year; never touch curated ones.
        slot[:] = [e for e in slot if not (e.get('by') == 'ai' and e.get('y') == entry['y'])]
        slot.append(entry)
        slot.sort(key=lambda e: e.get('y', 0))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('files', nargs='+')
    ap.add_argument('--dry-run', action='store_true', help='check only, write nothing')
    args = ap.parse_args()

    known = known_polities()
    stats = json.load(open(STATS, encoding='utf-8')) if os.path.exists(STATS) else {}
    if not isinstance(stats, dict):
        stats = {}
    log = [f'\n## {date.today().isoformat()}\n']
    accepted = rejected = 0
    for path in args.files:
        try:
            reply = load_reply(path)
        except (OSError, ValueError) as error:
            print(f'{path}: cannot read ({error})')
            log.append(f'- {os.path.basename(path)}: unreadable ({error})')
            continue
        if not isinstance(reply, list):
            print(f'{path}: the reply must be a JSON array')
            continue
        for item in reply:
            qid = item.get('qid') if isinstance(item, dict) else None
            if qid not in known:
                rejected += 1
                log.append(f'- {os.path.basename(path)}: unknown Wikidata id {qid!r}; polity dropped')
                continue
            runs = known[qid][1]
            problems = []
            for snap in item.get('snapshots') or []:
                fields = check_snapshot(snap if isinstance(snap, dict) else {}, runs, problems)
                if fields and not args.dry_run:
                    merge(stats, qid, fields)
                accepted += len(fields)
            rejected += len(problems)
            log.extend(f'- {os.path.basename(path)} · {known[qid][0]} ({qid}): {p}' for p in problems)
    if args.dry_run:
        print('\n'.join(line for line in log if line.startswith('- ')))
    else:
        with open(STATS, 'w', encoding='utf-8', newline='\n') as f:
            json.dump(stats, f, ensure_ascii=False, indent=1, sort_keys=True)
            f.write('\n')
        with open(LOG, 'a', encoding='utf-8', newline='\n') as f:
            f.write('\n'.join(log) + '\n')
    print(f'accepted {accepted} fields, rejected {rejected} ({"dry run, nothing written" if args.dry_run else "merged; see data/research/ingest-log.md"})')


if __name__ == '__main__':
    main()
