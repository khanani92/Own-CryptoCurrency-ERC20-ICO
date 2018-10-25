var KhananiToken = artifacts.require("./KhananiToken.sol");
var KhananiTokenSale = artifacts.require("./KhananiTokenSale.sol");

module.exports = function(deployer) {
  var tokenSupply = 1000000;
  var tokenPrice = 1000000000000000; // is 0.001 Ehter

  deployer.deploy(KhananiToken, tokenSupply).then(function(TokenAddress){
    return  deployer.deploy(KhananiTokenSale, TokenAddress.address, tokenPrice);
  }); //1000000 it the inital token supply
  
};
