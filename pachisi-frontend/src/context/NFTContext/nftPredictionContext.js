import React, { createContext, useState, useEffect } from "react";
import Web3 from "web3";
import pachisiCryptoNFTPredicitonABI from "../../contractAbis/NFTABIs/pachisiCryptoNFTPrediciton.json";
import config from "../../config";
export const NFTPredictionContractContext = createContext();

const NFTPredictionContractContextProvider = (props) => {
  const init = async () => {
    const web3 = new Web3(window.ethereum);
    const _contract = new web3.eth.Contract(
      daiContractAbi,
      config.daiContractAddress
    );
    setDaiContract(_contract);
  };

  useEffect(() => {
    init();
  }, []);

  const approveDaiContract = async (amount, userAddress) => {
    const web3 = new Web3(window.ethereum);
    console.log(web3.utils.toWei(amount), userAddress);
    const tx = daiContract.methods
      .approve(config.pachisiAddress, web3.utils.toWei(amount))
      .send({ from: userAddress });
  };

  const getAllowance = async (userAddress) => {
    const web3 = new Web3(window.ethereum);
    const _contract = new web3.eth.Contract(
      daiContractAbi,
      config.daiContractAddress
    );
    const allowedAccessAmount = await _contract.methods
      .allowance(userAddress, config.pachisiAddress)
      .call();
    return allowedAccessAmount;
  };

  const approveDaiContractToStocksContract = async (amount, userAddress) => {
    const web3 = new Web3(window.ethereum);
    console.log(web3.utils.toWei(amount), userAddress);
    const tx = daiContract.methods
      .approve(config.pachisiStockAddress, web3.utils.toWei(amount))
      .send({ from: userAddress });
  };

  const getBalance = async (userAddress) => {
    const balance = await daiContract.methods.balanceOf(userAddress).call();
    return balance;
  };

  return (
    <NFTPredictionContractContext.Provider value={{}}>
      {props.children}
    </NFTPredictionContractContext.Provider>
  );
};

export default NFTPredictionContractContextProvider;
