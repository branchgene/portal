
const Patient = require('../models/Patient');

function getHistory(req, res, next) {
  const patientName = req.swagger.params.patientName.raw;
  const requester = req.swagger.params.requester.raw || 'None';

  console.log(req.swagger.params.queryRequester);

  const patient = Patient.get(patientName, requester);
  if (!patient) {
    next(new Error({ statusCode: 404, message: 'Not Found'}));
    return;
  }

  res.send(patient);
}

function enableDoctor(req, res, next) {
  res.send(sarah);
}

function disableDoctor(req, res, next) {
  res.send(sarah);
}

module.exports = {
  getHistory,
  enableDoctor,
}