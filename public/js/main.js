import professorOak from "./clients/PokedexClient.js";
import ChannelManager from "./lib/ChannelManager.js";
import { createStore, reducer } from './store/index.js';

async function init() {
    const { dispatch, getState, subscribe } = createStore(reducer);
    const channelManager = new ChannelManager();

    let dbJson = await professorOak.load();
    console.info({ dbJson });
    if (dbJson) {
      dispatch({ type: "pokemon.load", payload: { data: dbJson }});
    }
}

await init();