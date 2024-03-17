import config from './config/app.js';
import professorOak from "./clients/PokedexClient.js";
import pokePaletteClient from './clients/PokePaletteClient.js';
import colorOnMessage from "./events/color/index.js";
import ChannelManager from "./lib/ChannelManager.js";
import { createStore, reducer } from './store/index.js';
import DOMProxy from './lib/DOM/DOMProxy.js';

async function init() {
  const { dispatch, getState, subscribe } = createStore(reducer);
  let dbJson = await professorOak.load();
  
  if (dbJson) {
    dispatch({ type: "pokemon.load", payload: { data: dbJson }});
  }

  const defaultPokemonId = config.defaults.pokemon.id;
  const pokemonData = (dbJson?.pokemon || []).find(pkmn => pkmn.id === defaultPokemonId);

  DOMProxy.updateInspiredByPokemonSprite(pokemonData);

  await pokePaletteClient.fetchPalette(pokemonData);
  
  const channelManager = new ChannelManager();
  let colorChannel = channelManager.join("color");
  colorChannel.onmessage = colorOnMessage;
  

}

await init();