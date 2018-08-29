const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const { interface, bytecode } = require('../compile');

let accounts;
let token;
let JSONABI;
JSONABI = JSON.parse(interface);

beforeEach(async () => {
    // Get a list of all accounts
    accounts = await web3.eth.getAccounts();

// Use one of those accounts to deploy
// the contract


token = await new web3.eth.Contract(JSONABI)
    .deploy({
        data: bytecode,
        arguments: [100000000000000000000, 'BCCoin', 0, 'BCC' , 100]
    })
    .send({ from: accounts[0], gas: '1000000' });
});

describe('Deployment', () => {
    it('deploys a contract', () => {
    assert.ok(token.options.address);
});
})

describe('balances property', () => {

    it('balances property exist', () => {
    assert.ok(token.methods.balances);
});

it('balances type', () => {
    assert.equal("object", typeof JSONABI[4].inputs[0]);;
});

it('balance[account 0] equal the initial ammount', async () => {
    const balance = await token.methods.balances(accounts[0]).call({
    from: accounts[0]
});
assert.equal(100000000000000000000, balance)
});
})

describe('properties initialized', () => {
    it('name property assigned', async () => {
    const name = await token.methods.name().call({
        from: accounts[0]
    });
    assert.equal('BCCoin', name)
});
it('symbol property assigned', async () => {
    const symbol = await token.methods.symbol().call({
    from: accounts[0]
});
assert.equal('BCC', symbol)
});
it('decimals property assigned', async () => {
    const decimals = await token.methods.decimals().call({
    from: accounts[0]
});
assert.equal(0, decimals)
});
it('token value property assigned', async () => {
    const tokenValue = await token.methods.tokenValue().call({
    from: accounts[0]
});
assert.equal(100, tokenValue)
});
})


describe('transfer function', () => {
    it('transfer function exists', () => {
    assert.ok(token.methods.transfer);
});

it('it should perform a transaction and modify the balances of sender and receiver account', async () => {
    await token.methods.transfer(accounts[2],10).send ({
        from: accounts[0]
    });


const balance2 = await token.methods.balances(accounts[2]).call({
    from: accounts[0]
});

assert.equal(10, balance2);

});

})


describe('Approve', () => {
    it('approve function exists', () => {
    assert.ok(token.methods.approve);
});

it('it should assign the value to spender address ', async () => {
    await token.methods.approve(accounts[2],10).send({
        from: accounts[0]
    });


const allowed2 = await token.methods.allowed(accounts[0],accounts[2]).call({
    from: accounts[0]
})

assert.equal(10, allowed2);

})
})


describe('transferFrom function', () => {
    it('transferFrom function exists', () => {
    assert.ok(token.methods.transferFrom);
});

it('it should perform a transaction and modify the balances of sender and receiver accounts', async () => {
    await token.methods.transfer(accounts[2],10).send ({
        from: accounts[0]
    });

await token.methods.approve(accounts[3],5).send ({
    from: accounts[2]
});
await token.methods.transferFrom(accounts[2],accounts[3],3).send ({
    from: accounts[3]
});
const balance3 = await token.methods.balances(accounts[3]).call({
    from: accounts[3]
});

const balance2 = await token.methods.balances(accounts[2]).call({
    from: accounts[2]
});
assert.equal(3, balance3);
assert.equal(7,balance2)
})
})





describe('getTokens function', () => {
    it('getTokens function exists', () => {
    assert.ok(token.methods.getTokens);
});

it('it should receive tokens when you pay certain amount of ethers ', async () => {
    await token.methods.getTokens().send({
        from: accounts[1],
        value: 1000
    });

const tokens = await token.methods.balances(accounts[1]).call({
    from: accounts[1]
});

assert.equal(10, tokens);
});
})

describe('getBalance function', () => {
    it('getBalance function exist', () => {
    assert.ok(token.methods.getBalance);
});

it('return balance ', async () => {

    const balance =  await token.methods.getBalance().call({
    from: accounts[1]
});
assert.ok(balance<100000000000000000000);

})
});

describe('getEthers function', () => {
    it('getEthers function exist', () => {
    assert.ok(token.methods.getEthers);
});

it('receives ethers when you sell certain amount of tokens ', async () => {

    const Before =  await token.methods.getBalance().call({
    from: accounts[1]
});

await token.methods.getTokens().send({
    from: accounts[1],
    value: web3.utils.toWei('90', 'ether')
});
const after1 =  await token.methods.getBalance().call({
    from: accounts[1]
});

await token.methods.getEthers(900000000000000000).send({
    from: accounts[1]
});

const after2 =  await token.methods.getBalance().call({
    from: accounts[1]
});

const tokens = await token.methods.balances(accounts[1]).call({
    from: accounts[1]
});

assert.equal(0, tokens);
assert.ok(Before<100000000000000000000);
assert.ok(after1<Before);
assert.ok(after1<after2);
});
})