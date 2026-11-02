#!/usr/bin/env python3
"""Builds the data the Biomes lens needs.

  public/data/koppen.bin     Köppen–Geiger classes at 1/6 degree, run-length encoded
  public/data/ocean.geojson  open sea (world minus Natural Earth land), used to
                             trim the climate colours to the coastline

koppen.bin layout (little endian):
  uint16 width, uint16 height, then runs of (uint8 class, uint16 length)
  Row 0 is 90 N, column 0 is 180 W. Class 0 is open sea, 1..31 are Köppen
  classes in kgcpy order (Af ... ET).

Run `npm run data:biomes:download` first. Needs: numpy, Pillow, shapely >= 2.
"""
import json
import struct
import sys

import numpy as np
import shapely
from PIL import Image
from shapely.geometry import box, mapping

sys.path.insert(0, 'data')
from geo_labels import load_land  # noqa: E402

SRC = 'data/raw/koppen/koppen-classes.png'
FACTOR = 6                      # 100 arc-second pixels per output cell (1/36 degree -> 1/6)
OCEAN_SRC = 32                  # kgcpy value for ocean
Image.MAX_IMAGE_PIXELS = None

src = np.array(Image.open(SRC))
assert src.shape == (6480, 12960), src.shape
H, W = src.shape[0] // FACTOR, src.shape[1] // FACTOR

# Most common land class in each block; open sea only if land is under 35%.
blocks = src.reshape(H, FACTOR, W, FACTOR).transpose(0, 2, 1, 3).reshape(H, W, FACTOR * FACTOR)
counts = np.zeros((32, H, W), dtype=np.uint8)
for klass in range(1, 32):
    counts[klass] = (blocks == klass).sum(axis=2)
land_share = counts[1:].sum(axis=0) / float(FACTOR * FACTOR)
best = counts[1:].argmax(axis=0) + 1
grid = np.where(land_share >= 0.35, best, 0).astype(np.uint8)


def fill_coast(grid, passes=3):
    """Push land classes a few cells out to sea so the vector sea mask can trim them."""
    out = grid.copy()
    for _ in range(passes):
        sea = out == 0
        votes = np.zeros((32,) + out.shape, dtype=np.uint8)
        for dy in (-1, 0, 1):
            for dx in (-1, 0, 1):
                if dx == 0 and dy == 0:
                    continue
                shifted = np.roll(np.roll(out, dy, axis=0), dx, axis=1)
                for klass in range(1, 32):
                    votes[klass] += (shifted == klass)
        pick = votes[1:].argmax(axis=0) + 1
        has = votes[1:].max(axis=0) > 0
        out = np.where(sea & has, pick, out).astype(np.uint8)
    return out


# Keep the real open sea (class 0) far from land; only the coastal fringe is filled.
filled = fill_coast(grid)

# Run-length encode, row-major.
flat = filled.reshape(-1)
runs = bytearray()
start = 0
for i in range(1, len(flat) + 1):
    if i == len(flat) or flat[i] != flat[start] or i - start == 65535:
        runs += struct.pack('<BH', int(flat[start]), i - start)
        start = i
with open('public/data/koppen.bin', 'wb') as fh:
    fh.write(struct.pack('<HH', W, H))
    fh.write(bytes(runs))
print(f'koppen.bin: {W}x{H}, {len(runs) // 3} runs, {(len(runs) + 4) / 1024:.0f} KB')

# Open sea polygon = world rectangle minus land.
land = load_land('public/data/land.geojson')
world = box(-180, -85.06, 180, 85.06)
ocean = world.difference(land)
ocean = shapely.set_precision(ocean, 0.01)
out = {
    'type': 'FeatureCollection',
    'features': [{'type': 'Feature', 'properties': {}, 'geometry': mapping(ocean)}],
}
with open('public/data/ocean.geojson', 'w') as fh:
    json.dump(out, fh, separators=(',', ':'))
print('ocean.geojson written')
