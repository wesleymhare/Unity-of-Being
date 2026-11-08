#!/usr/bin/env python3
"""Gives every polity and province shape its key `k` and writes the properties on their own.

Why: the browser used to download and parse the 26 MB polities file and the 14 MB provinces file
on the main thread, then hand a copy to MapLibre's worker. On phones that peaked at several
gigabytes and the tab was killed. Now MapLibre's worker fetches the shape files itself, and the
page only loads these small property lists (labels, clicks and the panel need no geometry).

  public/data/polities.geojson     each feature gets properties.k = its index
  public/data/subdivisions.geojson province polygons get properties.k = SUB_K + their index
                                   (internal border lines, marked `bd`, get none)
  public/data/polities-props.json  [properties, ...] indexed by k
  public/data/subdivisions-props.json  [properties, ...] indexed by k - SUB_K
  public/data/polity-shapes/<n>.json and subdivision-shapes/<n>.json: 150 shapes each, for Edit mode

Also writes public/data/polity-shapes/<n>.json (150 shapes each) for edit mode.

Run after data/build-modern-polities.py and data/build-subdivisions.py. Safe to run again.
Usage:  python3 data/split-web-data.py
"""
import json

SUB_K = 1_000_000  # keep equal to SUB_K in src/main.ts


def rewrite(path, props_path, first_key, skip=lambda p: False):
    data = json.load(open(path, encoding='utf8'))
    props = []
    for feature in data['features']:
        p = feature['properties']
        if skip(p):
            p.pop('k', None)
            continue
        p['k'] = first_key + len(props)
        props.append(p)
    with open(path, 'w', encoding='utf8') as fh:
        json.dump(data, fh, separators=(',', ':'), ensure_ascii=False)
    with open(props_path, 'w', encoding='utf8') as fh:
        json.dump(props, fh, separators=(',', ':'), ensure_ascii=False)
    print(f'{path}: {len(data["features"])} shapes, {len(props)} keyed; {props_path}: '
          f'{len(json.dumps(props, separators=(",", ":"), ensure_ascii=False)) / 1e6:.1f} MB')


rewrite('public/data/polities.geojson', 'public/data/polities-props.json', 0)
rewrite('public/data/subdivisions.geojson', 'public/data/subdivisions-props.json', SUB_K, skip=lambda p: bool(p.get('bd')))


# Shapes in small chunks, so edit mode can fetch the few it needs instead of the whole 26 MB file.
# CHUNK must equal SHAPE_CHUNK in src/main.ts.
CHUNK = 150
import os  # noqa: E402

os.makedirs('public/data/polity-shapes', exist_ok=True)
for old in os.listdir('public/data/polity-shapes'):
    os.remove(os.path.join('public/data/polity-shapes', old))
features = json.load(open('public/data/polities.geojson', encoding='utf8'))['features']
for n in range(0, (len(features) + CHUNK - 1) // CHUNK):
    part = [f['geometry'] for f in features[n * CHUNK:(n + 1) * CHUNK]]
    with open(f'public/data/polity-shapes/{n}.json', 'w', encoding='utf8') as fh:
        json.dump(part, fh, separators=(',', ':'), ensure_ascii=False)
print(f'public/data/polity-shapes: {(len(features) + CHUNK - 1) // CHUNK} chunks of {CHUNK}')

# Province shapes in the same kind of chunks (index = k - SUB_K), for splitting a polity into provinces.
os.makedirs('public/data/subdivision-shapes', exist_ok=True)
for old in os.listdir('public/data/subdivision-shapes'):
    os.remove(os.path.join('public/data/subdivision-shapes', old))
sub_features = [f for f in json.load(open('public/data/subdivisions.geojson', encoding='utf8'))['features'] if not f['properties'].get('bd')]
for n in range(0, (len(sub_features) + CHUNK - 1) // CHUNK):
    part = [f['geometry'] for f in sub_features[n * CHUNK:(n + 1) * CHUNK]]
    with open(f'public/data/subdivision-shapes/{n}.json', 'w', encoding='utf8') as fh:
        json.dump(part, fh, separators=(',', ':'), ensure_ascii=False)
print(f'public/data/subdivision-shapes: {(len(sub_features) + CHUNK - 1) // CHUNK} chunks of {CHUNK}')
