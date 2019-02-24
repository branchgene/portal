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

export const ENABLE_DOCTOR = 'portal/PatientHistory/ENABLE_DOCTOR';
export const ENABLE_DOCTOR_ERROR = 'portal/PatientHistory/ENABLE_DOCTOR_ERROR';
export const ENABLE_DOCTOR_SUCCESS = 'portal/PatientHistory/ENABLE_DOCTOR_SUCCESS';
export const DISABLE_DOCTOR = 'portal/PatientHistory/DISABLE_DOCTOR';
export const DISABLE_DOCTOR_ERROR = 'portal/PatientHistory/DISABLE_DOCTOR_ERROR';
export const DISABLE_DOCTOR_SUCCESS = 'portal/PatientHistory/DISABLE_DOCTOR_SUCCESS';
export const GET_PATIENT_HISTORY = 'portal/PatientHistory/GET_PATIENT_HISTORY';
export const GET_PATIENT_HISTORY_ERROR = 'portal/PatientHistory/GET_PATIENT_HISTORY_ERROR';
export const GET_PATIENT_HISTORY_SUCCESS = 'portal/PatientHistory/GET_PATIENT_HISTORY_SUCCESS';
