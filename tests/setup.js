// Mock localStorage for Node.js test environment
// (window.localStorage is not available in jsdom-less vitest runs)
const localStorageStore = {};

global.localStorage = {
  getItem: (key) => localStorageStore[key] ?? null,
  setItem: (key, value) => {
    localStorageStore[key] = String(value);
  },
  removeItem: (key) => {
    delete localStorageStore[key];
  },
  clear: () => {
    Object.keys(localStorageStore).forEach((key) => delete localStorageStore[key]);
  },
};
