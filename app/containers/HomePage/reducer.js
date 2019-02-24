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
  GET_PATIENT_HISTORY_SUCCESS,
  GET_PATIENT_HISTORY_ERROR, 
  GET_PATIENT_HISTORY, 
} from './constants';

const initialState = {
  error: false,
  loading: false,
  patientName: '',
  doctorId: ''
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case GET_PATIENT_HISTORY_ERROR:
      return {
        error: true,
        loading: false,
        ...state,
      };
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
