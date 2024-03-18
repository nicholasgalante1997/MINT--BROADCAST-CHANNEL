import ColorScale from 'color-scales';
import Logger from '../Logger.js';

class DOMProxy {
  /**
   * @private
   */
  static _interval;

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
