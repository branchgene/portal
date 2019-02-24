/*
 * HomeConstants
 * Each action has a corresponding type, which the reducer knows and picks up on.
 * To avoid weird typos between the reducer and the actions, we save them as
 * constants here. We prefix them with 'yourproject/YourComponent' so we avoid
 * reducers accidentally picking up actions they shouldn't.
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = 'yourproject/YourContainer/YOUR_ACTION_CONSTANT';
 */

export const GET_PATIENT_HISTORY = 'portal/HomePage/GET_PATIENT_HISTORY';
export const GET_PATIENT_HISTORY_ERROR = 'portal/HomePage/GET_PATIENT_HISTORY_ERROR';
export const GET_PATIENT_HISTORY_SUCCESS = 'portal/HomePage/GET_PATIENT_HISTORY_SUCCESS';
