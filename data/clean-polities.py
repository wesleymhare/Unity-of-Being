#!/usr/bin/env python3
"""Turn the raw simplified Cliopatria shapes into a clean polities.geojson.

Why this step exists
--------------------
Cliopatria stores two kinds of shapes in one file:

* leaf polities, e.g. "British Raj", "Kingdom of England", and
* group shapes whose name is wrapped in parentheses, e.g. "(British Empire)".
  A group is the union of its members (members carry the group name in
  `MemberOf`), so drawing both stacks the group on top of its own parts. That
  produced doubled fills, doubled labels and the overlapping "major polity"
  labels on the old map.

What this script does
---------------------
1. Groups that only describe a relationship ("Allegiance of X to Y",
   "Vassalage ...", "Personal union ...", "Alliance ...") are dropped. Their
   members stay; a vassal takes its overlord's colour.
2. Groups with members become label-only shapes (`g: 1`): they are not filled,
   but they carry the realm name and an outline. Any land of the group that none
   of its members covers is kept as an ordinary leaf with the group's name.
3. A group with no members is kept as an ordinary leaf (name without brackets).
4. Exact duplicates ("(Kingdom of England)" over "Kingdom of England") are
   dropped.
5. Every shape gets a label anchor inside the shape (pole of inaccessibility,
   computed with smaller overlapping shapes cut out) plus the free width and
   height of the shape at that anchor, so the browser can fit names to shapes.
6. Colours are assigned by graph colouring: polities that touch in time and
   space get different colours; members of one realm share their realm colour.

Usage: python3 data/clean-polities.py [input.json] [output.geojson]
Needs: shapely >= 2, numpy.
"""
import json
import re
import sys
from collections import defaultdict

import shapely
from shapely.geometry import mapping, shape
from shapely.ops import unary_union
from shapely.strtree import STRtree

from geo_labels import (
    colour_by_graph, label_anchor, polygons, stable_hash, tidy, time_overlap,
)

SRC = sys.argv[1] if len(sys.argv) > 1 else 'data/raw/polities.simplified.json'
DST = sys.argv[2] if len(sys.argv) > 2 else 'public/data/polities.geojson'

PALETTE = [
    '#b5574f', '#d08a45', '#cdb050', '#8fa655', '#5f9e6e', '#4f9f95', '#5a9bb8',
    '#6b86c2', '#8878b8', '#a76fa4', '#c46f8d', '#9a6b52', '#7d8b99', '#b8905f',
    '#6f8f4a', '#c2685f',
]

RELATION = re.compile(r'^\((Allegiance|Vassalage|Personal union|Alliance|Union)\b')
VASSAL = re.compile(r'^\((?:Allegiance|Vassalage) of (.+?) to (.+)\)$')


def clean(name):
    name = re.sub(r'\s+', ' ', name.strip())
    if name.startswith('(') and name.endswith(')'):
        name = name[1:-1].strip()
    if name and name[0].islower():
        name = name[0].upper() + name[1:]
    return name


# ---- Load ----------------------------------------------------------------
with open(SRC, encoding='utf8') as fh:
    raw = json.load(fh)['features']

items = []
for index, feature in enumerate(raw):
    p = feature['properties']
    geom = tidy(shape(feature['geometry']))
    if geom is None:
        continue
    items.append({
        'raw': p['n'], 'name': clean(p['n']), 'group': p['n'].startswith('('),
        'm': p['m'], 's': p['s'], 'e': p['e'], 'w': p['w'], 'q': p['q'],
        'geom': geom, 'area': geom.area,
    })
print(f'{len(items)} shapes read')

members_of = defaultdict(list)
for it in items:
    if it['m']:
        members_of[it['m']].append(it)

leaves, groups = [], []
dropped = defaultdict(int)

for it in items:
    if not it['group']:
        leaves.append(it)
        continue

    if RELATION.match(it['raw']):
        dropped['relationship group'] += 1
        continue

    members = [m for m in members_of.get(it['raw'], []) if time_overlap(it, m)]
    if not members:
        it['group'] = False          # standalone, e.g. "(Phoenician Empire)"
        leaves.append(it)
        continue

    union = unary_union([m['geom'] for m in members])
    covered = it['geom'].intersection(union).area / it['area'] if it['area'] else 1.0
    same_name = any(m['name'] == it['name'] for m in members)
    if len(members) == 1 and covered > 0.97 and same_name:
        dropped['duplicate of its only member'] += 1
        continue
    if same_name:
        dropped['group named like a member'] += 1
        continue

    leftover = tidy(it['geom'].difference(union), min_area=0.02)
    if leftover is not None and leftover.area > 0.04 * it['area']:
        leaves.append({
            'raw': it['raw'], 'name': it['name'], 'group': False, 'm': it['raw'],
            's': it['s'], 'e': it['e'], 'w': it['w'], 'q': it['q'],
            'geom': leftover, 'area': leftover.area,
        })
    groups.append(it)

# Exact duplicates among leaves (same name, same years, ~same shape).
seen, unique = {}, []
for it in sorted(leaves, key=lambda x: -x['area']):
    key = (it['name'], it['s'], it['e'])
    prior = seen.get(key)
    if prior is not None and prior['geom'].symmetric_difference(it['geom']).area < 0.02 * prior['area']:
        dropped['duplicate leaf'] += 1
        continue
    seen[key] = it
    unique.append(it)
leaves = unique
print(f'{len(leaves)} leaves, {len(groups)} realm groups; dropped:', dict(dropped))

# ---- Label anchors ---------------------------------------------------------
leaf_geoms = [it['geom'] for it in leaves]
tree = STRtree(leaf_geoms)


def near_in_time(it, pad=0.0):
    """Leaves whose bounding box touches `it` and whose years overlap."""
    hits = tree.query(it['geom'])
    return [leaves[j] for j in hits if time_overlap(it, leaves[j])]


for it in leaves + groups:
    geom = it['geom']
    if not it['group']:
        cut = [
            o['geom'] for o in near_in_time(it)
            if o is not it and o['area'] < it['area'] and o['name'] != it['name']
        ]
        if cut:
            trimmed = tidy(geom.difference(unary_union(cut)), min_area=0.02)
            if trimmed is not None and trimmed.area > 0.25 * it['area']:
                it.update(label_anchor(trimmed, geom))
                continue
    it.update(label_anchor(geom))

# ---- Colours ---------------------------------------------------------------
vassal_of = {}
for it in items:
    match = VASSAL.match(it['raw'])
    if match:
        vassal_of[clean(match.group(1))] = clean(match.group(2))


def colour_key(it):
    if it['m'] and not RELATION.match(it['m']):
        return clean(it['m'])
    if it['m'] and it['name'] in vassal_of:
        return vassal_of[it['name']]
    return it['name']


for it in leaves:
    it['key'] = colour_key(it)

key_area = defaultdict(float)
for it in leaves:
    key_area[it['key']] += it['area']

edges = defaultdict(float)
for a_index, it in enumerate(leaves):
    cands = [j for j in tree.query(it['geom']) if j > a_index
             and time_overlap(it, leaves[j]) and leaves[j]['key'] != it['key']]
    if not cands:
        continue
    close = shapely.dwithin(it['geom'], [leaf_geoms[j] for j in cands], 0.2)
    for j, ok in zip(cands, close):
        if ok:
            edges[tuple(sorted((it['key'], leaves[j]['key'])))] += 1

colour, conflicts = colour_by_graph(key_area, edges, PALETTE)
print(f'{len(colour)} colour keys, {len(edges)} neighbour pairs, '
      f'{conflicts:.0f} same-colour contacts left')

# ---- Output ----------------------------------------------------------------
out = []
for it in leaves + groups:
    is_group = it['group']
    in_realm = bool(it['m']) and not RELATION.match(it['m'])
    props = {
        'n': it['name'], 's': it['s'], 'e': it['e'], 'w': it['w'], 'q': it['q'],
        'lx': it['lx'], 'ly': it['ly'], 'cw': it['cw'], 'ch': it['ch'], 'sz': it['sz'],
    }
    if in_realm:
        props['m'] = clean(it['m'])
    if is_group:
        props['g'] = 1
        props['r'] = 1
        props['c'] = PALETTE[colour.get(it['name'], stable_hash(it['name']) % len(PALETTE))]
    else:
        props['c'] = PALETTE[colour[it['key']]]
        if not in_realm:
            props['r'] = 1
    out.append((it['area'], {
        'type': 'Feature',
        'properties': props,
        'geometry': mapping(shapely.set_precision(it['geom'], 0.1)),
    }))

# Big shapes first so small ones are drawn on top of them.
out.sort(key=lambda pair: -pair[0])
collection = {'type': 'FeatureCollection', 'features': [f for _, f in out]}
with open(DST, 'w', encoding='utf8') as fh:
    json.dump(collection, fh, separators=(',', ':'), ensure_ascii=False)
print(f'{DST}: {len(out)} features')
