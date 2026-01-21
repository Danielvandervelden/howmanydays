import { EventData, Events } from "./interfaces";

type EventCallback<E extends Events = Events> = (data: EventData[E]) => void;

const listeners = new Map<Events, Set<EventCallback<any>>>();

export const events = {
  emit: <E extends Events>(eventName: E, data?: EventData[E]) => {
    const event = new CustomEvent(eventName, { detail: data });
    console.log(`[Events] Emitting ${eventName}`, data);
    document.dispatchEvent(event);
  },
  on: <E extends Events>(eventName: E, callback: EventCallback<E>) => {
    console.log(`[Events] Registering listener for ${eventName}`);
    // Only set up the document listener once per event type
    if (!listeners.has(eventName)) {
      listeners.set(eventName, new Set());
      document.addEventListener(eventName, (event) => {
        const customEvent = event as CustomEvent<EventData[E]>;
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
  off: <E extends Events>(eventName: E, callback: EventCallback<E>) => {
    const callbacks = listeners.get(eventName);
    if (callbacks) {
      callbacks.delete(callback);
    }
  },
};
