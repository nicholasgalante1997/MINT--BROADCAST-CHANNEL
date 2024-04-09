import DOMEvent from '../../../DOMEvent.js';

const EVENT_NAME = 'click';

class AllTabClickDOMEvent extends DOMEvent {
  listener() {
    const allTab = document.getElementById('switch-all-tab');
    const popularTab = document.getElementById('switch-popular-tab');

    if (allTab && popularTab) {
      allTab.dataset.tabState = 'active';
      popularTab.dataset.tabState = 'inactive';
    }
  }
}

export default new AllTabClickDOMEvent(EVENT_NAME);
