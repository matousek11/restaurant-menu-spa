// src/app/actions/enterSubscriptionCreateAction.js

import { ACTION_ENTER_SUBSCRIPTION_CREATE, LOADED } from '../../constants.js';

export function enterSubscriptionCreateAction({ store }) {
  store.setState((state) => ({
    ...state,
    ui: {
      ...state.ui,
      view: ACTION_ENTER_SUBSCRIPTION_CREATE,
      selectedSubscriptionId: null,
      status: LOADED,
      errorMessage: null,
    },
  }));
}
