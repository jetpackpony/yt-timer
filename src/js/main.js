import { setupCounter } from './counter.js';

export function main() {
  const { createCounter, startCounter, stopCounter } = setupCounter();

  let c = 0;
  const sendStartSignal = () => {
    console.log(c++, "Start");
    chrome.runtime.sendMessage({ action: "start" }, (data) => {
      createCounter(data.startedAt, data.total);
    });
  };

  const sendStopSignal = () => {
    console.log(c++, "Stop");
    chrome.runtime.sendMessage({ action: "stop" });
    stopCounter();
  };

  window.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      sendStopSignal();
    }
  });
  window.addEventListener("focus", () => sendStartSignal());
  window.addEventListener("blur", () => sendStopSignal());
  window.addEventListener("unload", () => sendStopSignal());

  sendStartSignal();
}