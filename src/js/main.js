import { setupCounter } from './counter.js';

const sendFocusMessage = () => {
  chrome.runtime.sendMessage({ action: "focus" });
};

const sendBlurMessage = () => {
  chrome.runtime.sendMessage({ action: "blur" });
};

export function main() {
  const { createCounter, stopCounter } = setupCounter();

  let focused = true;
  let c = 0;
  chrome.runtime.onMessage.addListener(
    (data, sender, sendResponse) => {
      if (data.action === "start" && focused) {
        console.log(c++, "Start", data);
        createCounter(data.startedAt, data.total);
      }
      sendResponse("Thank you, very nice");
    }
  );

  const onFocus = () => {
    sendFocusMessage();
    focused = true;
  };
  const onBlur = () => {
    sendBlurMessage();
    focused = false;
    stopCounter();
    console.log(c++, "Stop");
  };

  window.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      onBlur();
    }
  });
  window.addEventListener("focus", () => onFocus());
  window.addEventListener("blur", () => onBlur());
  window.addEventListener("unload", () => onBlur());

  onFocus();
}