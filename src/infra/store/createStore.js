import {createTranslator, translations} from '../../app/helpers/translations';

/**
 * Contains the state of the application
 */
export function createStore(initialState) {
  let state = initialState;
  const translator = createTranslator(() => state, translations);

  function getTranslator() {
    return translator;
  }

  function getState() {
    return structuredClone(state);
  }

  function setState(updateFunction) {
    state = updateFunction(state);
  }

  return {
    getTranslator,
    getState,
    setState,
  };
}
