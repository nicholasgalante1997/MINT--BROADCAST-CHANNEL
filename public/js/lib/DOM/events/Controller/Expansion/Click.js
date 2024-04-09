import DOMEvent from '../../DOMEvent.js';
import DOMProxy from '../../../DOMProxy.js';
import { getState } from '../../../../../store/index.js';

const EVENT_NAME = 'click';

class ControllerExpansionClickDOMEvent extends DOMEvent {
  /**
   * @private
   */
  _expandOrCollapseControllerVisibilityState = false;

  listener() {
    const controllerSectionBarIconId = 'controller-bar-expand-or-collapse-icon';
    const controllerSectionBarIcon = document.getElementById(controllerSectionBarIconId);
    const controllerContentSectionId = 'controller-content-container';
    const controllerContentElement = document.getElementById(controllerContentSectionId);
    const searchBarSectionId = 'controller-search-bar';
    const searchBarSectionElement = document.getElementById(searchBarSectionId);
    const searchInput = document.getElementById('pokemon-search');

    const modalIsVisible = Boolean(document.getElementById('new-user-modal'));
    if (modalIsVisible) return; // Short circuit & exit early if new user modal is still visible

    if (this._expandOrCollapseControllerVisibilityState) {
      /** Turn Off */
      this._expandOrCollapseControllerVisibilityState = false;
      searchBarSectionElement.style.display = 'none';
      controllerContentElement.style.display = 'none';
      controllerContentElement.style.padding = 'none';
      controllerSectionBarIcon.style.transform = 'rotate(180deg)';
      DOMProxy.removePokemonCards();
      searchInput.value = '';
    } else {
      /** Turn On */
      this._expandOrCollapseControllerVisibilityState = true;
      searchBarSectionElement.style.display = 'flex';
      controllerContentElement.style.display = 'flex';
      controllerContentElement.style.padding = 'var(--spacing-unit)';
      controllerSectionBarIcon.style.transform = 'rotate(0deg)';
      DOMProxy.renderPokemonCards(getState().db.pokemon.pokemon, getState().db.colors.colors);
    }
  }
}

export default new ControllerExpansionClickDOMEvent(EVENT_NAME);
