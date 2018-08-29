import Web3 from 'web3';

// const HDWalletProvider = require('truffle-hdwallet-provider'); //It can be uses wherever a Web3 provider is needed, not just in Truffle. It will sign transactions for addresses derived from a 12-word mnemonic.


const provider = window.web3.currentProvider;
const web3 = new Web3(provider);

export default web3;