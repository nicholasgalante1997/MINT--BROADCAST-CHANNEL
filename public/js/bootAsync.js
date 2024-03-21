import Logger from './lib/Logger.js';

import { dispatch } from './store/index.js';
import pokePaletteClient from './clients/PokePaletteClient.js';
import professorOak from './clients/PokedexClient.js';

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

export { bootAsyncStore };
