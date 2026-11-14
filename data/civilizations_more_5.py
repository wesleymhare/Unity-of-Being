"""Civilizations batch 5: finer regional peoples inside large European peoples (owner
request, 13 November 2026: "germans is still there but there are also smaller circles
like swabians saxons etc").

Everything here is lvl 3 (a regional identity), drawn as a deeper shade inside the
broad people and shown only when zoomed in. The broad entries (Germans, French,
Poles, English...) stay as they are; these nest inside them. Footprints are the
core and long-term home of each community, deliberately rough.
"""
from civilizations_data import add, blob, box  # noqa: F401


def S(name, s, e, fam, kind, lang, wiki, poly, lvl=3, line=None, note='', clip=True):
    add(name, s, e, fam, kind, lang, wiki, poly, lvl=lvl, line=line, note=note, clip=clip)


def register():
    # ---- Germans: the old stem duchies and dialect regions ---------------------------
    # Already elsewhere: Alemanni and Swabians, Bavarians and Austrians, Frisians,
    # Alsatians and Lorrainers, Swiss, Pennsylvania Germans.
    S('Old Saxons', 300, 1179, 'IE', 'People', 'Old Saxon (Low German)', 'Old Saxons',
      [[6.6, 51.4], [6.9, 53.4], [9.0, 54.0], [11.2, 53.6], [11.6, 52.0], [10.0, 51.3], [8.0, 51.2]],
      line='saxons', note='Pagan Germanic tribes between the Rhine and the Elbe, conquered and converted by Charlemagne; their duchy was broken up in 1180.')
    S('Lower Saxons', 1180, 2026, 'IE', 'People', 'Low German (Northern Low Saxon, Eastphalian)', 'Lower Saxony',
      [[7.0, 52.2], [7.2, 53.4], [9.0, 53.9], [11.0, 53.4], [11.4, 52.2], [10.2, 51.5], [8.8, 51.8]],
      line='saxons', note='Low German-speaking heirs of the Old Saxons around Hanover, Brunswick and Bremen.')
    S('Westphalians', 1180, 2026, 'IE', 'People', 'Westphalian (Low German)', 'Westphalia',
      [[6.4, 51.3], [6.7, 52.4], [8.0, 52.6], [9.3, 52.0], [9.2, 51.2], [7.8, 50.9]],
      line='saxons', note='The western Saxon lands of Münster, Paderborn and the Ruhr, with their own Low German dialects.')
    S('Holsteiners and Mecklenburgers', 1100, 2026, 'IE', 'People', 'Low German (Holsatian, Mecklenburgish)', 'Low German',
      [[8.6, 53.5], [8.8, 54.8], [10.8, 54.6], [14.3, 54.3], [14.2, 53.2], [11.3, 53.0], [9.6, 53.4]],
      note='Low German speakers of the Baltic coast, in Holstein (Saxon) and Mecklenburg (Germanised Slavic lands).')
    S('Upper Saxons', 1089, 2026, 'IE', 'People', 'Upper Saxon (East Central German)', 'Upper Saxon German',
      box(11.9, 50.2, 15.0, 51.7),
      note='Germans of the Margraviate of Meissen, later the Kingdom and Free State of Saxony (Dresden, Leipzig); the name moved here from the old Saxons.')
    S('Thuringians', 400, 2026, 'IE', 'People', 'Thuringian (East Central German)', 'Thuringii',
      box(9.9, 50.2, 12.6, 51.6),
      note='A kingdom of the Thuringii until the Franks conquered it in 531, then a German land of forests and small courts.')
    S('Franconians', 900, 2026, 'IE', 'People', 'East Franconian German', 'Franconia',
      box(9.0, 49.0, 12.3, 50.6),
      note='Germans of the old stem duchy of Franconia (Nuremberg, Würzburg, Bamberg), Bavarian citizens since 1806 but not Bavarians.')
    S('Hessians', 900, 2026, 'IE', 'People', 'Hessian (Rhine Franconian)', 'Hessians',
      box(8.0, 49.4, 10.2, 51.6),
      note='Descendants of the Chatti; the Landgraviate of Hesse, Frankfurt and the Hessian dialects.')
    S('Rhinelanders', 900, 2026, 'IE', 'People', 'Ripuarian and Moselle Franconian', 'Rhineland',
      [[6.0, 49.5], [5.9, 50.8], [6.2, 51.6], [7.3, 51.4], [7.9, 50.4], [7.6, 49.6]],
      note='Catholic, wine-growing Rhine and Moselle lands of Cologne, Aachen, Bonn and Trier.')
    S('Palatines', 1100, 2026, 'IE', 'People', 'Palatine German (Rhine Franconian)', 'Palatinate (region)',
      box(7.0, 49.0, 8.6, 49.8),
      note='The Electoral Palatinate; many emigrated to America in the 1700s, the origin of the Pennsylvania Germans.')
    S('Brandenburgers and Berliners', 1157, 2026, 'IE', 'People', 'Brandenburgish (Low German), Berlinerisch', 'Brandenburg',
      [[11.3, 52.0], [11.6, 53.2], [13.5, 53.5], [14.6, 52.9], [14.7, 51.6], [12.8, 51.6]],
      note='The Mark of Brandenburg, colonised from the Slavic lands, core of Prussia and home of Berlin.')
    S('Pomeranians', 1100, 1945, 'IE', 'People', 'East Low German (Pomeranian)', 'Pomeranians (German people)',
      [[12.6, 53.6], [12.8, 54.5], [14.5, 54.2], [16.6, 54.6], [18.0, 54.8], [18.2, 53.7], [16.0, 53.2], [14.0, 53.2]],
      note='German Pomerania along the Baltic; the eastern part was expelled to Germany in 1945 and became Polish.')
    S('East Prussians', 1230, 1945, 'IE', 'People', 'Low Prussian and High Prussian German', 'East Prussia',
      box(19.5, 53.3, 22.9, 55.3),
      note='Lands won by the Teutonic Knights from the Old Prussians and settled by Germans; emptied by flight and expulsion in 1945.')
    S('Silesians (German Silesia)', 1200, 1945, 'IE', 'People', 'Silesian German, Polish, Silesian', 'Silesians',
      [[14.8, 51.3], [15.3, 51.8], [17.0, 51.7], [18.7, 50.8], [19.0, 50.0], [17.6, 49.9], [16.3, 50.3]],
      line='silesians', note='A rich Habsburg and then Prussian province of German and Slavic Silesians, Breslau its capital; Lower Silesia was expelled to Germany in 1945.')
    S('Silesians (Upper Silesia)', 1946, 2026, 'IE', 'People', 'Silesian (Lechitic), Polish', 'Silesians',
      box(17.6, 49.8, 19.3, 50.8),
      line='silesians', note='Autochthonous Upper Silesians in Poland and Czechia, many of whom count themselves a nationality of their own.')
    S('Sudeten Germans', 1200, 1946, 'IE', 'People', 'German (Bavarian, East Franconian, Silesian dialects)', 'Sudeten Germans',
      [box(12.1, 50.2, 15.5, 51.0), box(12.1, 48.6, 13.3, 50.2), box(16.6, 49.8, 18.0, 50.4)],
      note='German-speaking rim of Bohemia and Moravia; annexed by Germany in 1938 and expelled after 1945.')
    S('Sorbs', 600, 2026, 'IE', 'People', 'Upper and Lower Sorbian (West Slavic)', 'Sorbs',
      box(13.6, 51.0, 15.0, 52.0),
      note='A Slavic people of Lusatia who have kept their languages inside Germany for fourteen centuries.')
    S('Luxembourgers', 963, 2026, 'IE', 'People', 'Luxembourgish (Moselle Franconian), French, German', 'Luxembourgers',
      box(5.7, 49.45, 6.5, 50.2),
      note='A Moselle Franconian people who became a nation of their own with a trilingual state.')
    S('Tyroleans', 1140, 2026, 'IE', 'People', 'Southern Bavarian German, Ladin, Italian', 'Tyrol (state)',
      box(10.1, 46.4, 12.9, 47.6),
      note='Alpine Tyrol, Austrian since 1363; the south was given to Italy in 1919 and keeps its German speech.')

    # ---- Germans abroad ----------------------------------------------------------
    S('Baltic Germans', 1200, 1939, 'IE', 'People', 'German', 'Baltic Germans',
      [[21.0, 56.0], [21.6, 57.6], [23.5, 59.4], [28.0, 59.4], [27.5, 57.5], [26.5, 55.8]],
      note='The German nobility and town burghers of Livonia and Estonia, resettled by Hitler in 1939.')
    S('Transylvanian Saxons', 1150, 1990, 'IE', 'People', 'Transylvanian Saxon (Moselle Franconian)', 'Transylvanian Saxons',
      box(23.5, 45.6, 25.8, 46.8),
      note='Germans invited by Hungarian kings, with fortified church villages; most left Romania for Germany around 1990.')
    S('Danube Swabians', 1700, 1945, 'IE', 'People', 'German (mixed Rhenish and Bavarian dialects)', 'Danube Swabians',
      box(18.5, 44.5, 22.5, 46.6),
      note='Settlers of the Banat, Bačka and Swabian Turkey after the Ottomans left; expelled or deported after 1944.')
    S('Volga Germans', 1764, 1941, 'IE', 'People', 'German (Hessian and Palatine dialects)', 'Volga Germans',
      box(44.5, 50.0, 47.5, 52.5),
      note='Farmers invited by Catherine the Great; their autonomous republic was dissolved and they were deported to Siberia and Kazakhstan in 1941.')

    # ---- Baltic and West Slavic --------------------------------------------------------
    S('Old Prussians', 500, 1400, 'IE', 'People', 'Old Prussian (West Baltic)', 'Old Prussians',
      box(19.3, 53.3, 22.9, 55.2),
      note='A Baltic people conquered by the Teutonic Knights; their language died out around 1700 and their name passed to the German state.')
    S('Kashubians', 1100, 2026, 'IE', 'People', 'Kashubian (Pomeranian Lechitic)', 'Kashubians',
      box(17.2, 53.8, 18.6, 54.8),
      note='West Slavs of Pomerania west of Gdańsk, the only surviving Pomeranian Slavs, with their own language.')
    S('Masurians', 1500, 1945, 'IE', 'People', 'Masurian Polish dialect, German', 'Masurians',
      box(20.4, 53.3, 22.6, 54.2),
      note='Lutheran, Polish-speaking people of southern East Prussia, most of whom left for Germany after 1945.')
    S('Gorals', 1300, 2026, 'IE', 'People', 'Goral dialects (Polish and Slovak)', 'Gorals',
      box(19.0, 49.1, 20.6, 49.8),
      note='Highland herders of the Tatras and Beskids on both sides of the Polish-Slovak border.')
    S('Moravians', 830, 2026, 'IE', 'People', 'Moravian dialects of Czech', 'Moravians',
      box(15.4, 48.6, 18.6, 50.2),
      note='Heirs of Great Moravia, the first West Slavic state; a regional identity within the Czechs.')

    # ---- East Slavic --------------------------------------------------------------------
    S('Rusyns', 1000, 2026, 'IE', 'People', 'Rusyn (East Slavic)', 'Rusyns',
      box(21.8, 48.0, 24.6, 49.5),
      note='Greek Catholic and Orthodox highlanders of the Carpathians, in Slovakia, Ukraine and Poland.')
    S('Hutsuls', 1500, 2026, 'IE', 'People', 'Hutsul dialect (Ukrainian)', 'Hutsuls',
      box(24.0, 47.7, 25.6, 48.6),
      note='A Ukrainian highland people of the eastern Carpathians, known for wood-carving and their own customs.')
    S('Pomors', 1200, 2026, 'IE', 'People', 'Pomor dialects (Russian)', 'Pomors',
      [[33.0, 64.0], [35.0, 66.8], [41.0, 66.6], [44.5, 66.3], [44.5, 63.8], [38.0, 63.2]],
      note='Russian settlers of the White Sea coast, fishers, sealers and seafarers of the Arctic.')

    # ---- Britain ------------------------------------------------------------------
    S('Northumbrians and Geordies', 600, 2026, 'IE', 'People', 'Northumbrian English', 'Northumbria',
      box(-2.7, 54.5, -1.2, 55.8),
      note='North-east England, the old kingdom of Northumbria, with Tyneside and its Geordie speech.')
    S('Yorkshire folk', 875, 2026, 'IE', 'People', 'Yorkshire English', 'Yorkshire',
      box(-2.6, 53.3, -0.1, 54.6),
      note='England’s largest county, Viking York at its heart, with a strong regional identity.')
    S('West Country folk', 700, 2026, 'IE', 'People', 'West Country English', 'West Country',
      [[-4.6, 50.3], [-4.4, 51.2], [-3.0, 51.6], [-1.8, 51.6], [-1.8, 50.6], [-3.0, 50.5]],
      note='The old kingdom of Wessex in the south-west, east of Cornwall: Devon, Somerset, Dorset and Bristol.')

    # ---- France and Belgium -----------------------------------------------------
    S('Walloons', 1000, 2026, 'IE', 'People', 'French, Walloon (Oïl)', 'Walloons',
      box(3.0, 49.5, 6.4, 50.8),
      note='French-speaking Belgians of the south, from the Meuse coal and steel valley to the Ardennes.')
    S('Picards', 900, 2026, 'IE', 'People', 'Picard (Oïl), French', 'Picardy',
      box(1.4, 49.2, 4.2, 50.4),
      note='The northern French plain of Amiens and Lille, with its own Oïl language, Picard.')
    S('Burgundians', 900, 2026, 'IE', 'People', 'French, Burgundian (Oïl)', 'Burgundy',
      box(3.0, 46.2, 5.5, 48.4),
      note='Named after a Germanic people who settled here in 443; a duchy that rivalled the French crown in the 1400s.')
    S('Gascons', 900, 2026, 'IE', 'People', 'Gascon (Occitan), French', 'Gascons',
      box(-1.5, 42.9, 1.5, 44.6),
      note='Occitan speakers of the south-west, between the Garonne and the Pyrenees, next to the Basques.')
    S('Provençals', 900, 2026, 'IE', 'People', 'Provençal (Occitan), French', 'Provence',
      box(4.6, 43.1, 7.0, 44.5),
      note='The oldest Roman province outside Italy, a land of Occitan poetry and Mediterranean towns.')
    S('Auvergnats', 900, 2026, 'IE', 'People', 'Auvergnat (Occitan), French', 'Auvergne',
      box(2.0, 44.6, 3.9, 46.3),
      note='Highlanders of the Massif Central, named after the Gaulish Arverni of Vercingetorix.')

    # ---- Iberia -------------------------------------------------------------------
    S('Asturians', 718, 2026, 'IE', 'People', 'Asturian (Astur-Leonese), Spanish', 'Asturians',
      box(-7.2, 42.9, -4.5, 43.7),
      note='Where the Christian kingdoms began after 718; a mining and dairy coast with its own Astur-Leonese tongue.')
    S('Aragonese', 1035, 2026, 'IE', 'People', 'Spanish, Aragonese', 'Aragonese people',
      box(-1.9, 40.0, 0.8, 42.9),
      note='The old Kingdom of Aragon along the Ebro, Zaragoza its capital, which joined Castile in 1479.')
    S('Guanches', -500, 1496, 'AA', 'People', 'Guanche (Berber)', 'Guanches',
      box(-18.2, 27.6, -13.4, 29.5),
      line='canary', note='The Berber-descended first people of the Canary Islands, conquered by Castile by 1496.')
    S('Canarians', 1497, 2026, 'IE', 'People', 'Canarian Spanish', 'Canarians',
      box(-18.2, 27.6, -13.4, 29.5),
      line='canary', note='Islanders of mixed Castilian, Portuguese, Guanche and African descent, a bridge to Latin America.')

    # ---- Italy and Greece -------------------------------------------------------------
    S('Friulians', 1000, 2026, 'IE', 'People', 'Friulian (Rhaeto-Romance), Italian', 'Friulians',
      box(12.3, 45.6, 13.9, 46.65),
      note='A Rhaeto-Romance people of the north-east, under Venice and Austria before Italy.')
    S('Ligurians and Genoese', 1000, 2026, 'IE', 'People', 'Ligurian (Gallo-Italic), Italian', 'Republic of Genoa',
      [[7.5, 43.8], [7.6, 44.4], [8.9, 44.7], [10.0, 44.4], [10.0, 44.0], [8.7, 44.3]],
      note='The Genoese coast, a seafaring and banking republic for seven centuries.')
    S('Emilians and Romagnols', 1000, 2026, 'IE', 'People', 'Emilian and Romagnol (Gallo-Italic), Italian', 'Emilia-Romagna',
      box(9.2, 43.7, 12.8, 45.1),
      note='The Po plain south of the river, from Piacenza to Bologna and Ravenna.')
    S('Cretans', 1000, 2026, 'IE', 'People', 'Cretan Greek', 'Cretans',
      box(23.4, 34.8, 26.4, 35.7),
      note='Greeks of Crete, under Venice and the Ottomans before joining Greece in 1913, with a strong island identity.')

    # ---- Nordic -------------------------------------------------------------------
    S('Faroese', 900, 2026, 'IE', 'People', 'Faroese (North Germanic)', 'Faroese people',
      box(-7.8, 61.3, -6.1, 62.5),
      note='Descendants of Norse settlers in the North Atlantic, with a language and parliament of their own.')
