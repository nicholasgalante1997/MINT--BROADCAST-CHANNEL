import axios from 'axios';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { performance } from 'node:perf_hooks';

import Attempt from './lib/Attempt.js';
import OptionAsync from './lib/OptionAsync.js';
import { getCustomRethrowFn } from './lib/Rethrow.js';

import Logger from './lib/Logger.js';

import pokeApiClient from './clients/PokeAPIClient.js';

const IMAGE_ENDPOINT = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/';

function logRunStarted() {
  Logger.info(`pull-images.js run() started at ${performance.now()}`);
}

function logRunEnded() {
  Logger.info(`pull-images.js run() exited successfully at ${performance.now()}`);
}

async function fetchAsset(url) {
  const callback = async () => {
    const { data } = await axios.get(url);
    return data;
  };
  const option = new OptionAsync(callback);
  await option.call();
  if (option.ok()) {
    return option.ok();
  }
  return null;
}

async function writeAsset(path, data) {
  const callback = async () => await writeFile(path, data, { encoding: 'utf-8' });
  await Attempt.runAsync(callback, getCustomRethrowFn('writeAsset(...) threw.'));
}

async function fetchAndWrite(index) {
  const url = IMAGE_ENDPOINT + `${index}.svg`;
  const svg = await fetchAsset(url);
  if (svg == null) {
    throw new Error('fetchAndWrite() failed.');
  }
  const outfile = path.resolve(process.cwd(), 'public', 'assets', 'svgs', `${index}.svg`);
  await writeAsset(outfile, svg);
}

function getPromises() {
  let [, UPPER_BOUND] = pokeApiClient.getBDSPBounds();
  const promises = [];
  for (let index = 1; index < UPPER_BOUND + 1; index++) {
    promises.push(fetchAndWrite(index));
  }
  return promises;
}

async function resolvePromises(promises) {
  await Promise.all(promises).then(() => Logger.info('pull-images.js succeeded.'));
}

async function run() {
  logRunStarted();
  await resolvePromises(getPromises());
  logRunEnded();
}

await run();
