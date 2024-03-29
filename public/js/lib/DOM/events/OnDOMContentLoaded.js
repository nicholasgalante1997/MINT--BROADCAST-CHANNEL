import config from '../../../config/app.js';
import Logger from "../../Logger.js";
import DOMEvent from "./DOMEvent.js";

const EVENT_NAME = "DOMContentLoaded";

class DOMContentLoadedDOMEvent extends DOMEvent {
    listener() {
      Logger.info(`Handling event ${EVENT_NAME}...`);
      const openInstancesAsString = window.localStorage.getItem(config.window.storage.instanceKey);
      let openInstances = 0;

      if (openInstancesAsString && parseInt(openInstancesAsString, 10) > 0) {
        openInstances = parseInt(openInstancesAsString, 10);
      }

      if (openInstances == 0) {
        window.localStorage.setItem(config.window.storage.instancePrime, config.app.id);
      }

      openInstances += 1;
      window.localStorage.setItem(config.window.storage.instanceKey, openInstances.toString());

      window.localStorage.setItem(`${config.window.storage.instanceUUID}-${openInstances}`, config.app.id);

      if (window.location.search === '') {
        const urlParams = new window.URLSearchParams([
          ['index', openInstances.toString()],
          ['instanceUuid', config.app.id]
        ]);

        const nextUrl = window.location.href + '?' + urlParams.toString();
        window.history.pushState(null, null, nextUrl);
      }
    }
}

export default new DOMContentLoadedDOMEvent(EVENT_NAME);