import Logger from '../lib/Logger.js';

class PokePaletteClient {
  /**
   * @private
   * @readonly
   */
  static __POKEPALETTE_ENDPOINT__ = '/db/colors.json';

  async fetchPalette() {
    const url = PokePaletteClient.__POKEPALETTE_ENDPOINT__;
    const fetchResult = await fetch(url).catch((e) => {
      Logger.warn(e);
      return null;
    });
    if (fetchResult) {
      return await fetchResult.json().catch((e) => {
        Logger.warn(e);
        return null;
      });
    }

    return null;
  }
}

export default new PokePaletteClient();
