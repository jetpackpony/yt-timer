class FocusState {
  #focused = true;
  #subscriptions = {};

  constructor(w = window, d = document) {
    this.window = w;
    this.document = d;

    this.window.addEventListener("visibilitychange", () => {
      if (this.document.hidden) {
        this.updateFocus(false);
      }
    });
    this.window.addEventListener("focus", () => this.updateFocus(true));
    this.window.addEventListener("blur", () => this.updateFocus(false));
    this.window.addEventListener("unload", () => this.updateFocus(false));
  }

  updateFocus(isFocused) {
    const changed = this.#focused !== isFocused;
    this.#focused = isFocused;
    if (changed) {
      console.log("Changed focused to: ", isFocused);
      this.emit("change");
    }
  }

  isFocused() {
    return this.#focused;
  }

  emit(eventName) {
    this.#subscriptions[eventName].forEach((fn) => fn());
  }

  on(eventName, fn) {
    if (!Array.isArray(this.#subscriptions[eventName])) {
      this.#subscriptions[eventName] = [];
    }
    this.#subscriptions[eventName].push(fn);
  }
}

export default FocusState;