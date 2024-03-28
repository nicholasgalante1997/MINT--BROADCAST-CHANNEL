import ColorScale from 'color-scales';

import config from '../../config/app.js';

import { getState } from '../../store/index.js';
import { getChannelManager } from '../ChannelManager.js';

import logger from '../Logger.js';
import { isPrimaryWindow } from '../../windowContext.js';

String.prototype.toCapitalCase = function () {
  return this.split(' ')
    .map((str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase())
    .join(' ');
};

class DOMProxy {
  /**
   * @private
   */
  static _interval;

  /**
   * @private
   */
  static _expandOrCollapseControllerVisibilityState = false;

  static attachEventListeners() {
    DOMProxy.attachOnDOMContentLoaded();
    DOMProxy.attachUnloadEvent();
    DOMProxy.attachExpandOrCollapseControllerSectionEventListeners();
    DOMProxy.attachSearchEventListeners();
  }

  static attachOnDOMContentLoaded() {
    window.addEventListener('DOMContentLoaded', () => {
      logger.info('DOMContentLoaded event has fired.');

      const openInstancesAsString = window.localStorage.getItem(
        config.window.storage.instanceKey
      );

      let openInstances = 0;

      if (openInstancesAsString && parseInt(openInstancesAsString, 10) > 0) {
        openInstances = parseInt(openInstancesAsString, 10);
      }

      if (openInstances == 0) {
        window.localStorage.setItem(
          config.window.storage.instancePrime,
          config.app.id
        );
      }

      openInstances += 1;
      window.localStorage.setItem(
        config.window.storage.instanceKey,
        openInstances.toString()
      );

      window.localStorage.setItem(
        `${config.window.storage.instanceUUID}-${openInstances}`,
        config.app.id
      );

      if (window.location.search === '') {
        const urlParams = new window.URLSearchParams([
          ['index', openInstances.toString()],
          ['instanceUuid', config.app.id]
        ]);

        const nextUrl = window.location.href + '?' + urlParams.toString();
        window.history.pushState(null, null, nextUrl);
      }
    });
  }

  static attachUnloadEvent() {
    window.addEventListener('unload', (event) => {
      logger.info('unload event has fired.');
      event.preventDefault();
      
      const currentOpenInstancesAsString = window.localStorage.getItem(
        config.window.storage.instanceKey
      );

      if (currentOpenInstancesAsString) {
        let currentOpenInstances = parseInt(currentOpenInstancesAsString, 10);
        currentOpenInstances -= 1;
        window.localStorage.setItem(
          config.window.storage.instanceKey,
          currentOpenInstances.toString()
        );
      }

      let params = new window.URLSearchParams(window.location.search);
      let index = params.get('index');
      if (index) {
        window.localStorage.removeItem(`${config.window.storage.instanceUUID}-${index}`);
      }

      if (isPrimaryWindow()) {
        window.localStorage.removeItem(config.window.storage.instancePrime)
        const destroyChannel = getChannelManager().getChannel('destroy');
        destroyChannel.postMessage({ type: "end" });
      }
    });
  }

  static attachSearchEventListeners() {
    const input = document.getElementById('pokemon-search');
    input.addEventListener('input', (event) => {
      const val = event.target.value;
      const pokemon = getState().db.pokemon.pokemon;
      const colors = getState().db.colors.colors;
      if (!val || val === '') {
        DOMProxy.removePokemonCards();
        DOMProxy.renderPokemonCards(pokemon, colors);
      } else {
        const fPokemon = pokemon.filter((p) =>
          p.name.toLowerCase().includes(val.toLowerCase())
        );
        const fColors = colors.filter((col) =>
          col.name.toLowerCase().includes(val.toLowerCase())
        );
        DOMProxy.removePokemonCards();
        DOMProxy.renderPokemonCards(fPokemon, fColors);
      }
    });
  }

  static attachExpandOrCollapseControllerSectionEventListeners() {
    const expandOrCollapseContainer = document.getElementById(
      'controller-bar-expand-or-collapse-container'
    );
    if (expandOrCollapseContainer) {
      expandOrCollapseContainer.addEventListener('click', () => {
        const controllerSectionBarIconId =
          'controller-bar-expand-or-collapse-icon';
        const controllerSectionBarIcon = document.getElementById(
          controllerSectionBarIconId
        );
        const controllerContentSectionId = 'controller-content-container';
        const controllerContentElement = document.getElementById(
          controllerContentSectionId
        );
        const searchBarSectionId = 'controller-search-bar';
        const searchBarSectionElement =
          document.getElementById(searchBarSectionId);

        if (DOMProxy._expandOrCollapseControllerVisibilityState) {
          /** Turn Off */
          DOMProxy._expandOrCollapseControllerVisibilityState = false;
          searchBarSectionElement.style.display = 'none';
          controllerContentElement.style.display = 'none';
          controllerContentElement.style.padding = 'none';
          controllerSectionBarIcon.style.transform = 'rotate(180deg)';
          DOMProxy.removePokemonCards();
        } else {
          /** Turn On */
          DOMProxy._expandOrCollapseControllerVisibilityState = true;
          searchBarSectionElement.style.display = 'flex';
          controllerContentElement.style.display = 'flex';
          controllerContentElement.style.padding = 'var(--spacing-unit)';
          controllerSectionBarIcon.style.transform = 'rotate(0deg)';
          DOMProxy.renderPokemonCards(
            getState().db.pokemon.pokemon,
            getState().db.colors.colors
          );
        }
      });
    }
  }

  static renderColorWheel(colors) {
    return colors
      .map(
        (color) =>
          `<span class="pokemon-card-color-swatch" style="background: ${color};"></span>`
      )
      .join('');
  }

  static renderPokemonCards(pokemon, colors) {
    const controllerContentSectionId = 'controller-content-container';
    const controllerContentElement = document.getElementById(
      controllerContentSectionId
    );
    const colorChannel = getChannelManager().getChannel('color');
    if (controllerContentElement) {
      const cards = [];
      const length = pokemon.length;
      for (let index = 0; index < length; index++) {
        let colorScheme = colors[index];
        let pokemonData = pokemon[index];

        let cardWrapper = document.createElement('div');
        cardWrapper.className = 'pokemon-card';
        cardWrapper.style.cursor = 'pointer';
        cardWrapper.onclick = function () {
          DOMProxy.updateInspiredByPokemonSprite(pokemonData);
          DOMProxy.startColorCycleInterval(colorScheme.colors, colorChannel);
        };

        cardWrapper.innerHTML = `
          <div class="pokemon-card-info">
            <img src="/svgs/${pokemonData.id}.svg" alt="${pokemonData.name}" loading="lazy">
            <div>
              <h1>${pokemonData.name.toCapitalCase()}</h1>
            </div>
          </div>
          <div>
            <p>Color Cycle</p>
            <hr />
            <div class="pokemon-card-color-wheel">
              ${DOMProxy.renderColorWheel(colorScheme.colors)}
            </div>
          </div>
        `;

        cards.push(cardWrapper);
      }

      controllerContentElement.append(...cards);
    }
  }

  static removePokemonCards() {
    const controllerContentSectionId = 'controller-content-container';
    const controllerContentElement = document.getElementById(
      controllerContentSectionId
    );
    controllerContentElement.innerHTML = '';
  }

  static removeLoadingIndicator() {
    let element = document.getElementById('loading-indicator');
    if (element) {
      element.remove();
    }
  }

  static updateColorSchemeInCurrentWindowContext(color) {
    let colorElement = document.getElementById('color-section');
    if (colorElement) {
      colorElement.style.background = color;
    }
  }

  static updateInspiredByPokemonSprite(pokemon) {
    let inspiredByPokemonSpriteElement = document.getElementById(
      'color-inspired-by-pokemon-sprite'
    );
    if (inspiredByPokemonSpriteElement) {
      inspiredByPokemonSpriteElement.src =
        pokemon.sprites.other.dream_world.front_default;
      inspiredByPokemonSpriteElement.alt = `An image of a ${pokemon.name} pokemon`;
    }
  }

  static startColorCycleInterval(colors) {
    if (DOMProxy._interval) {
      clearInterval(DOMProxy._interval);
    }

    let colorScales = [];

    for (let x = 0; x <= colors.length - 1; x++) {
      let current = colors[x];
      let nextIndex = x === colors.length - 1 ? 0 : x + 1;
      let next = colors[nextIndex];

      colorScales.push(new ColorScale(0, 100, [current, next]));
    }

    let colorScalesIndex = 0;
    let colorStopMarker = 0;

    DOMProxy._interval = setInterval(() => {
      if (colorStopMarker === 100) {
        if (colorScalesIndex === colorScales.length - 1) {
          colorScalesIndex = 0;
        } else {
          colorScalesIndex += 1;
        }

        colorStopMarker = 0;
      } else {
        colorStopMarker += 1;
      }

      const colorScale = colorScales[colorScalesIndex];
      const colorAsHex = colorScale.getColor(colorStopMarker).toHexString();

      // Update current window
      DOMProxy.updateColorSchemeInCurrentWindowContext(colorAsHex);

      // Propagate updates to susbscribed windows
      const cbc = getChannelManager().getChannel('color');
      cbc.postMessage({
        type: 'update',
        values: { color: colorAsHex }
      });
    }, 15);
  }

  static stopIntervalInSecondaryContext() {
    clearInterval(DOMProxy._interval);
  }

  static hideController() {
    const controllerSection = document.getElementById('controller-section');
    if (controllerSection) {
      controllerSection.style.display = 'none';
    }
  }

  static showNewUserModal() {
    const colorSectionElement = document.getElementById('color-section');
    if (colorSectionElement) {
      const imageElement = colorSectionElement.childNodes.item(0);
      const modal = document.createElement('div');
      modal.id = "new-user-modal";
      modal.innerHTML = `
        <img src="/assets/Angry-Pikachu.png" alt="A pikachu ready to attack!" height="116px" width="auto">
        <h1>Blackthorn</h1>
        <p>Blackthorn is a browser-based lighting synchronizer. It gets its name from the Dragon Type Gym in the Pokemon Gold and Silver games.</p>
        <p>You can use Blackthorn to set the lighting backdrop for gaming, development, editing, or whatever you want.</p>
        <a href="#" style="margin-top:24px;">Check out our usage demo</a>
        <button id="new-user-modal__dismiss-modal-btn">Dismiss</button>
      `;
      colorSectionElement.insertBefore(modal, imageElement);

      const dismissBtn = modal.querySelector('#new-user-modal__dismiss-modal-btn');
      if (dismissBtn) {
        dismissBtn.addEventListener('click', () => {
          modal.remove();
          window.localStorage.setItem('has-already-visited', new Date().getTime());
        })
      }
    }
  }
}

export default DOMProxy;
