import React, { createContext, useState, useContext } from "react";
import Web3 from "web3";
import { ProviderModalContext } from "./providerModalContext";

export const Web3Context = createContext();
let _web3 = new Web3();

const Web3ContextProvider = (props) => {
  //
  const [web3, setWeb3] = useState(_web3);
  const [userAddress, setUserAddress] = useState(null);
  const [web3ConnectStatus, setWeb3ConnectStatus] = useState(0);
  // connectStatus
  //0 -> Not Connected
  //1 -> MetaMask
  //2 -> Portis
  //
  const connectMetamask = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      try {
        const provider = window.ethereum;
        await provider.enable();
        setWeb3(new Web3(provider));
        setUserAddress(provider.selectedAddress);
        //
      } catch (error) {
        // User denied account access...
        alert("User denied account access");
      }
    } else {
      console.log(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
    setWeb3ConnectStatus(1);
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
