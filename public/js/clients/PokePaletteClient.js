import Logger from "../lib/Logger.js";

class PokePaletteClient {
    /**
     * @private
     * @readonly
     */
    static __POKEPALETTE_ENDPOINT__ = "https://pokepalettes.com/";

    async fetchPalette(pokemon) {
        const url = PokePaletteClient.__POKEPALETTE_ENDPOINT__ + '#' + pokemon.name;
        const fetchResult = await fetch(url).catch(e => { Logger.warn(e); return null; })
        if (fetchResult) {
            const pokePalettesPageText = await fetchResult.text().catch(e => { Logger.warn(e); return null; });
            if (pokePalettesPageText) {
                Logger.info({ pokePalettesPageText });
            }
        }
    }
}

export default new PokePaletteClient();