import StateEmitter from "./StateEmitter.js";

class FocusState extends StateEmitter {
  #focused = true;

  constructor(w = window, d = document) {
    super(w, d);

    this.window.addEventListener("visibilitychange", () => {
      if (this.document.hidden) {
        this.updateFocus(false);
      }
    });
    this.window.addEventListener("focus", () => {
      this.updateFocus(true)
    });
    this.window.addEventListener("blur", () => {
      // If user clicked on an iframe, ignore this event
      if (document.activeElement.tagName !== "IFRAME") {
        this.updateFocus(false)
      }
    });
    this.window.addEventListener("unload", () => {
      this.updateFocus(false)
    });
  }

  updateFocus(isFocused) {
    const changed = this.#focused !== isFocused;
    this.#focused = isFocused;
    if (changed) {
      console.log("Changed focused to: ", isFocused);
      this.emit("change", isFocused);
    }
  }

  isFocused() {
    return this.#focused;
  }
}

export default FocusState;