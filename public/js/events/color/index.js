import Logger from '../../lib/Logger.js';
import { pollHandler, pollResponseHandler } from './poll.js';
import updateColorHandler from './update.js';

function colorOnMessage(event) {
    switch(event.data.type) {
        case 'poll-for-alpha-node': {
            pollHandler(event);
            break;
        };
        case 'respond-to-poll': {
            pollResponseHandler(event);
            break;
        }
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