import React, { createContext, useState, useEffect } from "react";
import Web3 from "web3";
import pachisiNFTCatABI from "../../contractAbis/NFTABIs/nftCat.json";
import config from "../../config";
export const NFTCatContractContext = createContext();

const NFTCatContractContextProvider = (props) => {
  const [nftCatContract, setNFTCatContract] = useState({});

  const init = async () => {
    const web3 = new Web3(window.ethereum);
    const _contract = new web3.eth.Contract(
      pachisiNFTCatABI,
      config.catNFTContract
    );
    setNFTCatContract(_contract);
  };

  useEffect(() => {
    init();
  }, []);

  const getCatBalance = async (userAddress) => {
    console.log(userAddress);
    const web3 = new Web3(window.ethereum);
    const _contract = new web3.eth.Contract(
      pachisiNFTCatABI,
      config.catNFTContract
    );
    const balance = await _contract.methods.balanceOf(userAddress).call();
    return balance;
  };

  const getCatUserTokens = async (userAddress) => {
    const web3 = new Web3(window.ethereum);
    const _contract = new web3.eth.Contract(
      pachisiNFTCatABI,
      config.catNFTContract
    );

    const _userOwnedTokens = await _contract.methods
      .getUserOwnedTokens(userAddress)
      .call();
    console.log(_userOwnedTokens);
    return _userOwnedTokens;
  };

  const getCatTokenDetails = async (tokenID) => {
    const web3 = new Web3(window.ethereum);
    const _contract = new web3.eth.Contract(
      pachisiNFTCatABI,
      config.catNFTContract
    );
    const tokenDetails = await _contract.methods.tokenDetails(tokenID).call();
    console.log(tokenDetails);
    return tokenDetails;
  };

  const approveCat = (tokenID, _userAddress) => {
    const web3 = new Web3(window.ethereum);
    const _contract = new web3.eth.Contract(
      pachisiNFTCatABI,
      config.catNFTContract
    );

    _contract.methods
      .approve(config.nftCryptoPredictionContract, tokenID)
      .send({ from: _userAddress });
  };

  return (
    <NFTCatContractContext.Provider
      value={{
        getCatBalance,
        getCatUserTokens,
        getCatTokenDetails,
        approveCat,
      }}>
      {props.children}
    </NFTCatContractContext.Provider>
  );
};

export default NFTCatContractContextProvider;
