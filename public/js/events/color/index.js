import Logger from '../../lib/Logger.js';
import updateColorHandler from './update.js';

function colorOnMessage(event) {
    switch(event.data.type) {
        case 'update': {
            updateColorHandler(event);
            break;
        };
        default: {
            Logger.warn("Unknown event emitted by ColorBroadcastChannel");
            Logger.error(event);
            break;
        }
    }
}

export default colorOnMessage;