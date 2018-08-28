
pragma solidity ^0.4.21;

import "./Interface.sol";            // change this line


library SafeMath {
    function add(uint a, uint b) internal pure returns (uint c) {
        c = a + b;
        require(c >= a);
    }
    function sub(uint a, uint b) internal pure returns (uint c) {
        require(b <= a);
        c = a - b;
    }
    function mul(uint a, uint b) internal pure returns (uint c) {
        c = a * b;
        require(a == 0 || c / a == b);
    }
    function div(uint a,   uint b) internal pure returns (uint c) {
        require(b > 0);
        c = a / b;
    }
}


contract BCCoin is Interface {

    uint256 constant private MAX_UINT256 = 2**256 - 1;
    // declare balances variable here
    mapping (address => mapping (address => uint256)) public allowed;
    using SafeMath for uint;

    string public name;                   //fancy name: eg Simon Bucks
    uint8 public decimals;                //How many decimals to show.
    string public symbol;                 //An identifier: eg SBX
    uint8 public tokenValue;              //token value in ethers
    address public owner;                 //address account who deplyed the contract
    uint256 initialAmount;
    mapping(address => uint) public balances;



    constructor (uint256 _initialAmount, string _tokenName, uint8 _decimalUnits, string _tokenSymbol, uint8 _tokenValue) public {
        owner = msg.sender;
       // your code here
        initialAmount = _initialAmount;
        name = _tokenName;
        decimals = _decimalUnits;
        symbol = _tokenSymbol;
        tokenValue = _tokenValue;

        balances[owner] = initialAmount;
    }


    function transfer(address _to, uint256 _value) public  {
       // your code here
        balances[msg.sender] = balances[msg.sender].sub(_value);
        balances[_to] = balances[_to].add(_value);
    }

    function transferFrom(address _from, address _to, uint256 _value) public  {
        uint256 allowance = allowed[_from][msg.sender];
        // your code here
        balances[_from] = balances[_from].sub(_value);
        allowed[_from][msg.sender] = allowed[_from][msg.sender].sub(_value);
        balances[_to] = balances[_to].add(_value);

     
    }    
   
    function approve(address _spender, uint256 _value) public  {
       // your code here
        allowed[msg.sender][_spender] = _value;


    }

    function getTokens() public payable{
        uint256 exchangeTokens = msg.value.div(tokenValue);
        balances[owner] = balances[owner].sub(exchangeTokens);
        balances[msg.sender] = balances[msg.sender].add(exchangeTokens);
    }


    function getBalance() public returns(uint256) {
        return msg.sender.balance;
    }

    function getEthers(uint256 _tokens) public   {
        uint256 exchangedEther = _tokens.div(tokenValue);
        balances[msg.sender] = balances[msg.sender].sub(_tokens);
        msg.sender.send(exchangedEther);
    }



}
