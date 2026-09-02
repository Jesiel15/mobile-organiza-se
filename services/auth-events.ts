type Listener = (message?: string) => void;

let listeners: Listener[] = [];

export const authEvents = {
  onUnauthorized(listener: Listener) {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  },
  emitUnauthorized(message?: string) {
    listeners.forEach((l) => l(message));
  },
};