import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { performance } from 'node:perf_hooks';

import logger from './lib/Logger.js';
import OptionAsync from './lib/OptionAsync.js';
import pokeApiClient from './clients/PokeAPIClient.js';

async function run() {
  logRunStarted();
  const promises = getPromises();
  const pokemon = await resolvePromises(promises);
  const file = buildJSONObject(pokemon);
  const outpath = path.resolve(process.cwd(), 'db', 'pokedex.json');
  await writeFile(outpath, JSON.stringify(file), { encoding: 'utf-8' });
  logRunEnded();
}

function logRunStarted() {
  const startTime = performance.now();
  const writeDbRunFnStarted = `Blackthorn Server Event Started: write-db.js has been executed at ${startTime}`;
  logger.info(writeDbRunFnStarted);
}

function logRunEnded() {
  const endTime = performance.now();
  const writeDbRunFnEnded = `Blackthorn Server Event Started: write-db.js has been finished op at ${endTime}`;
  logger.info(writeDbRunFnEnded);
}

function getPromises() {
  const [, UPPER_BOUND] = pokeApiClient.getBDSPBounds();
  let pokemonPromises = [];
  for (let index = 1; index < UPPER_BOUND + 1; index++) {
    appendPromise(index, pokemonPromises);
  }
  return pokemonPromises;
}

function appendPromise(index, promises) {
  const asyncOption = new OptionAsync(fetchPokemon.bind(this, index));
  promises.push(asyncOption.asPromise());
}

async function fetchPokemon(index) {
  const result = await pokeApiClient.fetch(index);
  if (result) {
    const { moves, game_indices, stats, past_abilities, past_types, ...attrs } = result;
    return { ...attrs };
  } else {
    throw new Error('PokeApiClient#fetch(...) failed during pull operation.\nFailing ID: ' + index);
  }
}

async function resolvePromises(promises) {
  return await Promise.all(promises)
    .then((pokemon) => pokemon.sort((a, b) => a.id - b.id))
    .catch((e) => {
      logger.error('Promise.all(...) failed. Closing operation before write event.');
      throw e;
    });
}

function buildJSONObject(pokemon) {
  return {
    timestamp: new Date().toISOString(),
    pokeApiVersion: 'v2',
    fileVersion: '1.1',
    pokemon
  };
}

await run();
