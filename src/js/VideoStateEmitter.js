import StateEmitter from "./StateEmitter.js";

class VideoState extends StateEmitter{
  videoElements = [];
  #playing = true;

  constructor(w = window, d = document) {
    super(w, d);

    this.detectVideoElement();
  }

  detectVideoElement() {
    const videoElements = this.document.querySelectorAll("video");
    videoElements.forEach((el) => {
      if (!this.videoElements.includes(el)) {
        el.addEventListener("play", () => this.updatePlaying());
        el.addEventListener("pause", () => this.updatePlaying());
        this.videoElements.push(el);
      }
    });
    const newList = [];
    this.videoElements.forEach((el) => {
      if (this.document.body.contains(el)) {
        newList.push(el);
      }
    });
    this.videoElements = newList;
    this.updatePlaying();
    setTimeout(this.detectVideoElement.bind(this), 1000);
  }

  updatePlaying() {
    let isPlaying = false;
    this.videoElements.forEach((el) => {
      if (!el.paused) {
        isPlaying = true;
      }
    });
    const changed = this.#playing !== isPlaying;
    this.#playing = isPlaying;
    if (changed) {
      console.log("Changed playing to: ", isPlaying);
      this.emit("change", isPlaying);
    }
  }

  isPlaying() {
    return this.#playing;
  }
}

export default VideoState;
