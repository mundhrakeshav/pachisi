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
      parseInt(_betResolveTime / 1000),
      _betToken,
      _symbol,
      web3.utils.toWei(_predictionPrice) / 10 ** 10,
      web3.utils.toWei(_initialBetAmount),
      _userAddress
    );

    pachisiCryptoPredictionContract.methods
      .createUSDBet(
        parseInt(_betResolveTime / 1000),
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
      parseInt(_betResolveTime / 1000),
      _betToken,
      _symbol,
      web3.utils.toWei(_predictionPrice),
      web3.utils.toWei(_initialBetAmount),
      _userAddress
    );

    pachisiCryptoPredictionContract.methods
      .createETHBet(
        parseInt(_betResolveTime / 1000),
        _betToken,
        _symbol,
        web3.utils.toWei(_predictionPrice),
        web3.utils.toWei(_initialBetAmount),
        true
      )
      .send({ from: _userAddress });
  };

  const getUSDTokenBetsAddresses = async () => {
    const _web3 = new Web3(window.ethereum);
    const _contract = new _web3.eth.Contract(
      pachisiCryptoPredictionAbi,
      config.pachisiCryptoPredictionContractAddress
    );
    const addresses = await _contract.methods.getUSDBets().call();
    return addresses;
  };
  const getETHTokenBetsAddresses = async () => {
    const _web3 = new Web3(window.ethereum);
    const _contract = new _web3.eth.Contract(
      pachisiCryptoPredictionAbi,
      config.pachisiCryptoPredictionContractAddress
    );
    const addresses = await _contract.methods.getETHBets().call();
    return addresses;
  };

  const placeUSDBets = (
    _betAddress,
    _betToken,
    _betAmount,
    _userBet,
    _userAddress
  ) => {
    const _web3 = new Web3(window.ethereum);
    console.log(
      _betAddress,
      _betToken,
      _betAmount,
      _userBet,
      "USD",
      _userAddress
    );
    pachisiCryptoPredictionContract.methods
      .placeUSDBet(
        _betAddress,
        _betToken,
        _web3.utils.toWei(_betAmount.toString()),
        _userBet
      )
      .send({ from: _userAddress });
  };

  const placeETHBets = (
    _betAddress,
    _betToken,
    _betAmount,
    _userBet,
    _userAddress
  ) => {
    const _web3 = new Web3(window.ethereum);

    console.log(
      _betAddress,
      _betToken,
      _betAmount,
      _userBet,
      "ETH",
      _userAddress
    );
    pachisiCryptoPredictionContract.methods
      .placeETHBet(
        _betAddress,
        _betToken,
        _web3.utils.toWei(_betAmount.toString()),
        _userBet
      )
      .send({ from: _userAddress });
  };

  return (
    <PachisiCryptoPredictionContractContext.Provider
      value={{
        createUSDBet,
        createETHBet,
        getUSDTokenBetsAddresses,
        getETHTokenBetsAddresses,
        placeUSDBets,
        placeETHBets,
      }}>
      {props.children}
    </PachisiCryptoPredictionContractContext.Provider>
  );
};

export default PachisiCryptoPredictionContractContextProvider;
