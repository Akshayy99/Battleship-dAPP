var battleship = artifacts.require("battleship");

module.exports = function(deployer) {
  deployer.deploy(battleship);
};