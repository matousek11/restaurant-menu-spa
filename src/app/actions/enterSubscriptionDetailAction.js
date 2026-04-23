// src/app/actions/enterSubscriptionDetailAction.js

import { ACTION_ENTER_SUBSCRIPTION_DETAIL, LOADED } from '../../constants.js';

export function enterSubscriptionDetailAction({ store, payload }) {
  store.setState((state) => ({
    ...state,
    ui: {
      ...state.ui,
      view: ACTION_ENTER_SUBSCRIPTION_DETAIL,
      selectedSubscriptionId: payload.subscriptionId,
      status: LOADED,
      errorMessage: null,
    },
  }));
}
