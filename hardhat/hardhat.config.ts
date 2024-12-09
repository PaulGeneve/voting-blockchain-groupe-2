import deploy from "./scripts/deploy";
require("@nomiclabs/hardhat-waffle");
import "@nomiclabs/hardhat-ethers";
import { HardhatUserConfig } from "hardhat/config";
import "@typechain/hardhat";

deploy.setDescription("Deploy the Proposal contract");

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  typechain: {
    outDir: "typechain-types",
    target: "ethers-v5",
  }
};

export default config;
