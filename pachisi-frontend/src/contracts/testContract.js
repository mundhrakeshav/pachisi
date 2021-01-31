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
const abi = [
  {
    constant: false,
    inputs: [
      {
        internalType: "uint256",
        name: "x",
        type: "uint256",
      },
    ],
    name: "setDai",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "dai",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
];
const address = "0x283aED10dDE5757cb0c6eA2d03c8363f0262E3C2";
export default new Contract(abi, address);
