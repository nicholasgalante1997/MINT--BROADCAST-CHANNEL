import Logger from './Logger.js';

function rethrow(e) {
  throw e;
}

function getCustomRethrowFn(...messages) {
  return function (e) {
    for (const message of messages) {
      Logger.error(message);
    }

    throw e;
  };
}

export { rethrow, getCustomRethrowFn };
