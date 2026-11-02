#!/usr/bin/env python3
"""Builds the data the Biomes lens needs.

  public/data/koppen.bin           Köppen–Geiger classes at 1/12 degree, run-length encoded
  public/data/ecoregions.bin       ecoregion ids on the same grid, run-length encoded
  public/data/ecoregions.json      ecoregion names, biomes and realms (index = id - 1)
  public/data/ecoregion-lines.geojson  borders between ecoregions
  public/data/ocean.geojson        open sea (world minus Natural Earth land), used to
                                   trim the colours to the coastline

koppen.bin layout (little endian):
  uint16 width, uint16 height, then runs of (uint8 class, uint16 length)
ecoregions.bin layout:
  uint16 width, uint16 height, then runs of (uint16 id, uint16 length)
Row 0 is 90 N, column 0 is 180 W. Köppen class 0 is open sea, 1..31 are classes in
kgcpy order (Af ... ET). Ecoregion id 0 is open sea, 1..N are ecoregions in the
order of ecoregions.json, and the last id is "Rock and Ice".

Run `npm run data:biomes:download` first. Needs: numpy, Pillow, scipy, rasterio,
shapely >= 2 (see data/requirements.txt) and Node with mapshaper (npm install).
"""
import json
import os
import struct
import subprocess
import sys

import numpy as np
import rasterio.features
import shapely
from affine import Affine
from PIL import Image
from scipy import ndimage
from shapely.geometry import box, mapping, shape

sys.path.insert(0, 'data')
from geo_labels import load_land  # noqa: E402

KOPPEN_SRC = 'data/raw/koppen/koppen-classes.png'
ECO_SRC = 'data/raw/ecoregions/ecoregions-2017.geojson'
FACTOR = 3                      # 1/36 degree source pixels per 1/12 degree cell
COAST_CELLS = 6                 # how far land classes are pushed out to sea (trimmed by the ocean mask)
ECO_NEAR_CELLS = 8              # land cells with no ecoregion take the nearest one within this distance
Image.MAX_IMAGE_PIXELS = None


def write_runs(path, grid, value_format):
    flat = grid.reshape(-1)
    runs = bytearray()
    start = 0
    for i in range(1, len(flat) + 1):
        if i == len(flat) or flat[i] != flat[start] or i - start == 65535:
            runs += struct.pack(value_format, int(flat[start]), i - start)
            start = i
    with open(path, 'wb') as fh:
        fh.write(struct.pack('<HH', grid.shape[1], grid.shape[0]))
        fh.write(bytes(runs))
    print(f'{path}: {grid.shape[1]}x{grid.shape[0]}, {len(runs) // struct.calcsize(value_format)} runs, '
          f'{(len(runs) + 4) / 1024:.0f} KB')


# ---- Köppen at 1/12 degree -------------------------------------------------
src = np.array(Image.open(KOPPEN_SRC))
assert src.shape == (6480, 12960), src.shape
H, W = src.shape[0] // FACTOR, src.shape[1] // FACTOR
cells = FACTOR * FACTOR
grid = np.zeros((H, W), dtype=np.uint8)
SLAB = 90
for r0 in range(0, H, SLAB):
    r1 = min(H, r0 + SLAB)
    slab = src[r0 * FACTOR:r1 * FACTOR].reshape(r1 - r0, FACTOR, W, FACTOR)
    slab = slab.transpose(0, 2, 1, 3).reshape(r1 - r0, W, cells)
    counts = np.stack([(slab == k).sum(axis=2) for k in range(1, 32)])
    share = counts.sum(axis=0) / float(cells)
    best = counts.argmax(axis=0) + 1
    grid[r0:r1] = np.where(share >= 0.35, best, 0)
land_cells = grid > 0

# Push land classes a few cells out to sea so the vector sea mask can trim them.
dist, (iy, ix) = ndimage.distance_transform_edt(~land_cells, return_indices=True)
koppen = np.where(dist <= COAST_CELLS, grid[iy, ix], 0).astype(np.uint8)
write_runs('public/data/koppen.bin', koppen, '<BH')
covered = koppen > 0

# ---- Ecoregions on the same grid ---------------------------------------------
features = json.load(open(ECO_SRC))['features']
features.sort(key=lambda f: f['properties']['ECO_ID'])
biome_names = []
realm_names = []
eco_table = []
shapes = []
for index, feature in enumerate(features, start=1):
    props = feature['properties']
    biome = props['BIOME_NAME']
    realm = props['REALM']
    if biome not in biome_names:
        biome_names.append(biome)
    if realm not in realm_names:
        realm_names.append(realm)
    eco_table.append([props['ECO_NAME'], biome_names.index(biome), realm_names.index(realm)])
    geom = shapely.make_valid(shape(feature['geometry']))
    shapes.append((index, geom))

ROCK = len(features) + 1
biome_names.append('Rock and Ice')
realm_names.append('Antarctica')
eco_table.append(['Rock and Ice', len(biome_names) - 1, len(realm_names) - 1])

transform = Affine(360.0 / W, 0, -180, 0, -180.0 / H, 90)
# Larger ecoregions first so small ones are never painted over.
ordered = sorted(shapes, key=lambda item: -item[1].area)
eco = rasterio.features.rasterize(
    [(mapping(geom), index) for index, geom in ordered],
    out_shape=(H, W), transform=transform, fill=0, dtype='uint16',
)
# Ecoregions too small to catch a cell centre: let them claim any cell they touch.
present = set(np.unique(eco).tolist())
small = [(mapping(geom), index) for index, geom in ordered if index not in present]
if small:
    touched = rasterio.features.rasterize(
        small, out_shape=(H, W), transform=transform, fill=0, dtype='uint16', all_touched=True,
    )
    eco = np.where((eco == 0) & (touched > 0), touched, eco).astype(np.uint16)
    print(f'{len(small)} tiny ecoregions placed with all_touched')
missing = [index for index, _ in shapes if index not in set(np.unique(eco).tolist())]
print(f'ecoregions with no cell: {len(missing)}', [eco_table[i - 1][0] for i in missing][:10])

# Every land cell gets an ecoregion: nearest one nearby, otherwise Rock and Ice.
dist_e, (ey, ex) = ndimage.distance_transform_edt(eco == 0, return_indices=True)
near = eco[ey, ex]
need = covered & (eco == 0)
eco = np.where(need, np.where(dist_e <= ECO_NEAR_CELLS, near, ROCK), eco)
eco = np.where(covered, eco, 0).astype(np.uint16)
print(f"cells: {int(covered.sum())} land, {int((eco == ROCK).sum())} Rock and Ice")
write_runs('public/data/ecoregions.bin', eco, '<HH')

with open('public/data/ecoregions.json', 'w', encoding='utf8') as fh:
    json.dump({'biomes': biome_names, 'realms': realm_names, 'eco': eco_table}, fh,
              ensure_ascii=False, separators=(',', ':'))

# ---- Borders between ecoregions ------------------------------------------------
# Trace the grid into polygons (so neighbours share exact vertices), then let
# mapshaper smooth the cell stair-steps and keep only the lines between ecoregions.
cells_path = 'data/raw/ecoregions/eco-cells.geojson'
polys = []
for geom, value in rasterio.features.shapes(eco, mask=eco > 0, transform=transform):
    polys.append({'type': 'Feature', 'properties': {'id': int(value)}, 'geometry': geom})
with open(cells_path, 'w') as fh:
    json.dump({'type': 'FeatureCollection', 'features': polys}, fh, separators=(',', ':'))
mapshaper = os.path.join('node_modules', 'mapshaper', 'bin', 'mapshaper')
subprocess.run([
    'node', mapshaper, '-i', cells_path,
    '-simplify', 'interval=9000',
    '-innerlines',
    '-o', 'public/data/ecoregion-lines.geojson', 'format=geojson', 'precision=0.01',
], check=True)
print(f"ecoregion-lines.geojson: {os.path.getsize('public/data/ecoregion-lines.geojson') / 1024:.0f} KB")

# ---- Open sea polygon = world rectangle minus land ----------------------------
land = load_land('public/data/land.geojson')
world = box(-180, -85.06, 180, 85.06)
ocean = shapely.set_precision(world.difference(land), 0.01)
with open('public/data/ocean.geojson', 'w') as fh:
    json.dump({'type': 'FeatureCollection',
               'features': [{'type': 'Feature', 'properties': {}, 'geometry': mapping(ocean)}]},
              fh, separators=(',', ':'))
print('ocean.geojson written')
