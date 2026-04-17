// src/app/actions/enterSubscriptionDetailAction.js

export function enterSubscriptionDetailAction({ store, payload }) {
  store.setState((state) => ({
    ...state,
    ui: {
      ...state.ui,
      mode: 'SUBSCRIPTION_DETAIL',
      selectedSubscriptionId: payload.subscriptionId,
      status: 'READY',
      errorMessage: null,
    },
  }));
}
