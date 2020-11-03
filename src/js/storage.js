export const getData = async (fields = { total: 0, startedAt: null, dayStart: null }) => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(fields, (data) => {
      resolve(data);
    });
  });
};

export const setStartedAt = async (value) => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({ startedAt: value }, () => {
      resolve(value);
    });
  });
};

export const setData = async (data) => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set(data, () => {
      resolve(data);
    });
  });
};

export const resetTotal = async (newDayStart) => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get({ total: 0, dayStart: null, archive: {} }, (data) => {
      if (data.dayStart) {
        data.archive[data.dayStart] = data.total;
      }

      chrome.storage.local.set({ archive: data.archive, total: 0, dayStart: newDayStart }, () => {
        resolve({ total: 0, dayStart: newDayStart });
      });
    });
  });
};
