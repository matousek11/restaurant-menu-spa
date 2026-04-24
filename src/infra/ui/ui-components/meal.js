import * as constants from '../../../constants.js';

/**
 * Creates a DOM card showing meal name, price, and status badge.
 *
 * @param {{ id: string, name: {cz: string, en: string}, price: number, status: string }} meal
 * @returns {HTMLDivElement}
 */
export function createMealCard(meal) {
  const card = document.createElement('div');
  card.className = 'meal-card';

  const name = document.createElement('span');
  name.className = 'meal-name';
  name.textContent = meal.name?.cz ?? '—';

  const price = document.createElement('span');
  price.className = 'meal-price';
  price.textContent = `${meal.price} Kč`;

  const status = document.createElement('span');
  status.className = 'meal-status';
  status.textContent = statusLabel(meal.status);

  card.appendChild(name);
  card.appendChild(price);
  card.appendChild(status);

  return card;
}

function statusLabel(status) {
  switch (status) {
    case constants.MEAL_DRAFT: return '(Koncept)';
    case constants.MEAL_AVAILABLE: return '(Dostupné)';
    case constants.MEAL_UNAVAILABLE: return '(Nedostupné)';
    default: return '';
  }
}
