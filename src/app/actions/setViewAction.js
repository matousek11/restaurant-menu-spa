/**
 * Pure state updater — switches the current UI view.
 * No side-effects, no API calls.
 *
 * @param {{ store: import('../../infra/store/createStore').Store }} deps
 * @param {{ view: string }} payload – must contain the target view constant
 */
export const ACTION_SET_VIEW = 'ACTION_SET_VIEW';

export function setViewAction({ store, payload }) {
  store.setState((state) => ({
    ...state,
    ui: {
      ...state.ui,
      view: payload.view,
    },
  }));
}
