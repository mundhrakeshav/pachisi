import { Biconomy } from "@biconomy/mexa";
import config from "../config";
var Contract = require("web3-eth-contract");

const abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_uid",
        type: "uint256",
      },
    ],
    name: "claim",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_title",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_initialAmount",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "_outcome",
        type: "bool",
      },
      {
        internalType: "string",
        name: "_outcome1",
        type: "string",
      },
      {
        internalType: "string",
        name: "_outcome2",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_toBeResolvedTime",
        type: "uint256",
      },
    ],
    name: "createCustomBet",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "userAddress",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "functionSignature",
        type: "bytes",
      },
      {
        internalType: "bytes32",
        name: "sigR",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "sigS",
        type: "bytes32",
      },
      {
        internalType: "uint8",
        name: "sigV",
        type: "uint8",
      },
    ],
    name: "executeMetaTransaction",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_uid",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "_predictedOutcome",
        type: "bool",
      },
    ],
    name: "predictCustomBets",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bool",
        name: "_outcome",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "_uid",
        type: "uint256",
      },
    ],
    name: "resolveBet",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "userAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "relayerAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "functionSignature",
        type: "bytes",
      },
    ],
    name: "MetaTransactionExecuted",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "customBets",
    outputs: [
      {
        internalType: "uint256",
        name: "toBeResolvedTime",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "title",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "totalAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "totalAmountOnOutcome1",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "totalAmountOnOutcome2",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "outcome1",
        type: "string",
      },
      {
        internalType: "string",
        name: "outcome2",
        type: "string",
      },
      {
        internalType: "bool",
        name: "outcome",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "getNonce",
    outputs: [
      {
        internalType: "uint256",
        name: "nonce",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalbets",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

Contract.setProvider(
  new Biconomy(window.ethereum, {
    apiKey: config.biconomyApiKey,
    debug: true,
  })
);

const address = "0x9DF9DFC9220F1fc88642b9f7e8A8c9BC7a4FFb02";

export default {
  contract: new Contract(abi, address),
  contractAddress: address,
  contractName: "Custom",
};
