// src/app/actions/enterSubscriptionCreateAction.js

export function enterSubscriptionCreateAction({ store }) {
  store.setState((state) => ({
    ...state,
    ui: {
      ...state.ui,
      mode: 'SUBSCRIPTION_CREATE',
      selectedSubscriptionId: null,
      status: 'READY',
      errorMessage: null,
    },
  }));
}
