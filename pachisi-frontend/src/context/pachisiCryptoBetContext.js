import React, { createContext, useState } from "react";
import Web3 from "web3";
import pachisiCryptoBetABI from "./../contractAbis/pachisiCryptoBet.json";

export const PachisiCryptoBetContext = createContext();

const PachisiCryptoBetProvider = (props) => {
  const getData = async (_address) => {
    const _web3 = new Web3(window.ethereum);
    const _contract = new _web3.eth.Contract(pachisiCryptoBetABI, _address);
    // betResolved;
    const betToken = await _contract.methods.betToken().call();
    const betPair = await _contract.methods.betPair().call();
    const betResolveTime = await _contract.methods.betResolveTime().call();
    const resolvedPrice = await _contract.methods.resolvedPrice().call();
    const symbol = await _contract.methods.symbol().call();
    const predictionPrice = await _contract.methods.predictionPrice().call();
    const betResolved = await _contract.methods.betResolved().call();

    return {
      betToken,
      betPair,
      betResolveTime,
      resolvedPrice,
      symbol,
      predictionPrice,
      betResolved,
    };
  };

  return (
    <PachisiCryptoBetContext.Provider value={{ getData }}>
      {props.children}
    </PachisiCryptoBetContext.Provider>
  );
};

export default PachisiCryptoBetProvider;
