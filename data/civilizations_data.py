"""Curated Civilizations for the Civilizations lens. See docs/CIVILIZATIONS.md for what counts.

Each entry is a people, culture or language community, not a state. Footprints
are coarse polygons of [longitude, latitude] points. They are trimmed to the
coastline by data/build-civilizations.py unless `clip=False` (island groups).

add(name, start, end, family, kind, languages, wikipedia_title, polygon, clip=True,
    lvl=2, line=None, note='')
`polygon` is one ring, or a list of rings for a split footprint. Years are CE
(negative = BCE).

A civilization is a *stage in time*: "who you belong to" in a place and period. Stages
that continue one another share a `line` (lineage id), so the panel can walk from
Proto-Dravidian to Sangam Tamil to modern Tamil. `lvl` is the scale of the
affinity: 1 broad sphere, 2 people (default), 3 local or regional identity
(shown only when zoomed in). `note` is one line on what holds the people together.
Helpers: box(west, south, east, north) and blob(lon, lat, rx, ry, rot=0) make
quick rough footprints.
"""
import math

FAMILIES = {
    'IE': ('Indo-European', '#5b86c9'),
    'AA': ('Afro-Asiatic', '#d98a3d'),
    'ST': ('Sino-Tibetan', '#c2574f'),
    'AN': ('Austronesian', '#3fa0a0'),
    'NC': ('Niger-Congo', '#5fa05f'),
    'NS': ('Nilo-Saharan and Khoe-San', '#a8a14a'),
    'UR': ('Uralic and Siberian', '#8b78bd'),
    'TM': ('Turkic, Mongolic and Tungusic', '#cdb050'),
    'DR': ('Dravidian and Munda', '#c46f8d'),
    'SE': ('Mainland Southeast Asian', '#8fb04f'),
    'JK': ('Japonic and Koreanic', '#5aa8cc'),
    'IS': ('Isolates and lost languages', '#8a929a'),
    'MA': ('Mesoamerican', '#a8704f'),
    'AD': ('Andean and Amazonian', '#b8956a'),
    'NA': ('Native North American', '#9a6fa4'),
    'PA': ('Papuan and Australian', '#a65a5a'),
}

CIVILIZATIONS = []


def add(name, start, end, family, kind, languages, wiki, polygon, clip=True,
        lvl=2, line=None, note=''):
    rings = polygon if isinstance(polygon[0][0], (list, tuple)) else [polygon]
    CIVILIZATIONS.append({
        'name': name, 's': start, 'e': end, 'family': family, 'kind': kind,
        'languages': languages, 'wiki': wiki, 'rings': rings, 'clip': clip,
        'lvl': lvl, 'line': line, 'note': note,
    })


def box(w, s, e, n):
    """A rectangle as one ring."""
    return [[w, s], [e, s], [e, n], [w, n]]


def blob(lon, lat, rx, ry, rot=0, n=14):
    """An ellipse (radii in degrees, rotated by `rot` degrees) as one ring."""
    a = math.radians(rot)
    out = []
    for i in range(n):
        t = 2 * math.pi * i / n
        x, y = rx * math.cos(t), ry * math.sin(t)
        out.append([round(lon + x * math.cos(a) - y * math.sin(a), 2),
                    round(lat + x * math.sin(a) + y * math.cos(a), 2)])
    return out


# ---- Near East and Egypt ----------------------------------------------------
add('Sumerians', -3400, -1900, 'IS', 'People', 'Sumerian (language isolate)', 'Sumer',
    [[44.0, 32.8], [46.0, 33.3], [48.0, 32.3], [48.6, 30.2], [47.3, 29.0], [45.0, 30.0], [44.0, 31.2]])
add('Akkadians and Babylonians', -2400, -539, 'AA', 'People', 'Afro-Asiatic (East Semitic: Akkadian)', 'Babylonia',
    [[42.5, 34.8], [45.5, 35.0], [47.8, 33.5], [46.6, 32.0], [44.0, 31.6], [42.6, 33.0]])
add('Assyrians', -2500, 2026, 'AA', 'People', 'Afro-Asiatic (Akkadian, later Aramaic)', 'Assyrian people',
    [[41.2, 37.6], [44.4, 37.5], [44.8, 35.6], [43.0, 34.6], [41.6, 35.5]])
add('Elamites', -3200, -539, 'IS', 'People', 'Elamite (language isolate)', 'Elam',
    [[47.6, 33.6], [50.2, 34.0], [52.6, 31.6], [53.2, 29.6], [50.6, 28.4], [48.6, 30.4]])
add('Ancient Egyptians', -3400, 639, 'AA', 'Civilization', 'Afro-Asiatic (Egyptian, later Coptic)', 'Ancient Egypt',
    [[29.2, 31.8], [32.5, 31.5], [34.4, 28.0], [33.2, 24.2], [33.8, 22.0], [31.2, 21.8], [30.0, 25.0], [29.0, 29.0]])
add('Egyptians', 640, 2026, 'AA', 'People', 'Afro-Asiatic (Egyptian Arabic; Coptic in liturgy)', 'Egyptians',
    [[29.2, 31.8], [32.5, 31.5], [34.4, 28.0], [33.2, 24.2], [33.8, 22.0], [31.2, 21.8], [30.0, 25.0], [29.0, 29.0]])
add('Nubians', -3000, 2026, 'NS', 'People', 'Nilo-Saharan (Nubian languages)', 'Nubia',
    [[30.2, 24.0], [34.0, 23.6], [35.0, 17.5], [33.0, 14.0], [30.2, 15.0], [29.2, 19.5]])
add('Canaanites and Phoenicians', -3000, -300, 'AA', 'People', 'Afro-Asiatic (Northwest Semitic)', 'Canaan',
    [[34.6, 36.0], [36.6, 35.8], [37.0, 33.0], [36.0, 30.6], [34.3, 31.3]])
add('Israelites', -1200, -586, 'AA', 'People', 'Afro-Asiatic (Hebrew)', 'Israelites',
    [[34.8, 33.2], [36.0, 33.0], [36.2, 31.2], [35.2, 30.6], [34.5, 31.5]])
add('Arameans', -1100, 700, 'AA', 'People', 'Afro-Asiatic (Aramaic)', 'Arameans',
    [[36.2, 36.8], [40.0, 36.8], [41.8, 34.8], [39.0, 32.5], [36.2, 33.5]])
add('Hurrians', -2300, -1000, 'IS', 'People', 'Hurro-Urartian', 'Hurrians',
    [[37.0, 37.8], [43.6, 38.0], [44.6, 36.2], [40.6, 35.8], [37.6, 36.2]])
add('Hittites and Luwians', -2000, -1181, 'IE', 'People', 'Indo-European (Anatolian)', 'Hittites',
    [[30.0, 40.6], [35.0, 41.5], [39.6, 40.0], [38.6, 37.0], [33.0, 36.8], [29.6, 38.0]])
add('Phrygians and Lydians', -1180, -100, 'IE', 'People', 'Indo-European (Phrygian, Anatolian)', 'Phrygians',
    [[26.0, 39.2], [31.0, 40.6], [33.6, 39.6], [32.2, 37.6], [27.6, 37.2]])
add('Armenians', -600, 2026, 'IE', 'People', 'Indo-European (Armenian)', 'Armenians',
    [[41.0, 41.0], [45.6, 41.2], [47.0, 39.5], [45.5, 38.0], [42.5, 37.8], [40.6, 39.0]])
add('Georgians', -600, 2026, 'IS', 'People', 'Kartvelian', 'Georgians',
    [[40.0, 42.9], [46.5, 42.6], [46.5, 41.0], [42.6, 41.2]])
add('Persians', -1000, 2026, 'IE', 'People', 'Indo-European (Iranian)', 'Persian people',
    [[46.0, 38.2], [54.0, 37.6], [61.0, 35.2], [61.6, 27.0], [57.0, 25.6], [52.0, 27.6], [48.6, 30.0], [46.0, 34.0]])
add('Kurds', 700, 2026, 'IE', 'People', 'Indo-European (Iranian)', 'Kurds',
    [[38.5, 38.2], [44.6, 39.6], [47.2, 37.2], [46.0, 34.0], [43.0, 34.0], [40.0, 36.6]])
add('Pashtuns', -500, 2026, 'IE', 'People', 'Indo-European (Iranian: Pashto)', 'Pashtuns',
    [[62.0, 34.0], [66.0, 36.4], [70.2, 36.0], [72.2, 32.0], [69.0, 29.0], [64.0, 30.0]])
add('Sogdians and Tajiks', -500, 2026, 'IE', 'People', 'Indo-European (Eastern Iranian, Tajik)', 'Sogdians',
    [[62.0, 40.0], [68.0, 41.4], [75.0, 40.0], [74.4, 36.6], [68.0, 36.6]])
add('Arabs', -900, 639, 'AA', 'People', 'Afro-Asiatic (Semitic: Arabic)', 'Arabs',
    [[35.0, 29.5], [38.0, 32.0], [44.0, 32.6], [48.0, 30.0], [52.0, 24.0], [59.6, 22.6], [57.0, 17.0],
     [52.0, 16.0], [43.0, 12.8], [40.0, 17.0], [36.0, 26.0]])
add('Arabs', 640, 2026, 'AA', 'People', 'Afro-Asiatic (Semitic: Arabic)', 'Arabs', [
    [[35.0, 29.5], [38.0, 32.0], [44.0, 32.6], [48.0, 30.0], [52.0, 24.0], [59.6, 22.6], [57.0, 17.0],
     [52.0, 16.0], [43.0, 12.8], [40.0, 17.0], [36.0, 26.0]],
    [[34.5, 36.8], [41.0, 37.2], [44.0, 36.0], [48.0, 31.2], [44.0, 33.0], [38.0, 33.0], [35.0, 31.0]],
    [[25.0, 31.8], [34.4, 31.4], [34.0, 23.0], [25.0, 22.0]],
    [[-13.0, 27.5], [-9.8, 35.7], [11.0, 37.3], [12.0, 33.0], [9.0, 28.0], [-1.0, 25.0]],
])

# ---- Europe ---------------------------------------------------------------
add('Yamnaya steppe peoples', -3400, -2300, 'IE', 'Culture', 'Indo-European (early; reconstructed)', 'Yamnaya culture',
    [[28.0, 47.0], [34.0, 50.0], [45.0, 51.5], [56.0, 51.0], [56.0, 47.0], [48.0, 45.5], [40.0, 45.0], [33.0, 44.5]])
add('Cucuteni and Danubian farmers', -3400, -2800, 'IS', 'Culture', 'Unknown (pre-Indo-European)', 'Cucuteni–Trypillia culture',
    [[24.0, 44.5], [24.0, 49.0], [30.0, 50.6], [32.5, 48.0], [29.0, 45.0]])
add('Megalith builders', -3400, -2400, 'IS', 'Culture', 'Unknown (pre-Indo-European)', 'Megalith', [
    [[-10.5, 51.5], [-5.5, 58.8], [-2.0, 58.8], [1.8, 52.5], [1.8, 50.5], [-5.5, 49.8]],
    [[-9.6, 36.8], [-9.6, 43.8], [-4.5, 48.7], [-1.5, 48.0], [-1.5, 43.5], [-6.0, 37.0]],
])
add('Corded Ware and Bell Beaker peoples', -2900, -1800, 'IE', 'Culture', 'Indo-European (early)', 'Corded Ware culture',
    [[4.0, 50.0], [8.0, 55.0], [18.0, 57.0], [30.0, 58.0], [30.0, 52.0], [20.0, 49.0], [10.0, 47.0]])
add('Uralic peoples', -3400, -500, 'UR', 'People', 'Uralic (early)', 'Uralic peoples',
    [[44.0, 55.0], [60.0, 64.0], [70.0, 64.0], [66.0, 56.0], [56.0, 53.0]])
add('Minoans', -3000, -1100, 'IS', 'Civilization', 'Minoan (undeciphered)', 'Minoan civilization',
    [[23.4, 35.7], [26.6, 35.7], [26.6, 34.8], [23.4, 34.8]])
add('Mycenaean Greeks', -1600, -1101, 'IE', 'Civilization', 'Indo-European (Mycenaean Greek)', 'Mycenaean Greece',
    [[20.5, 40.0], [24.0, 40.2], [24.5, 37.5], [23.0, 36.3], [21.5, 36.5], [20.5, 38.5]])
add('Ancient Greeks', -1100, -146, 'IE', 'People', 'Indo-European (Greek)', 'Ancient Greece', [
    [[19.5, 40.8], [23.0, 41.5], [26.5, 41.2], [28.5, 40.5], [28.0, 37.0], [26.5, 36.5], [22.5, 36.3], [19.5, 39.0]],
    [[12.5, 38.2], [16.0, 38.0], [17.2, 40.5], [16.0, 40.8], [14.5, 38.0]],
])
add('Greeks', -145, 2026, 'IE', 'People', 'Indo-European (Greek)', 'Greeks', [
    [[19.5, 41.0], [23.0, 41.6], [26.5, 41.4], [26.5, 36.5], [22.5, 36.3], [19.5, 39.0]],
    [[32.2, 35.0], [34.6, 35.6], [34.0, 34.6], [32.3, 34.6]],
])
add('Thracians', -1500, 400, 'IE', 'People', 'Indo-European (Thracian)', 'Thracians',
    [[22.5, 43.5], [28.5, 43.8], [29.0, 41.0], [26.0, 40.8], [23.5, 41.0]])
add('Illyrians', -1200, 300, 'IE', 'People', 'Indo-European (Illyrian)', 'Illyrians',
    [[13.5, 45.5], [19.0, 45.5], [21.5, 42.5], [20.0, 40.5], [17.0, 41.5]])
add('Etruscans', -900, -27, 'IS', 'People', 'Etruscan (language isolate)', 'Etruscan civilization',
    [[10.0, 44.0], [12.5, 43.5], [12.5, 41.5], [11.0, 41.7], [10.0, 42.5]])
add('Latins and Romans', -1000, 475, 'IE', 'People', 'Indo-European (Italic: Latin)', 'Italic peoples',
    [[7.0, 44.0], [12.0, 46.0], [13.5, 45.7], [18.5, 40.2], [16.0, 38.0], [12.5, 38.0], [8.5, 40.5], [9.5, 43.5]])
add('Italians', 476, 2026, 'IE', 'People', 'Indo-European (Romance: Italian)', 'Italians',
    [[7.0, 44.0], [12.0, 46.5], [13.8, 45.7], [18.5, 40.2], [16.0, 38.0], [12.5, 38.0], [8.5, 40.5], [9.5, 43.5]])
add('Iberians', -600, 100, 'IS', 'People', 'Iberian (language isolate)', 'Iberians',
    [[-2.0, 43.0], [3.2, 42.4], [3.2, 41.0], [0.5, 38.5], [-2.5, 36.7], [-5.5, 36.5], [-7.5, 37.5], [-6.5, 40.0], [-2.0, 41.0]])
add('Spanish and Portuguese', 476, 2026, 'IE', 'People', 'Indo-European (Romance: Castilian, Portuguese, Catalan)', 'Spaniards',
    [[-9.6, 36.9], [-9.6, 43.8], [-1.8, 43.5], [3.2, 42.4], [0.3, 38.5], [-2.0, 36.7], [-5.6, 36.0]])
add('Basques', -1000, 2026, 'IS', 'People', 'Basque (language isolate)', 'Basques',
    [[-3.3, 43.6], [-0.8, 43.5], [-0.8, 42.5], [-2.8, 42.4]])
add('French', 476, 2026, 'IE', 'People', 'Indo-European (Romance: French)', 'French people',
    [[-4.8, 48.5], [-1.5, 49.7], [2.5, 51.0], [6.0, 49.5], [7.5, 47.5], [7.0, 44.0], [3.0, 42.5], [-1.8, 43.4], [-1.5, 46.0]])
add('Celts', -800, -50, 'IE', 'People', 'Indo-European (Celtic)', 'Celts',
    [[-8.0, 43.5], [-1.0, 49.0], [3.0, 51.0], [8.0, 51.5], [14.0, 49.5], [16.0, 47.5], [12.0, 46.8], [7.0, 45.5], [3.0, 43.5]])
add('Britons and Gaels', -600, 450, 'IE', 'People', 'Indo-European (Celtic: Brythonic, Goidelic)', 'Britons (historical)',
    [[-10.5, 51.4], [-5.5, 58.8], [-2.0, 58.8], [1.5, 52.5], [1.0, 50.8], [-5.5, 49.9]])
add('Celtic fringe', 450, 2026, 'IE', 'People', 'Indo-European (Celtic: Welsh, Irish, Scottish Gaelic, Breton)', 'Celts', [
    [[-10.5, 51.4], [-10.0, 55.2], [-6.0, 55.4], [-5.8, 52.0], [-8.0, 51.3]],
    [[-5.3, 51.6], [-3.0, 51.4], [-3.0, 53.4], [-4.8, 53.4]],
    [[-6.6, 56.4], [-5.0, 58.7], [-3.0, 57.5], [-4.0, 56.2]],
    [[-4.8, 48.0], [-2.0, 48.0], [-2.5, 48.9], [-4.8, 48.8]],
])
add('Germanic peoples', -500, 299, 'IE', 'People', 'Indo-European (Germanic)', 'Germanic peoples',
    [[4.0, 52.0], [8.0, 56.0], [13.0, 57.5], [22.0, 56.0], [22.0, 52.0], [16.0, 50.5], [8.0, 49.5]])
add('Germans', 300, 2026, 'IE', 'People', 'Indo-European (Germanic: German)', 'Germans',
    [[6.0, 47.5], [6.0, 51.5], [7.0, 53.8], [14.0, 54.5], [18.5, 54.8], [18.0, 51.0], [16.0, 48.7], [17.0, 47.7], [13.0, 46.5], [9.5, 46.5]])
add('English', 450, 2026, 'IE', 'People', 'Indo-European (Germanic: English)', 'English people',
    [[-5.5, 50.0], [1.7, 51.0], [1.7, 53.0], [-0.5, 55.5], [-2.5, 55.8], [-3.2, 54.5], [-3.0, 53.0], [-4.5, 51.8]])
add('Scandinavians', 800, 2026, 'IE', 'People', 'Indo-European (North Germanic)', 'Scandinavians',
    [[4.5, 58.5], [5.0, 62.0], [12.0, 66.0], [18.0, 69.5], [28.0, 71.0], [30.0, 69.5], [22.0, 66.0], [24.0, 64.0],
     [22.0, 60.5], [18.5, 59.0], [18.0, 56.2], [12.5, 55.5], [11.0, 58.5]])
add('Icelanders', 874, 2026, 'IE', 'People', 'Indo-European (North Germanic: Icelandic)', 'Icelanders',
    [[-24.5, 63.3], [-13.3, 63.3], [-13.3, 66.6], [-24.5, 66.6]])
add('Balts', -1000, 2026, 'IE', 'People', 'Indo-European (Baltic)', 'Balts',
    [[19.5, 53.8], [21.5, 56.5], [21.0, 58.0], [28.0, 57.8], [28.0, 54.3], [23.5, 53.5]])
add('Early Slavs', 500, 899, 'IE', 'People', 'Indo-European (Slavic)', 'Slavs',
    [[16.0, 48.0], [17.0, 53.0], [24.0, 54.5], [34.0, 54.0], [35.0, 50.0], [30.0, 47.5], [22.0, 47.0]])
add('West Slavs', 900, 2026, 'IE', 'People', 'Indo-European (Slavic: Polish, Czech, Slovak)', 'West Slavs',
    [[12.0, 50.0], [14.0, 54.0], [24.0, 54.5], [24.0, 48.5], [17.0, 48.5]])
add('South Slavs', 600, 2026, 'IE', 'People', 'Indo-European (Slavic: Serbo-Croatian, Bulgarian, Slovene)', 'South Slavs',
    [[13.5, 46.5], [22.0, 46.0], [29.0, 44.0], [26.0, 41.5], [20.0, 41.5], [16.0, 44.0]])
add('East Slavs', 900, 1499, 'IE', 'People', 'Indo-European (Slavic: Russian, Ukrainian, Belarusian)', 'East Slavs',
    [[24.0, 48.5], [24.0, 54.0], [30.0, 59.0], [40.0, 60.0], [44.0, 58.0], [44.0, 50.0], [36.0, 47.0], [30.0, 46.0]])
add('Russians and East Slavs', 1500, 1799, 'IE', 'People', 'Indo-European (Slavic: Russian, Ukrainian, Belarusian)', 'Russians',
    [[24.0, 48.5], [24.0, 54.0], [28.0, 59.5], [34.0, 63.0], [56.0, 64.0], [62.0, 58.0], [54.0, 50.0], [44.0, 46.0], [36.0, 46.0], [30.0, 46.0]])
add('Russians and East Slavs', 1800, 2026, 'IE', 'People', 'Indo-European (Slavic: Russian, Ukrainian, Belarusian)', 'Russians',
    [[24.0, 48.5], [24.0, 54.0], [28.0, 59.5], [34.0, 63.0], [56.0, 64.0], [82.0, 62.0], [100.0, 56.0], [132.0, 48.5],
     [134.0, 44.0], [112.0, 50.5], [80.0, 52.0], [62.0, 52.0], [54.0, 50.0], [44.0, 46.0], [36.0, 46.0], [30.0, 46.0]])
add('Finns', -500, 2026, 'UR', 'People', 'Uralic (Finnic)', 'Finns',
    [[21.0, 60.0], [24.0, 61.5], [30.0, 62.0], [34.0, 66.0], [28.0, 66.5], [22.0, 64.0]])
add('Sámi', -500, 2026, 'UR', 'People', 'Uralic (Sámi)', 'Sámi people',
    [[14.0, 66.5], [20.0, 69.5], [29.0, 70.5], [41.0, 68.5], [33.0, 67.0], [24.0, 66.5], [18.0, 66.5]])
add('Hungarians', 895, 2026, 'UR', 'People', 'Uralic (Ugric: Hungarian)', 'Hungarians',
    [[16.5, 48.5], [22.8, 48.4], [22.5, 46.0], [19.0, 45.8], [16.5, 46.8]])
add('Samoyedic and Ob-Ugric peoples', -500, 2026, 'UR', 'People', 'Uralic (Samoyedic, Ugric)', 'Samoyedic peoples',
    [[56.0, 66.0], [70.0, 73.0], [90.0, 72.0], [84.0, 64.0], [66.0, 60.0]])

# ---- Eurasian steppe and Siberia ------------------------------------------
add('Scythians', -800, -200, 'IE', 'People', 'Indo-European (Iranian)', 'Scythians',
    [[28.0, 46.0], [34.0, 50.5], [50.0, 51.0], [68.0, 50.0], [70.0, 45.0], [54.0, 44.0], [46.0, 43.0], [36.0, 45.0]])
add('Sarmatians', -300, 400, 'IE', 'People', 'Indo-European (Iranian)', 'Sarmatians',
    [[38.0, 46.0], [50.0, 50.0], [62.0, 51.0], [60.0, 45.0], [48.0, 43.5], [40.0, 44.0]])
add('Xiongnu', -300, 400, 'TM', 'People', 'Unknown (Turkic or Mongolic ties debated)', 'Xiongnu',
    [[88.0, 52.0], [112.0, 52.0], [118.0, 44.0], [106.0, 38.0], [94.0, 40.0]])
add('Xianbei and early Mongols', 100, 900, 'TM', 'People', 'Mongolic (early)', 'Xianbei',
    [[100.0, 50.0], [122.0, 53.0], [124.0, 43.0], [110.0, 40.0], [98.0, 43.0]])
add('Turkic peoples', 400, 999, 'TM', 'People', 'Turkic', 'Turkic peoples',
    [[60.0, 52.0], [80.0, 52.0], [100.0, 52.0], [110.0, 47.0], [96.0, 41.0], [78.0, 40.0], [62.0, 42.0], [56.0, 46.0]])
add('Turkic peoples', 1000, 2026, 'TM', 'People', 'Turkic', 'Turkic peoples',
    [[48.0, 36.0], [50.0, 46.0], [60.0, 52.0], [80.0, 52.0], [94.0, 50.0], [86.0, 42.0], [80.0, 38.0], [68.0, 36.8], [58.0, 36.5]])
add('Anatolian Turks', 1071, 2026, 'TM', 'People', 'Turkic (Oghuz: Turkish)', 'Turkish people',
    [[26.0, 36.5], [26.0, 41.8], [36.0, 42.0], [42.0, 41.2], [44.5, 39.5], [42.0, 37.0], [36.0, 36.4]])
add('Azerbaijanis', 1000, 2026, 'TM', 'People', 'Turkic (Oghuz: Azerbaijani)', 'Azerbaijanis',
    [[44.5, 41.5], [49.5, 41.8], [49.0, 38.2], [46.0, 37.5], [44.2, 39.5]])
add('Mongols', 1000, 2026, 'TM', 'People', 'Mongolic', 'Mongols',
    [[88.0, 50.0], [100.0, 52.0], [119.0, 50.0], [116.0, 45.0], [110.0, 41.5], [98.0, 42.0], [90.0, 45.0]])
add('Tungusic peoples', -500, 2026, 'TM', 'People', 'Tungusic (Manchu, Evenki)', 'Tungusic peoples',
    [[119.0, 53.0], [135.0, 54.0], [140.0, 48.0], [134.0, 43.0], [125.0, 41.0], [121.0, 46.0]])
add('Evenks', -500, 2026, 'TM', 'People', 'Tungusic (Evenki)', 'Evenks',
    [[100.0, 66.0], [120.0, 70.0], [140.0, 62.0], [130.0, 54.0], [110.0, 52.0]])
add('Yakuts', 1200, 2026, 'TM', 'People', 'Turkic (Yakut)', 'Yakuts',
    [[110.0, 70.0], [140.0, 71.0], [148.0, 64.0], [135.0, 58.0], [116.0, 60.0]])
add('Chukchi and Kamchatkans', -2000, 2026, 'UR', 'People', 'Chukotko-Kamchatkan', 'Chukchi people',
    [[160.0, 62.0], [180.0, 69.5], [180.0, 65.0], [170.0, 60.0], [160.0, 56.0]])
add('Inuit', -2000, 2026, 'NA', 'People', 'Eskimo-Aleut (Inuit)', 'Inuit',
    [[-168.0, 66.0], [-160.0, 71.0], [-140.0, 70.0], [-120.0, 70.0], [-95.0, 72.0], [-80.0, 70.0], [-62.0, 66.0],
     [-55.0, 63.0], [-45.0, 60.0], [-58.0, 57.5], [-65.0, 59.0], [-78.0, 62.0], [-90.0, 64.0], [-100.0, 66.0],
     [-124.0, 67.0], [-141.0, 69.0], [-156.0, 65.0]])

# ---- South and Central Asia ------------------------------------------------
add('Indus Valley peoples', -3300, -1300, 'IS', 'Civilization', 'Unknown (script undeciphered)', 'Indus Valley Civilisation',
    [[66.5, 24.0], [68.0, 28.5], [70.5, 33.0], [74.0, 34.0], [77.5, 30.5], [78.0, 28.0], [74.0, 23.0], [72.0, 21.0], [69.0, 22.5]])
add('Indo-Aryan peoples', -1500, 2026, 'IE', 'People', 'Indo-European (Indo-Aryan)', 'Indo-Aryan peoples',
    [[68.0, 36.0], [75.0, 36.5], [80.0, 30.0], [89.0, 27.0], [92.0, 26.0], [88.0, 22.0], [82.0, 21.5], [76.0, 20.0],
     [73.0, 17.0], [72.0, 21.0], [68.0, 24.0], [66.0, 29.0]])
add('Bengalis', 800, 2026, 'IE', 'People', 'Indo-European (Indo-Aryan: Bengali)', 'Bengalis',
    [[86.0, 26.5], [92.5, 26.0], [92.0, 21.8], [88.0, 21.5]])
add('Sinhalese', -500, 2026, 'IE', 'People', 'Indo-European (Indo-Aryan: Sinhala)', 'Sinhalese people',
    [[79.8, 6.0], [81.9, 6.5], [81.2, 9.0], [79.8, 8.5]])
add('Dravidian peoples', -1500, 2026, 'DR', 'People', 'Dravidian', 'Dravidian peoples',
    [[73.5, 20.0], [78.0, 20.5], [82.0, 19.5], [85.0, 19.5], [80.0, 12.0], [79.8, 10.0], [77.5, 8.0], [76.0, 9.5], [74.5, 13.5]])
add('Munda peoples', -1500, 2026, 'DR', 'People', 'Austroasiatic (Munda)', 'Munda peoples',
    [[82.0, 24.0], [87.5, 24.0], [87.0, 21.0], [83.5, 20.5]])
add('Tibetans', -600, 2026, 'ST', 'People', 'Sino-Tibetan (Tibetic)', 'Tibetan people',
    [[78.0, 36.0], [88.0, 35.5], [95.0, 35.0], [101.0, 34.0], [102.0, 30.0], [98.0, 27.5], [92.0, 27.5], [85.0, 27.7], [79.0, 30.5]])
add('Burmans', 800, 2026, 'ST', 'People', 'Sino-Tibetan (Lolo-Burmese)', 'Bamar people',
    [[93.5, 25.0], [97.0, 24.0], [98.5, 18.0], [97.5, 15.5], [95.0, 15.8], [94.5, 20.0]])

# ---- East Asia -------------------------------------------------------------
add('Yellow River Neolithic cultures', -3400, -1700, 'ST', 'Culture', 'Sino-Tibetan (early; reconstructed)', 'Yangshao culture',
    [[103.0, 36.0], [107.0, 36.5], [112.0, 38.0], [116.0, 38.0], [118.0, 34.0], [114.0, 32.5], [108.0, 33.0]])
add('Liangzhu and Yangtze Neolithic', -3400, -2000, 'SE', 'Culture', 'Unknown', 'Liangzhu culture',
    [[118.0, 32.0], [122.0, 32.0], [122.0, 28.5], [118.0, 28.0]])
add('Huaxia', -1700, -207, 'ST', 'People', 'Sino-Tibetan (Old Chinese)', 'Huaxia',
    [[103.0, 35.0], [106.0, 38.0], [116.0, 40.0], [119.0, 35.0], [119.0, 31.0], [112.0, 29.5], [107.0, 31.0]])
add('Han Chinese', -206, 1299, 'ST', 'People', 'Sino-Tibetan (Sinitic)', 'Han Chinese',
    [[100.0, 38.0], [106.0, 41.0], [120.0, 41.0], [123.0, 38.0], [122.0, 32.0], [120.0, 27.0], [111.0, 22.0], [104.0, 23.0],
     [102.0, 29.0], [100.0, 33.0]])
add('Han Chinese', 1300, 2026, 'ST', 'People', 'Sino-Tibetan (Sinitic)', 'Han Chinese',
    [[98.0, 40.0], [106.0, 42.0], [121.0, 43.5], [126.0, 41.0], [123.0, 38.0], [122.0, 32.0], [120.0, 26.0], [112.0, 21.5],
     [108.0, 21.5], [103.0, 22.5], [101.0, 26.0], [102.0, 31.0], [100.0, 34.0]])
add('Baiyue peoples', -1000, 300, 'SE', 'People', 'Kra-Dai and Austroasiatic (probable)', 'Baiyue',
    [[100.0, 26.0], [108.0, 27.0], [116.0, 27.0], [122.0, 28.0], [122.0, 24.0], [110.0, 21.0], [103.0, 21.0], [100.0, 23.0]])
add('Tai peoples', 300, 2026, 'SE', 'People', 'Kra-Dai', 'Tai peoples',
    [[98.5, 20.5], [104.0, 21.0], [108.0, 22.5], [110.0, 25.5], [104.0, 26.5], [100.0, 24.0]])
add('Thai and Lao', 1000, 2026, 'SE', 'People', 'Kra-Dai (Thai, Lao)', 'Tai peoples',
    [[98.5, 20.5], [103.0, 18.5], [105.0, 15.0], [102.0, 12.5], [100.0, 13.5], [99.0, 16.5]])
add('Hmong–Mien peoples', -500, 2026, 'SE', 'People', 'Hmong–Mien', 'Hmong people',
    [[106.0, 29.0], [111.0, 28.5], [111.0, 25.0], [106.0, 24.5]])
add('Koreans', -2000, 2026, 'JK', 'People', 'Koreanic', 'Koreans',
    [[124.5, 38.5], [127.0, 41.5], [130.5, 42.5], [130.0, 35.0], [126.5, 34.2], [125.0, 37.0]])
add('Jōmon peoples', -3400, -301, 'IS', 'People', 'Unknown (Jōmon)', 'Jōmon period',
    [[130.0, 31.0], [132.0, 35.0], [137.0, 37.0], [141.0, 41.0], [142.5, 44.5], [145.0, 43.5], [141.0, 38.5],
     [140.0, 35.5], [135.0, 33.0], [131.0, 31.0]])
add('Yayoi peoples', -300, 699, 'JK', 'People', 'Japonic (early)', 'Yayoi period',
    [[129.5, 31.0], [130.5, 34.5], [136.0, 36.0], [140.0, 36.0], [141.0, 35.0], [136.0, 33.5], [132.0, 32.5]])
add('Japanese', 700, 2026, 'JK', 'People', 'Japonic', 'Japanese people',
    [[129.5, 31.0], [130.5, 35.0], [136.5, 37.5], [141.5, 41.5], [141.5, 39.0], [140.5, 35.0], [135.0, 33.0], [131.0, 31.0]])
add('Ainu', -500, 2026, 'IS', 'People', 'Ainu (language isolate)', 'Ainu people', [
    [[139.8, 41.4], [141.0, 45.6], [145.9, 44.3], [143.5, 41.9]],
    [[141.9, 46.0], [143.0, 46.2], [143.4, 49.2], [142.2, 49.0]],
])

# ---- Southeast Asia and Oceania --------------------------------------------
add('Taiwanese indigenous peoples', -3400, 2026, 'AN', 'People', 'Austronesian (Formosan)', 'Taiwanese indigenous peoples',
    [[119.8, 21.8], [122.2, 25.4], [122.2, 24.5], [121.2, 21.9]])
add('Austronesian peoples', -1500, 2026, 'AN', 'People', 'Austronesian (Philippine, Bornean, Sulawesi)', 'Austronesian peoples', [
    [[116.8, 4.8], [118.5, 11.5], [120.0, 18.8], [122.5, 19.5], [127.0, 16.5], [126.8, 5.8], [122.0, 4.8]],
    [[108.8, -4.0], [108.8, 2.0], [111.0, 4.8], [115.5, 7.0], [119.5, 5.2], [118.5, 0.0], [116.0, -4.2]],
    [[118.8, -5.8], [119.0, 1.2], [125.3, 1.8], [125.0, -2.0], [122.5, -5.5]],
])
add('Malays and Indonesians', -500, 2026, 'AN', 'People', 'Austronesian (Malayic, Javanese, Sundanese)', 'Malay people',
    [[95.0, 5.8], [98.0, 5.5], [103.5, 1.3], [106.0, -2.8], [102.0, -5.8], [105.5, -6.9], [114.8, -8.8], [114.0, -7.2],
     [109.0, -6.7], [105.0, -5.9], [100.0, -1.0], [96.0, 3.0]])
add('Khmer', -500, 2026, 'SE', 'People', 'Austroasiatic (Khmer)', 'Khmer people',
    [[102.0, 15.0], [106.0, 14.5], [107.5, 11.0], [104.5, 10.5], [102.5, 12.0]])
add('Mon', 400, 2026, 'SE', 'People', 'Austroasiatic (Mon)', 'Mon people',
    [[96.0, 19.0], [98.5, 18.5], [99.0, 14.5], [97.5, 15.0]])
add('Vietnamese', -1000, 999, 'SE', 'People', 'Austroasiatic (Vietic)', 'Vietnamese people',
    [[103.5, 23.0], [107.5, 22.5], [107.5, 18.5], [103.5, 20.0]])
add('Vietnamese', 1000, 2026, 'SE', 'People', 'Austroasiatic (Vietic)', 'Vietnamese people',
    [[103.5, 22.8], [108.0, 22.6], [109.5, 15.0], [108.2, 11.0], [106.0, 9.6], [104.8, 9.0], [105.4, 11.0],
     [106.0, 16.0], [105.0, 18.5], [103.5, 20.0]])
add('Cham', 200, 2026, 'AN', 'People', 'Austronesian (Chamic)', 'Cham people',
    [[107.8, 16.0], [109.4, 14.0], [109.2, 11.5], [108.0, 11.2]])
add('Lapita peoples', -1500, -501, 'AN', 'Culture', 'Austronesian (early Oceanic)', 'Lapita culture', [
    [[147.0, -3.0], [150.0, -6.0], [160.0, -10.5], [170.0, -17.0], [180.0, -19.5], [180.0, -14.0], [172.0, -11.0], [160.0, -6.0], [150.0, -2.0]],
    [[-180.0, -19.5], [-174.0, -21.0], [-171.0, -14.0], [-180.0, -14.0]],
], clip=False)
add('Samoans and Tongans', -1000, 2026, 'AN', 'People', 'Austronesian (Polynesian)', 'Polynesians',
    [[-177.0, -22.5], [-172.5, -22.5], [-170.5, -13.0], [-173.5, -13.0], [-177.0, -17.5]], clip=False)
add('Eastern Polynesians', 700, 2026, 'AN', 'People', 'Austronesian (Polynesian)', 'Polynesians',
    [[-160.0, -9.0], [-138.0, -8.0], [-134.0, -14.0], [-145.0, -23.0], [-160.0, -22.0]], clip=False)
add('Hawaiians', 1000, 2026, 'AN', 'People', 'Austronesian (Polynesian)', 'Native Hawaiians',
    [[-160.5, 18.8], [-154.5, 18.8], [-154.5, 22.4], [-160.5, 22.4]], clip=False)
add('Māori', 1250, 2026, 'AN', 'People', 'Austronesian (Polynesian: Māori)', 'Māori people',
    [[166.4, -46.7], [168.0, -44.5], [172.7, -40.5], [173.0, -34.4], [178.6, -37.7], [175.0, -41.8]])
add('Micronesians', -1500, 2026, 'AN', 'People', 'Austronesian (Micronesian)', 'Micronesians',
    [[134.0, 7.5], [139.0, 10.5], [149.0, 10.0], [160.0, 7.5], [165.0, 5.0], [160.0, 4.0], [148.0, 5.0], [138.0, 6.0]], clip=False)
add('Madagascar Malagasy', 500, 2026, 'AN', 'People', 'Austronesian (Malagasy)', 'Malagasy people',
    [[43.0, -25.5], [47.0, -25.2], [50.5, -15.5], [49.5, -12.0], [44.0, -16.5]])
add('Papuan peoples', -3400, 2026, 'PA', 'People', 'Papuan (many unrelated families)', 'Papuan peoples',
    [[131.0, -1.0], [141.0, -2.0], [150.0, -5.5], [150.5, -10.5], [143.0, -9.2], [138.0, -8.2], [134.0, -4.0]])
add('Melanesians', -1500, 2026, 'PA', 'People', 'Austronesian (Oceanic) and Papuan', 'Melanesians',
    [[150.0, -3.0], [156.0, -6.5], [168.0, -14.0], [168.5, -20.5], [165.0, -22.0], [160.0, -10.0], [152.0, -4.5]], clip=False)
add('Aboriginal Australians', -3400, 2026, 'PA', 'People', 'Australian (many families)', 'Aboriginal Australians',
    [[113.0, -22.0], [114.0, -34.5], [129.0, -33.0], [140.0, -38.0], [146.0, -39.0], [153.0, -31.0], [153.5, -25.0],
     [146.0, -18.5], [142.0, -10.8], [136.0, -12.0], [130.0, -12.0], [126.0, -14.5], [122.0, -17.0]])
add('Australians', 1788, 2026, 'IE', 'People', 'Indo-European (Germanic: English)', 'Australians', [
    [[138.0, -35.0], [153.5, -28.0], [153.0, -37.8], [141.0, -38.5], [135.0, -34.8]],
    [[114.8, -35.0], [116.5, -31.0], [115.0, -28.0], [114.0, -33.0]],
])

# ---- Africa ---------------------------------------------------------------
add('Saharan pastoralists', -3400, -2000, 'NS', 'Culture', 'Nilo-Saharan and Afro-Asiatic (probable)', 'African humid period',
    [[-10.0, 28.0], [10.0, 31.0], [25.0, 27.0], [30.0, 20.0], [20.0, 15.0], [0.0, 16.0], [-12.0, 20.0]])
add('Berbers', -3000, 639, 'AA', 'People', 'Afro-Asiatic (Berber)', 'Berbers',
    [[-9.5, 35.0], [-2.0, 35.5], [10.0, 37.2], [12.0, 33.0], [24.0, 32.0], [25.0, 28.0], [20.0, 22.0], [10.0, 22.0],
     [0.0, 22.0], [-9.0, 27.0], [-13.0, 28.0]])
add('Berbers', 640, 2026, 'AA', 'People', 'Afro-Asiatic (Berber)', 'Berbers',
    [[-10.0, 30.0], [-2.0, 35.2], [8.0, 36.5], [10.0, 33.0], [8.0, 29.0], [8.0, 24.0], [0.0, 20.0], [-6.0, 23.0], [-10.0, 26.0]])
add('Tuareg', 700, 2026, 'AA', 'People', 'Afro-Asiatic (Berber: Tamasheq)', 'Tuareg people',
    [[-4.0, 24.0], [4.0, 25.0], [10.0, 26.0], [11.0, 20.0], [4.0, 15.5], [-1.0, 17.0], [-4.0, 20.0]])
add('Cushitic peoples', -3000, 2026, 'AA', 'People', 'Afro-Asiatic (Cushitic)', 'Cushites',
    [[33.5, 22.0], [38.0, 21.0], [43.0, 13.0], [51.2, 11.5], [49.0, 2.0], [41.0, -1.0], [36.0, 3.0], [35.0, 10.0], [33.5, 15.0]])
add('Habesha (Ethiopian Semitic) peoples', -500, 2026, 'AA', 'People', 'Afro-Asiatic (Semitic: Amharic, Tigrinya, Ge\'ez)', 'Habesha peoples',
    [[36.5, 15.5], [40.0, 15.0], [40.0, 10.5], [37.5, 9.5], [36.0, 12.0]])
add('Nilotic peoples', -1000, 2026, 'NS', 'People', 'Nilo-Saharan (Nilotic)', 'Nilotic peoples',
    [[27.0, 10.0], [34.0, 12.0], [35.0, 4.0], [37.0, -2.0], [36.0, -4.0], [32.0, -1.0], [29.0, 3.0], [27.0, 6.0]])
add('Mandé peoples', 800, 2026, 'NC', 'People', 'Niger-Congo (Mande)', 'Mandé peoples',
    [[-13.0, 15.0], [-4.0, 15.5], [-4.0, 9.0], [-9.0, 8.0], [-12.0, 11.0]])
add('Songhai', 700, 2026, 'NS', 'People', 'Songhay (Nilo-Saharan)', 'Songhai people',
    [[-3.0, 17.5], [4.0, 17.0], [4.0, 13.0], [0.0, 12.5], [-3.0, 14.0]])
add('Hausa', 800, 2026, 'AA', 'People', 'Afro-Asiatic (Chadic: Hausa)', 'Hausa people',
    [[4.0, 14.0], [11.0, 14.0], [11.0, 10.5], [5.0, 10.5]])
add('Fula', 1000, 2026, 'NC', 'People', 'Niger-Congo (Atlantic: Fula)', 'Fula people',
    [[-17.0, 16.5], [-12.0, 16.5], [-3.0, 15.0], [5.0, 13.5], [14.0, 12.5], [14.0, 9.5], [5.0, 9.5], [-4.0, 12.0], [-14.0, 12.5]])
add('Yoruba', 600, 2026, 'NC', 'People', 'Niger-Congo (Yoruboid)', 'Yoruba people',
    [[2.5, 8.8], [5.8, 9.0], [6.0, 6.4], [2.7, 6.4]])
add('Igbo', 800, 2026, 'NC', 'People', 'Niger-Congo (Igboid)', 'Igbo people',
    [[6.2, 7.2], [8.4, 7.0], [8.0, 5.0], [6.3, 5.2]])
add('Akan', 1000, 2026, 'NC', 'People', 'Niger-Congo (Kwa: Akan)', 'Akan people',
    [[-3.2, 8.0], [0.7, 8.0], [0.7, 5.2], [-3.2, 5.2]])
add('Proto-Bantu peoples', -1000, -501, 'NC', 'People', 'Niger-Congo (Bantu, early)', 'Bantu expansion',
    [[6.5, 7.0], [11.5, 7.0], [13.0, 3.0], [9.0, 2.3], [7.0, 4.0]])
add('Bantu peoples', -500, 499, 'NC', 'People', 'Niger-Congo (Bantu)', 'Bantu peoples',
    [[9.0, 4.0], [14.0, 4.5], [22.0, 4.5], [30.0, 2.0], [34.0, -2.0], [33.0, -6.0], [27.0, -7.0], [20.0, -6.0], [14.0, -5.5], [9.0, -1.5]])
add('Bantu peoples', 500, 999, 'NC', 'People', 'Niger-Congo (Bantu)', 'Bantu peoples',
    [[9.0, 3.0], [14.0, 4.5], [22.0, 4.5], [30.0, 2.0], [34.0, -2.0], [40.0, -3.0], [39.0, -10.0], [35.0, -20.0],
     [33.0, -27.0], [30.0, -26.0], [24.0, -16.0], [15.0, -8.0], [9.0, -1.5]])
add('Bantu peoples', 1000, 2026, 'NC', 'People', 'Niger-Congo (Bantu)', 'Bantu peoples',
    [[9.0, 3.0], [14.0, 4.5], [22.0, 4.5], [31.0, 2.0], [41.0, -2.0], [40.5, -12.0], [35.0, -22.0], [32.5, -28.5],
     [27.0, -33.5], [20.0, -31.0], [16.0, -25.0], [12.5, -17.0], [11.7, -13.0], [9.0, -5.0]])
add('Khoisan', -3400, 1499, 'NS', 'People', 'Khoe-San (click languages)', 'Khoisan',
    [[11.7, -17.5], [20.0, -20.0], [27.0, -20.0], [28.0, -26.0], [26.0, -33.5], [18.0, -34.0], [15.0, -28.0]])
add('Khoisan', 1500, 2026, 'NS', 'People', 'Khoe-San (click languages)', 'Khoisan',
    [[17.0, -18.5], [25.0, -19.0], [25.0, -25.0], [20.0, -27.0], [16.0, -25.0]])
add('Swahili', 800, 2026, 'NC', 'People', 'Niger-Congo (Bantu: Swahili)', 'Swahili people',
    [[38.5, -11.0], [41.5, -12.0], [42.0, -1.0], [41.2, 3.5], [39.0, -3.0], [38.8, -7.0]])
add('Afrikaners', 1650, 2026, 'IE', 'People', 'Indo-European (Germanic: Afrikaans)', 'Afrikaners',
    [[17.8, -34.5], [27.0, -33.8], [30.0, -30.0], [25.0, -28.0], [19.0, -28.5]])

# ---- The Americas ----------------------------------------------------------
add('Olmecs', -1500, -401, 'MA', 'Civilization', 'Unknown (Mixe–Zoquean probable)', 'Olmecs',
    [[-96.2, 18.8], [-94.0, 18.4], [-94.2, 17.3], [-95.8, 17.3]])
add('Maya', -2000, 2026, 'MA', 'People', 'Mayan', 'Maya peoples',
    [[-92.5, 18.5], [-89.0, 21.3], [-87.0, 21.5], [-87.5, 17.5], [-88.5, 14.5], [-91.5, 14.5], [-92.5, 16.5]])
add('Zapotecs and Mixtecs', -500, 2026, 'MA', 'People', 'Oto-Manguean', 'Zapotec peoples',
    [[-98.0, 17.8], [-96.0, 18.0], [-95.0, 16.6], [-97.5, 16.0]])
add('Teotihuacan', -100, 550, 'MA', 'Civilization', 'Unknown', 'Teotihuacan',
    [[-99.8, 20.3], [-98.4, 20.3], [-98.4, 19.1], [-99.8, 19.1]])
add('Nahua peoples', 600, 2026, 'MA', 'People', 'Uto-Aztecan (Nahuatl)', 'Nahua peoples',
    [[-104.0, 21.0], [-98.0, 21.5], [-96.5, 19.0], [-97.5, 17.2], [-101.0, 17.3], [-103.5, 18.7]])
add('Ancestral Puebloans', -100, 1299, 'NA', 'Culture', 'Unknown', 'Ancestral Puebloans',
    [[-112.0, 38.0], [-108.0, 38.2], [-106.0, 36.0], [-107.0, 34.5], [-111.0, 34.8], [-112.5, 36.5]])
add('Pueblo peoples', 1300, 2026, 'NA', 'People', 'Tanoan, Keresan, Zuni, Hopi', 'Pueblo peoples',
    [[-111.5, 36.5], [-109.0, 36.5], [-106.0, 36.5], [-105.5, 34.5], [-108.0, 34.0], [-111.0, 35.0]])
add('Mississippian peoples', 800, 1599, 'NA', 'Culture', 'Muskogean, Siouan, Caddoan (probable)', 'Mississippian culture',
    [[-92.0, 37.5], [-88.0, 38.5], [-83.0, 36.0], [-82.0, 33.0], [-86.0, 31.5], [-91.0, 32.5], [-94.0, 35.0]])
add('Eastern Woodlands peoples', -1000, 1850, 'NA', 'People', 'Algonquian, Iroquoian, Siouan, Muskogean', 'Eastern Woodlands',
    [[-94.0, 48.0], [-76.0, 47.0], [-66.0, 45.0], [-75.0, 36.0], [-82.0, 31.0], [-92.0, 30.0], [-94.0, 36.0]])
add('Iroquois', 1000, 1799, 'NA', 'People', 'Iroquoian', 'Iroquois',
    [[-79.0, 44.0], [-74.0, 45.0], [-74.0, 42.2], [-78.5, 42.2]])
add('Plains peoples', 1000, 1880, 'NA', 'People', 'Siouan, Algonquian, Caddoan, Uto-Aztecan', 'Plains Indians',
    [[-112.0, 50.0], [-96.0, 50.0], [-96.0, 35.0], [-104.0, 29.0], [-111.0, 40.0]])
add('Pacific Northwest peoples', -3000, 2026, 'NA', 'People', 'Salishan, Wakashan, Tsimshianic, Haida', 'Indigenous peoples of the Pacific Northwest Coast',
    [[-135.0, 59.0], [-124.0, 49.0], [-123.0, 43.0], [-124.0, 47.7], [-130.0, 54.0]])
add('Californian peoples', -3400, 1849, 'NA', 'People', 'Many families (Penutian, Hokan, Uto-Aztecan)', 'Indigenous peoples of California',
    [[-124.0, 42.0], [-121.0, 40.0], [-117.0, 34.0], [-120.0, 34.4], [-123.0, 37.0]])
add('Dene (Athabaskan) peoples', -1000, 2026, 'NA', 'People', 'Na-Dene (Athabaskan)', 'Dene',
    [[-160.0, 65.0], [-140.0, 66.0], [-120.0, 64.0], [-110.0, 62.0], [-110.0, 56.0], [-125.0, 55.0], [-135.0, 60.0]])
add('Navajo and Apache', 1400, 2026, 'NA', 'People', 'Na-Dene (Southern Athabaskan)', 'Navajo',
    [[-112.0, 37.5], [-107.0, 37.0], [-105.0, 33.0], [-108.0, 31.5], [-112.0, 33.5]])
add('Caral–Supe civilization', -3000, -1800, 'AD', 'Civilization', 'Unknown', 'Caral–Supe civilization',
    [[-78.0, -9.0], [-76.5, -9.0], [-76.5, -11.5], [-78.5, -11.5]])
add('Chavín', -900, -201, 'AD', 'Culture', 'Unknown', 'Chavín culture',
    [[-78.5, -8.0], [-76.5, -8.0], [-76.5, -10.5], [-78.5, -10.5]])
add('Moche and Nazca', -200, 799, 'AD', 'Culture', 'Unknown (Mochica, Quechua probable)', 'Moche culture',
    [[-81.0, -4.5], [-78.0, -6.0], [-77.5, -11.0], [-75.5, -15.0], [-74.0, -15.5], [-76.0, -13.0], [-79.0, -8.0]])
add('Tiwanaku', 400, 1099, 'AD', 'Civilization', 'Puquina and Aymara (probable)', 'Tiwanaku',
    [[-71.0, -13.0], [-66.0, -14.5], [-66.0, -20.0], [-70.0, -19.5], [-71.5, -16.5]])
add('Quechua and Aymara', 1000, 2026, 'AD', 'People', 'Quechuan and Aymaran', 'Quechua people',
    [[-79.5, -1.0], [-76.5, -2.0], [-72.0, -10.0], [-68.0, -14.0], [-66.0, -22.0], [-68.5, -24.0], [-70.0, -20.0],
     [-72.0, -14.0], [-75.0, -10.0], [-78.0, -5.0], [-80.0, -3.0]])
add('Mapuche', 1000, 2026, 'AD', 'People', 'Mapudungun (isolate)', 'Mapuche',
    [[-73.5, -36.0], [-71.0, -36.5], [-71.5, -41.0], [-73.5, -42.0], [-73.8, -38.5]])
add('Amazonian peoples', -3400, 2026, 'AD', 'People', 'Many families (Arawakan, Cariban, Tupian...)', 'Indigenous peoples of the Amazon rainforest',
    [[-74.0, 3.0], [-60.0, 5.0], [-50.0, 2.0], [-48.0, -3.0], [-56.0, -9.0], [-66.0, -12.0], [-73.0, -8.0]])
add('Tupi–Guarani peoples', -1000, 1899, 'AD', 'People', 'Tupian (Tupi–Guarani)', 'Tupi people',
    [[-64.0, -9.0], [-58.0, -14.0], [-47.0, -24.0], [-41.0, -23.0], [-35.0, -6.0], [-48.0, -1.0], [-56.0, -4.0]])
add('Taíno and Caribbean peoples', -400, 1599, 'AD', 'People', 'Arawakan (Taíno)', 'Taíno',
    [[-85.0, 23.5], [-72.0, 20.5], [-65.0, 18.8], [-61.0, 16.0], [-61.0, 11.0], [-72.0, 12.0], [-79.0, 18.5]])
add('Brazilians', 1500, 1799, 'IE', 'People', 'Indo-European (Romance: Portuguese)', 'Brazilians',
    [[-50.0, -1.0], [-35.0, -5.0], [-39.0, -15.0], [-48.0, -28.0], [-53.0, -33.0], [-57.0, -30.0], [-52.0, -22.0], [-52.0, -12.0]])
add('Brazilians', 1800, 2026, 'IE', 'People', 'Indo-European (Romance: Portuguese)', 'Brazilians',
    [[-73.8, -7.5], [-60.0, 5.0], [-51.0, 4.5], [-34.8, -7.0], [-39.0, -17.5], [-48.0, -28.0], [-53.5, -33.5],
     [-57.5, -30.2], [-54.0, -26.0], [-58.0, -22.5], [-58.0, -16.0], [-65.0, -11.0], [-70.0, -10.5]])
add('Spanish-speaking Americans', 1520, 1799, 'IE', 'People', 'Indo-European (Romance: Spanish)', 'Hispanic America', [
    [[-105.0, 22.0], [-97.0, 26.0], [-97.5, 21.0], [-96.0, 18.5], [-91.0, 18.2], [-87.0, 21.4], [-88.5, 15.8], [-83.5, 11.0],
     [-80.0, 8.5], [-86.0, 11.0], [-92.0, 14.5], [-100.0, 17.0]],
    [[-80.5, 8.0], [-72.0, 11.5], [-69.0, 7.0], [-76.0, 0.0], [-80.5, -3.0], [-78.0, 2.0]],
    [[-81.0, -5.0], [-76.5, -14.0], [-70.3, -18.0], [-70.5, -33.0], [-72.0, -41.0], [-70.0, -34.0], [-68.0, -25.0], [-72.0, -12.0]],
])
add('Spanish-speaking Americans', 1800, 2026, 'IE', 'People', 'Indo-European (Romance: Spanish)', 'Hispanic America', [
    [[-117.2, 32.5], [-110.0, 31.3], [-103.0, 29.0], [-97.2, 25.9], [-97.7, 21.0], [-96.0, 18.5], [-91.0, 18.2], [-87.0, 21.4],
     [-88.5, 15.8], [-83.5, 11.0], [-80.0, 8.5], [-86.0, 11.0], [-92.0, 14.5], [-105.0, 20.0]],
    [[-78.5, 2.0], [-77.0, 8.5], [-72.0, 12.0], [-62.0, 10.7], [-60.0, 6.0], [-70.0, 0.5], [-72.0, -10.0], [-68.5, -11.0],
     [-66.0, -22.0], [-62.0, -24.0], [-58.0, -27.0], [-57.0, -34.0], [-58.5, -38.0], [-62.0, -40.0], [-65.5, -45.0],
     [-69.0, -51.0], [-72.0, -54.0], [-72.5, -45.0], [-73.5, -38.0], [-71.4, -30.0], [-70.3, -18.0], [-76.5, -14.0],
     [-81.0, -5.0], [-79.0, 1.0]],
])
add('Anglo-Americans', 1607, 1799, 'IE', 'People', 'Indo-European (Germanic: English)', 'Anglo-America',
    [[-81.5, 31.5], [-79.0, 36.0], [-75.0, 40.0], [-70.0, 43.0], [-67.0, 45.0], [-70.5, 41.5], [-75.5, 38.0], [-79.5, 33.5]])
add('Anglo-Americans', 1800, 1899, 'IE', 'People', 'Indo-European (Germanic: English)', 'Anglo-America',
    [[-97.0, 28.0], [-94.0, 34.0], [-95.0, 41.0], [-90.0, 47.5], [-83.0, 46.0], [-67.0, 45.0], [-70.0, 41.5],
     [-75.5, 36.0], [-81.5, 30.5], [-85.0, 30.0]])
add('Anglo-Americans', 1900, 2026, 'IE', 'People', 'Indo-European (Germanic: English)', 'Anglo-America',
    [[-124.5, 48.5], [-117.0, 49.0], [-96.0, 49.0], [-83.0, 46.0], [-67.0, 45.0], [-70.0, 41.5], [-75.5, 36.0],
     [-81.0, 30.5], [-85.0, 30.0], [-97.0, 26.5], [-106.0, 31.5], [-117.0, 32.4], [-121.0, 32.5], [-125.0, 38.0], [-125.0, 41.0]])
add('French Canadians', 1608, 2026, 'IE', 'People', 'Indo-European (Romance: French)', 'French Canadians',
    [[-79.0, 46.0], [-64.0, 49.5], [-59.5, 48.0], [-66.0, 45.0], [-73.5, 45.0], [-77.0, 45.5]])


# ---- Later batches (stages in time, local identities) ------------------------
import importlib  # noqa: E402

for _module in ('civilizations_more_1', 'civilizations_more_2', 'civilizations_more_3', 'civilizations_more_4'):
    importlib.import_module(_module).register()
