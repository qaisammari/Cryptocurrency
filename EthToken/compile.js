const path = require('path');
const fs = require('fs');
const solc = require('solc');

const BCPath = path.resolve(__dirname, 'contracts', 'BCCoin.sol');
const interfacePath = path.resolve(__dirname, 'contracts', 'Interface.sol');

const source = fs.readFileSync(BCPath, 'utf8');
const source2 = fs.readFileSync(interfacePath, 'utf8');

const contracts = {
  sources: {
    'BCCoin.sol': source,
    'Interface.sol': source2
  }
};
let compiled = solc.compile(contracts, 1);
// console.log(compiled); //comment if you want
module.exports  = compiled.contracts[ 'BCCoin.sol:BCCoin'];
