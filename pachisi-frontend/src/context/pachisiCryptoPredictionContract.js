import React, { createContext, useState, useEffect } from "react";
import Web3 from "web3";
import pachisiCryptoPredictionAbi from "./../contractAbis/PachisiCryptoPrediction.json";
import config from "../config";
export const PachisiCryptoPredictionContractContext = createContext();

const PachisiCryptoPredictionContractContextProvider = (props) => {
  const [web3, setWeb3] = useState();

  const [
    pachisiCryptoPredictionContract,
    setPachisiCryptoPredictionContract,
  ] = useState({});

  const init = async () => {
    const _web3 = new Web3(window.ethereum);
    const _contract = new _web3.eth.Contract(
      pachisiCryptoPredictionAbi,
      config.pachisiCryptoPredictionContractAddress
    );
    setWeb3(_web3);
    setPachisiCryptoPredictionContract(_contract);
  };

  useEffect(() => {
    init();
  }, []);

  const createUSDBet = async (
    _betResolveTime,
    _betToken,
    _symbol,
    _predictionPrice,
    _initialBetAmount,
    _userAddress
  ) => {
    console.log(
      _betResolveTime,
      _betToken,
      _symbol,
      web3.utils.toWei(_predictionPrice) / 10 ** 10,
      web3.utils.toWei(_initialBetAmount),
      _userAddress
    );
    pachisiCryptoPredictionContract.methods
      .createUSDBet(
        _betResolveTime,
        _betToken,
        _symbol,
        web3.utils.toWei(_predictionPrice) / 10 ** 10,
        web3.utils.toWei(_initialBetAmount),
        true
      )
      .send({ from: _userAddress });
  };

  const createETHBet = async (
    _betResolveTime,
    _betToken,
    _symbol,
    _predictionPrice,
    _initialBetAmount,
    _userAddress
  ) => {
    console.log(
      _betResolveTime,
      _betToken,
      _symbol,
      web3.utils.toWei(_predictionPrice),
      web3.utils.toWei(_initialBetAmount),
      _userAddress
    );
    pachisiCryptoPredictionContract.methods
      .createETHBet(
        _betResolveTime,
        _betToken,
        _symbol,
        web3.utils.toWei(_predictionPrice),
        web3.utils.toWei(_initialBetAmount),
        true
      )
      .send({ from: _userAddress });
    //                          uint _betResolveTime,
    //                         string memory _betToken,
    //                         string memory _symbol,
    //                         uint _predictionPrice,
    //                         uint _initialBetAmount,
    //                         bool _userBet
  };

  return (
    <PachisiCryptoPredictionContractContext.Provider
      value={{ createUSDBet, createETHBet }}>
      {props.children}
    </PachisiCryptoPredictionContractContext.Provider>
  );
};

export default PachisiCryptoPredictionContractContextProvider;
