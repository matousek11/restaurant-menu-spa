// src/app/actions/createSubscriptionAction.js

import { ACTION_ENTER_SUBSCRIPTION_DETAIL, LOADED } from '../../constants.js';

export async function createSubscriptionAction({ store, api, payload }) {
  const { weekStartId, totalDays } = payload;
  const state = store.getState();
  const userId = state.currentUser.userId;

  store.setState((state) => ({
    ...state,
    ui: { ...state.ui, status: 'LOADING', errorMessage: null },
  }));

  try {
    const subscription = await api.subscription.addSubscription(userId, weekStartId, totalDays);

    store.setState((state) => ({
      ...state,
      subscriptions: [...state.subscriptions, subscription],
      ui: {
        ...state.ui,
        status: LOADED,
        errorMessage: null,
        view: ACTION_ENTER_SUBSCRIPTION_DETAIL,
        selectedSubscriptionId: subscription.id,
      },
    }));
  } catch (error) {
    store.setState((state) => ({
      ...state,
      ui: {
        ...state.ui,
        status: 'ERROR',
        errorMessage: error.message ?? 'FE: Předplatné se nepodařilo vytvořit',
      },
    }));
  }
}
