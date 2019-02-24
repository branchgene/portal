# BranchGene Portal

A portal application for the BranchGene application.

Created as part of the Hudson Alpha Tech Challenge 2019.

# Setup


# Ganache

Use Ganache to simulate the blockchain.

```
$ npm install -g ganache-cli
```


## Truffle

We set up truffle locally to manage the smart contract.

https://truffleframework.com/docs/truffle/getting-started/creating-a-project

```
$ npm install -g truffle
$ cd whatever
$ truffle init
```

## Smart Contract

We have a very simple smart contract. While ideally we'd like to place the entire patient history on the blockchain, to start we're just going to place the consent for viewing a particular patient's data on the blockchain. Each person who wants to view the patient's data places an integer value on the blockchain; we then check that value before displaying the data.

```
pragma solidity >=0.4.22 <0.6.0;

contract HashBranchPatient {
    uint8 private consentCount;
    mapping (uint => uint) private consentIds;
    address public owner;

    event LogConsentEnabled(uint consentId);

    event LogConsentDisabled(uint consentId);

    constructor() public {
        owner = msg.sender;
        consentCount = 0;
    }

    function enableConsent(uint consentId) public returns (uint) {
        consentIds[consentId] = 1;
        consentCount++;

        emit LogConsentEnabled(consentId);

        return consentIds[consentId];
    }

    function disableConsent(uint consentId) public returns (uint) {
        consentIds[consentId] = 0;
        consentCount++;

        emit LogConsentDisabled(consentId);

        return consentIds[consentId];
    }

    function hasConsent(uint consentId) public view returns (uint) {
        return consentIds[consentId];
    }
}
```

# License

This project is licensed under the MIT license:

MIT license, Copyright (c) 2019 Matthew Jordan.

The [React-Redux Boilerplate](https://github.com/flexdinesh/react-redux-boilerplate) that formed the basis of this project was also licensed under the MIT license:

MIT license, Copyright (c) 2018 Dinesh Pandiyan.
