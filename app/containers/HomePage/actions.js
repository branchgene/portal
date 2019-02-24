/*
 * App Actions
 *
 * Actions change things in your application
 * Since this boilerplate uses a uni-directional data flow, specifically redux,
 * we have these actions which are the only way your application interacts with
 * your application state. This guarantees that your state is up to date and nobody
 * messes it up weirdly somewhere.
 *
 * To add a new Action:
 * 1) Import your constant
 * 2) Add a function like this:
 *    export function yourAction(var) {
 *        return { type: YOUR_ACTION_CONSTANT, var: var }
 *    }
 */

import { push } from 'react-router-redux';

import http from '../../lib/http';

import {
  GET_PATIENT_HISTORY,
  GET_PATIENT_HISTORY_SUCCESS,
  GET_PATIENT_HISTORY_ERROR,
} from './constants';



export function getPatientHistorySuccess(patientName, requester, patientData) {
  return {
    type: GET_PATIENT_HISTORY_SUCCESS,
    payload: {
      requester,
      patientData,
    },
  };
}

export function getPatientHistoryError(error) {
  return {
    type: GET_PATIENT_HISTORY_ERROR,
    payload: { error },
  };
}

export function getPatientHistory(patientName, requester) {
  return async (dispatch) => {
    try {
      console.log({ patientName, requester }, 'Getting Patient History');
      const { data } = await http().get(`/api/v1/patients/${patientName}/history?requester=${requester}`);
      dispatch(getPatientHistorySuccess(patientName, requester, data));
      dispatch(push('/patientHistory'));
    } catch (ex) {
      dispatch(getPatientHistoryError(ex));
    }
  }  
}
