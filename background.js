let counter = 0;
let lastStart = null;

const startTimer = () => {
  if (!lastStart) {
    console.log("Starting timer");
    lastStart = Date.now();
  }
};

const stopTimer = function stopTimer() {
  if (lastStart) {
    console.log("Stopping timer");
    counter = counter + (Date.now() - lastStart);
    console.log(`New total: ${counter}`);
    lastStart = null;
  }
};

chrome.runtime.onMessage.addListener(
  (req, sender, sendResponse) => {
    switch(req.action) {
      case "start":
        startTimer();
        sendResponse({ total: counter, startedAt: lastStart });
        break;
      case "stop":
        stopTimer();
        break;
      default:
        console.log("Unknown action: ", req);
    }
  }
);