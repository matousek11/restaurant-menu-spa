// src/app/actions/pauseSubscriptionAction.js

export async function pauseSubscriptionAction({ store, api, payload }) {
  const { subscriptionId } = payload;

  store.setState((state) => ({
    ...state,
    ui: { ...state.ui, status: 'LOADING', errorMessage: null },
  }));

  try {
    const subscription = await api.subscription.pauseSubscriptionById(subscriptionId);

    store.setState((state) => ({
      ...state,
      subscriptions: state.subscriptions.map((s) =>
        s.id === subscription.id ? subscription : s,
      ),
      ui: { ...state.ui, status: 'READY', errorMessage: null },
    }));
  } catch (error) {
    store.setState((state) => ({
      ...state,
      ui: {
        ...state.ui,
        status: 'ERROR',
        errorMessage: error.message ?? 'FE: Předplatné se nepodařilo pozastavit',
      },
    }));
  }
}
