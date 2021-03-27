import React, { createContext, useState, useEffect } from "react";
import Web3 from "web3";
import pachisiStockPredictionAbi from "./../contractAbis/pachisiStockPrediction.json";
import config from "../config";
export const PachisiStockPredictionContractContext = createContext();

const PachisiStockPredictionContractContextProvider = (props) => {
  const [web3, setWeb3] = useState();

  const [
    pachisiStockPredictionContract,
    setPachisiStockPredictionContract,
  ] = useState({});

  const init = async () => {
    const _web3 = new Web3(window.ethereum);
    const _contract = new _web3.eth.Contract(
      pachisiStockPredictionAbi,
      config.pachisiStockAddress
    );
    setWeb3(_web3);
    setPachisiStockPredictionContract(_contract);
  };

  const createBet = (
    _betResolveTime,
    _stockAsset,
    _symbol,
    _predictedPrice,
    _initialBetAmount,
    _userAddress
  ) => {
    const _web3 = new Web3(window.ethereum);

    console.log(
      "TEST",
      _betResolveTime,
      _stockAsset,
      _symbol,
      _predictedPrice,
      _initialBetAmount,
      _userAddress
    );
    pachisiStockPredictionContract.methods
      .createStockBet(
        parseInt(_betResolveTime / 1000),
        _stockAsset,
        _symbol,
        _predictedPrice,
        _web3.utils.toWei(_initialBetAmount.toString()),
        true
      )
      .send({ from: _userAddress });
  };

  const getStockBetsAddresses = async () => {
    const _web3 = new Web3(window.ethereum);
    const _contract = new _web3.eth.Contract(
      pachisiStockPredictionAbi,
      config.pachisiStockAddress
    );
    const addresses = await _contract.methods.getStockBets().call();
    return addresses;
  };

  const placeBet = (
    _betAddress,
    _betStock,
    _betAmount,
    _userBet,
    _userAddress
  ) => {
    const _web3 = new Web3(window.ethereum);
    console.log(_betAddress, _betStock, _betAmount, _userBet, _userAddress);
    pachisiStockPredictionContract.methods
      .placeStockBet(
        _betAddress,
        _betStock,
        _web3.utils.toWei(_betAmount.toString()),
        _userBet
      )
      .send({ from: _userAddress });
  };
  const claimFunds = (_betAddress, _userAddress) => {
    pachisiStockPredictionContract.methods
      .claimStockFunds(_betAddress)
      .send({ from: _userAddress });
  };
  useEffect(() => {
    init();
  }, []);

  return (
    <PachisiStockPredictionContractContext.Provider
      value={{
        createBet,
        getStockBetsAddresses,
        placeBet,
        claimFunds,
      }}>
      {props.children}
    </PachisiStockPredictionContractContext.Provider>
  );
};

export default PachisiStockPredictionContractContextProvider;
