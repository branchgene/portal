
const config = require('config');
const Web3 = require('web3');
const log = require('./log');

const consentContractJson = require('./smartContracts/patientConsent.json');
const consentContractByteCode = '0x608060405234801561001057600080fd5b5033600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060008060006101000a81548160ff021916908360ff1602179055506104e28061007c6000396000f3fe60806040526004361061005c576000357c010000000000000000000000000000000000000000000000000000000090048063488d4b3e14610061578063663334f8146100d057806368ce4ed11461013f5780638da5cb5b146101ae575b600080fd5b34801561006d57600080fd5b506100ba6004803603604081101561008457600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050610205565b6040518082815260200191505060405180910390f35b3480156100dc57600080fd5b50610129600480360360408110156100f357600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291908035906020019092919050505061031d565b6040518082815260200191505060405180910390f35b34801561014b57600080fd5b506101986004803603604081101561016257600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050610378565b6040518082815260200191505060405180910390f35b3480156101ba57600080fd5b506101c3610490565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b600080600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008481526020019081526020016000208190555060008081819054906101000a900460ff168092919060010191906101000a81548160ff021916908360ff160217905550507fd8e29fedbb2a2958d33c3f14227af010707eec471450f50045c1f11295ab431c826040518082815260200191505060405180910390a1600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600083815260200190815260200160002054905092915050565b6000600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600083815260200190815260200160002054905092915050565b600060018060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008481526020019081526020016000208190555060008081819054906101000a900460ff168092919060010191906101000a81548160ff021916908360ff160217905550507f1cd631c568600dd6c03398fbb1296e3cca52300d44f04cbe5050719f796b4f07826040518082815260200191505060405180910390a1600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600083815260200190815260200160002054905092915050565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff168156fea165627a7a72305820c3e9b701efed3f21083e249844806bad23bf5179b82264707b23411aec0460870029';

let consentContractInstance;

async function getContract(web3, brokerAddress) {
  if (consentContractInstance) {
    return consentContractInstance;
  }

  // Initialize the contract
  const consentContract = new web3.eth.Contract(consentContractJson, brokerAddress);
  consentContractInstance = await consentContract
    .deploy({ data: consentContractByteCode })
    .send({ from: brokerAddress, gas: 1500000 });

  return consentContractInstance;
}

class Ethereum {
  constructor() {
    this._uri = `${config.ethereum.transport}://${config.ethereum.host}:${config.ethereum.port}`;
    this._web3 = new Web3(new Web3.providers.HttpProvider(this._uri));
    this._brokerAddress = null;
    this._accounts = [];
    this._consentContract = null;

    this._patients = {
      charles: 1,
      george: 2,
      gerald: 3,
      sam: 4,
      sarah: 5,
      sherry: 6,
    };
  }

  async init() {
    const accounts = await this._web3.eth.getAccounts();

    // Our account is always the first
    this._brokerAddress = accounts[0];
    this._accounts = accounts.slice(1);

    this._consentContract = await getContract(this._web3, this._brokerAddress);
  }

  getAccounts() {
    return this._accounts;
  }

  _getPatientAddress(patientName) {
    const pname = patientName.toLowerCase();
    if (!this._patients[pname]) {
      throw new Error('Invalid Patient');
    }

    return this._accounts[this._patients[pname]];    
  }

  async doctorHasConsent(patientName, doctorId) {
    const patientAddress = this._getPatientAddress(patientName);
    const hasConsent = await this._consentContract.methods.hasConsent(patientAddress, doctorId).call();

    log.debug({ patientName, doctorId, hasConsent }, 'Doctor consent');

    return hasConsent;
  }

  async enableDoctor(patientName, doctorId) {
    const patientAddress = this._getPatientAddress(patientName);

    const enableDoctor = await this._consentContract.methods.enableConsent(patientAddress, doctorId)
      .send({ from: this._brokerAddress, gas: 1500000 });

    log.debug({ patientName, doctorId }, 'Doctor enabled');
    return enableDoctor;
  }

  async disableDoctor(patientName, doctorId) {
    const patientAddress = this._getPatientAddress(patientName);

    const disableDoctor = await this._consentContract.methods.disableConsent(patientAddress, doctorId)
      .send({ from: this._brokerAddress, gas: 1500000 });

    log.debug({ patientName, doctorId }, 'Doctor disabled');
    return disableDoctor;
  }
}

module.exports = Ethereum;
