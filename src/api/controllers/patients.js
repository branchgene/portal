
const sarah = require('../mocks/sarah.json');


function getHistory(req, res, next) {

  const patientName = req.swagger.params.patientName.raw;
  const requester = req.swagger.params.queryRequester.raw || 'None';

  if (patientName !== 'Sarah') {
    next(new Error('foo'));
    return;
  }

  res.send(sarah);

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