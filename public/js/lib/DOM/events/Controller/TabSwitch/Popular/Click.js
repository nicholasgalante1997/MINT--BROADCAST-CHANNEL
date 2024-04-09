import { getState } from '../../../../../../store/index.js';
import DOMProxy from '../../../../DOMProxy.js';
import DOMEvent from '../../../DOMEvent.js';

const EVENT_NAME = 'click';

class PopularTabClickDOMEvent extends DOMEvent {
  listener() {
    const allTab = document.getElementById('switch-all-tab');
    const popularTab = document.getElementById('switch-popular-tab');
    const input = document.getElementById('pokemon-search');

    if (popularTab) popularTab.dataset.tabState = 'active';
    if (allTab) allTab.dataset.tabState = 'inactive';
    if (input) input.value = '';

    const pokemon = getState().db.pokemon.pokemon;
    const colors = getState().db.colors.colors;

    DOMProxy.removePokemonCards();
    DOMProxy.renderPokemonCards();
  }
}

export default new PopularTabClickDOMEvent(EVENT_NAME);
