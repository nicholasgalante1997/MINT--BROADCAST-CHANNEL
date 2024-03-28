import config from './config/app.js';
import DOMProxy from './lib/DOM/DOMProxy.js';
import Logger from './lib/Logger.js';

import { hasPreviouslyVisited, isPrimaryWindow, prepareSecondaryWindow, startPrimaryWindowColorCycle } from './windowContext.js';
import { bootAsyncStore } from './bootAsync.js';
import { getChannelManager } from './lib/ChannelManager.js';
import { setupWatchStoreListener } from './store/listeners.js';

function init() {
  DOMProxy.attachEventListeners();
  setupWatchStoreListener();
}

async function load() {
  await bootAsyncStore();
}

function run() {
  if (isPrimaryWindow()) {
    startPrimaryWindowColorCycle();
    if (!hasPreviouslyVisited()) {
      DOMProxy.showNewUserModal();
    }
  } else {
    prepareSecondaryWindow();
  }

  getChannelManager()
    .getChannel('color')
    .postMessage({ type: 'init', data: { instanceId: config.app.id } });
}

/**
 * Initialization is synchronous
 * We leverage the DOMContentLoaded event callback
 * to track instance count of same-origin windows
 * If we dispatch the attachment of the event listener
 * from a single async iife, we miss the DOMContentLoaded event
 * So we break up the application process into several steps
 * 1. Init - attach event listeners (DOM, Store Mutations)
 * 2. Load - fetch all the data needed for the app to run,
 * load it into the shared global store
 * 3. Run - we can only predictably run the app
 * if we have loaded all the data needed from /db
 * so we call run() after our async load op has finished.
 */

init();
await load()
  .then(() => run())
  .catch((e) => Logger.error(e));
