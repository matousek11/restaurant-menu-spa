// src/app/actions/enterSubscriptionsAction.js

import { ACTION_ENTER_SUBSCRIPTIONS, LOADED } from '../../constants.js';

export function enterSubscriptionsAction({ store }) {
  store.setState((state) => ({
    ...state,
    ui: {
      ...state.ui,
      view: ACTION_ENTER_SUBSCRIPTIONS,
      selectedSubscriptionId: null,
      status: LOADED,
      errorMessage: null,
    },
  }));
}
