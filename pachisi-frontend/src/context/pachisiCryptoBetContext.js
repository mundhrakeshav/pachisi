import React, { createContext, useState } from "react";
import Web3 from "web3";
import pachisiCryptoBetABI from "./../contractAbis/pachisiCryptoBet.json";
import erc20ABI from "./../contractAbis/erc20.json";

export const PachisiCryptoBetContext = createContext();

const PachisiCryptoBetProvider = (props) => {
  const getData = async (_contractAddress, _userAddress) => {
    const _web3 = new Web3(window.ethereum);
    const _cryptoBetContract = new _web3.eth.Contract(
      pachisiCryptoBetABI,
      _contractAddress
    );
    // betResolved;
    const betToken = await _cryptoBetContract.methods.betToken().call();
    const betPair = await _cryptoBetContract.methods.betPair().call();
    const betResolveTime = await _cryptoBetContract.methods
      .betResolveTime()
      .call();
    const resolvedPrice = await _cryptoBetContract.methods
      .resolvedPrice()
      .call();
    const symbol = await _cryptoBetContract.methods.symbol().call();
    const predictionPrice = await _cryptoBetContract.methods
      .predictionPrice()
      .call();
    const betResolved = await _cryptoBetContract.methods.betResolved().call();
    const trueTokenAddress = await _cryptoBetContract.methods
      .trueToken()
      .call();
    const falseTokenAddress = await _cryptoBetContract.methods
      .falseToken()
      .call();

    const volume = await _cryptoBetContract.methods.volume().call();

    const trueTokensInMarket = await _cryptoBetContract.methods
      .trueTokensInMarket()
      .call();

    const falseTokensInMarket = await _cryptoBetContract.methods
      .falseTokensInMarket()
      .call();

    const userOwnedTrueTokens = await _cryptoBetContract.methods
      .userOwnedTrueTokens(_userAddress)
      .call();
    const userOwnedFalseTokens = await _cryptoBetContract.methods
      .userOwnedFalseTokens(_userAddress)
      .call();
    const hasUserClaimed = await _cryptoBetContract.methods
      .hasUserClaimed(_userAddress)
      .call();
    console.log(
      betToken,
      betPair,
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
      betToken,
      betPair,
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
    <PachisiCryptoBetContext.Provider value={{ getData }}>
      {props.children}
    </PachisiCryptoBetContext.Provider>
  );
};

export default PachisiCryptoBetProvider;
