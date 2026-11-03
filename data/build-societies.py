#!/usr/bin/env python3
"""Builds public/data/societies.geojson from data/societies_data.py (the Societies lens).

Output: a FeatureCollection of drawn elements (routes, zones, nodes), each tagged with the
index `k` of its entity, plus two extra top-level arrays used by the app:
    entities  one record per network (name, kind, sphere/group, years, colour, anchor, hubs, note, wiki)
    labels    label items: one title per entity and one per hub
See docs/SOCIETIES.md.

Usage:  python3 data/build-societies.py
"""
import json
import math
import os
import sys

sys.path.insert(0, 'data')
from collections import defaultdict  # noqa: E402

import shapely  # noqa: E402
from shapely.geometry import mapping, shape  # noqa: E402
from shapely.ops import unary_union  # noqa: E402

from geo_labels import label_anchor, polygons, tidy  # noqa: E402
from societies_data import ENTITIES, KINDS  # noqa: E402
from societies_groups import GROUP_OF, GROUPS, MARKS  # noqa: E402

DST = 'public/data/societies.geojson'
NE0 = 'data/raw/ne/ne_10m_admin_0_countries.geojson'
POLITIES_IN = 'data/raw/polities.cleaned.geojson' if os.path.exists('data/raw/polities.cleaned.geojson') else 'public/data/polities.geojson'
SIMPLIFY = 0.12
_polities = None
_countries = None
_warnings = []


def polity_shape(name, s, e):
    """The largest Cliopatria record of a polity that overlaps [s, e]."""
    global _polities
    if _polities is None:
        _polities = defaultdict(list)
        for f in json.load(open(POLITIES_IN))['features']:
            if 'g' not in f['properties']:
                _polities[f['properties']['n']].append(f)
    best = None
    for f in _polities.get(name, []):
        p = f['properties']
        if p['e'] < s or p['s'] > e:
            continue
        g = shape(f['geometry'])
        if best is None or g.area > best.area:
            best = g
    if best is None:
        _warnings.append(f'polity {name} {s}..{e}: not found')
        return None
    return tidy(best.simplify(SIMPLIFY), 0.05)


def country_shape(names):
    global _countries
    if _countries is None:
        _countries = defaultdict(list)
        for f in json.load(open(NE0))['features']:
            p = f['properties']
            g = tidy(shape(f['geometry']).simplify(0.05))
            if g is None:
                continue
            for key in {p.get('ADMIN'), p.get('NAME'), p.get('NAME_LONG')}:
                if key:
                    _countries[key.lower()].append(g)
    parts = []
    for n in names:
        found = _countries.get(n.lower())
        if not found:
            _warnings.append(f'country {n}: not found')
            continue
        parts.extend(found)
    if not parts:
        return None
    return tidy(unary_union(parts).simplify(SIMPLIFY), 0.05)

NODE_LABEL_BASE = 10_000


def seg_len(a, b):
    return math.hypot(b[0] - a[0], b[1] - a[1])


def midpoint(pts):
    """The point half way along a polyline."""
    total = sum(seg_len(a, b) for a, b in zip(pts, pts[1:]))
    half = total / 2
    run = 0.0
    for a, b in zip(pts, pts[1:]):
        d = seg_len(a, b)
        if run + d >= half and d > 0:
            t = (half - run) / d
            return a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t
        run += d
    return pts[0]


def main():
    features = []
    entities = []
    labels = []
    next_label = NODE_LABEL_BASE
    marks_used = set()

    for k, ent in enumerate(ENTITIES):
        group = GROUP_OF.get(ent['name'])
        if group is None:
            raise SystemExit(f"no sphere/group for network {ent['name']!r} in data/societies_groups.py")
        colour = GROUPS[group][0]
        s, e = ent['s'], ent['e']
        xs, ys = [], []

        def base(el):
            return {'k': k, 'c': colour,
                    's': el['s'] if el.get('s') is not None else s,
                    'e': el['e'] if el.get('e') is not None else e}

        longest = None
        for r in ent['routes']:
            pts = [[round(x, 3), round(y, 3)] for x, y in r['pts']]
            xs += [p[0] for p in pts]
            ys += [p[1] for p in pts]
            props = base(r)
            props['t'] = 'r'
            if r['sea']:
                props['sea'] = 1
            features.append({'type': 'Feature', 'properties': props,
                             'geometry': {'type': 'LineString', 'coordinates': pts}})
            length = sum(seg_len(a, b) for a, b in zip(pts, pts[1:]))
            if longest is None or length > longest[0]:
                longest = (length, pts)

        zone_geoms = []
        for z in ent['zones']:
            zs = z['s'] if z.get('s') is not None else s
            ze = z['e'] if z.get('e') is not None else e
            geom = None
            if z.get('poly'):
                geom = polity_shape(z['poly'], zs, ze)
            elif z.get('countries'):
                geom = country_shape(z['countries'])
            if geom is not None:
                for part in polygons(geom):
                    xs += [part.bounds[0], part.bounds[2]]
                    ys += [part.bounds[1], part.bounds[3]]
                geom = tidy(shapely.set_precision(geom, 0.01)) or geom
                zone_geoms.append(geom)
                props = base(z)
                props['t'] = 'z'
                features.append({'type': 'Feature', 'properties': props, 'geometry': mapping(geom)})
                continue
            if not z.get('pts'):
                continue
            ring = [[round(x, 3), round(y, 3)] for x, y in z['pts']]
            if ring[0] != ring[-1]:
                ring.append(ring[0])
            xs += [p[0] for p in ring]
            ys += [p[1] for p in ring]
            props = base(z)
            props['t'] = 'z'
            features.append({'type': 'Feature', 'properties': props,
                             'geometry': {'type': 'Polygon', 'coordinates': [ring]}})

        hubs = []
        seen = set()
        node_defs = []
        for node in ent['nodes']:
            name, x, y = node[0], node[1], node[2]
            major = len(node) > 3 and node[3] == 'major'
            if name in seen:
                continue
            seen.add(name)
            xs.append(x)
            ys.append(y)
            hubs.append(name)
            node_defs.append((name, x, y, major))
            props = {'k': k, 'c': colour, 's': s, 'e': e, 't': 'n', 'nm': name}
            if major:
                props['m'] = 1
            features.append({'type': 'Feature', 'properties': props,
                             'geometry': {'type': 'Point', 'coordinates': [round(x, 3), round(y, 3)]}})

        mark_defs = []
        for (owner, mname, mx, my, mic, ms, me) in MARKS:
            if owner != ent['name']:
                continue
            xs.append(mx)
            ys.append(my)
            mark_defs.append((mname, mx, my, mic))
            features.append({'type': 'Feature',
                             'properties': {'k': k, 'c': colour, 's': ms, 'e': me, 't': 'm', 'ic': mic, 'nm': mname},
                             'geometry': {'type': 'Point', 'coordinates': [round(mx, 3), round(my, 3)]}})
            marks_used.add((owner, mname))

        extent = max(max(xs) - min(xs), max(ys) - min(ys)) if xs else 1.0
        title_sz = None
        if longest:
            lx, ly = midpoint(longest[1])
        elif zone_geoms:
            anchor = label_anchor(max(zone_geoms, key=lambda g: g.area))
            lx, ly, title_sz = anchor['lx'], anchor['ly'], anchor['sz']
        else:
            lx, ly = sum(xs) / len(xs), sum(ys) / len(ys)
        # hubs, major first, are what the panel lists
        major_first = [n[0] for n in node_defs if n[3]] + [n[0] for n in node_defs if not n[3]]
        entities.append({
            'k': k, 'n': ent['name'], 'kind': ent['kind'], 'grp': group, 's': s, 'e': e, 'c': colour,
            'w': ent['wiki'], 'q': '', 'nt': ent['note'],
            'lx': round(lx, 3), 'ly': round(ly, 3), 'sz': round(max(0.8, min(40.0, title_sz or extent * 0.4)), 2),
            'hubs': ', '.join(major_first),
            'box': [round(min(xs), 2), round(min(ys), 2), round(max(xs), 2), round(max(ys), 2)],
        })
        # entity title label
        labels.append({
            'k': k, 'n': ent['name'], 's': s, 'e': e, 'c': colour, 'w': ent['wiki'], 'q': '',
            'lx': round(lx, 3), 'ly': round(ly, 3), 'sz': round(max(2.0, min(40.0, title_sz or extent * 0.4)), 2),
            'cw': 30, 'ch': 8, 'oy': -13, 'lcls': 'net-title', 'ent': k,
        })
        # hub labels
        for name, x, y, major in node_defs:
            labels.append({
                'k': next_label, 'n': name, 's': s, 'e': e, 'c': colour, 'w': ent['wiki'], 'q': '',
                'lx': round(x, 3), 'ly': round(y, 3), 'sz': 3.6 if major else 1.3,
                'cw': 6, 'ch': 2.5, 'oy': 11, 'lcls': 'net-hub' + (' major' if major else ''), 'ent': k,
            })
            next_label += 1
        # mark labels (small, shown when zoomed in)
        for (owner, mname, mx, my, mic, ms, me) in MARKS:
            if owner != ent['name']:
                continue
            labels.append({
                'k': next_label, 'n': mname, 's': ms, 'e': me, 'c': colour, 'w': ent['wiki'], 'q': '',
                'lx': round(mx, 3), 'ly': round(my, 3), 'sz': 1.5,
                'cw': 6, 'ch': 2.5, 'oy': 14, 'lcls': 'net-hub mark', 'ent': k,
            })
            next_label += 1

    unused = [(o, n) for (o, n, *_rest) in MARKS if (o, n) not in marks_used]
    if unused:
        raise SystemExit(f'marks for unknown networks: {unused}')

    out = {'type': 'FeatureCollection', 'features': features, 'entities': entities, 'labels': labels,
           'groups': {name: colour for name, (colour, _about) in GROUPS.items()}, 'kinds': KINDS}
    with open(DST, 'w') as fh:
        json.dump(out, fh, separators=(',', ':'), ensure_ascii=False)
    print(f'{DST}: {len(ENTITIES)} networks, {len(features)} elements, {len(labels)} labels, '
          f'{len(json.dumps(out, ensure_ascii=False)) / 1e3:.0f} kB')
    for w in _warnings:
        print('WARN', w)


if __name__ == '__main__':
    main()
