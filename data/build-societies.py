#!/usr/bin/env python3
"""Builds public/data/societies.geojson from data/societies_data.py (the Societies lens).

Output: a FeatureCollection of drawn elements (routes, zones, nodes), each tagged with the
index `k` of its entity, plus two extra top-level arrays used by the app:
    entities  one record per network (name, kind, years, colour, anchor, hubs, note, wiki)
    labels    label items: one title per entity and one per hub
See docs/SOCIETIES.md.

Usage:  python3 data/build-societies.py
"""
import json
import math
import sys

sys.path.insert(0, 'data')
from societies_data import ENTITIES, KINDS  # noqa: E402

DST = 'public/data/societies.geojson'
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

    for k, ent in enumerate(ENTITIES):
        colour = KINDS[ent['kind']]
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

        for z in ent['zones']:
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

        extent = max(max(xs) - min(xs), max(ys) - min(ys)) if xs else 1.0
        if longest:
            lx, ly = midpoint(longest[1])
        else:
            lx, ly = sum(xs) / len(xs), sum(ys) / len(ys)
        # hubs, major first, are what the panel lists
        major_first = [n[0] for n in node_defs if n[3]] + [n[0] for n in node_defs if not n[3]]
        entities.append({
            'k': k, 'n': ent['name'], 'kind': ent['kind'], 's': s, 'e': e, 'c': colour,
            'w': ent['wiki'], 'q': '', 'nt': ent['note'],
            'lx': round(lx, 3), 'ly': round(ly, 3), 'sz': round(max(0.8, min(40.0, extent * 0.4)), 2),
            'hubs': ', '.join(major_first),
            'box': [round(min(xs), 2), round(min(ys), 2), round(max(xs), 2), round(max(ys), 2)],
        })
        # entity title label
        labels.append({
            'k': k, 'n': ent['name'], 's': s, 'e': e, 'c': colour, 'w': ent['wiki'], 'q': '',
            'lx': round(lx, 3), 'ly': round(ly, 3), 'sz': round(max(2.0, min(40.0, extent * 0.4)), 2),
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

    out = {'type': 'FeatureCollection', 'features': features, 'entities': entities, 'labels': labels,
           'kinds': KINDS}
    with open(DST, 'w') as fh:
        json.dump(out, fh, separators=(',', ':'), ensure_ascii=False)
    print(f'{DST}: {len(ENTITIES)} networks, {len(features)} elements, {len(labels)} labels, '
          f'{len(json.dumps(out, ensure_ascii=False)) / 1e3:.0f} kB')


if __name__ == '__main__':
    main()
