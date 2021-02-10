import { Biconomy } from "@biconomy/mexa";
import config from "../config";
var Contract = require("web3-eth-contract");

const abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_uidOfMatch",
        type: "uint256",
      },
    ],
    name: "claimCricketFunds",
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
        internalType: "string",
        name: "_title",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_uidOfMatch",
        type: "uint256",
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
        name: "_gameStartTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_betAmount",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "_predictedOutcome",
        type: "bool",
      },
    ],
    name: "predictCricketMatch",
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
        name: "_uidOfMatch",
        type: "uint256",
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
        name: "_gameStartTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_betAmount",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "_predictedOutcome",
        type: "bool",
      },
    ],
    name: "predictCricketToss",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_uidOfMatchString",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_uidOfMatchInt",
        type: "uint256",
      },
    ],
    name: "resolveCricketMatch",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_uidOfMatchString",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_uidOfMatchInt",
        type: "uint256",
      },
    ],
    name: "resolveCricketToss",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "cricketBetCreated",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "cricketBets",
    outputs: [
      {
        internalType: "contract CricketGame",
        name: "",
        type: "address",
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
];

Contract.setProvider(
  new Biconomy(window.ethereum, {
    apiKey: config.biconomyApiKey,
    debug: true,
  })
);

const address = "0x97f7518380Dc4eE648A29B899aF61903F51E6926";

export default {
  contract: new Contract(abi, address),
  contractAddress: address,
  contractName: "CricketPachisi",
};
