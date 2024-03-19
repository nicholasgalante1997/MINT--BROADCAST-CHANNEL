import DOMProxy from '../../lib/DOM/DOMProxy.js';
import Logger from '../../lib/Logger.js';
import { BC_COLOR_EVENTS } from './index.js';

function pollHandler(event) {
  console.group("pollHandler, key: poll-for-primary")
    Logger.info(BC_COLOR_EVENTS.POLL);
    Logger.info(event);
  console.groupEnd();
  const colorBroadcastChannelLink = new BroadcastChannel('color');
  colorBroadcastChannelLink.postMessage({ type: 'respond-to-poll' });
  colorBroadcastChannelLink.close();
}

function pollResponseHandler(event) {
  console.group("pollResponseHandler, key: respond-to-poll")
    Logger.info(BC_COLOR_EVENTS.RPOLL);
    Logger.info(event);
  console.groupEnd();
  // DOMProxy.stopIntervalInSecondaryContext();
}

export { pollHandler, pollResponseHandler };