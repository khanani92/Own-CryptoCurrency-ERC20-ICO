pragma solidity ^0.4.24;

import './KhananiToken.sol';

contract KhananiTokenSale {
    address admin;
    KhananiToken public tokenContract;
    uint256 public tokenPrice;
    uint256 public tokensSold;

    event Sell(
        address   _buyer,
        uint256  _amount
    );

    constructor (KhananiToken _tokenContract, uint256 _tokenPrice ) public {
        //Assign an Admin
        admin = msg.sender; //address of person how deployed the contract

        //Assign Token Contract
        tokenContract = _tokenContract;

        //Set the token Price
        tokenPrice = _tokenPrice;
    }

    //Multiple function 
    function multiply(uint x, uint y) internal pure returns(uint z) {
        require(y == 0 || (z = x * y) / y == x);
    }

    //Buy Token

    function buyToken(uint256 _numberOfTokens) public payable {
        //Require that value is equal to token
        require(msg.value == multiply(_numberOfTokens , tokenPrice));

        //require that enough token are avaible in token
        require(tokenContract.balanceOf(this) == _numberOfTokens);        

        //require transfer is succesfull
        require(tokenContract.transfer(msg.sender, _numberOfTokens));        
        
        //Keep track of num of token sold
        tokensSold += _numberOfTokens;


        //trigger for Sell Event
        Sell(msg.sender, _numberOfTokens);
    }

}