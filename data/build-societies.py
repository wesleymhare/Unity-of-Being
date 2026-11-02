#!/usr/bin/env python3
"""Builds public/data/societies.geojson from data/societies_data.py.

Each curated footprint is trimmed to the coastline (public/data/land.geojson),
given a label anchor inside the shape, and coloured by language family or
cultural sphere. See docs/SOCIETIES.md for what counts as a Society.

Usage: python3 data/build-societies.py
Needs: shapely >= 2.
"""
import json
import sys

import shapely
from shapely.geometry import MultiPolygon, Polygon, mapping, shape
from shapely.ops import unary_union

sys.path.insert(0, 'data')
from geo_labels import label_anchor, load_land, tidy  # noqa: E402
from societies_data import FAMILIES, SOCIETIES  # noqa: E402

LAND = 'public/data/land.geojson'
DST = 'public/data/societies.geojson'

def chaikin(ring, rounds=2):
    """Cut the corners of a ring so hand-placed points read as soft, approximate edges."""
    pts = [tuple(p) for p in ring]
    if pts[0] == pts[-1]:
        pts = pts[:-1]
    for _ in range(rounds):
        out = []
        for i, (x0, y0) in enumerate(pts):
            x1, y1 = pts[(i + 1) % len(pts)]
            out.append((0.75 * x0 + 0.25 * x1, 0.75 * y0 + 0.25 * y1))
            out.append((0.25 * x0 + 0.75 * x1, 0.25 * y0 + 0.75 * y1))
        pts = out
    return pts


land = load_land(LAND)
print(f'land: {len(shapely.get_parts(land))} polygons, area {land.area:.0f} sq deg')

out = []
problems = []
for entry in SOCIETIES:
    rings = []
    for ring in entry['rings']:
        if len(ring) < 3:
            problems.append(f"{entry['name']}: ring with fewer than 3 points")
            continue
        poly = Polygon(chaikin(ring))
        if not poly.is_valid:
            poly = shapely.make_valid(poly)
        rings.append(poly)
    footprint = unary_union(rings)
    if entry['clip']:
        footprint = footprint.intersection(land)
    geom = tidy(footprint, min_area=0.005)
    if geom is None:
        problems.append(f"{entry['name']} ({entry['s']}..{entry['e']}): nothing left after trimming to land")
        continue
    if entry['family'] not in FAMILIES:
        problems.append(f"{entry['name']}: unknown family {entry['family']}")
        continue

    label, colour = FAMILIES[entry['family']]
    props = {
        'n': entry['name'],
        's': entry['s'],
        'e': entry['e'],
        'w': entry['wiki'],
        'q': '',
        'kind': entry['kind'],
        'fam': entry['languages'],
        'fg': label,
        'c': colour,
    }
    props.update(label_anchor(geom))
    out.append((geom.area, {
        'type': 'Feature',
        'properties': props,
        'geometry': mapping(shapely.set_precision(geom, 0.02)),
    }))

for line in problems:
    print('PROBLEM:', line)

# Big shapes first so small ones are drawn on top of them.
out.sort(key=lambda pair: -pair[0])
collection = {'type': 'FeatureCollection', 'features': [f for _, f in out]}
with open(DST, 'w', encoding='utf8') as fh:
    json.dump(collection, fh, separators=(',', ':'), ensure_ascii=False)
print(f'{DST}: {len(out)} societies')
if problems:
    sys.exit(1)
