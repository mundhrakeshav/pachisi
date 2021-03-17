import React, { createContext, useState } from "react";
import Web3 from "web3";

export const Web3Context = createContext();

const Web3ContextProvider = (props) => {
  const [web3, setWeb3] = useState();
  const [userAddress, setUserAddress] = useState(null);

  const connectMetamask = async () => {
    if (window.ethereum) {
      try {
        const provider = window.ethereum;

        if (!(provider.networkVersion == "42")) {
          alert("Please switch to Kovan Network");
          return;
        }
        await provider.enable();
        const _web3 = new Web3(provider);
        setWeb3(_web3);
        setUserAddress(provider.selectedAddress);
      } catch (error) {
        console.log("Please allow access to connect to web3 ");
      }
    } else {
      console.log(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  };

  return (
    <Web3Context.Provider value={{ userAddress, connectMetamask, web3 }}>
      {props.children}
    </Web3Context.Provider>
  );
};

export default Web3ContextProvider;
