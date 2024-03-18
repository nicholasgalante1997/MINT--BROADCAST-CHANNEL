import fs from 'fs';
import getSvgColors from 'get-svg-colors';
import path from 'path';
import util from 'util';

import pokeApiClient from './clients/PokeAPIClient.js';
import Logger from './utils/Logger.js';

const asyncFsWrite = util.promisify(fs.writeFile);

void (async () => {
  const pathToPokedexBlob = path.resolve(process.cwd(), 'db', 'pokedex.json');
  const blobAsString = fs.readFileSync(pathToPokedexBlob, {
    encoding: 'utf-8'
  });
  const pokemonBlob = JSON.parse(blobAsString);

  const pokemon = pokemonBlob.pokemon || [];

  const [, UPPER_BOUND] = pokeApiClient.getBDSPBounds();
  const colorsArr = [];
  for (let index = 1; index <= UPPER_BOUND; index++) {
    const svgPath = path.resolve(process.cwd(), 'svgs', `${index}.svg`);
    const colors = getSvgColors(svgPath);

    const fills = colors.fills.map((fill) => fill.hex());
    const strokes = colors.strokes.map((stroke) => stroke.hex());

    const uniqueColors = new Set([...fills, ...strokes]);

    const pokemonData = pokemon.find((pkmn) => pkmn.id === index);

    let data = {
      name: pokemonData.name,
      id: pokemonData.id,
      colors: Array.from(uniqueColors)
    };

    colorsArr.push(data);
  }

  let obj = {
    timestamp: new Date().toISOString(),
    fileVersion: 1,
    colors: colorsArr
  };

  await asyncFsWrite(
    path.resolve(process.cwd(), 'db', 'colors.json'),
    JSON.stringify(obj, null, 2),
    { encoding: 'utf-8' }
  )
    .then(() =>
      Logger.success('db:write-colors operation completed successfully!')
    )
    .catch((e) =>
      Logger.error(
        'db:write-colors emitted an error during the writeFile step\n%s',
        e
      )
    );
})();
