import DOMProxy from "../../lib/DOM/DOMProxy.js";

export function pollHandler(_event) {
    const colorBroadcastChannelLink = new BroadcastChannel("color");
    colorBroadcastChannelLink.postMessage({ type: "respond-to-poll" });
}

export function pollResponseHandler(event) {
    DOMProxy.stopIntervalInSecondaryContext();
}