import "@nomiclabs/hardhat-ethers";
import dotenv from "dotenv";
dotenv.config();

export default {
  solidity: "0.8.24",
  networks: {
    hardhat: {},
    geth: {
      url: process.env.GETH_RPC,
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
