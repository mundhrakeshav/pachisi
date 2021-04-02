import React, { createContext, useState, useEffect, useContext } from "react";
import Web3 from "web3";
import pachisiCryptoNFTBetABI from "../../contractAbis/NFTABIs/pachisiCryptoNFTBet.json";
import nftCatABI from "../../contractAbis/NFTABIs/nftCat.json";
import nftDogABI from "../../contractAbis/NFTABIs/nftDog.json";
import config from "../../config";
import { NFTDogContractContext } from "./nftDogContractContext";
import { NFTCatContractContext } from "./nftCatContractContext";
export const NFTCryptoBetContext = createContext();

const NFTCryptoBetContextProvider = (props) => {
  const init = async () => {};

  const getData = async (contractAddress) => {
    const web3 = new Web3(window.ethereum);
    const _contract = new web3.eth.Contract(
      pachisiCryptoNFTBetABI,
      contractAddress
    );

    let data = {};

    data.betStage = await _contract.methods.betStage().call();
    data.betResolveTime = await _contract.methods.betResolveTime().call();
    data.resolvedPrice = await _contract.methods.resolvedPrice().call();
    data.symbol = await _contract.methods.symbol().call();
    data.predictionPrice = await _contract.methods.predictionPrice().call();
    data.betToken = await _contract.methods.betToken().call();
    data.betPair = await _contract.methods.betPair().call();
    data.initialiserBet = await _contract.methods.initialiserBet().call();
    data.secondaryBet = await _contract.methods.secondaryBet().call();

    console.log(data);

    return { data };
  };

  return (
    <NFTCryptoBetContext.Provider value={{ getData }}>
      {props.children}
    </NFTCryptoBetContext.Provider>
  );
};

export default NFTCryptoBetContextProvider;
