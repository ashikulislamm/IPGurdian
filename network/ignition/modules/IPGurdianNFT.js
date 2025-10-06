const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("IPGuardianNFTModule", (m) => {
  // Deploy contract (constructor takes no params)
  const ipGuardianNFT = m.contract("IPGuardianNFT", []);

  return { ipGuardianNFT };
});
