(() => {
  const listeners = new Map();

  const socket = {
    enabled: false,
    connected: false,
    connect() {
      this.connected = false;
    },
    send() {
      return false;
    },
    on(event, handler) {
      if (!listeners.has(event)) {
        listeners.set(event, new Set());
      }
      listeners.get(event).add(handler);
    },
    off(event, handler) {
      if (!listeners.has(event)) return;
      listeners.get(event).delete(handler);
    },
    emit(event, payload) {
      if (!listeners.has(event)) return;
      listeners.get(event).forEach((handler) => handler(payload));
    }
  };

  window.LemegetonSocket = socket;
})();
