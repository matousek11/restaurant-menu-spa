import {createTranslator, translations} from '../../app/helpers/translations.js';

/**
 * Contains the state of the application
 */
export function createStore(initialState) {
  let state = initialState;
  const listeners = [];
  const translator = createTranslator(() => state, translations);

  function getTranslator() {
    return translator;
  }

  function getState() {
    return structuredClone(state);
  }

  function setState(updateFunction) {
    state = updateFunction(state);
    listeners.forEach(listener => listener(state));
  }

  function subscribe(listener) {
    listeners.push(listener);
  }

  return {
    getTranslator,
    getState,
    setState,
    subscribe,
  };
}
