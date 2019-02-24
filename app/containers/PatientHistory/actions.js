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
    ENABLE_DOCTOR,
    ENABLE_DOCTOR_SUCCESS,
    ENABLE_DOCTOR_ERROR,
    DISABLE_DOCTOR_SUCCESS,
    DISABLE_DOCTOR,
    DISABLE_DOCTOR_ERROR,
    GET_PATIENT_HISTORY,
    GET_PATIENT_HISTORY_SUCCESS,
    GET_PATIENT_HISTORY_ERROR,
  } from './constants';

  export function enableDoctorSuccess(patientName, doctorId, patientData) {
    return {
      type: ENABLE_DOCTOR_SUCCESS,
      payload: {
        patientData,
      },
    };
  }

  export function enableDoctorError(error) {
    return {
      type: ENABLE_DOCTOR_ERROR,
      payload: { error },
    };
  }

  export function enableDoctor(patientName, doctorId) {
    return async (dispatch) => {
      try {
        console.log({ patientName, doctorId });
        const { data } = await http().put(`/api/v1/patients/${patientName}/enableDoctor`, { name: doctorId });
        dispatch(enableDoctorSuccess(patientName, doctorId, data));
      } catch (ex) {
        dispatch(enableDoctorError(ex));
      }
    }
  }

  export function disableDoctorSuccess(patientName, doctorId, patientData) {
    return {
      type: DISABLE_DOCTOR_SUCCESS,
      payload: {
        patientData,
      },
    };
  }

  export function disableDoctorError(error) {
    return {
      type: DISABLE_DOCTOR_ERROR,
      payload: { error },
    };
  }

  export function disableDoctor(patientName, doctorId) {
    return async (dispatch) => {
      try {
        await http().put(`/api/v1/patients/${patientName}/disableDoctor`, { name: doctorId });
        dispatch(disableDoctorSuccess(patientName, doctorId));
      } catch (ex) {
        dispatch(disableDoctorError(ex));
      }
    }
  }


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
        const { data } = await http().get(`/api/v1/patients/${patientName}/history?requester=${requester}`);
        dispatch(getPatientHistorySuccess(patientName, requester, data));
      } catch (ex) {
        dispatch(getPatientHistoryError(ex));
      }
    }  
  }
