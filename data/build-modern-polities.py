#!/usr/bin/env python3
"""Replaces 2016 onward in public/data/polities.geojson with the current de jure world map.

Why: Cliopatria's last years show de facto entities (rebel and occupied zones, "Gaza/Hamas",
"Mujahideen", "Russian-occupied territories", a Turkish Republic of Northern Cyprus...).
From 2016 to 2026 this map uses internationally recognised borders instead:

  * one state per recognised country, no rebel, occupied or breakaway areas;
  * Crimea, Donetsk, Luhansk and the Georgian and Moldovan breakaway areas are Ukraine,
    Georgia and Moldova; the Golan Heights is Syria;
  * the West Bank (with East Jerusalem) and Gaza are Palestine;
  * Western Sahara is its own territory (Natural Earth gives most of it to Morocco);
  * Northern Cyprus is Cyprus and Somaliland is Somalia;
  * Kosovo and Taiwan stand alone (Kosovo is recognised by about half of UN members and
    Taiwan by a handful, so both are shown as entities with that caveat in docs/POLITIES.md);
  * dependencies (Greenland, Puerto Rico, Hong Kong...) belong to the realm of their state
    and share its colour;
  * names follow the year (Swaziland to Eswatini 2018, Macedonia to North Macedonia 2019,
    Turkey to Türkiye 2022).

Cliopatria records are cut off at the end of 2015. Borders come from Natural Earth 1:50m
(public domain), simplified; they are not survey grade, and the fixes above are cut from
Natural Earth shapes with small boxes, so Crimea, the Golan and Western Sahara are
approximate. Kashmir and other disputed lines follow Natural Earth.

Needs data/raw/ne/ne_50m_admin_0_countries.geojson (npm run data:download) and mapshaper.
Safe to run again: it replaces what it added before.

Reads data/raw/polities.cleaned.geojson (from data/clean-polities.py) and writes
public/data/polities.geojson. With one argument it edits that file in place instead.

Usage: python3 data/build-modern-polities.py [polities.geojson]
"""
import json
import os
import subprocess
import sys
from collections import defaultdict

import shapely
from shapely.geometry import box, mapping, shape
from shapely.ops import unary_union

sys.path.insert(0, 'data')
from geo_labels import colour_by_graph, label_anchor, polygons, stable_hash, tidy  # noqa: E402

CLEANED = 'data/raw/polities.cleaned.geojson'        # written by data/clean-polities.py
PATH = sys.argv[1] if len(sys.argv) > 1 else 'public/data/polities.geojson'
SOURCE = CLEANED if os.path.exists(CLEANED) and len(sys.argv) < 2 else PATH
NE = 'data/raw/ne/ne_50m_admin_0_countries.geojson'
CUT = 2015                      # last year of Cliopatria
START, END = 2016, 2026

PALETTE = [
    '#b5574f', '#d08a45', '#cdb050', '#8fa655', '#5f9e6e', '#4f9f95', '#5a9bb8',
    '#6b86c2', '#8878b8', '#a76fa4', '#c46f8d', '#9a6b52', '#7d8b99', '#b8905f',
    '#6f8f4a', '#c2685f',
]

# Display name (when NE's NAME_LONG is not the usual short name) and Wikipedia title.
SHOW = {
    'Dem. Rep. Korea': 'North Korea', 'Republic of Korea': 'South Korea', 'Lao PDR': 'Laos',
    'Falkland Islands / Malvinas': 'Falkland Islands', 'Czech Republic': 'Czechia',
    'Kingdom of eSwatini': 'Eswatini', 'Republic of Cabo Verde': 'Cabo Verde',
    'Brunei Darussalam': 'Brunei', 'Russian Federation': 'Russia', 'Faeroe Islands': 'Faroe Islands',
    'Federated States of Micronesia': 'Micronesia', 'Palestine': 'Palestine',
    'Åland Islands': 'Åland', 'The Gambia': 'The Gambia',
}
WIKI = {
    'Palestine': 'State of Palestine', 'Georgia': 'Georgia (country)', 'Ireland': 'Republic of Ireland',
    'Czechia': 'Czechia', 'North Korea': 'North Korea', 'South Korea': 'South Korea',
    'Falkland Islands': 'Falkland Islands', 'Congo': 'Republic of the Congo',
    'Eswatini': 'Eswatini', 'Western Sahara': 'Western Sahara', 'Kosovo': 'Kosovo',
    'Taiwan': 'Taiwan', 'United States': 'United States', 'Russia': 'Russia',
}
# Years in which a state used another name: (first year, last year, name).
RENAMES = {
    'Turkey': [(2016, 2021, 'Turkey'), (2022, END, 'Türkiye')],
    'Eswatini': [(2016, 2017, 'Swaziland'), (2018, END, 'Eswatini')],
    'North Macedonia': [(2016, 2018, 'Macedonia'), (2019, END, 'North Macedonia')],
}
MERGE = {'N. Cyprus': 'Cyprus', 'Somaliland': 'Somalia', 'Siachen Glacier': 'India'}
SKIP = {'Antarctica'}


def fix_shapes(shapes):
    """Apply the de jure corrections to {NE name: geometry}."""
    crimea = shapes['Russia'].intersection(box(32.4, 44.3, 36.6, 46.3))
    if not crimea.is_empty:
        shapes['Ukraine'] = shapes['Ukraine'].union(crimea)
        shapes['Russia'] = shapes['Russia'].difference(crimea)
    golan = shapes['Israel'].intersection(box(35.64, 32.68, 36.0, 33.5))
    if not golan.is_empty:
        shapes['Syria'] = shapes['Syria'].union(golan)
        shapes['Israel'] = shapes['Israel'].difference(golan)
    south = shapes['Morocco'].intersection(box(-18, 20, -7.5, 27.667))
    if not south.is_empty:
        shapes['W. Sahara'] = shapes['W. Sahara'].union(south)
        shapes['Morocco'] = shapes['Morocco'].difference(south)
    for part, whole in MERGE.items():
        if part in shapes and whole in shapes:
            shapes[whole] = shapes[whole].union(shapes.pop(part))
    return shapes


def load_countries():
    tmp = 'data/raw/ne/countries.simplified.json'
    mapshaper = os.path.join('node_modules', 'mapshaper', 'bin', 'mapshaper')
    subprocess.run(['node', mapshaper, '-i', NE, '-simplify', 'interval=2500', '-o', tmp,
                    'format=geojson', 'precision=0.001'], check=True, stdout=subprocess.DEVNULL)
    feats = json.load(open(tmp))['features']
    original = {f['properties']['NAME']: f for f in json.load(open(NE))['features']}
    shapes, props = {}, {}
    for f in feats:
        p = f['properties']
        if p['NAME'] in SKIP:
            continue
        geometry = f['geometry'] or original[p['NAME']]['geometry']   # tiny territories vanish when simplified
        g = tidy(shape(geometry).buffer(0.01) if shape(geometry).geom_type in ('Point', 'MultiPoint') else shape(geometry))
        if g is None:
            continue
        shapes[p['NAME']] = g
        props[p['NAME']] = p
    return fix_shapes(shapes), props


def main():
    shapes, props = load_countries()

    def shown(ne_name):
        p = props[ne_name]
        long = p['NAME_LONG']
        return SHOW.get(long, long)

    # realm (sovereign state) of each entity
    realm_of = {}
    for name, p in props.items():
        if name not in shapes:
            continue
        sov = p['SOVEREIGNT']
        if name in ('Palestine', 'Kosovo', 'W. Sahara', 'Taiwan'):
            sov = p['NAME']
        member = sov != p['ADMIN'] and sov in props and sov != name
        # Natural Earth gives 'Country' types a different ADMIN (France vs its territories)
        if p['TYPE'] == 'Sovereign country' and name not in MERGE:
            member = False
        realm_of[name] = sov if member else None

    items = []
    for name, geom in shapes.items():
        p = props[name]
        display = SHOW.get(p['NAME_LONG'], p['NAME_LONG'])
        if name == 'W. Sahara':
            display = 'Western Sahara'
        variants = RENAMES.get(display) or RENAMES.get(name) or [(START, END, display)]
        anchor = label_anchor(geom)
        realm = realm_of.get(name)
        for first, last, label in variants:
            items.append({
                'ne': name, 'n': label, 's': first, 'e': last, 'geom': geom, 'area': geom.area,
                'q': p.get('WIKIDATAID') or '', 'w': WIKI.get(label) or WIKI.get(display)
                or (p.get('NAME_EN') or display), 'anchor': anchor,
                'realm': shown(realm) if realm else None,
                'key': shown(realm) if realm else display,
            })
    print(f'{len(shapes)} entities, {len(items)} records for {START}-{END}')

    # colours: touching states differ; a realm and its dependencies share one
    tree = shapely.STRtree([it['geom'] for it in items])
    key_area = defaultdict(float)
    for it in items:
        key_area[it['key']] += it['area']
    edges = defaultdict(float)
    for i, it in enumerate(items):
        if it['s'] != START:
            continue
        for j in tree.query(it['geom'], predicate='dwithin', distance=0.08):
            other = items[j]
            if j <= i or other['s'] != START or other['key'] == it['key']:
                continue
            edges[tuple(sorted((it['key'], other['key'])))] += 1
    colour, conflicts = colour_by_graph(key_area, edges, PALETTE)
    print(f'{len(colour)} colour keys, {conflicts:.0f} same-colour contacts')

    new = []
    for it in sorted(items, key=lambda x: -x['area']):
        props_out = {'n': it['n'], 's': it['s'], 'e': it['e'], 'w': it['w'], 'q': it['q'],
                     **it['anchor'], 'c': PALETTE[colour[it['key']]], 'mod': 1}
        if it['realm']:
            props_out['m'] = it['realm']
        else:
            props_out['r'] = 1
        new.append({'type': 'Feature', 'properties': props_out,
                    'geometry': mapping(shapely.set_precision(it['geom'], 0.01))})

    data = json.load(open(SOURCE))
    kept = []
    dropped = cut = 0
    for f in data['features']:
        p = f['properties']
        if p.get('mod'):
            continue
        if p['s'] > CUT:
            dropped += 1
            continue
        if p['e'] > CUT:
            p['e'] = CUT
            cut += 1
        kept.append(f)
    data['features'] = kept + new
    with open(PATH, 'w', encoding='utf8') as fh:
        json.dump(data, fh, separators=(',', ':'), ensure_ascii=False)
    print(f'Cliopatria: {cut} records cut at {CUT}, {dropped} dropped; added {len(new)}; '
          f'{os.path.getsize(PATH) / 1e6:.1f} MB')


if __name__ == '__main__':
    main()
