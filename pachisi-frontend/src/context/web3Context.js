import React, { createContext, useState, useContext } from "react";
import Web3 from "web3";
import config from "../config";
import { Biconomy } from "@biconomy/mexa";

import { ProviderModalContext } from "./providerModalContext";

export const Web3Context = createContext();

const Web3ContextProvider = (props) => {
  //
  const [web3, setWeb3] = useState();
  const [userAddress, setUserAddress] = useState(null);
  const [web3ConnectStatus, setWeb3ConnectStatus] = useState(0);
  // connectStatus
  //0 -> Not Connected
  //1 -> MetaMask
  //2 -> Portis
  //
  const connectMetamask = async () => {
    if (window.ethereum) {
      try {
        const provider = window.ethereum;
        const biconomy = new Biconomy(provider, {
          apiKey: config.biconomyApiKey,
          debug: true,
        });
        await window.ethereum.enable();
        setWeb3(new Web3(biconomy));
        setUserAddress(provider.selectedAddress);

        biconomy
          .onEvent(biconomy.READY, async () => {
            setWeb3ConnectStatus(1);

            provider.on("accountsChanged", function (accounts) {
              setUserAddress(accounts[0]);
            });
          })
          .onEvent(biconomy.ERROR, (err, message) => {
            alert(message);
            console.log(err, message);
          });
      } catch (error) {
        console.log("Please allow access to connect to web3 ");
      }
    } else {
      console.log(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  };
  const connectPortis = async () => {};

  return (
    <Web3Context.Provider
      value={{
        connectMetamask,
        connectPortis,
        web3,
        userAddress,
        setUserAddress,
        web3ConnectStatus,
      }}>
      {props.children}
    </Web3Context.Provider>
  );
};

export default Web3ContextProvider;
