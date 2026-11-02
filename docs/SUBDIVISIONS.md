# Provinces inside big polities

Big polities are drawn as one colour. From about zoom 3.4 their **provinces** appear inside them as
dashed internal borders, in the same colour as the parent, with their own names. Clicking one opens
its Wikipedia article, and the polity and its provinces are listed together as "Also here" chips.

Covered so far: Roman Empire, Achaemenid Empire, Sasanian Empire, Ottoman Empire, Han, Tang, Ming and
Qing China, Mughal Empire, British Raj. (Cliopatria already draws member states for realms such as the
Holy Roman Empire and France; those are unchanged.)

## These are approximations

No free dataset has historical province borders for these empires, so each province is **built from
modern boundaries**: a province is a list of modern countries and first-level units (Natural Earth,
public domain). For example, Roman Britannia is the United Kingdom, Roman Dacia is Romania, a Qing
province is its modern Chinese namesake. The result is clipped to the polity's Cliopatria shape for that
year, and any part of the polity no province covers goes to the nearest province so the polity is always
fully divided. Expect rough edges; the panel says so.

## Where the data lives

- `data/subdivisions_data.py`: the province lists (name, Wikipedia title, years, modern members).
- `data/build-subdivisions.py`: builds `public/data/subdivisions.geojson` (about 20 MB).
- `data/raw/ne/`: Natural Earth 10m admin-0 countries and admin-1 provinces (git-ignored).

Download the Natural Earth files once:

```
mkdir -p data/raw/ne && cd data/raw/ne
for f in ne_10m_admin_0_countries ne_10m_admin_1_states_provinces; do
  curl -L -o $f.geojson https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/$f.geojson
done
```

Then `python3 data/build-subdivisions.py` (a few minutes; needs shapely 2.1+).

## Adding a polity

Add a `polity('Exact Cliopatria name', 'era label', """...""")` block. One line per province:
`Name | Wikipedia title | start year | end year | members`, members separated by `;`.
A member is a country name (`Romania`) or a first-level unit (`a:Fars`, or `a:Punjab@Pakistan` when
the name is ambiguous). Specific `a:` units always win over a whole-country member, so "Spain" can mean
"the rest of Spain". The build prints warnings for names it cannot find and for large areas it had to
hand to the nearest province; fix those by adding provinces or members.

Province years matter: the shape is split wherever a province starts or ends, so a province that did not
exist yet is not drawn and its area goes to its neighbours.

## Known limits

- Borders follow modern lines, so they are wrong in detail (and sometimes in principle: Roman
  Pannonia is not Hungary). They show how an empire was divided, not exactly where.
- One definition per province, valid for all its years. Provinces that moved a lot are simplified.
- Some provinces are missing for periods when an empire's shape is unusual; those areas are absorbed by
  the nearest province.
