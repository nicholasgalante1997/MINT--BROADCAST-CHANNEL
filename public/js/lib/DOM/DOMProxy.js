import ColorScale from 'color-scales';

import { getChannelManager } from '../ChannelManager.js';

import DOMContentLoadedEventHandler from './events/OnDOMContentLoaded.js';
import UnloadEventHandler from './events/OnUnload.js';
import SearchInputEventHandler from './events/Controller/SearchInput/Input.js';
import ExpansionClickEventHandler from './events/Controller/Expansion/Click.js';
import AllTabClickEventHandler from './events/Controller/TabSwitch/All/Click.js';
import PopularTabClickEventHandler from './events/Controller/TabSwitch/Popular/Click.js';

class DOMProxy {
  /**
   * @private
   */
  static _interval;

  static attachEventListeners() {
    DOMContentLoadedEventHandler.attachTo(window);
    UnloadEventHandler.attachTo(window);
    ExpansionClickEventHandler.attachTo(document.getElementById('controller-bar-expand-or-collapse-container'));
    SearchInputEventHandler.attachTo(document.getElementById('pokemon-search'));
    AllTabClickEventHandler.attachTo(document.getElementById('switch-all-tab'));
    PopularTabClickEventHandler.attachTo(document.getElementById('switch-popular-tab'));
  }

  static renderColorWheel(colors) {
    return colors
      .map((color) => `<span class="pokemon-card-color-swatch" style="background: ${color};"></span>`)
      .join('');
  }

  static renderTypeBadges(types) {
    return types.map(({ type }) => `<span class="badge ${type.name}-type">${type.name.toUpperCase()}</span>`).join('');
  }

  static renderSprites(spritesObj) {
    let spritesAsImgArr = [];
    const {
      other: {
        'official-artwork': { front_default: officialArtworkFrontDefault },
        showdown: { front_default: showdownImageFrontDefault }
      },
      versions
    } = spritesObj;

    function formatRawImageSrc(src) {
      return `<img src="${src}" loading="lazy" height="24px" width="24px" class="poke-sprite" />`;
    }

    for (const [k, v] of Object.entries(versions)) {
      for (const [k2, v2] of Object.entries(v)) {
        const { front_default } = v2;
        if (front_default) {
          spritesAsImgArr.push(formatRawImageSrc(front_default));
        }
      }
    }

    spritesAsImgArr.push(formatRawImageSrc(officialArtworkFrontDefault));
    spritesAsImgArr.push(formatRawImageSrc(showdownImageFrontDefault));

    return spritesAsImgArr.join('');
  }

  static renderPokemonCards(pokemon, colors) {
    const controllerContentSectionId = 'controller-content-container';
    const controllerContentElement = document.getElementById(controllerContentSectionId);
    const colorChannel = getChannelManager().getChannel('color');
    if (controllerContentElement) {
      const cards = [];
      const length = pokemon.length;
      for (let index = 0; index < length; index++) {
        let colorScheme = colors[index];
        let pokemonData = pokemon[index];

        let cardWrapper = document.createElement('div');
        cardWrapper.className = 'alt-pokemon-card';
        cardWrapper.style.cursor = 'pointer';
        cardWrapper.onclick = function () {
          DOMProxy.updateInspiredByPokemonSprite(pokemonData);
          DOMProxy.startColorCycleInterval(colorScheme.colors, colorChannel);
        };

        cardWrapper.innerHTML = `
            <div class="wrapper">
              <div class="cover-image">
                <span class="poke-id">
                  <b>Poke ID:</b>
                  &nbsp;${pokemonData.id}
                </span>
                <div class="poke-types">
                  ${DOMProxy.renderTypeBadges(pokemonData.types)}
                </div>
                <span class="color-wheel-title">${pokemonData.name.toCapitalCase()}'s Colors</span>
                <div class="color-wheel">
                  ${DOMProxy.renderColorWheel(colorScheme.colors)}
                </div>
                <div class="pokecard-gif-container">
                  <img src="${pokemonData.sprites.other.showdown.front_default}" loading="lazy" height="92px" width="auto" class="pokecard-gif" />
                </div>
              </div>
            </div>
            <h1 class="title">${pokemonData.name.toCapitalCase()}</h1>
            <img src="/assets/svgs/${pokemonData.id}.svg" class="character" loading="lazy" />
        `;

        cards.push(cardWrapper);
      }

      controllerContentElement.append(...cards);
    }
  }

  static removePokemonCards() {
    const controllerContentSectionId = 'controller-content-container';
    const controllerContentElement = document.getElementById(controllerContentSectionId);
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
    let inspiredByPokemonSpriteElement = document.getElementById('color-inspired-by-pokemon-sprite');
    if (inspiredByPokemonSpriteElement) {
      inspiredByPokemonSpriteElement.src = `/assets/svgs/${pokemon.id}.svg`;
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
      modal.id = 'new-user-modal';
      modal.innerHTML = `
        <img src="/assets/images/Angry-Pikachu.png" alt="A pikachu ready to attack!" height="116px" width="auto">
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
        });
      }
    }
  }
}

export default DOMProxy;
