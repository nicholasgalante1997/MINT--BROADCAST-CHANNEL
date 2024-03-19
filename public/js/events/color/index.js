import Logger from '../../lib/Logger.js';
import { pollHandler, pollResponseHandler } from './poll.js';
import updateColorHandler from './update.js';

export const BC_COLOR_EVENTS = {
  POLL: 'poll-for-primary',
  RPOLL: 'respond-to-poll',
  UPDATE: 'update'
};

function colorOnMessage(event) {
  switch (event.data.type) {
    case BC_COLOR_EVENTS.POLL: {
      pollHandler(event);
      break;
    }
    case BC_COLOR_EVENTS.RPOLL: {
      pollResponseHandler(event);
      break;
    }
    case BC_COLOR_EVENTS.UPDATE: {
      updateColorHandler(event);
      break;
    }
    default: {
      Logger.warn('Unknown event emitted by ColorBroadcastChannel');
      Logger.error(event);
      break;
    }
  }
}

export default colorOnMessage;
