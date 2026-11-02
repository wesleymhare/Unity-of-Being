"""Shared helpers for building label anchors and colours (polities and societies).

Needs: shapely >= 2.
"""
import json
import math
from collections import defaultdict

import shapely
from shapely.affinity import translate
from shapely.geometry import LineString, MultiPolygon, box, shape
from shapely.ops import polylabel, unary_union


def polygons(geom):
    """Flatten any geometry into a list of Polygons."""
    if geom is None or geom.is_empty:
        return []
    if geom.geom_type == 'Polygon':
        return [geom]
    if geom.geom_type in ('MultiPolygon', 'GeometryCollection'):
        out = []
        for part in geom.geoms:
            out.extend(polygons(part))
        return out
    return []


def tidy(geom, min_area=0.0):
    """Repair a geometry, keep polygonal parts only, drop slivers."""
    if geom is None or geom.is_empty:
        return None
    geom = shapely.make_valid(geom)
    parts = [p for p in polygons(geom) if p.area > min_area]
    if not parts:
        return None
    return parts[0] if len(parts) == 1 else MultiPolygon(parts)


def load_land(path='public/data/land.geojson'):
    """Land as one valid geometry with longitudes inside -180..180.

    public/data/land.geojson keeps the Afro-Eurasian landmass in a frame shifted
    by -360 degrees (MapLibre draws it fine through its world copies), so shapes
    are moved back and cut at the antimeridian here.
    """
    world = box(-180, -90, 180, 90)
    east = box(180, -90, 540, 90)
    parts = []
    for feature in json.load(open(path))['features']:
        for poly in polygons(shape(feature['geometry'])):
            if not poly.is_valid:
                poly = shapely.make_valid(poly)
            for piece in polygons(poly):
                if piece.is_empty:
                    continue
                if piece.bounds[0] < -180.5:
                    piece = translate(piece, xoff=360)
                inside = piece.intersection(world)
                beyond = piece.intersection(east)
                parts.extend(polygons(inside))
                if not beyond.is_empty:
                    parts.extend(polygons(translate(beyond, xoff=-360)))
    return unary_union([p for p in parts if p.area > 0])


def lat_scale(lat):
    """Mercator stretches north-south distances by 1/cos(lat)."""
    return 1.0 / max(0.2, math.cos(math.radians(min(abs(lat), 80))))


def time_overlap(a, b):
    return a['s'] <= b['e'] and b['s'] <= a['e']


def label_anchor(geom, whole=None):
    """Return label properties for a shape.

    lx, ly : anchor inside the shape (pole of inaccessibility of its largest part)
    cw, ch : free width and height at the anchor, in degrees as drawn on a
             Mercator map, so the browser can fit the name inside the shape
    sz     : square root of the shape's drawn area in degrees (a size score)
    """
    whole = whole if whole is not None else geom
    parts = sorted(polygons(geom), key=lambda p: -p.area)
    main = parts[0]
    try:
        pt = polylabel(main, tolerance=max(0.02, math.sqrt(main.area) / 60))
    except Exception:
        pt = main.representative_point()
    lx, ly = pt.x, pt.y

    minx, miny, maxx, maxy = main.bounds
    free = {'w': 0.0, 'h': 0.0}
    probes = (
        ('w', LineString([(minx - 1, ly), (maxx + 1, ly)])),
        ('h', LineString([(lx, miny - 1), (lx, maxy + 1)])),
    )
    for axis, line in probes:
        hit = main.intersection(line)
        segs = [hit] if hit.geom_type == 'LineString' else list(getattr(hit, 'geoms', []))
        for seg in segs:
            if seg.geom_type != 'LineString' or seg.is_empty:
                continue
            x0, y0, x1, y1 = seg.bounds
            if axis == 'w':
                inside = x0 - 1e-6 <= lx <= x1 + 1e-6
                length = x1 - x0
            else:
                inside = y0 - 1e-6 <= ly <= y1 + 1e-6
                length = y1 - y0
            if inside:
                free[axis] = max(free[axis], length)

    scale = lat_scale(ly)
    total = sum(p.area for p in polygons(whole))
    return {
        'lx': round(lx, 2),
        'ly': round(ly, 2),
        'cw': round(free['w'], 2),
        'ch': round(free['h'] * scale, 2),
        'sz': round(math.sqrt(total * scale), 2),
    }


def stable_hash(value):
    h = 2166136261
    for ch in value:
        h ^= ord(ch)
        h = (h * 16777619) & 0xFFFFFFFF
    return h


def colour_by_graph(areas, edges, palette):
    """Greedy graph colouring.

    areas : {key: total area}      (bigger / better connected keys are coloured first)
    edges : {(a, b): weight}       keys that touch in space and time
    Returns {key: palette index}.
    """
    neighbours = defaultdict(dict)
    for (a, b), weight in edges.items():
        neighbours[a][b] = weight
        neighbours[b][a] = weight

    colour = {}
    use = [0] * len(palette)
    order = sorted(areas, key=lambda k: (-len(neighbours[k]), -areas[k], k))
    for key in order:
        clash = [0.0] * len(palette)
        for other, weight in neighbours[key].items():
            if other in colour:
                clash[colour[other]] += weight
        best = min(
            range(len(palette)),
            key=lambda c: (clash[c], use[c], (stable_hash(key) + c * 7) % len(palette)),
        )
        colour[key] = best
        use[best] += 1
    conflicts = sum(w for (a, b), w in edges.items() if colour[a] == colour[b])
    return colour, conflicts
