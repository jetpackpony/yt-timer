import { getData, setData, setStartedAt, resetTotal } from './storage.js';
import { msInADay, cutOffHour, getCurrentDayStart } from './dateTime.js';

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

// Listen for tabs' start/stop events
chrome.runtime.onMessage.addListener(
  // This callback has to return true to be able to call sendResponse asynchronously
  // See https://developer.chrome.com/extensions/runtime#event-onMessage
  (req, sender, sendResponse) => {
    switch(req.action) {
      case "start":
        startTimer()
          .then(({ total, startedAt }) => {
            console.log("Sending reposnse...", total, startedAt);
            sendResponse({ total, startedAt });
          });
        return true;
      case "stop":
        stopTimer()
          .then(() => sendResponse());
        return true;
      case "getData":
        getData()
          .then(({ total, startedAt }) => {
            console.log("Sending reposnse...", total, startedAt);
            sendResponse({ total, startedAt });
          });
        return true;
      default:
        console.log("Unknown action: ", req);
    }
  }
);