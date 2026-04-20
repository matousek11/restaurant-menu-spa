import {dayKeys} from './translations.js';

/**
 * Calculates date of Monday of the current week
 *
 * @returns {string} YYYY-MM-DD date format
 */
export function getMondayDateOfCurrentWeek() {
  const d = new Date();
  const day = d.getDay(); // 0 (Sun) - 6 (Sat)

  // If Sunday returns to monday otherwise
  // add 1 day as Sunday is the first day.
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);

  const monday = new Date(d.setDate(diff));

  const year = monday.getFullYear();
  const month = String(monday.getMonth() + 1).padStart(2, '0');
  const dayOfMonth = String(monday.getDate()).padStart(2, '0');

  return `${year}-${month}-${dayOfMonth}`;
}

/**
 * Converts any date to Monday of the same week.
 *
 * @param {string} dateString date in YYYY-MM-DD format
 * @returns {string} Monday date in YYYY-MM-DD format
 */
export function getMondayDateOfWeek(dateString) {
  const [year, month, dayOfMonth] = dateString.split('-').map(Number);
  const d = new Date(Date.UTC(year, month - 1, dayOfMonth));
  const day = d.getUTCDay(); // 0 (Sun) - 6 (Sat)
  const diff = day === 0 ? -6 : 1 - day;
  d.setUTCDate(d.getUTCDate() + diff);

  const mondayYear = d.getUTCFullYear();
  const mondayMonth = String(d.getUTCMonth() + 1).padStart(2, '0');
  const mondayDay = String(d.getUTCDate()).padStart(2, '0');
  return `${mondayYear}-${mondayMonth}-${mondayDay}`;
}

/**
 * Gets the translation for a given day ID.
 *
 * @param {number} dayId id of the day
 *
 * @returns {string} translation for the given day ID
 */
export function getDayTranslation(dayId) {
  return dayKeys[dayId];
}
