/**
 * Used for multilingual translation of strings.
 *
 * @param getState function that will be used to retrieve current state
 * @param translations object with translations
 * @returns {function(key: string): string} function that will return translation
 * for a given key based on language in state,
 * when key doesn't have translation, key is returned.
 */
export function createTranslator(getState, translations) {
  function getTranslation(lang, key) {
    if (translations[lang] === undefined) {
      return key;
    }

    return translations[lang][key] ?? key;
  }

  return function t(key) {
    return getTranslation(getState().ui.language, key);
  }
}

export const translations = {
  cs: {
    "currentWeeklyMenuNotFound": "Týdenní menu pro aktuální týden nebylo nalezeno.",
    "weeklyMenuAlreadyExists": "Týdenní menu pro zvolený týden již existuje.",
    "weeklyMenuNotFound": "Týdenní menu nebylo nalezeno.",
    "unableToUpdateNonExistentWeeklyMenu": "Týdenní menu nelze aktualizovat, protože neexistuje.",
    "unableToDeleteNonExistentWeeklyMenu": "Týdenní menu nelze smazat, protože neexistuje.",
  },
  en: {
    "currentWeeklyMenuNotFound": "Weekly menu for the current week was not found.",
    "weeklyMenuAlreadyExists": "Weekly menu for the selected week already exists.",
    "weeklyMenuNotFound": "Weekly menu was not found.",
    "unableToUpdateNonExistentWeeklyMenu": "Weekly menu cannot be updated because it does not exist.",
    "unableToDeleteNonExistentWeeklyMenu": "Weekly menu cannot be deleted because it does not exist.",
  },
}