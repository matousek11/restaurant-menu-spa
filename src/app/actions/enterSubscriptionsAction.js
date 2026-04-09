// src/app/actions/enterSubscriptionsAction.js

export function enterSubscriptionsAction({ store }) {
  store.setState((state) => ({
    ...state,
    ui: {
      ...state.ui,
      mode: 'SUBSCRIPTION_LIST',
      selectedSubscriptionId: null,
      status: 'READY',
      errorMessage: null,
    },
  }));
}
