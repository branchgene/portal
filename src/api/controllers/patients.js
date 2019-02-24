
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

function getHistory(req, res, next) {
  const patientName = req.swagger.params.patientName.raw;
  const requester = req.swagger.params.requester.raw || 'None';

  Patient.get(patientName, requester)
    .then((patient) => {
      if (!patient) {
        next(new Error({ statusCode: 404, message: 'Not Found'}));
        return;
      }

      res.send(patient);
    })
    .catch(next);
}

function enableDoctor(req, res, next) {
  const patientName = req.swagger.params.patientName.raw;
  const doctor = req.swagger.params.doctor.raw;

  Doctor.get(doctor.name).then((model) => {
    return model.grantConsent(patientName);
  })
  .then(() => {
    res.send({});
  });
}

function disableDoctor(req, res, next) {
  const patientName = req.swagger.params.patientName.raw;
  const doctor = req.swagger.params.doctor.raw;

  Doctor.get(doctor.name).then((model) => {
    return model.removeConsent(patientName);
  })
  .then(() => {
    res.send({});
  });
}

module.exports = {
  getHistory,
  enableDoctor,
  disableDoctor,
}