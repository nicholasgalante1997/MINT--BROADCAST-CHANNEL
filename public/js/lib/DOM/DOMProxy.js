import ColorScale from 'color-scales';

import { getState } from '../../store/index.js';
import logger from '../Logger.js';
import { getChannelManager } from '../ChannelManager.js';

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
  }

  static attachOnDOMContentLoaded() {
    window.addEventListener('DOMContentLoaded', () => {
      logger.info("DOMContentLoaded event has fired.");
      const storageKey = "raichu-min-armoury-crate-open-instances";
      const openInstancesAsString = window.localStorage.getItem(storageKey);
      let openInstances = 0;
      if (openInstancesAsString) {
        openInstances = parseInt(openInstancesAsString, 10);
      }

      openInstances += 1;
      window.localStorage.setItem(storageKey, openInstances.toString());
    })
  }

  static attachUnloadEvent() {
    window.addEventListener('unload', (event) => {
      logger.info("unload event has fired.");
      event.preventDefault();
      const storageKey = "raichu-min-armoury-crate-open-instances";
      const currentOpenInstancesAsString = window.localStorage.getItem(storageKey);
      if (currentOpenInstancesAsString) {
        let currentOpenInstances = parseInt(currentOpenInstancesAsString, 10);
        currentOpenInstances -= 1;
        window.localStorage.setItem(storageKey, currentOpenInstances.toString());
      }
    });
  }

  static attachExpandOrCollapseControllerSectionEventListeners() {
    const expandOrCollapseContainer = document.getElementById('controller-bar-expand-or-collapse-container');
    if (expandOrCollapseContainer) {
      expandOrCollapseContainer.addEventListener('click', () => {
        const controllerSectionBarIconId = "controller-bar-expand-or-collapse-icon";
        const controllerSectionBarIcon = document.getElementById(controllerSectionBarIconId);
        const controllerContentSectionId = "controller-content-container";
        const controllerContentElement = document.getElementById(controllerContentSectionId);

        if (DOMProxy._expandOrCollapseControllerVisibilityState) {
          /** Turn Off */
          DOMProxy._expandOrCollapseControllerVisibilityState = false;
          controllerContentElement.style.display = "none";
          controllerContentElement.style.padding = "none";
          controllerSectionBarIcon.style.transform = "rotate(180deg)";
          DOMProxy.removePokemonCards();
        } else {
          /** Turn On */
          DOMProxy._expandOrCollapseControllerVisibilityState = true;
          controllerContentElement.style.display = "flex";
          controllerContentElement.style.padding = "var(--spacing-unit)";
          controllerSectionBarIcon.style.transform = "rotate(0deg)";
          DOMProxy.renderPokemonCards(
            getState().db.pokemon.pokemon,
            getState().db.colors.colors
          );
        }
      })
    }
  }

  static renderColorWheel(colors) {
    return colors
      .map(color => `<span class="pokemon-card-color-swatch" style="background: ${color};"></span>`)
      .join('');
  }

  static renderPokemonCards(pokemon, colors) {
    const controllerContentSectionId = "controller-content-container";
    const controllerContentElement = document.getElementById(controllerContentSectionId);
    const colorChannel = getChannelManager().getChannel('color');
    if (controllerContentElement) {
      const cards = [];
      const length = pokemon.length;
      for (let index = 0; index < length; index++) {
        let colorScheme = colors[index];
        let pokemonData = pokemon[index];

        let cardWrapper = document.createElement('div');
        cardWrapper.className = "pokemon-card";
        cardWrapper.style.cursor = "pointer";
        cardWrapper.onclick = function () {
          DOMProxy.updateInspiredByPokemonSprite(pokemonData);
          DOMProxy.startColorCycleInterval(
            colorScheme.colors,
            colorChannel
          );
        }

        cardWrapper.innerHTML = `
        <div class="pokemon-card-info">
          <img src="/svgs/${index + 1}.svg" alt="${pokemonData.name}" loading="lazy">
          <h1>${pokemonData.name}</h1>
        </div>
        <div class="pokemon-card-color-wheel">
          ${DOMProxy.renderColorWheel(colorScheme.colors)}
        </div>
        `;
      
        cards.push(cardWrapper);
      }

      controllerContentElement.append(...cards);
    }
  }

  static removePokemonCards() {
    const controllerContentSectionId = "controller-content-container";
    const controllerContentElement = document.getElementById(controllerContentSectionId);
    controllerContentElement.innerHTML = "";
    controllerContentElement.style.display = "none";
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

  static startColorCycleInterval(colors, colorBroadcastChannel) {
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
      colorBroadcastChannel.postMessage({
        type: 'update',
        values: { color: colorAsHex }
      });
    }, 15);
  }

  static stopIntervalInSecondaryContext() {
    clearInterval(DOMProxy._interval);
  }
}

export default DOMProxy;
