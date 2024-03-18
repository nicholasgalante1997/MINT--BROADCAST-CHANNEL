import config from './config/app.js';
import professorOak from "./clients/PokedexClient.js";
import pokePaletteClient from './clients/PokePaletteClient.js';
import colorOnMessage from "./events/color/index.js";
import ChannelManager from "./lib/ChannelManager.js";
import { createStore, reducer } from './store/index.js';
import DOMProxy from './lib/DOM/DOMProxy.js';
import Logger from './lib/Logger.js';

const channelManager = new ChannelManager();
let colorChannel = channelManager.join("color");
colorChannel.onmessage = colorOnMessage;

const { dispatch, getState, subscribe } = createStore(reducer);

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
    dispatch({ type: "pokemon.load", payload: { data: dbJson }});
    return;
  }

  Logger.warn("bootPokemonDB failed to update AsyncStore.");
}

async function bootPokemonColorSchemes() {
  const pokemonColorSchemes = await pokePaletteClient.fetchPalette();
  if (pokemonColorSchemes) {
    dispatch({ type: "colors.load", payload: { data: pokemonColorSchemes }});
    return;
  }

  Logger.warn("bootPokemonColorSchemes failed to update AsyncStore.");
}

async function bootAsyncStore() {
  await Promise.all([bootPokemonDB(), bootPokemonColorSchemes()])
    .then(() => Logger.info("bootAsyncStore completed successfully."))
    .catch((e) => { Logger.warn("bootAsyncStore failed"); Logger.warn(e); });
}

function getDefaultPokemonData() {
  const defaultPokemonId = config.defaults.pokemon.id;
  const { pokemon = [] } = getState().db.pokemon || {};
  return pokemon.find(pkmn => pkmn.id === defaultPokemonId);
}

function getDefaultPokemonColorSchemesData() {
  const defaultPokemonId = config.defaults.pokemon.id;
  const { colors = [] } = getState().db.colors;
  return colors.find(color => color.id === defaultPokemonId);
}

function startPrimaryWindowColorCycle() {
  const pokemonData = getDefaultPokemonData();
  const pokemonColorSchemeData = getDefaultPokemonColorSchemesData();
  DOMProxy.updateInspiredByPokemonSprite(pokemonData);
  DOMProxy.startColorCycleInterval(pokemonColorSchemeData.colors, colorChannel);
}

async function init() {
  setupWatchStoreListener();
  await bootAsyncStore();
  startPrimaryWindowColorCycle();
}

await init();

/**
 * Initially Opened App
 * - Primary Window, 
 * Responsible for
 * 
 */