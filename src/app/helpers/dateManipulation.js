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