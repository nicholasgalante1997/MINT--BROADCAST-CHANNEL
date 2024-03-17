import { v4 as uuidv4 } from 'uuid';

import logger from './Logger.js';
import Option from './Option.js';

class Id {
    static getId() {
        const option = new Option(() => uuidv4);
        return option.match(
            (uuidv4) => uuidv4(),
            () => {
                logger.warn("Using fallback id generator.");
                return Id.fallbackGetId();
            }
        );
    }

    static fallbackGetId() {
        const keys = {
            a: ['charmander', 'venusaur', 'togepi', 'dratini', 'hypno', 'mr. mime', 'kabutops', 'cradily', 'aerodactyl'],
            b: ['hoenn', 'johto', 'kanto', 'sinnoh', 'arceus'],
            c: ['sapphire', 'leaf-green', 'fire-red', 'brilliant-diamond', 'shining-pearl', 'ruby', 'emerald', 'arceus', 'violet', 'scarlet', 'sword', 'shild'],
            d: ['team-rocket', 'team-yell', 'team-magma', 'team-aqua', 'team-galactic']
        };
        const selected = [];
        for (const field of Object.keys(keys)) {
            selected.push(keys[field].at(Math.floor(Math.random() * keys[field].length)));
        }
        return selected.join('-');
    }
}

export default Id;