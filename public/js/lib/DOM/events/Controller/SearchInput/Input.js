import DOMEvent from '../../DOMEvent.js';
import DOMProxy from '../../../DOMProxy.js';
import { getState } from '../../../../../store/index.js';

const EVENT_NAME = 'input';

class SearchInputInputDOMEvent extends DOMEvent {
  listener(event) {
    const val = event.target.value;
    const pokemon = getState().db.pokemon.pokemon;
    const colors = getState().db.colors.colors;

    if (!val || val === '') {
      DOMProxy.removePokemonCards();
      DOMProxy.renderPokemonCards(pokemon, colors);
    } else {
      const fPokemon = pokemon.filter((p) => p.name.toLowerCase().includes(val.toLowerCase()));
      const fColors = colors.filter((col) => col.name.toLowerCase().includes(val.toLowerCase()));
      DOMProxy.removePokemonCards();
      DOMProxy.renderPokemonCards(fPokemon, fColors);
    }
  }
}

export default new SearchInputInputDOMEvent(EVENT_NAME);
