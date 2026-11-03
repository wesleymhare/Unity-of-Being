#!/usr/bin/env python3
"""Adds the Caspian Sea and time-aware lakes to the water layers.

Why: the base land polygon (world-atlas, from Natural Earth land) fills in the Caspian
Sea, and Natural Earth's lake file has no Caspian, so it never appeared. The Aral Sea,
Lake Chad and Lop Nur also shrank within living memory and Lake Texcoco was drained.

Inputs (committed, from Natural Earth, public domain):
  data/caspian.geojson          the Caspian from ne_50m_ocean, simplified
  data/lakes-historic.geojson   ne_10m_lakes_historic (Aral, Texcoco, Chad, Lop Nur)
Changes:
  public/data/lakes.geojson     + Caspian, + historic lakes with end years, modern Aral and
                                Chad get a start year (features carry optional `s` and `e`)
  public/data/ocean.geojson     + Caspian (so the Biomes colours are trimmed around it)
  public/data/land.geojson      Caspian (and the 1960 Aral Sea) cut out of the base land, so a coarse
                                hole in an old polity shape shows water, not a ring of land
Safe to run again: it replaces what it added before.

Usage: python3 data/build-water-extra.py
"""
import json
import sys

import shapely
from shapely.geometry import mapping, shape
from shapely.ops import unary_union

sys.path.insert(0, 'data')
from geo_labels import polygons  # noqa: E402

# Last year each historic extent is drawn (the modern outline takes over after it).
HISTORIC_END = {'Aral Sea': 1960, 'Lake Chad': 1960, 'Lake Texcoco': 1520, 'Lop Nur': 1972}
MODERN_START = {'North Aral Sea': 1961, 'South Aral Sea': 1961, 'Lake Chad': 1961}

lakes_path = 'public/data/lakes.geojson'
lakes = json.load(open(lakes_path))
kept = [f for f in lakes['features'] if not f['properties'].get('x')]
for f in kept:
    name = f['properties'].get('name')
    if name in MODERN_START:
        f['properties']['s'] = MODERN_START[name]

added = []
for f in json.load(open('data/caspian.geojson'))['features']:
    added.append({'type': 'Feature', 'properties': {'name': 'Caspian Sea', 'x': 1}, 'geometry': f['geometry']})
for f in json.load(open('data/lakes-historic.geojson'))['features']:
    name = f['properties']['name']
    props = {'name': name, 'x': 1, 'e': HISTORIC_END[name]}
    added.append({'type': 'Feature', 'properties': props, 'geometry': f['geometry']})
lakes['features'] = kept + added
json.dump(lakes, open(lakes_path, 'w'), separators=(',', ':'), ensure_ascii=False)
print(f'lakes.geojson: {len(kept)} kept + {len(added)} added')

ocean_path = 'public/data/ocean.geojson'
ocean = json.load(open(ocean_path))
geom = unary_union([shape(f['geometry']) for f in ocean['features']] +
                   [shape(f['geometry']) for f in json.load(open('data/caspian.geojson'))['features']])
geom = shapely.set_precision(geom, 0.01)
ocean['features'] = [{'type': 'Feature', 'properties': {}, 'geometry': mapping(geom)}]
json.dump(ocean, open(ocean_path, 'w'), separators=(',', ':'))
print('ocean.geojson: Caspian added')

# ---- base land: cut the water out so it shows sea colour, not land, around coarse polity holes
from shapely.affinity import translate  # noqa: E402

land_path = 'public/data/land.geojson'
land = json.load(open(land_path))
water = [shape(f['geometry']) for f in json.load(open('data/caspian.geojson'))['features']]
water += [shape(f['geometry']) for f in json.load(open('data/lakes-historic.geojson'))['features']
          if f['properties']['name'] == 'Aral Sea']
water = unary_union(water).buffer(0.06)
# land.geojson keeps Afro-Eurasia in a frame shifted by -360 degrees (see geo_labels.load_land)
cuts = [water, translate(water, xoff=-360)]
changed = 0
for feat in land['features']:
    geom = shape(feat['geometry'])
    parts = []
    for part in (geom.geoms if hasattr(geom, 'geoms') else [geom]):
        for cut in cuts:
            if part.intersects(cut):
                part = part.difference(cut)
                changed += 1
        parts.extend(polygons(part))
    feat['geometry'] = mapping(shapely.MultiPolygon(parts)) if len(parts) != 1 else mapping(parts[0])
json.dump(land, open(land_path, 'w'), separators=(',', ':'))
print(f'land.geojson: water cut out of {changed} polygon(s)')
