import Logger from '../lib/Logger.js';
import { getState, subscribe } from './index.js';

function setupWatchStoreListener() {
  function watchStoreMutations() {
    const state = getState();
    Logger.info({ state, logger: 'watchStoreMutations' });
  }
  subscribe(watchStoreMutations);
}

export { setupWatchStoreListener };
