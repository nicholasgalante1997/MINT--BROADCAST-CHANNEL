import config from '../../config/app.js';
import Logger from '../../lib/Logger.js';

export const DESTROY_EVENTS = {
  END: 'end'
};

function destroyOnMessage(event) {
  Logger.info(`App ${config.app.id} - Received event`);
  switch (event.data.type) {
    case DESTROY_EVENTS.END: {
      Logger.warn('Oprhan-ing window.');
      window.location.assign('400.html');
      break;
    }
    default: {
      Logger.warn('Unknown event emitted by DestroyBroadcastChannel');
      Logger.error(event);
      break;
    }
  }
}

export default destroyOnMessage;
