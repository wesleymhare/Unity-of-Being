// Downloads the Maddison Project Database 2023 (GDP per person and population from 1 CE).
//   Bolt, J. and van Zanden, J. L. (2024), "Maddison style estimates of the evolution of the
//   world economy: A new 2023 update", Journal of Economic Surveys, doi:10.1111/joes.12618.
//   Licence: Creative Commons Attribution 4.0 International (checked on the GGDC page).
//   File: https://doi.org/10.34894/INZBF2 (DataverseNL, datafile 421302 = mpd2023_web.xlsx).
import { mkdirSync, writeFileSync } from 'node:fs';

mkdirSync('data/raw/maddison', { recursive: true });
const response = await fetch('https://dataverse.nl/api/access/datafile/421302');
if (!response.ok) throw new Error(`Download failed: ${response.status}`);
writeFileSync('data/raw/maddison/mpd2023_web.xlsx', Buffer.from(await response.arrayBuffer()));
console.log('Saved data/raw/maddison/mpd2023_web.xlsx. Next: npm run data:maddison:build');
