import config from './config/app.js';
import professorOak from './clients/PokedexClient.js';
import pokePaletteClient from './clients/PokePaletteClient.js';
import { getChannelManager } from './lib/ChannelManager.js';
import { BC_COLOR_EVENTS } from './events/color/index.js';
import { dispatch, getState, subscribe } from './store/index.js';
import DOMProxy from './lib/DOM/DOMProxy.js';
import Logger from './lib/Logger.js';

function setupWatchStoreListener() {
  function watchStoreMutations() {
    const state = getState();
    Logger.info({ state, logger: 'watchStoreMutations' });
  }
  subscribe(watchStoreMutations);
}

async function bootPokemonDB() {
  const dbJson = await professorOak.load();
  if (dbJson) {
    dispatch({ type: 'pokemon.load', payload: { data: dbJson } });
    return;
  }

  Logger.warn('bootPokemonDB failed to update AsyncStore.');
}

async function bootPokemonColorSchemes() {
  const pokemonColorSchemes = await pokePaletteClient.fetchPalette();
  if (pokemonColorSchemes) {
    dispatch({ type: 'colors.load', payload: { data: pokemonColorSchemes } });
    return;
  }

  Logger.warn('bootPokemonColorSchemes failed to update AsyncStore.');
}

async function bootAsyncStore() {
  await Promise.all([bootPokemonDB(), bootPokemonColorSchemes()])
    .then(() => Logger.info('bootAsyncStore completed successfully.'))
    .catch((e) => {
      Logger.warn('bootAsyncStore failed');
      Logger.warn(e);
    });
}

function getDefaultPokemonData() {
  const defaultPokemonId = config.defaults.pokemon.id;
  const { pokemon = [] } = getState().db.pokemon || {};
  return pokemon.find((pkmn) => pkmn.id === defaultPokemonId);
}

function getDefaultPokemonColorSchemesData() {
  const defaultPokemonId = config.defaults.pokemon.id;
  const { colors = [] } = getState().db.colors || {};
  return colors.find((color) => color.id === defaultPokemonId);
}

function startPrimaryWindowColorCycle() {
  const pokemonData = getDefaultPokemonData();
  const pokemonColorSchemeData = getDefaultPokemonColorSchemesData();
  const colorChannel = getChannelManager().getChannel('color');
  DOMProxy.updateInspiredByPokemonSprite(pokemonData);
  DOMProxy.startColorCycleInterval(pokemonColorSchemeData.colors, colorChannel);
}

function pollForPrimaryWindow() {
  const cbc = getChannelManager().getChannel('color');
  if (cbc) {
    cbc.postMessage({ type: BC_COLOR_EVENTS.POLL });
  }
}

function init() {
  DOMProxy.attachEventListeners();
  setupWatchStoreListener();
}

async function load() {
  await bootAsyncStore();
}

function run() {
  startPrimaryWindowColorCycle();
  // pollForPrimaryWindow();
}

/** 
 * Initialization is synchronous
 * We leverage the DOMContentLoaded event callback 
 * to track instance count of same-origin windows
 * If we dispatch the attachment of the event listener
 * from a single async iife, we miss the DOMContentLoaded event
 * So we break up the application process into several steps
 * 1. Init - attach event listeners (DOM, Store Mutations)
 * 2. Load - fetch all the data needed for the app to run,
 * load it into the shared global store
 * 3. Run - we can only predictably run the app
 * if we have loaded all the data needed from /db
 * so we call run() after our async load op has finished.
 */

init();
await load()
  .then(() => run())
  .catch(e => Logger.error(e));
