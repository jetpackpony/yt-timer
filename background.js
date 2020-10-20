// 1) on switching to already YT tab
// 2) on navigating to YT (onUpdate) && the tab is active

const startTimer = function startTimer() {
  console.log("Starting timer");
};

const stopTimer = function stopTimer() {
  console.log("Stopping timer");
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
