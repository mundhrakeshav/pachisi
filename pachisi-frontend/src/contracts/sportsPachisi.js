import { Biconomy } from "@biconomy/mexa";
import config from "../config";
var Contract = require("web3-eth-contract");

// set provider for all later instances to use
Contract.setProvider(
  new Biconomy(window.ethereum, {
    apiKey: config.biconomyApiKey,
    debug: true,
  })
);
