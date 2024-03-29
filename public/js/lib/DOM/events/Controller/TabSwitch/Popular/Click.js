import DOMEvent from "../../../DOMEvent.js";

const EVENT_NAME = 'click';

class PopularTabClickDOMEvent extends DOMEvent {
    listener() {
        const allTab = document.getElementById('switch-all-tab');
        const popularTab = document.getElementById('switch-popular-tab');
    
        if (allTab && popularTab) {
          popularTab.dataset.tabState = 'active';
          allTab.dataset.tabState = 'inactive';
        }

    }
}

export default new PopularTabClickDOMEvent(EVENT_NAME);