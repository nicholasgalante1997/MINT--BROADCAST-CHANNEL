class DOMProxy {
    static removeLoadingIndicator() {
        let element = document.getElementById("loading-indicator");
        if (element) {
            element.remove();
        }
    }

    static updateColorSchemeInCurrentWindowContext(color) {
        let colorElement = document.getElementById("color-section");
        if (colorElement) {
            colorElement.style.background = color;
        }
    }

    static updateInspiredByPokemonSprite(pokemon) {
        let inspiredByPokemonSpriteElement = document.getElementById("color-inspired-by-pokemon-sprite");
        if (inspiredByPokemonSpriteElement) {
            inspiredByPokemonSpriteElement.src = pokemon.sprites.other.dream_world.front_default;
            inspiredByPokemonSpriteElement.alt = `An image of a ${pokemon.name} pokemon`;
        }
    }
}

export default DOMProxy;