import Logger from "../../Logger.js";

class DOMEvent {
    _type;
    
    constructor(type) {
        this._type = type;
    }

    listener(_e) {/** Classes that extend DOMEvent must override this method */}

    attachTo(element) {
        Logger.info(`Attaching listener to ${this._type} event...`);
        element.addEventListener(this._type, this.listener);
    }

    removeFrom(element) {
        Logger.warn(`Removing listener to ${this._type} event...`);
        element.remove(this._type, this.listener);
    }
}

export default DOMEvent;