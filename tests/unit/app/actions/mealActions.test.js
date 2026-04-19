import {describe, it, expect} from 'vitest';
import * as constants from '../../../../src/constants.js';
import {createInitialState} from '../../../../src/app/state.js';
import {createStore} from '../../../../src/infra/store/createStore.js';
import {getMockApi} from '../../../../src/api/mockApi.js';
import {getWeeklyMenus} from '../../../../src/database/weeklyMenuData.js';
import {getMeals} from '../../../../src/database/mealData.js';
import {mealListAction} from '../../../../src/app/actions/mealListAction.js';
import {mealCreateAction} from '../../../../src/app/actions/mealCreateAction.js';
import {makeMealCreateAction} from '../../../../src/app/actions/makeMealCreateAction.js';
import {makeMealPublishAction} from '../../../../src/app/actions/makeMealPublishAction.js';
import {makeMealUnavailableAction} from '../../../../src/app/actions/makeMealUnavailableAction.js';
import {makeMealAvailableAction} from '../../../../src/app/actions/makeMealAvailableAction.js';

function createTestSetup(meals = getMeals()) {
  const store = createStore(createInitialState());
  const api = getMockApi(getWeeklyMenus(), true, meals);
  store.setState((state) => ({...state, meals}));
  return {store, api, meals};
}

describe('mealListAction', () => {
  it('navigates to the meal list view', () => {
    const {store} = createTestSetup();
    mealListAction({store});
    const state = store.getState();
    expect(state.ui.view).toBe(constants.ACTION_MEAL_LIST);
    expect(state.ui.status).toBe(constants.LOADED);
    expect(state.ui.errorMessage).toBeNull();
  });
});

describe('mealCreateAction', () => {
  it('navigates to the create meal view', () => {
    const {store} = createTestSetup();
    mealCreateAction({store});
    const state = store.getState();
    expect(state.ui.view).toBe(constants.ACTION_MEAL_CREATE);
    expect(state.ui.status).toBe(constants.LOADED);
  });
});

describe('makeMealCreateAction', () => {
  it('creates a new meal in DRAFT state and adds it to the store', async () => {
    const {store, api} = createTestSetup([]);
    const payload = {
      meal: {
        id: 'new-meal-id',
        name: {cz: 'Polévka', en: 'Soup'},
        price: 55,
        allergens: [],
      },
    };

    await makeMealCreateAction({store, api, payload});

    const state = store.getState();
    expect(state.meals).toHaveLength(1);
    expect(state.meals[0].status).toBe(constants.MEAL_DRAFT);
    expect(state.meals[0].name.cz).toBe('Polévka');
    expect(state.ui.view).toBe(constants.ACTION_MEAL_LIST);
    expect(state.ui.status).toBe(constants.LOADED);
  });
});

describe('makeMealPublishAction', () => {
  it('publishes a DRAFT meal and updates it in the store', async () => {
    const {store, api, meals} = createTestSetup();
    const draftMeal = meals.find((m) => m.status === constants.MEAL_DRAFT);

    await makeMealPublishAction({store, api, payload: {mealId: draftMeal.id}});

    const state = store.getState();
    const updated = state.meals.find((m) => m.id === draftMeal.id);
    expect(updated.status).toBe(constants.MEAL_AVAILABLE);
    expect(state.ui.status).toBe(constants.LOADED);
  });

  it('does not change state when meal does not exist', async () => {
    const {store, api} = createTestSetup();
    const stateBefore = store.getState();

    await makeMealPublishAction({store, api, payload: {mealId: 'nonexistent'}});

    const stateAfter = store.getState();
    expect(stateAfter.meals).toEqual(stateBefore.meals);
  });

  it('does not call API when meal is not in DRAFT state', async () => {
    const {store, api, meals} = createTestSetup();
    const availableMeal = meals.find((m) => m.status === constants.MEAL_AVAILABLE);
    const stateBefore = store.getState();

    await makeMealPublishAction({store, api, payload: {mealId: availableMeal.id}});

    const stateAfter = store.getState();
    expect(stateAfter.meals).toEqual(stateBefore.meals);
  });
});

describe('makeMealUnavailableAction', () => {
  it('marks an AVAILABLE meal as UNAVAILABLE', async () => {
    const {store, api, meals} = createTestSetup();
    const availableMeal = meals.find((m) => m.status === constants.MEAL_AVAILABLE);

    await makeMealUnavailableAction({store, api, payload: {mealId: availableMeal.id}});

    const state = store.getState();
    const updated = state.meals.find((m) => m.id === availableMeal.id);
    expect(updated.status).toBe(constants.MEAL_UNAVAILABLE);
  });

  it('does not transition a DRAFT meal', async () => {
    const {store, api, meals} = createTestSetup();
    const draftMeal = meals.find((m) => m.status === constants.MEAL_DRAFT);
    const stateBefore = store.getState();

    await makeMealUnavailableAction({store, api, payload: {mealId: draftMeal.id}});

    const stateAfter = store.getState();
    expect(stateAfter.meals).toEqual(stateBefore.meals);
  });
});

describe('makeMealAvailableAction', () => {
  it('marks an UNAVAILABLE meal as AVAILABLE', async () => {
    const initialMeals = getMeals();
    initialMeals[0].status = constants.MEAL_UNAVAILABLE;
    const {store, api} = createTestSetup(initialMeals);
    const unavailableMeal = initialMeals[0];

    await makeMealAvailableAction({store, api, payload: {mealId: unavailableMeal.id}});

    const state = store.getState();
    const updated = state.meals.find((m) => m.id === unavailableMeal.id);
    expect(updated.status).toBe(constants.MEAL_AVAILABLE);
  });

  it('does not transition an AVAILABLE meal', async () => {
    const {store, api, meals} = createTestSetup();
    const availableMeal = meals.find((m) => m.status === constants.MEAL_AVAILABLE);
    const stateBefore = store.getState();

    await makeMealAvailableAction({store, api, payload: {mealId: availableMeal.id}});

    const stateAfter = store.getState();
    expect(stateAfter.meals).toEqual(stateBefore.meals);
  });
});
