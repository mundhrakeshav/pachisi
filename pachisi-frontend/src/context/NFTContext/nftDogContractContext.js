import React, { createContext, useState, useEffect } from "react";
import Web3 from "web3";
import pachisiNFTDogABI from "../../contractAbis/NFTABIs/nftDog.json";
import config from "../../config";
export const NFTDogContractContext = createContext();

const NFTDogContractContextProvider = (props) => {
  const [nftDogContract, setNFTDogContract] = useState({});

  const init = async () => {
    const web3 = new Web3(window.ethereum);
    const _contract = new web3.eth.Contract(
      pachisiNFTDogABI,
      config.dogNFTContract
    );
    setNFTDogContract(_contract);
  };

  useEffect(() => {
    init();
  }, []);

  const getDogBalance = async (userAddress) => {
    console.log(userAddress);
    const web3 = new Web3(window.ethereum);
    const _contract = new web3.eth.Contract(
      pachisiNFTDogABI,
      config.dogNFTContract
    );
    const balance = await _contract.methods.balanceOf(userAddress).call();
    return balance;
  };

  const getDogUserTokens = async (userAddress) => {
    const web3 = new Web3(window.ethereum);
    const _contract = new web3.eth.Contract(
      pachisiNFTDogABI,
      config.dogNFTContract
    );
    const _userOwnedTokens = await _contract.methods
      .getUserOwnedTokens(userAddress)
      .call();
    console.log(_userOwnedTokens);
    return _userOwnedTokens;
  };

  const getDogTokenDetails = async (tokenID) => {
    const web3 = new Web3(window.ethereum);
    const _contract = new web3.eth.Contract(
      pachisiNFTDogABI,
      config.dogNFTContract
    );
    const tokenDetails = await _contract.methods.tokenDetails(tokenID).call();
    console.log(tokenDetails);
    return tokenDetails;
  };

  const approveDog = (tokenID, _userAddress) => {
    const web3 = new Web3(window.ethereum);
    const _contract = new web3.eth.Contract(
      pachisiNFTDogABI,
      config.dogNFTContract
    );

    _contract.methods
      .approve(config.nftCryptoPredictionContract, tokenID)
      .send({ from: _userAddress });
  };

  return (
    <NFTDogContractContext.Provider
      value={{
        getDogBalance,
        getDogUserTokens,
        getDogTokenDetails,
        approveDog,
      }}>
      {props.children}
    </NFTDogContractContext.Provider>
  );
};

export default NFTDogContractContextProvider;
