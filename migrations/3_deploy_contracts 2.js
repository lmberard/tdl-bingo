var Token = artifacts.require("./LPLToken.sol");

module.exports = function(deployer) {
  deployer.deploy(Token);
};