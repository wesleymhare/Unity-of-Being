#!/usr/bin/env python3
"""Builds public/data/maddison.json from the Maddison Project Database 2023 (CC BY 4.0).

Output: { ISO3: { "n": name, "p": [[year, population], ...], "g": [[year, gdp per person], ...] } }
  population is in people (the source gives thousands); gdp per person is in 2011 international
  dollars. Years without a figure are left out, so early years are sparse (1, 1000, 1500, 1600...).
  The series follow present-day borders; the app labels them so.

Usage:  python3 data/build-maddison.py     (after: npm run data:maddison:download)
"""
import json
import sys

import openpyxl

SRC = 'data/raw/maddison/mpd2023_web.xlsx'
DST = 'public/data/maddison.json'


def main():
    wb = openpyxl.load_workbook(SRC, read_only=True, data_only=True)
    rows = wb['Full data'].iter_rows(values_only=True)
    header = next(rows)
    if tuple(header) != ('countrycode', 'country', 'region', 'year', 'gdppc', 'pop'):
        sys.exit(f'unexpected columns in the Full data sheet: {header}')
    out = {}
    for code, name, _region, year, gdppc, pop in rows:
        if not code or year is None:
            continue
        rec = out.setdefault(code, {'n': name, 'p': [], 'g': []})
        if pop is not None:
            rec['p'].append([int(year), round(pop * 1000)])
        if gdppc is not None:
            rec['g'].append([int(year), round(gdppc)])
    out = {k: v for k, v in out.items() if v['p'] or v['g']}
    with open(DST, 'w') as fh:
        json.dump(out, fh, separators=(',', ':'), ensure_ascii=False)
    first = min(y for v in out.values() for y, _ in v['p'] + v['g'])
    print(f'{DST}: {len(out)} countries, from {first} CE, '
          f'{sum(len(v["p"]) + len(v["g"]) for v in out.values())} figures')


if __name__ == '__main__':
    main()
