import DOMProxy from '../../lib/DOM/DOMProxy.js';

function handleUpdateColorEvent(event) {
    const color = event.data.values.color;
    DOMProxy.updateColorSchemeInCurrentWindowContext(color);
}

export default handleUpdateColorEvent;