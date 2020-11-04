
const pad = (n) => `${(n < 10) ? "0" : ""}${n}`;

const setupTimer = () => {
  const timer = document.createElement("div");
  timer.appendChild(document.createTextNode("Loading..."));
  timer.setAttribute("id", "timer");
  timer.setAttribute("style", "position: fixed; left: 0px; top: 0px; background: black; z-index: 1000000; color: #ff0000; font-size: 34px;");

  document.body.appendChild(timer);

  let updateInterval = null;
  const stopTimer = () => {
    if (updateInterval) {
      clearInterval(updateInterval);
      updateInterval = null;
    };
  };
  const startTimer = (startedAt, total) => {
    let seconds = Math.round((Date.now() - startedAt + total) / 1000);
    updateTimerHTML(seconds);
    if (updateInterval) {
      stopTimer();
    }
    updateInterval = setInterval(() => {
      seconds++;
      updateTimerHTML(seconds);
    }, 1000);
  };

  const updateTimerHTML = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds - hours * 3600) / 60);
    const secs = seconds - hours * 3600 - mins * 60;
    const timer = document.getElementById("timer");
    timer.innerHTML = `${hours}:${pad(mins)}:${pad(secs)}`;
  };

  return { startTimer, stopTimer };
};

export { setupTimer };