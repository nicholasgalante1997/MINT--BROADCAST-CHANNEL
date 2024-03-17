import axios from 'axios';
import fs from 'fs';
import path from 'path';
import util from 'util';

import OptionAsync from './utils/OptionAsync.js';
import Logger from './utils/Logger.js';
import pokeApiClient from './clients/PokeAPIClient.js';

let asyncFsWrite = util.promisify(fs.writeFile);

void (async () => {
    const IMAGE_ENDPOINT = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/"; // /1.SVG;
    let [, UPPER_BOUND] = pokeApiClient.getBDSPBounds();

    for (let x = 1; x <= UPPER_BOUND; x++) {
        const asyncOption = new OptionAsync();
        await asyncOption.invoke(async () => {
            const url = IMAGE_ENDPOINT + `${x}.svg`;
            const { data, status, statusText } = await axios.get(url);
            if (data) {
                return data;
            }

            Logger.warn("Fetch of svg asset " + x + " has yielded an excption.");
            Logger.error("Status: " + status);
            Logger.error("Status Text: " + statusText);
        })

        if (asyncOption.ok()) {
            const data = asyncOption.ok();
            let outFile = path.resolve(process.cwd(), 'svgs', `${x}.svg`);

            await asyncFsWrite(
                outFile,
                data,
                { encoding: "utf-8" }
            )
            .then(() => Logger.info("Wrote out svg to svgs/" + x + ".svg"))
            .catch(e => {
                Logger.error("An exception was thrown during asyncFsWrite(...).");
                Logger.error(e);
            });
        }
    }
})();