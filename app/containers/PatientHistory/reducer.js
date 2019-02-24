/*
 * AppReducer
 *
 * The reducer takes care of our data. Using actions, we can change our
 * application state.
 * To add a new action, add it to the switch statement in the reducer function
 *
 * Example:
 * case YOUR_ACTION_CONSTANT:
 *   return state.set('yourStateVariable', true);
 */

import {
  ENABLE_DOCTOR,
  ENABLE_DOCTOR_SUCCESS,
  ENABLE_DOCTOR_ERROR,
  DISABLE_DOCTOR,
  DISABLE_DOCTOR_ERROR,
  DISABLE_DOCTOR_SUCCESS,
  GET_PATIENT_HISTORY_SUCCESS,
  GET_PATIENT_HISTORY_ERROR, 
  GET_PATIENT_HISTORY,
} from './constants';

const initialState = {
  error: false,
  loading: false,
  historyData: {},
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case ENABLE_DOCTOR_ERROR:
      return { error: true, loading: false, ...state };
    case ENABLE_DOCTOR_SUCCESS:
      return {
        error: false,
        loading: false,
        historyData: { 
          ...action.payload
        },
       };
    case ENABLE_DOCTOR:
      return { loading: true, error: false, ...state };
    case DISABLE_DOCTOR_ERROR:
      return { error: true, loading: false, ...state };
    case DISABLE_DOCTOR_SUCCESS:
      return {
        error: false,
        loading: false,
        historyData: { 
          ...action.payload
        },
       };
    case DISABLE_DOCTOR:
      return { loading: true, error: false, ...state };
    case GET_PATIENT_HISTORY_ERROR:
      return { error: true, loading: false, ...state };
    case GET_PATIENT_HISTORY_SUCCESS:
      return {
      	error: false,
      	loading: false,
        historyData: { 
          ...action.payload
        },
       };
    case GET_PATIENT_HISTORY:
      return { loading: true, error: false, ...state };
    default:
      return state;
  }
}

export default reducer;
