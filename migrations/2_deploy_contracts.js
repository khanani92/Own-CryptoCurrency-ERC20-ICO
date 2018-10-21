var KhananiToken = artifacts.require("./KhananiToken.sol");

module.exports = function(deployer) {
  deployer.deploy(KhananiToken);
};
