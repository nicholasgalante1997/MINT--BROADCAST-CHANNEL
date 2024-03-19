import DOMProxy from '../../lib/DOM/DOMProxy.js';
import Logger from '../../lib/Logger.js';

function handleUpdateColorEvent(event) {
  const color = event.data.values.color;
  console.group("handleUpdateColorEvent, key: update");
    Logger.info({ event, color });
  console.groupEnd();
  // DOMProxy.updateColorSchemeInCurrentWindowContext(color);
}

export default handleUpdateColorEvent;
