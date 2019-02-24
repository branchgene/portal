
const Doctor = require('./Doctor');
const allPatientData = require('./patientData');
const log = require('../../lib/log');
const _ = require('lodash');

function addIds(_patientData) {
  const patientData = _.cloneDeep(_patientData);

  patientData.id = patientData.name;
  if (patientData.history) {
    Object.keys(patientData.history).forEach((patientName) => {
      patientData.history[patientName].id = patientName;
    });
  }

  return patientData;
}

function anonymize(_patientData) {
  const patientData = _.cloneDeep(_patientData);

  Object.keys(patientData.history).forEach((patientName) => {
    if (patientData.history[patientName].hasConsent) {
      return;
    }
    if (patientData.history[patientName].gender === 'male') {
      patientData.history[patientName].name = 'John Doe';
    } else {
      patientData.history[patientName].name = 'Jane Doe';
    }
  });

  return patientData;
}

function addRelationshipConfidences(_patientData) {
  const patientData = _.cloneDeep(_patientData);

  if (patientData.diseases) {
    patientData.diseases = patientData.diseases.map((disease) => {
      return {
        ...disease,
        confidenceScore: 1
      };
    });
  }

  if (patientData.family.father) {
    patientData.family.father = [{ confidenceScore: 1, id: patientData.family.father }];
  } else {
    patientData.family.father = [];
  }
  if (patientData.family.mother) {
    patientData.family.mother = [{ confidenceScore: 1, id: patientData.family.mother }];
  } else {
    patientData.family.mother = [];
  }
  if (patientData.family.siblings) {
    patientData.family.siblings = patientData.family.siblings.map((sibling) => {
      return {
        confidenceScore: 1,
        id: sibling
      };
    });
  } else {
    patientData.family.siblings = [];
  }
  if (patientData.family.children) {
    patientData.family.children = patientData.family.children.map((child) => {
      return {
        confidenceScore: 1,
        id: child
      }
    });
  } else {
    patientData.family.children = [];
  }

  Object.keys(patientData.history).forEach((patientName) => {
    if (patientData.history[patientName].diseases) {
      patientData.history[patientName].diseases = patientData.history[patientName].diseases.map((disease) => {
        return {
          ...disease,
          confidenceScore: 1
        };
      });
    }
    if (patientData.history[patientName].family.father) {
      patientData.history[patientName].family.father = [{ confidenceScore: 1, id: patientData.history[patientName].family.father }];
    } else {
      patientData.history[patientName].family.father = [];
    }

    if (patientData.history[patientName].family.mother) {
      patientData.history[patientName].family.mother = [{ confidenceScore: 1, id: patientData.history[patientName].family.mother }];
    } else {
      patientData.history[patientName].family.mother = [];
    }

    if (patientData.history[patientName].family.children) {
      patientData.history[patientName].family.children = patientData.history[patientName].family.children.map((child) => {
        return {
          confidenceScore: 1,
          id: child
        };
      });
    } else {
      patientData.history[patientName].family.children = [];
    }

    if (patientData.history[patientName].family.siblings) {
      patientData.history[patientName].family.siblings = patientData.history[patientName].family.siblings.map((sibling) => {
        return {
          confidenceScore: 1,
          id: sibling
        };
      });
    } else {
      patientData.history[patientName].family.siblings = [];
    }

  });

  return patientData;
}

function mergePatients(_patient, allPatientData) {
  const patient = _.cloneDeep(addRelationshipConfidences(addIds(_patient)));

  const otherPatientDatas = Object.keys(allPatientData)
    .filter((otherPatientName) => {
      return otherPatientName.toLowerCase() !== patient.name.toLowerCase();
    })
    .map((otherPatientName) => _.cloneDeep(addRelationshipConfidences(addIds(allPatientData[otherPatientName]))));

  otherPatientDatas.forEach((otherPatientData) => {
    const mergedItems = [otherPatientData, ...Object.keys(otherPatientData.history).map((name) => otherPatientData.history[name])];

    mergedItems.forEach((item) => {
      let current = patient.history[item.name];
      if (!current) {
        if (item.name === patient.name) {
          current = patient;
        } else {
          return;
        }
      }

      if (!current.family.father) {
        current.family.father = [];
      }
      if (!current.family.mother) {
        current.family.mother = [];
      }
      if (!current.family.siblings) {
        current.family.siblings = [];
      }
      if (!current.family.children) {
        current.family.children = [];
      }

      if (item.deathAge && item.deathAge !== current.deathAge) {
        if (!current.deathAge) {
          current.deathAge = item.deathAge;
        } else {
          current.minDeathAge = Math.min(current.minDeathAge || current.deathAge, item.deathAge);
          current.maxDeathAge = Math.max(current.maxDeathAge || current.deathAge, item.deathAge);
        }
      }

      if (item.diseases && item.diseases.length) {
        if (!current.diseases) {
          current.diseases = [];
        }
        item.diseases.forEach((disease) => {
          const existing = current.diseases.find((d) => d.name === disease.name);
          if (!existing) {
            current.diseases.push(disease);
          } else {
            if (existing.onsetAge !== disease.onsetAge) {
              existing.minOnsetAge = Math.min(existing.minOnsetAge || existing.onsetAge, disease.onsetAge);
              existing.maxOnsetAge = Math.max(existing.maxOnsetAge || existing.onsetAge, disease.onsetAge);
            }
            existing.confidenceScore += 1;
          }
        });
      }

      if (item.family.father.length) {
        const father = current.family.father.find((f) => {
          return f.id === item.family.father[0].id;
        });
        if (father) {
          father.confidenceScore += 1;
        } else {
          if (!patient.history[item.family.father[0].id] && item.family.father[0].id !== patient.id) {
            patient.history[item.family.father[0].id] = {
              id: item.family.father[0].id,
              name: item.family.father[0].id,
              gender: 'male',
              family: {
                father: [],
                mother: [],
                children: [],
                siblings: [],
              },
            };
          }
          current.family.father.push(_.cloneDeep(item.family.father[0]));
        }
      }

      if (item.family.mother.length) {
        const mother = current.family.mother.find((f) => f.id === item.family.mother[0].id);
        if (mother) {
          mother.confidenceScore += 1;
        } else {
          if (!patient.history[item.family.mother[0].id] && item.family.mother[0].id !== patient.id) {
            patient.history[item.family.mother[0].id] = {
              id: item.family.mother[0].id,
              name: item.family.mother[0].id,
              gender: 'female',
              family: {
                father: [],
                mother: [],
                children: [],
                siblings: [],
              },
            };
          }
          current.family.mother.push(_.cloneDeep(item.family.mother[0]));
        }
      }

      if (item.family.children) {
        item.family.children.forEach((child) => {
          const existingChild = current.family.children.find((c) => c.id === child.id);
          if (existingChild) {
            existingChild.confidenceScore += 1;
          } else {
            if (!patient.history[child.id] && child.id !== patient.id) {
              patient.history[child.id] = {
                id: child.id,
                name: child.id,
                family: {
                  father: [],
                  mother: [],
                  children: [],
                  siblings: [],
                },
              };
            }
            current.family.children.push(_.cloneDeep(child));
          }
        });
      }

      if (item.family.siblings) {
        item.family.siblings.forEach((sibling) => {
          const existingSibling = current.family.siblings.find((s) => s.id === sibling.id);
          if (existingSibling) {
            existingSibling.confidenceScore += 1;
          } else {
            if (!patient.history[sibling.id] && sibling.id !== patient.id) {
              patient.history[sibling.id] = {
                id: sibling.id,
                name: sibling.id,
                family: {
                  father: [],
                  mother: [],
                  children: [],
                  siblings: [],
                },
              };
            }
            current.family.siblings.push(_.cloneDeep(sibling));
          }
        });
      }
    });

  });

  return patient;
}

class Patient {
  constructor() {

  }

  static async get(_patientName, requester) {
    const patientName = _patientName.toLowerCase();
    const patient = allPatientData[patientName];
    const allowedNames = [
      'charles',
      'george',
      'gerald',
      'sam',
      'sarah',
      'sherry',
    ];

    if (!patient) {
      log.debug({ patientName }, 'Not found');
      return null;
    }

    log.debug({ patientName, requester }, 'Requested Patient');
    if (requester.toLowerCase() === patient.name.toLowerCase()) {
      log.info({ patientName }, 'Returning patient to themselves');
      return addRelationshipConfidences(addIds(patient));
    }

    // Check the blockchain for our authentication
    const doctor = await Doctor.get(requester);
    const hasConsent = await doctor.hasConsent(patientName);
    log.debug({ patientName, requester, hasConsent }, 'Result of consent');
    if (hasConsent === '1') {
      log.info({ patientName, requester }, 'Doctor has primary consent; returning patient');

      const mergedPatients = mergePatients(patient, allPatientData);
      const allConsents = await Promise.all(Object.keys(mergedPatients.history)
        .filter((historyPatientName) => allowedNames.includes(historyPatientName.toLowerCase()))
        .map((historyPatientName) => {
          return doctor.hasConsent(historyPatientName.toLowerCase())
            .then((result) => {
              return { hasConsent: result === '1', name: historyPatientName };
            });
          }));
      allConsents.forEach((consent) => {
        patient.history[consent.name].hasConsent = consent.hasConsent;
      });

      return anonymize(mergePatients(patient, allPatientData));
    }

    // Otherwise only return their name
    log.info({ patientName, requester }, 'Denying requester for patient');
    return {
      name: _patientName,
    };
  }
}

module.exports = Patient;