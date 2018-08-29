const HDWalletProvider = require('truffle-hdwallet-provider'); //It can be uses wherever a Web3 provider is needed, not just in Truffle. It will sign transactions for addresses derived from a 12-word mnemonic.
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');

const provider = new HDWalletProvider(
    'glory fish civil aisle chest few gap crazy hollow vacant season excess',
    'https://rinkeby.infura.io/v3/5dbf2aa41a7b4e03b2cbe95962583652');

const web3 = new Web3(provider);
let contractAddress;

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    console.log('Attempting to deploy from account', accounts[0]);

    const result = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: '0x'+bytecode, arguments: [1000, 'BCCoin', 0, 'BC' , 100] })
        .send({ gas: '1000000', from: accounts[0] });
    contractAddress = result.options.address;
    console.log('Contract deployed to', contractAddress);
};

deploy();