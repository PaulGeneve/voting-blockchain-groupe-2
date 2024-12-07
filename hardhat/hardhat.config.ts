require("@nomiclabs/hardhat-waffle");
import { HardhatUserConfig } from "hardhat/config";
import "@typechain/hardhat";

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  typechain: {
    outDir: "typechain-types",
    target: "ethers-v5",
  },
};

export default config;
