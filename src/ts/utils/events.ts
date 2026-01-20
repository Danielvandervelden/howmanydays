import { EventData, Events } from "./interfaces";

type EventCallback = (data: EventData[Events]) => void;

const listeners = new Map<Events, Set<EventCallback>>();

export const events = {
  emit: (eventName: Events, data: EventData[Events]) => {
    const event = new CustomEvent(eventName, { detail: data });
    console.log(`[Events] Emitting ${eventName}`, data);
    document.dispatchEvent(event);
  },
  on: (eventName: Events, callback: EventCallback) => {
    console.log(`[Events] Registering listener for ${eventName}`);
    // Only set up the document listener once per event type
    if (!listeners.has(eventName)) {
      listeners.set(eventName, new Set());
      document.addEventListener(eventName, (event) => {
        const customEvent = event as CustomEvent<EventData[Events]>;
        console.log(`[Events] Received ${eventName}`, customEvent.detail);
        const callbacks = listeners.get(eventName);
        if (callbacks) {
          callbacks.forEach((cb) => {
            console.log(`[Events] Calling callback for ${eventName}`);
            cb(customEvent.detail);
          });
        }
      });
    }

    // Add this specific callback to the set
    const callbacks = listeners.get(eventName);
    if (callbacks) {
      callbacks.add(callback);
    }
  },
  off: (eventName: Events, callback: EventCallback) => {
    const callbacks = listeners.get(eventName);
    if (callbacks) {
      callbacks.delete(callback);
    }
  },
};
