const counter = document.createElement("div");
counter.appendChild(document.createTextNode("0 sec"));
counter.setAttribute("id", "counter");
counter.setAttribute("style", "position: fixed; left: 0px; top: 0px; background: black; z-index: 1000000; color: crimson; font-size: 24px;");

document.body.appendChild(counter);
console.log("done");

let updateInterval = null;
const startCounter = (startedAt, total) => {
  console.log(`Starting counter. startedAt: ${startedAt}, total: ${total}`);
  const counter = document.getElementById("counter");
  let seconds = Math.round((Date.now() - startedAt + total) / 1000);
  counter.innerHTML = `${seconds} sec`;
  if (updateInterval) {
    clearInterval(updateInterval);
    updateInterval = null;
  };
  updateInterval = setInterval(() => {
    seconds++;
    counter.innerHTML = `${seconds} sec`;
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
      startCounter(data.startedAt, data.total);
    }
    if (data.action === "stop") {
      stopCounter(data.startedAt, data.total);
    }
  }
);