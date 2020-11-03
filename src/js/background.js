import { getData, setData, setStartedAt } from './storage.js';

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
    await setData({ total: newTotal, startedAt: null });
  }
};

const sendStartMessage = (tabId, data) => {
  chrome.tabs.sendMessage(tabId, { action: "start", ...data });
};

// Listen for tabs' focus/blur events
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