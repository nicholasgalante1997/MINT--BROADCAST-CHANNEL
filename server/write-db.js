import fs from 'fs';
import path from 'path';
import util from 'util';

import logger from './utils/Logger.js';
import pokeApiClient from './clients/PokeAPIClient.js';

let asyncFsWrite = util.promisify(fs.writeFile);

void (async () => {
  logger.info('Starting db rake...');

  const [, UPPER_BOUND] = pokeApiClient.getBDSPBounds();

  let pokemon = [];

  for (let index = 1; index <= UPPER_BOUND; index++) {
    logger.info('Trying to fetch pokemon json file with id of ' + index);
    const dataOrNull = await pokeApiClient.fetch(index);

    if (dataOrNull == null) {
      logger.warn(
        'pokeApiClient.fetch(...) has returned null for index: ' + index
      );
      logger.error('Failing operation wholesale to avoid corrupted write op.');
      process.exit(2);
    }

    if (dataOrNull != null) {
      const { moves, ...attrs } = dataOrNull;
      pokemon.push(attrs);
    }
  }

  let obj = {
    timestamp: new Date().toISOString(),
    pokeApiVersion: 'v2',
    fileVersion: 1,
    pokemon
  };

  await asyncFsWrite(
    path.resolve(process.cwd(), 'db', 'pokedex.json'),
    JSON.stringify(obj, null, 2),
    { encoding: 'utf-8' }
  )
    .then(() => logger.success('db:write operation completed successfully!'))
    .catch((e) =>
      logger.error('db:write emitted an error during the writeFile step\n%s', e)
    );
})();
