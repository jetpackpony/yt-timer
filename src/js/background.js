let counter = 0;
let lastStart = null;

const getData = async () => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get({ total: 0, startedAt: null }, (data) => {
      resolve(data);
    });
  });
};

const setStartedAt = async (value) => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({ startedAt: value }, () => {
      resolve(value);
    });
  });
};
const setData = async (data) => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set(data, () => {
      resolve(data);
    });
  });
};

const startTimer = async () => {
  let { total, startedAt } = await getData();
  if (!Number.isInteger(startedAt)) {
    console.log("Starting timer");
    startedAt = await setStartedAt(Date.now());
  }
  return { total, startedAt };
};

const stopTimer = async () => {
  let { total, startedAt } = await getData();
  if (Number.isInteger(startedAt)) {
    console.log("Stopping timer");
    const newTotal = total + (Date.now() - startedAt);
    console.log(`New total: ${newTotal}`);
    setData({ total: newTotal, startedAt: null });
  }
};

const sendStartMessage = async (tabId, data) => {
  new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(tabId, { action: "start", ...data }, () => {
      resolve();
    });
  });
};

chrome.runtime.onMessage.addListener(
  async (req, sender, sendResponse) => {
    switch(req.action) {
      case "focus":
        const { total, startedAt } = await startTimer();
        sendStartMessage(sender.tab.id, { total, startedAt });
        break;
      case "blur":
        stopTimer();
        break;
      default:
        console.log("Unknown action: ", req);
    }
  }
);