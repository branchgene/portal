
const Ethereum = require('../../lib/ethereum');

const ids = {
  'doctornick': 1,
  'sanatdixit': 2,
};

let eth;

class Doctor {
  constructor(id) {
    this._id = id;
  }

  async hasConsent(patientName) {
    const hasConsent = await eth.doctorHasConsent(patientName, this._id);

    return hasConsent;
  }

  async grantConsent(patientName) {
    await eth.enableDoctor(patientName, this._id);
  }

  async removeConsent(patientName) {
    await eth.disableDoctor(patientName, this._id);
  }

  static async get(name) {
    const lowerName = name.toLowerCase();
    if (!ids[lowerName]) {
      throw new Error('Unknown Doctor!');
    }

    if (!eth) {
      eth = new Ethereum();
      await eth.init();
    }

    return new Doctor(ids[lowerName]);
  }
}


module.exports = Doctor;