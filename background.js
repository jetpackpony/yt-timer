let counter = 0;
let lastStart = null;

const startMessage = (total, startedAt) => {
  chrome.tabs.query({ active: true, currentWindow: true, url: "*://*.youtube.com/*" }, (tabs) => {
    if (tabs && tabs[0]) {
      console.log("Sending message to ", tabs[0]);
      chrome.tabs.sendMessage(tabs[0].id, { total, startedAt, action: "start" });
    } else {
      console.log("Couldn't find YT tab: ", tabs);
    }
  });
};

const stopMessage = () => {
  chrome.tabs.query({ url: "*://*.youtube.com/*" }, (tabs) => {
    tabs.forEach((t) => {
      chrome.tabs.sendMessage(t.id, { action: "stop" });
    });
  });
};

const startTimer = () => {
  if (!lastStart) {
    console.log("Starting timer");
    lastStart = Date.now();
  }
  startMessage(counter, lastStart);
};

const stopTimer = function stopTimer() {
  if (lastStart) {
    console.log("Stopping timer");
    counter = counter + (Date.now() - lastStart);
    console.log(`New total: ${counter}`);
    lastStart = null;
    stopMessage();
  }
};

const focusedTab = function focusedTab(tabId, windowId) {
  chrome.tabs.get(tabId, (tab) => {
    const m = tab.url.match(/.*youtube\.com/g);
    if (m && m[0]) {
      startTimer();
    } else {
      stopTimer();
    }
  });
};

const unfocusedBrowser = function unfocusedBrowser() {
  stopTimer();
};

chrome.tabs.onActivated.addListener(
  ({ tabId, windowId }) => {
    focusedTab(tabId, windowId);
  }
);

chrome.windows.onFocusChanged.addListener(
  (windowId) => {
    if (windowId !== chrome.windows.WINDOW_ID_NONE) {
      chrome.tabs.query({ active: true, windowId }, (tabs) => {
        if (tabs[0]) {
            focusedTab(tabs[0].id, tabs[0].windowId);
        } else {
          unfocusedBrowser();
        }
      });
    } else {
      unfocusedBrowser();
    }
  }
);

chrome.runtime.onMessage.addListener(
  (req, sender, sendResponse) => {
    if (req.action == "get_data") {
      startTimer();
    }
  }
);