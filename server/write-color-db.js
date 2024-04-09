import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { performance } from 'node:perf_hooks';

import getSvgColors from 'get-svg-colors';

import pokeApiClient from './clients/PokeAPIClient.js';

import Logger from './lib/Logger.js';

const POKEMONDB_PATH = path.resolve(process.cwd(), 'db', 'pokedex.json');

async function readPokemonDb() {
  const dbAsString = await readFile(POKEMONDB_PATH, { encoding: 'utf-8' });
  if (dbAsString) {
    return JSON.parse(dbAsString);
  }

  throw new Error('readPokemonDb failed.');
}

function getSvgPath(index) {
  return path.resolve(process.cwd(), 'public', 'assets', 'svgs', `${index}.svg`);
}

function getUniqueColorsFromSvg(colors) {
  const fills = colors.fills.map((fill) => fill.hex());
  const strokes = colors.strokes.map((stroke) => stroke.hex());
  const uniqueColors = new Set([...fills, ...strokes]);
  return Array.from(uniqueColors);
}

function buildColorObject(pokemon, index, uniqueColors) {
  const found = pokemon.find(({ id }) => {
    return id === index;
  });

  if (found == null) {
    throw new Error('buildColorObject(...) failed. Indexed a null element from PokemonDB.pokemon array.');
  }

  return {
    id: index,
    name: found.name,
    colors: uniqueColors
  };
}

function addColorObject(colors, object) {
  colors.push(object);
}

async function getColors() {
  const pokemonDb = await readPokemonDb();
  const pokemon = pokemonDb?.pokemon || [];
  const [, UPPER_BOUND] = pokeApiClient.getBDSPBounds();
  const pokemonColorObjects = [];
  for (let index = 1; index < UPPER_BOUND + 1; index++) {
    const colors = getUniqueColorsFromSvg(getSvgColors(getSvgPath(index)));
    addColorObject(pokemonColorObjects, buildColorObject(pokemon, index, colors));
  }
  return pokemonColorObjects;
}

function buildJSONDBObject(colors) {
  return {
    timestamp: new Date().toISOString(),
    version: '1.1',
    colors
  };
}

function logRunStarted() {
  Logger.info(`write-color-db.js run() has started at ${performance.now()}`);
}

function logRunEnded() {
  Logger.info(`write-color-db.js run() has exited successfully at ${performance.now()}`);
}

async function run() {
  logRunStarted();
  const colors = await getColors();
  const fileObject = buildJSONDBObject(colors);
  const outfile = path.resolve(process.cwd(), 'db', 'colors.json');
  await writeFile(outfile, JSON.stringify(fileObject), { encoding: 'utf-8' });
  logRunEnded();
}

await run();
