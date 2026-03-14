import {describe, it, expect} from 'vitest';
import {createTranslator} from '../../../../src/app/helpers/translations';
import {LANG_CZECH} from '../../../../src/constants';
import {createInitialState} from '../../../../src/app/state';

const key = 'hello';
const translations = {cs: {[key]: 'Ahoj světe'}, en: {[key]: 'Hello world'}};
function getState(obj) {
  return () => obj;
}

describe('Test translations helper functions.', () => {
  it('Should return translated string under key based on language.', () => {
    const stateObj = createInitialState();
    const state = getState(stateObj);
    const t = createTranslator(state, translations);
    expect(t(key)).toBe(translations.en.hello);

    stateObj.ui.language = LANG_CZECH;
    expect(t(key)).toBe(translations.cs.hello);
  });

  it('Should return key because translation is not defined.', () => {
    const state = getState(createInitialState());
    const t = createTranslator(state, translations);
    const nonexistentKey = 'nonexistentKey';

    expect(t(nonexistentKey)).toBe(nonexistentKey);
  });

  it('Should return key of translation when selected language is not defined.', () => {
    const stateObj = createInitialState();
    stateObj.ui.language = 'de';
    const state = getState(stateObj);
    const t = createTranslator(state, translations);

    expect(t(key)).toBe(key);
  });
});
