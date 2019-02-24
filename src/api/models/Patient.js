
const patientData = require('./patientData');
const log = require('../../lib/log');

class Patient {
  constructor() {

  }

  static get(_patientName, requester) {
    const patientName = _patientName.toLowerCase();
    const patient = patientData[patientName];

    if (!patient) {
      log.debug({ patientName }, 'Not found');
      return null;
    }

    log.debug({ patientName, requester }, 'Requested Patient');
    if (requester.toLowerCase() === patient.name.toLowerCase()) {
      return patient;
    }

    // Check the blockchain for our authentication

    // Otherwise reject
    log.info({ patientName, requester }, 'Denying requester for patient');
    return null;
  }
}

module.exports = Patient;