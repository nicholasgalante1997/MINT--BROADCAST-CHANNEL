import axios from 'axios';
import OptionAsync from '../utils/OptionAsync.js';

class PokeApiClient {
    /**
     * @private
     * @readonly
     */
    static __URI__ = "https://pokeapi.co/api/v2/pokemon/";

    /**
     * @private
     * @readonly
     */
    static __docs__ = "https://pokeapi.co/docs/v2#pokemon";

    /**
     * @private
     * @readonly
     * @type {[1, 151]}
     * @description Pokemon from Red, Blue, Yellow, Leaf Green, Fire Red
     */
    static __BASE_SET_BOUNDS__ = [1, 151];

    /**
     * @private
     * @readonly
     * @type {[152, 252]}
     * @description Pokemon from Gold, Silver
     */
    static __NEO_SET_BOUNDS__ = [152, 252];

    /**
     * @private
     * @readonly
     * @type {[253, 387]}
     * @description Pokemon from Sapphire, Ruby, Emerald
     */
    static __EX_READER_SET_BOUNDS__ = [253, 387];

    /**
     * @private
     * @readonly
     * @type {[388, 493]}
     * @description Pokemon from Brilliant Diamond, Shining Pearl
     */
    static __DS_1_SET_BOUNDS__ = [388, 493];

    constructor() {}

    async fetch(identifier) {
        const url = PokeApiClient.__URI__ + identifier + '/';
        const asyncOption = new OptionAsync();
        await asyncOption.invoke(async () => {
            const { data, status, statusText } = await axios.get(url);
            if (status < 200 || status > 299 || data == null) {
                throw new Error(statusText);
            }
            return data;
        });

        if (asyncOption.ok()) {
            return asyncOption.ok();
        }

        return null;
    }

    getBaseSetBounds() {
        return PokeApiClient.__BASE_SET_BOUNDS__;
    }

    getNeoSetBounds() {
        return PokeApiClient.__NEO_SET_BOUNDS__;
    }

    getEXSetBounds() {
        return PokeApiClient.__EX_READER_SET_BOUNDS__;
    }

    getBDSPBounds() {
        return PokeApiClient.__DS_1_SET_BOUNDS__;
    }
}

export default new PokeApiClient();