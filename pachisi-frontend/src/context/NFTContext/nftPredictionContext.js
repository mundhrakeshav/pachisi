import React, { createContext, useState, useEffect } from "react";
import Web3 from "web3";
import pachisiCryptoNFTPredicitonABI from "../../contractAbis/NFTABIs/pachisiCryptoNFTPrediciton.json";
import config from "../../config";
export const NFTPredictionContractContext = createContext();

const NFTPredictionContractContextProvider = (props) => {
  //
  const [
    pachisiCryptoNFTPredictionContract,
    setPachisiCryptoNFTPredictionContract,
  ] = useState({});

  const init = async () => {
    const web3 = new Web3(window.ethereum);
    const _contract = new web3.eth.Contract(
      pachisiCryptoNFTPredicitonABI,
      config.nftCryptoPredictionContract
    );
    setPachisiCryptoNFTPredictionContract(_contract);
  };

  useEffect(() => {
    init();
  }, []);

  const createUSDBet = async (
    _betToken,
    _betResolveTime,
    _predictionPrice,
    _betSymbol,
    _assetNFTAddress,
    _tokenID,
    _userAddress
  ) => {
    const web3 = new Web3(window.ethereum);
    const _contract = new web3.eth.Contract(
      pachisiCryptoNFTPredicitonABI,
      config.nftCryptoPredictionContract
    );
    _contract.methods
      .createUSDBet(
        _betToken,
        parseInt(_betResolveTime / 1000),
        _predictionPrice.toString(),
        _betSymbol,
        _assetNFTAddress,
        _tokenID
      )
      .send({ from: _userAddress });
  };

  const getUSDBets = async () => {
    const web3 = new Web3(window.ethereum);
    const _contract = new web3.eth.Contract(
      pachisiCryptoNFTPredicitonABI,
      config.nftCryptoPredictionContract
    );
    const usdBets = await _contract.methods.getUSDBets().call();

    console.log(usdBets);
    return usdBets;
  };

  const agreeBet = async (
    _assetNFTAddress,
    _tokenID,
    _betAddress,
    _userAddress
  ) => {
    const web3 = new Web3(window.ethereum);
    const _contract = new web3.eth.Contract(
      pachisiCryptoNFTPredicitonABI,
      config.nftCryptoPredictionContract
    );
    _contract.methods
      .agreeBet(_assetNFTAddress, _tokenID, _betAddress)
      .send({ from: _userAddress });
  };

  const denyBet = async (_betAddress, _userAddress) => {
    const web3 = new Web3(window.ethereum);
    const _contract = new web3.eth.Contract(
      pachisiCryptoNFTPredicitonABI,
      config.nftCryptoPredictionContract
    );
    _contract.methods.denyBet(_betAddress).send({ from: _userAddress });
  };

  return (
    <NFTPredictionContractContext.Provider
      value={{ createUSDBet, getUSDBets, agreeBet, denyBet }}>
      {props.children}
    </NFTPredictionContractContext.Provider>
  );
};

export default NFTPredictionContractContextProvider;
