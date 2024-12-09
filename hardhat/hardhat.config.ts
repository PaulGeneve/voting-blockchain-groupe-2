require("@nomiclabs/hardhat-waffle");
import "@nomiclabs/hardhat-ethers";
import { HardhatUserConfig } from "hardhat/config";
import "@typechain/hardhat";

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  typechain: {
    outDir: "typechain-types",
    target: "ethers-v5",
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    amoy: {
      chainId: 80002,
      url: "https://rpc-amoy.polygon.technology",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    },
  },
};

export default config;
