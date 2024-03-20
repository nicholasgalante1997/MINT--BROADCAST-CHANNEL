import config from '../../config/app.js';
import Logger from '../../lib/Logger.js';
import { initHandler } from './init.js';
import updateColorHandler from './update.js';

export const BC_COLOR_EVENTS = {
  INIT: 'init',
  UPDATE: 'update'
};

function colorOnMessage(event) {
  Logger.info(`App ${config.app.id} - Received event`);
  switch (event.data.type) {
    case BC_COLOR_EVENTS.INIT: {
      initHandler(event);
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
