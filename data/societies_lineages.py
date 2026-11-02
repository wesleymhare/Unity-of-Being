"""Threads that join stages of one society through time, and broad umbrella entries.

LINES maps a lineage id to the entry names that belong to it (an entry name may
appear in several stages). Entries added with an explicit `line=` keep it.
LEVEL1 lists broad umbrella entries (language-family or cultural spheres); they are
drawn under the finer ones.
"""

LINES = {
    'mesopotamia': ['Sumerians', 'Akkadians and Babylonians'],
    'egypt': ['Ancient Egyptians', 'Egyptians'],
    'greek': ['Mycenaean Greeks', 'Ancient Greeks', 'Greeks'],
    'italic': ['Latins and Romans', 'Italians'],
    'iberia': ['Iberians', 'Spanish and Portuguese'],
    'celtic': ['Celts', 'Britons and Gaels', 'Celtic fringe'],
    'germanic': ['Germanic peoples', 'Germans'],
    'east-slavic': ['Early Slavs', 'East Slavs', 'Russians and East Slavs'],
    'turkic': ['Turkic peoples'],
    'mongolic': ['Xianbei and early Mongols', 'Mongols'],
    'china': ['Yellow River Neolithic cultures', 'Huaxia', 'Han Chinese'],
    'japan': ['Jōmon peoples', 'Yayoi peoples', 'Japanese'],
    'vietnam': ['Vietnamese'],
    'bantu': ['Proto-Bantu peoples', 'Bantu peoples'],
    'khoisan': ['Khoisan'],
    'berber': ['Berbers'],
    'polynesia': ['Lapita peoples', 'Samoans and Tongans', 'Eastern Polynesians'],
    'pueblo': ['Ancestral Puebloans', 'Pueblo peoples'],
    'andes': ['Caral–Supe civilization', 'Chavín', 'Moche and Nazca', 'Tiwanaku', 'Quechua and Aymara'],
    'brazil': ['Brazilians'],
    'hispanic-america': ['Spanish-speaking Americans'],
    'anglo-america': ['Anglo-Americans'],
    'albanian': ['Illyrians'],
    'dravidian': [],
}

LEVEL1 = [
    'Dravidian peoples', 'Indo-Aryan peoples', 'Austronesian peoples', 'Amazonian peoples',
    'Eastern Woodlands peoples', 'Pacific Northwest peoples', 'Californian peoples',
    'Plains peoples', 'Dene (Athabaskan) peoples', 'Turkic peoples', 'Uralic peoples',
    'Tungusic peoples', 'Papuan peoples', 'Aboriginal Australians', 'Melanesians',
    'Cushitic peoples', 'Nilotic peoples', 'Mandé peoples', 'Munda peoples',
    'Hmong–Mien peoples', 'Saharan pastoralists',
]
