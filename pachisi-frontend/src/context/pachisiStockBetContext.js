import React, { createContext, useState } from "react";
import Web3 from "web3";
import pachisiStockBetABI from "./../contractAbis/pachisiStockBet.json";
import erc20ABI from "./../contractAbis/erc20.json";

export const PachisiStockBetContext = createContext();

const PachisiStockBetContextProvider = (props) => {
  const getData = async (_contractAddress, _userAddress) => {
    const _web3 = new Web3(window.ethereum);
    const _stockBetContract = new _web3.eth.Contract(
      pachisiStockBetABI,
      _contractAddress
    );
    // betResolved;
    const betStock = await _stockBetContract.methods.betStock().call();
    const betResolveTime = await _stockBetContract.methods
      .betResolveTime()
      .call();
    const resolvedPrice = await _stockBetContract.methods
      .resolvedPrice()
      .call();
    const symbol = await _stockBetContract.methods.symbol().call();
    const predictionPrice = await _stockBetContract.methods
      .predictionPrice()
      .call();
    const betResolved = await _stockBetContract.methods.betResolved().call();
    const trueTokenAddress = await _stockBetContract.methods.trueToken().call();
    const falseTokenAddress = await _stockBetContract.methods
      .falseToken()
      .call();

    const volume = await _stockBetContract.methods.volume().call();

    const trueTokensInMarket = await _stockBetContract.methods
      .trueTokensInMarket()
      .call();

    const falseTokensInMarket = await _stockBetContract.methods
      .falseTokensInMarket()
      .call();

    const userOwnedTrueTokens = await _stockBetContract.methods
      .userOwnedTrueTokens(_userAddress)
      .call();
    const userOwnedFalseTokens = await _stockBetContract.methods
      .userOwnedFalseTokens(_userAddress)
      .call();
    const hasUserClaimed = await _stockBetContract.methods
      .hasUserClaimed(_userAddress)
      .call();
    console.log(
      betStock,
      betResolveTime,
      resolvedPrice,
      symbol,
      predictionPrice,
      betResolved,
      trueTokenAddress,
      falseTokenAddress,
      volume,
      trueTokensInMarket,
      falseTokensInMarket,
      userOwnedTrueTokens,
      userOwnedFalseTokens,
      hasUserClaimed
    );
    return {
      betStock,
      betResolveTime,
      resolvedPrice,
      symbol,
      predictionPrice,
      betResolved,
      trueTokenAddress,
      falseTokenAddress,
      volume,
      trueTokensInMarket,
      falseTokensInMarket,
      userOwnedTrueTokens,
      userOwnedFalseTokens,
      hasUserClaimed,
    };
  };

  return (
    <PachisiStockBetContext.Provider value={{ getData }}>
      {props.children}
    </PachisiStockBetContext.Provider>
  );
};

export default PachisiStockBetContextProvider;
