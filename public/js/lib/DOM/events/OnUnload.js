import config from '../../../config/app.js';
import { getChannelManager } from '../../ChannelManager.js';
import { isPrimaryWindow } from '../../../windowContext.js';
import Logger from "../../Logger.js";
import DOMEvent from "./DOMEvent.js";

const EVENT_NAME = "unload";

class UnloadDOMEvent extends DOMEvent {
    listener(event) {
      Logger.info(`Handling event ${EVENT_NAME}...`);
      event.preventDefault();

      const currentOpenInstancesAsString = window.localStorage.getItem(config.window.storage.instanceKey);

      if (currentOpenInstancesAsString) {
        let currentOpenInstances = parseInt(currentOpenInstancesAsString, 10);
        currentOpenInstances -= 1;
        window.localStorage.setItem(config.window.storage.instanceKey, currentOpenInstances.toString());
      }

      let params = new window.URLSearchParams(window.location.search);
      let index = params.get('index');
      if (index) {
        window.localStorage.removeItem(`${config.window.storage.instanceUUID}-${index}`);
      }

      if (isPrimaryWindow()) {
        window.localStorage.removeItem(config.window.storage.instancePrime);
        const destroyChannel = getChannelManager().getChannel('destroy');
        destroyChannel.postMessage({ type: 'end' });
      }
    }
}

export default new UnloadDOMEvent(EVENT_NAME);