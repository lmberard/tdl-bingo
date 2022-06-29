var Bingo = artifacts.require("./Lottery.sol");

module.exports = function(deployer) {
  deployer.deploy(Bingo);
};