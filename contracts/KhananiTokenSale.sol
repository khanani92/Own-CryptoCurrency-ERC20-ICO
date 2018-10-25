pragma solidity ^0.4.24;

import './KhananiToken.sol';

contract KhananiTokenSale {
    address admin;
    KhananiToken public tokenContract ;
    uint256 public tokenPrice;

    constructor (KhananiToken _tokenContract, uint256 _tokenPrice ) public {
        //Assign an Admin
        admin = msg.sender; //address of person how deployed the contract

        //Assign Token Contract
        tokenContract = _tokenContract;

        //Set the token Price
        tokenPrice = _tokenPrice;
    }
}