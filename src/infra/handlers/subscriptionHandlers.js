import * as constants from '../../constants.js';

/**
 * Returns an onSubmit handler for the "create subscription" form.
 * Reads weekStartId and totalDays from the form and dispatches ACTION_CREATE_SUBSCRIPTION.
 *
 * @param {Function} dispatch
 * @param {HTMLSelectElement} weekSelect
 * @param {HTMLInputElement} daysInput
 * @returns {(event: SubmitEvent) => void}
 */
export function createSubscriptionFormHandler(dispatch, weekSelect, daysInput) {
  return function onSubmit(event) {
    event.preventDefault();
    const weekStartId = weekSelect.value;
    const totalDays = parseInt(daysInput.value, 10);
    if (!weekStartId || Number.isNaN(totalDays)) return;
    dispatch({
      type: constants.ACTION_CREATE_SUBSCRIPTION,
      payload: { weekStartId, totalDays },
    });
  };
}

/**
 * Returns an onClick handler that pauses an active subscription.
 *
 * @param {Function} dispatch
 * @param {string} subscriptionId
 * @returns {(event: MouseEvent) => void}
 */
export function pauseSubscriptionHandler(dispatch, subscriptionId) {
  return function onClick(event) {
    event.preventDefault();
    dispatch({
      type: constants.ACTION_PAUSE_SUBSCRIPTION,
      payload: { subscriptionId },
    });
  };
}

/**
 * Returns an onClick handler that resumes a paused subscription.
 *
 * @param {Function} dispatch
 * @param {string} subscriptionId
 * @returns {(event: MouseEvent) => void}
 */
export function resumeSubscriptionHandler(dispatch, subscriptionId) {
  return function onClick(event) {
    event.preventDefault();
    dispatch({
      type: constants.ACTION_RESUME_SUBSCRIPTION,
      payload: { subscriptionId },
    });
  };
}

/**
 * Returns an onClick handler that cancels an active or paused subscription.
 *
 * @param {Function} dispatch
 * @param {string} subscriptionId
 * @returns {(event: MouseEvent) => void}
 */
export function cancelSubscriptionHandler(dispatch, subscriptionId) {
  return function onClick(event) {
    event.preventDefault();
    dispatch({
      type: constants.ACTION_CANCEL_SUBSCRIPTION,
      payload: { subscriptionId },
    });
  };
}
