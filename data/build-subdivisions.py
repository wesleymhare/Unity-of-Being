#!/usr/bin/env python3
"""Builds public/data/subdivisions.geojson: provinces inside big polities.

A province is approximated from modern boundaries (Natural Earth admin-0 countries and
admin-1 provinces, public domain), listed in data/subdivisions_data.py, then clipped to
the polity's Cliopatria shape. Parts of the polity that no listed province covers go to
the nearest province, so the polity is always fully divided. See docs/SUBDIVISIONS.md.

Usage:  python3 data/build-subdivisions.py
Needs:  shapely >= 2, and the Natural Earth files in data/raw/ne/ (see docs/SUBDIVISIONS.md).
"""
import json
import sys
import time
from collections import defaultdict

import shapely
from shapely.geometry import box, mapping, shape
from shapely.ops import unary_union

sys.path.insert(0, 'data')
from geo_labels import label_anchor, polygons, tidy  # noqa: E402
from subdivisions_data import POLITIES  # noqa: E402

NE0 = 'data/raw/ne/ne_10m_admin_0_countries.geojson'
NE1 = 'data/raw/ne/ne_10m_admin_1_states_provinces.geojson'
POLITIES_IN = 'public/data/polities.geojson'
DST = 'public/data/subdivisions.geojson'

SIMPLIFY = 0.03          # degrees, applied to Natural Earth units before use
MERGE_TOLERANCE = 0.05   # merge consecutive polity records whose shapes differ by less than this


def clean(geom, min_area=0.0):
    geom = tidy(geom, min_area)
    return geom


def opened(geom, r=0.03):
    """Remove thin slivers left where two sets of borders almost agree."""
    if geom is None or geom.is_empty:
        return None
    return clean(geom.buffer(-r).buffer(r), 0.005)


def load_units():
    countries = defaultdict(list)
    for f in json.load(open(NE0))['features']:
        p = f['properties']
        geom = clean(shape(f['geometry']).simplify(SIMPLIFY))
        if geom is None:
            continue
        for key in {p.get('ADMIN'), p.get('NAME'), p.get('NAME_LONG')}:
            if key:
                countries[key.lower()].append(geom)
    admin1 = defaultdict(list)
    for f in json.load(open(NE1))['features']:
        p = f['properties']
        geom = clean(shape(f['geometry']).simplify(SIMPLIFY))
        if geom is None:
            continue
        if not p.get('name'):
            continue
        admin1[p['name'].lower()].append(((p.get('admin') or '').lower(), geom))
    return countries, admin1


def polity_bounds(records):
    boxes = [shape(r['geometry']).bounds for r in records]
    return (min(b[0] for b in boxes) - 5, min(b[1] for b in boxes) - 5,
            max(b[2] for b in boxes) + 5, max(b[3] for b in boxes) + 5)


def resolve_admin1(token, admin1, bounds):
    name, _, country = token[2:].partition('@')
    options = admin1.get(name.lower(), [])
    if country:
        options = [o for o in options if o[0] == country.lower()]
    else:
        box_ = box(*bounds)
        near = [o for o in options if o[1].intersects(box_)]
        options = near or options
    return [g for _, g in options]


def province_geometries(definition, records, countries, admin1, warn):
    bounds = polity_bounds(records)
    taken = None
    geoms = {}
    # specific units first, so a whole-country token only gets what is left
    for prov in definition['provinces']:
        parts = []
        for token in prov['members']:
            if not token.startswith('a:'):
                continue
            found = resolve_admin1(token, admin1, bounds)
            if not found:
                warn(f"{prov['name']}: no admin-1 unit {token}")
            parts.extend(found)
        g = unary_union(parts) if parts else None
        if g is not None and taken is not None:
            g = g.difference(taken)
        if g is not None and not g.is_empty:
            taken = g if taken is None else taken.union(g)
        geoms[prov['name']] = g
    for prov in definition['provinces']:
        parts = []
        for token in prov['members']:
            if token.startswith('a:'):
                continue
            found = countries.get(token.lower())
            if not found:
                warn(f"{prov['name']}: no country {token}")
                continue
            parts.extend(found)
        if not parts:
            continue
        g = unary_union(parts)
        if taken is not None:
            g = g.difference(taken)
        g = opened(g)
        if g is not None:
            taken = g if taken is None else taken.union(g)
            geoms[prov['name']] = g if geoms[prov['name']] is None else unary_union([geoms[prov['name']], g])
    return geoms


def runs_of(records):
    """Group a polity's yearly records into runs whose shapes barely change."""
    runs = []
    for r in sorted(records, key=lambda r: r['properties']['s']):
        geom = clean(shape(r['geometry']))
        if geom is None:
            continue
        p = r['properties']
        if runs:
            last = runs[-1]
            if p['s'] <= last['e'] + 2 and geom.symmetric_difference(last['geom']).area < MERGE_TOLERANCE * last['geom'].area:
                last['e'] = max(last['e'], p['e'])
                continue
        runs.append({'s': p['s'], 'e': p['e'], 'geom': geom, 'props': p})
    return runs


T0 = time.time()


def log(msg):
    print(f'[{time.time() - T0:5.0f}s] {msg}', flush=True)


def main():
    countries, admin1 = load_units()
    log('units loaded')
    polities = json.load(open(POLITIES_IN))['features']
    by_name = defaultdict(list)
    for f in polities:
        if 'g' not in f['properties']:
            by_name[f['properties']['n']].append(f)

    warnings = []
    out = []
    for pname, definition in POLITIES.items():
        records = by_name.get(pname)
        if not records:
            warnings.append(f'{pname}: polity not found in polities.geojson')
            continue
        log(f'{pname}: building provinces')
        geoms = province_geometries(definition, records, countries, admin1, lambda m: warnings.append(f'{pname} / {m}'))
        provinces = definition['provinces']
        count = 0
        runs = runs_of(records)
        log(f'{pname}: {len(runs)} runs')
        for run in runs:
            # split the run wherever the set of existing provinces changes
            cuts = {run['s'], run['e'] + 1}
            for prov in provinces:
                for y in (prov['start'], prov['end'] + 1):
                    if run['s'] < y <= run['e']:
                        cuts.add(y)
            cuts = sorted(cuts)
            for a, b in zip(cuts, cuts[1:]):
                s, e = a, b - 1
                active = [p for p in provinces if p['start'] <= e and p['end'] >= s and geoms.get(p['name']) is not None]
                if not active:
                    continue
                whole = run['geom']
                pieces = {}
                for p in active:
                    pieces[p['name']] = clean(geoms[p['name']].intersection(whole), 0.01)
                covered = unary_union([g for g in pieces.values() if g is not None])
                rest = clean(whole.difference(covered).buffer(0.02).buffer(-0.02), 0.01)
                for part in polygons(rest):
                    ref = sorted(
                        active,
                        key=lambda p: part.distance(pieces[p['name']] if pieces[p['name']] is not None else geoms[p['name']]),
                    )[0]
                    cur = pieces[ref['name']]
                    pieces[ref['name']] = part if cur is None else unary_union([cur, part])
                    if part.area > 4:
                        warnings.append(f"{pname} {s}..{e}: {part.area:.1f} sq deg near ({part.centroid.x:.0f},{part.centroid.y:.0f}) given to {ref['name']}")
                group = []
                for p in active:
                    g = pieces[p['name']]
                    g = clean(g, 0.005) if g is not None else None
                    if g is not None:
                        group.append((p, g))
                if not group:
                    continue
                # simplify the whole division together so shared borders stay shared
                try:
                    simple = list(shapely.coverage_simplify([g for _, g in group], 0.07))
                except Exception:
                    simple = [g.simplify(0.07) for _, g in group]
                polys = []
                for (p, _), g in zip(group, simple):
                    g = clean(shapely.set_precision(g, 0.02))
                    if g is None:
                        continue
                    polys.append((p, g))
                    props = {
                        'n': p['name'], 'w': p['wiki'], 'p': pname, 'pq': run['props'].get('q', ''),
                        's': s, 'e': e, 'c': run['props']['c'], 'era': definition['era'],
                    }
                    props.update(label_anchor(g))
                    out.append({'type': 'Feature', 'properties': props, 'geometry': mapping(g)})
                    count += 1
                # internal borders only (the polity's own outline is already drawn)
                if len(polys) > 1:
                    edges = unary_union([g.boundary for _, g in polys])
                    outline = unary_union([g for _, g in polys]).boundary
                    inner = edges.difference(outline.buffer(0.02))
                    if not inner.is_empty:
                        out.append({
                            'type': 'Feature',
                            'properties': {'bd': 1, 'p': pname, 's': s, 'e': e},
                            'geometry': mapping(shapely.set_precision(inner, 0.02)),
                        })
        print(f'{pname}: {count} province shapes')

    with open(DST, 'w') as fh:
        json.dump({'type': 'FeatureCollection', 'features': out}, fh, separators=(',', ':'))
    size = len(json.dumps(out, separators=(',', ':'))) / 1e6
    print(f'{DST}: {len(out)} shapes, {size:.1f} MB')
    for w in warnings:
        print('WARN', w)


if __name__ == '__main__':
    main()
