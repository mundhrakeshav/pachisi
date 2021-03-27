import React, { createContext, useState, useEffect } from "react";
import Web3 from "web3";
import daiContractAbi from "../contractAbis/erc20.json";
import config from "../config";
export const DaiContractContext = createContext();

const DaiContractContextProvider = (props) => {
  const [daiContract, setDaiContract] = useState({});
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

  const getAllowanceForStocksContract = async (userAddress) => {
    const web3 = new Web3(window.ethereum);
    const _contract = new web3.eth.Contract(
      daiContractAbi,
      config.daiContractAddress
    );
    const allowedAccessAmount = await _contract.methods
      .allowance(userAddress, config.pachisiStockAddress)
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
    <DaiContractContext.Provider
      value={{
        approveDaiContract,
        getAllowance,
        getBalance,
        getAllowanceForStocksContract,
        approveDaiContractToStocksContract,
      }}>
      {props.children}
    </DaiContractContext.Provider>
  );
};

export default DaiContractContextProvider;
