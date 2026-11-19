"""The fixed vocabulary shared by the batch writer and the checker."""

ALLOWED_TECH = ['Stone', 'Bronze', 'Iron', 'Steel', 'Gunpowder', 'Industrial', 'Nuclear']
ALLOWED_ARMS = ['infantry', 'cavalry', 'archers', 'chariots', 'navy', 'artillery', 'mixed']
WEALTH_BASES = ['GDP', 'revenue', 'treasury']
CONFIDENCE = ['high', 'medium', 'low']

# The earliest year each technology can honestly be "in regular military use" for a polity.
TECH_NOT_BEFORE = {'Stone': -10000, 'Bronze': -3300, 'Iron': -1200, 'Steel': -500,
                   'Gunpowder': 900, 'Industrial': 1760, 'Nuclear': 1945}

# Sources that are not sources.
BAD_SOURCES = {'n/a', 'na', 'none', 'unknown', 'various', 'general knowledge', 'common knowledge',
               'scholarly consensus', 'historical records', 'historians', 'estimate', 'estimates'}
