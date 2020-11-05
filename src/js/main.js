import { setupTimer } from './timer.js';
import FocusStateEmitter from './FocusStateEmitter.js';
import VideoStateEmitter from './VideoStateEmitter.js';

const sendStartMessage = async () => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ action: "start" }, (data) => {
      resolve(data);
    });
  });
};

const sendStopMessage = () => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ action: "stop" }, () => {
      resolve();
    });
  });
};

export function main() {
  const { startTimer, stopTimer } = setupTimer();
  let beginStartSequence = false;
  const startSequence = () => {
    beginStartSequence = true;
    // This delay in necessary because sometimes focus/blur events fire in quick
    // succession within ~30ms between each other
    setTimeout(async () => {
      if (beginStartSequence) {
        console.log("Starting timer...");
        const { startedAt, total } = await sendStartMessage();
        console.log(`startedAt: ${startedAt}, total: ${total}`);
        startTimer(startedAt, total);
      }
    }, 200);
  };
  const stopSequence = async () => {
    console.log("Stopping timer...");
    beginStartSequence = false;
    await sendStopMessage();
    stopTimer();
  };
  const focusState = new FocusStateEmitter(window, document);
  focusState.on("change", () => updateTimerState());

  const videoState = new VideoStateEmitter(window, document);
  videoState.on("change", () => updateTimerState());

  const updateTimerState = async () => {
    if (videoState.isPlaying() && focusState.isFocused()) {
      await startSequence();
    } else {
      await stopSequence();
    }
  };

  updateTimerState();
}