export const getData = async () => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get({ total: 0, startedAt: null }, (data) => {
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
