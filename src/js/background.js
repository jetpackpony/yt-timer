import { getData, setData, setStartedAt, resetTotal } from './storage.js';

const msInADay = 24 * 60 * 60 * 1000;
// Set the date cutoff to 5 am
const cutOffHour = 5;
const getCurrentDayStart = () => {
  const date = new Date();
  if (date.getHours() < 5) {
    date.setDate(date.getDate() - 1);
  }
  date.setHours(cutOffHour, 0, 0, 0);
  return date.getTime();
};

const startTimer = async () => {
  let { total, startedAt, dayStart } = await getData();
  // If there is no timer running
  if (!Number.isInteger(startedAt)) {
    console.log("Starting timer");
    console.log(`dayStart: ${dayStart}`);

    // if dayStart not set || it is a new day, reset total
    if (!Number.isInteger(dayStart) || (Date.now() - dayStart) >= msInADay) {
      await resetTotal(getCurrentDayStart());
      total = 0;
    }
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