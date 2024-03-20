import Logger from '../../lib/Logger.js';

function initHandler(event) {
  Logger.info('Registering instance ' + event.data.data.instanceId);
}

export { initHandler };
