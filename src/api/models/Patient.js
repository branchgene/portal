
const Doctor = require('./Doctor');
const patientData = require('./patientData');
const log = require('../../lib/log');


class Patient {
  constructor() {

  }

  static async get(_patientName, requester) {
    const patientName = _patientName.toLowerCase();
    const patient = patientData[patientName];

    if (!patient) {
      log.debug({ patientName }, 'Not found');
      return null;
    }

    log.debug({ patientName, requester }, 'Requested Patient');
    if (requester.toLowerCase() === patient.name.toLowerCase()) {
      log.info({ patientName }, 'Returning patient to themselves');
      return patient;
    }

    // Check the blockchain for our authentication
    const doctor = await Doctor.get(requester);
    const hasConsent = await doctor.hasConsent(patientName);
    log.debug({ patientName, requester, hasConsent }, 'Result of consent');
    if (hasConsent === '1') {
      log.info({ patientName, requester }, 'Doctor has consent; returning patient');
      return patient;
    }

    // Otherwise only return their name
    log.info({ patientName, requester }, 'Denying requester for patient');
    return {
      name: _patientName,
    };
  }
}

module.exports = Patient;