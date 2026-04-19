import {describe, it, expect} from 'vitest';
import * as constants from '../../../../src/constants.js';
import {
  createMeal,
  publishMeal,
  markMealUnavailable,
  markMealAvailable,
} from '../../../../src/app/meal/mealTransitions.js';

function makeDraftMeal(overrides = {}) {
  return createMeal({
    id: 'test-id',
    name: {cz: 'Svíčková', en: 'Beef Sirloin'},
    price: 145,
    allergens: [1, 7],
    ...overrides,
  });
}

describe('createMeal', () => {
  it('creates a meal in DRAFT state', () => {
    const meal = makeDraftMeal();
    expect(meal.status).toBe(constants.MEAL_DRAFT);
  });

  it('sets default empty allergens when not provided', () => {
    const meal = createMeal({id: '1', name: {cz: 'Test', en: 'Test'}, price: 100});
    expect(meal.allergens).toEqual([]);
  });
});

describe('publishMeal (DRAFT -> AVAILABLE)', () => {
  it('transitions DRAFT to AVAILABLE when name and price are set', () => {
    const meal = makeDraftMeal();
    const result = publishMeal(meal);
    expect(result.status).toBe(constants.MEAL_AVAILABLE);
  });

  it('does not transition when meal is not in DRAFT state', () => {
    const meal = {...makeDraftMeal(), status: constants.MEAL_AVAILABLE};
    const result = publishMeal(meal);
    expect(result.status).toBe(constants.MEAL_AVAILABLE);
    expect(result).toBe(meal);
  });

  it('does not transition when price is missing', () => {
    const meal = createMeal({id: '1', name: {cz: 'Test', en: 'Test'}, price: 0});
    const result = publishMeal(meal);
    expect(result.status).toBe(constants.MEAL_DRAFT);
  });

  it('does not transition when name is missing', () => {
    const meal = createMeal({id: '1', name: null, price: 100});
    const result = publishMeal(meal);
    expect(result.status).toBe(constants.MEAL_DRAFT);
  });
});

describe('markMealUnavailable (AVAILABLE -> UNAVAILABLE)', () => {
  it('transitions AVAILABLE to UNAVAILABLE', () => {
    const meal = {...makeDraftMeal(), status: constants.MEAL_AVAILABLE};
    const result = markMealUnavailable(meal);
    expect(result.status).toBe(constants.MEAL_UNAVAILABLE);
  });

  it('does not transition when meal is in DRAFT state', () => {
    const meal = makeDraftMeal();
    const result = markMealUnavailable(meal);
    expect(result.status).toBe(constants.MEAL_DRAFT);
    expect(result).toBe(meal);
  });

  it('does not transition when meal is already UNAVAILABLE', () => {
    const meal = {...makeDraftMeal(), status: constants.MEAL_UNAVAILABLE};
    const result = markMealUnavailable(meal);
    expect(result.status).toBe(constants.MEAL_UNAVAILABLE);
    expect(result).toBe(meal);
  });
});

describe('markMealAvailable (UNAVAILABLE -> AVAILABLE)', () => {
  it('transitions UNAVAILABLE to AVAILABLE', () => {
    const meal = {...makeDraftMeal(), status: constants.MEAL_UNAVAILABLE};
    const result = markMealAvailable(meal);
    expect(result.status).toBe(constants.MEAL_AVAILABLE);
  });

  it('does not transition when meal is in DRAFT state', () => {
    const meal = makeDraftMeal();
    const result = markMealAvailable(meal);
    expect(result.status).toBe(constants.MEAL_DRAFT);
    expect(result).toBe(meal);
  });

  it('does not transition when meal is already AVAILABLE', () => {
    const meal = {...makeDraftMeal(), status: constants.MEAL_AVAILABLE};
    const result = markMealAvailable(meal);
    expect(result.status).toBe(constants.MEAL_AVAILABLE);
    expect(result).toBe(meal);
  });
});
