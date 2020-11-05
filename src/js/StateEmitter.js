class StateEmitter {
  #subscriptions = {};

  constructor(w = window, d = document) {
    this.window = w;
    this.document = d;
  }

  emit(eventName, ...args) {
    this.#subscriptions[eventName].forEach((fn) => fn(...args));
  }

  on(eventName, fn) {
    if (!Array.isArray(this.#subscriptions[eventName])) {
      this.#subscriptions[eventName] = [];
    }
    this.#subscriptions[eventName].push(fn.bind(null));
  }
}

export default StateEmitter;