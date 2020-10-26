const counter = document.createElement("div");
counter.appendChild(document.createTextNode("0 sec"));
counter.setAttribute("id", "counter");
counter.setAttribute("style", "position: fixed; left: 0px; top: 0px; background: black; z-index: 1000000; color: #ff0000; font-size: 34px;");

document.body.appendChild(counter);
console.log("done");

const pad = (n) => `${(n < 10) ? "0" : ""}${n}`;
const updateCounterHTML = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds - hours * 3600) / 60);
  const secs = seconds - hours * 3600 - mins * 60;
  const counter = document.getElementById("counter");
  counter.innerHTML = `${hours}:${pad(mins)}:${pad(secs)}`;
};

const createCounter = (startedAt, total) => {
  console.log(`Starting counter. startedAt: ${startedAt}, total: ${total}`);
  let seconds = Math.round((Date.now() - startedAt + total) / 1000);
  updateCounterHTML(seconds);
  stopCounter();
  startCounter(seconds);
};

let updateInterval = null;
const startCounter = (seconds) => {
  updateInterval = setInterval(() => {
    seconds++;
    updateCounterHTML(seconds);
  }, 1000);
};
const stopCounter = () => {
  if (updateInterval) {
    clearInterval(updateInterval);
    updateInterval = null;
  };
};

chrome.runtime.sendMessage({ action: "get_data" });

chrome.runtime.onMessage.addListener(
  (data) => {
    if (data.action === "start") {
      createCounter(data.startedAt, data.total);
    }
    if (data.action === "stop") {
      stopCounter(data.startedAt, data.total);
    }
  }
);