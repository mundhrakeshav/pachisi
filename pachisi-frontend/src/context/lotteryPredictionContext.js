import React, { createContext, useState, useEffect } from "react";
import Web3 from "web3";
import daiContractAbi from "../contractAbis/erc20.json";
import pachisiContractAbi from "../contractAbis/pachisi.json";
import config from "../config";
export const LotteryContractContext = createContext();

const LotteryContractContextProvider = (props) => {
  const [lotteryContract, setLotteryContract] = useState({});

  useEffect(() => {
    const _web3 = new Web3(window.ethereum);
    const _contract = new _web3.eth.Contract(
      pachisiContractAbi,
      config.pachisiAddress
    );
    setLotteryContract(_contract);
  }, []);

  const getCreatedBets = async () => {
    const _web3 = new Web3(window.ethereum);
    const _contract = new _web3.eth.Contract(
      pachisiContractAbi,
      config.pachisiAddress
    );
    const createdBetsTime = await _contract.methods.getCreatedBets().call();
    return createdBetsTime;
  };

  const getBetDetails = async (betTime) => {
    const _web3 = new Web3(window.ethereum);
    const _contract = new _web3.eth.Contract(
      pachisiContractAbi,
      config.pachisiAddress
    );
    const bet = await _contract.methods.betResolveTimeToBet(betTime).call();
    return bet;
  };

  const getUserBetAmount = async (_betResolveTime, _userAddress) => {
    const _web3 = new Web3(window.ethereum);
    const _contract = new _web3.eth.Contract(
      pachisiContractAbi,
      config.pachisiAddress
    );
    const bet = await _contract.methods
      .getUserBetAmount(_betResolveTime, _userAddress)
      .call();
    return bet;
  };

  const hasUserClaimed = async (_betResolveTime, _userAddress) => {
    const _web3 = new Web3(window.ethereum);
    const _contract = new _web3.eth.Contract(
      pachisiContractAbi,
      config.pachisiAddress
    );
    const bet = await _contract.methods
      .hasUserClaimed(_betResolveTime, _userAddress)
      .call();
    return bet;
  };

  const placeEvenOddBet = async (
    _amount,
    _userBet,
    _betResolveTime,
    _userAddress
  ) => {
    const _web3 = new Web3(window.ethereum);
    const _contract = new _web3.eth.Contract(
      pachisiContractAbi,
      config.pachisiAddress
    );
    _contract.methods
      .placeOddEvenBet(_web3.utils.toWei(_amount), _userBet, _betResolveTime)
      .send({ from: _userAddress });
  };

  const placeUpDownBet = async (
    _amount,
    _userBet,
    _betResolveTime,
    _userAddress
  ) => {
    const _web3 = new Web3(window.ethereum);
    const _contract = new _web3.eth.Contract(
      pachisiContractAbi,
      config.pachisiAddress
    );
    _contract.methods
      .placeUpDownBet(_web3.utils.toWei(_amount), _userBet, _betResolveTime)
      .send({ from: _userAddress });
  };

  const claimFundsUpDown = async (_betResolveTime, _userAddress) => {
    const _web3 = new Web3(window.ethereum);
    const _contract = new _web3.eth.Contract(
      pachisiContractAbi,
      config.pachisiAddress
    );
    _contract.methods
      .claimUpDownLotteryFunds(_betResolveTime)
      .send({ from: _userAddress });
    console.log(_betResolveTime, _userAddress, "CLAIM FUNDS");
  };
  const claimFundsOddEven = async (_betResolveTime, _userAddress) => {
    const _web3 = new Web3(window.ethereum);
    const _contract = new _web3.eth.Contract(
      pachisiContractAbi,
      config.pachisiAddress
    );
    _contract.methods
      .claimOddEvenLotteryFunds(_betResolveTime)
      .send({ from: _userAddress });
    console.log(_betResolveTime, _userAddress, "CLAIM FUNDS");
  };

  return (
    <LotteryContractContext.Provider
      value={{
        getCreatedBets,
        getBetDetails,
        getUserBetAmount,
        hasUserClaimed,
        placeEvenOddBet,
        placeUpDownBet,
        claimFundsUpDown,
        claimFundsOddEven,
      }}>
      {props.children}
    </LotteryContractContext.Provider>
  );
};
export default LotteryContractContextProvider;
