import config from './config/app.js';
import DOMProxy from './lib/DOM/DOMProxy.js';
import { getState } from './store/index.js';

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
  DOMProxy.updateInspiredByPokemonSprite(pokemonData);
  DOMProxy.startColorCycleInterval(pokemonColorSchemeData.colors);
}

function prepareSecondaryWindow() {
  DOMProxy.hideController();
}

function isPrimaryWindow() {
  const instancePrime = window.localStorage.getItem(
    config.window.storage.instancePrime
  );
  const instanceId = config.app.id;
  if (instancePrime == null) {
    return false;
  }
  return instancePrime === instanceId;
}


export { isPrimaryWindow, prepareSecondaryWindow, startPrimaryWindowColorCycle };