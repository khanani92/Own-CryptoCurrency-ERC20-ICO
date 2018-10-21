pragma solidity ^0.4.24;

contract KhananiToken {
    //Name
    //Symbol
    string public name = 'Khanani Token';
    string public symbol = 'KCOIN';
    string public standard = 'Khanani Token v1.0';
    
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;

    constructor(uint256 _initalSupply) public {
        balanceOf[msg.sender] = _initalSupply;
        totalSupply = _initalSupply;
         
        //allocating initial supply 
    }

}