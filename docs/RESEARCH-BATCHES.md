# Researched figures from a chat model (batch workflow)

For the worldbuilding rows in `docs/POLITY-STATS.md` (population, cities, lingua franca and writing,
wealth in gold, standing troops, military tech). There is no API key and nothing runs by itself: the
owner pastes a Markdown file into a chat (DeepSeek, ChatGPT...) and pastes the reply back.

## Steps
1. **Open the next file** in `data/research/batches/` (`batch-001.md`, `batch-002.md`, ...). It holds the
   instructions and a table of about 15 polities with the years to answer for.
2. **Paste the whole file into the chat.** The model answers with one JSON array.
3. **Paste the reply to the assistant** (or save it as `data/research/replies/batch-001.json`).
4. **Check and merge:** `python data/research/ingest.py data/research/replies/batch-001.json`
   (`--dry-run` checks only). Python is at `%LOCALAPPDATA%\Programs\Python\Python312\python.exe`.
5. Rejections and reasons are appended to `data/research/ingest-log.md`; re-ask those polities if wanted.

## What the checker rejects
Field by field (a bad field is dropped, the rest of the snapshot is kept):
- a year the map does not show for that polity (so the Roman Empire at 900 CE, or year 0);
- a source that is missing, shorter than 8 characters, or "general knowledge", "various", "n/a"...;
- a confidence other than high, medium or low (the whole snapshot is dropped);
- population under 100 or over 2.5 billion; troops over a quarter of the population, over 1.5 million before
  1700 or over 15 million after; any city over 2 million before 1800 (40 million after) or above the polity's population;
- a technology that is not on the list or too early for the year (Gunpowder before 900, Industrial before 1760...);
- wealth that is not a positive tonnage with a basis of GDP, revenue or treasury;
- an unknown Wikidata id.

Accepted values are written with `by: "ai"`, so the app shows them as unverified. They never replace a
curated entry. A figure that passes is plausible, not true: a check can catch nonsense, not a confident
and reasonable-looking wrong answer, so a sample of each batch is worth checking by hand against Wikipedia.

## Making batches
`python data/research/make-batches.py [--min-years 100] [--size 15]` rewrites `data/research/batches/`.
The map's records are time slices, and one Wikidata id can carry unrelated periods, so each polity is split
into continuous runs (a gap over 60 years starts a new run) and each run is asked about separately, for one
to three years the map really covers. Big, long-lived polities come first.

Counts (18 Nov 2026), runs of at least: 500 years 86 (6 files), 300 years 233 (16), 200 years 404 (27),
100 years 693 (47), 50 years 1,015 (68). The default is 100 years (47 files of 15).

Fifteen per file is a guess at what fits in one reply; if replies get cut off, lower `--size`.
