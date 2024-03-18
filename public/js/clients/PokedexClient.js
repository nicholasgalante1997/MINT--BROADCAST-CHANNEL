import Logger from '../lib/Logger.js';

class PokedexClient {
  /**
   * @private
   * @readonly
   */
  static __DB_ENDPOINT__ = '/db/pokedex.json';

  async load() {
    return await fetch(PokedexClient.__DB_ENDPOINT__, {
      method: 'GET',
      mode: 'same-origin'
    })
      .then((response) => response.json())
      .catch((e) => {
        Logger.warn('Failed to load db/pokedex.json!');
        return null;
      });
  }
}

export default new PokedexClient();
