import React, { useState, useEffect, useContext } from "react";
import { Card, Button, Row } from "react-bootstrap";
import CryptoCurrenciesCard from "./CryptoCard";
import "./cryptoCard.css";
import pricePrediction from "../../../../contracts/pricePrediction";
import { Web3Context } from "../../../../context/web3Context";
import Web3 from "web3";
const unixTimeStamp = require("unix-timestamp");
const web3 = new Web3();

const CryptoCurrencies = () => {
  let [date, setDate] = useState("");
  const { web3ConnectStatus, userAddress, signTx } = useContext(Web3Context);
  const [gameAddress, setGameAddress] = useState("Game Not Created");
  const [pricePredictionContract, setPricePredictionContract] = useState({});
  useEffect(() => {
    let newDate = new Date();
    let day = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();
    setPricePredictionContract(pricePrediction.contract);

    setDate(`${day}/${month}/${year}`);

    console.log(unixTimeStamp.now());
    console.log(pricePredictionContract.methods);
  }, []);
  //
  const makeMaticBet = async () => {
    const timeStamp = unixTimeStamp.fromDate(date);
    let betAmount = prompt("Amount you wanna bet?");
    betAmount = web3.utils.toWei(betAmount);
    const lowerLimit = prompt("Whats your lowerLimit?");
    console.log({ betAmount, lowerLimit, timeStamp });
    const functionSignatureMatic = pricePredictionContract.methods
      .createMaticBet(timeStamp, betAmount, lowerLimit)
      .encodeABI();

    console.log(functionSignatureMatic);
    const nonce = await pricePredictionContract.methods
      .getNonce(userAddress)
      .call();
    //  contractName, contractAddress, nonce, functionSignature;

    console.log(nonce);
    signTx(
      pricePrediction.contractName,
      pricePrediction.contractAddress,
      nonce,
      functionSignatureMatic,
      pricePredictionContract
    );
  };
  //
  const makeEthBet = async () => {
    const timeStamp = unixTimeStamp.fromDate(date);
    let betAmount = prompt("Amount you wanna bet?");
    betAmount = web3.utils.toWei(betAmount);
    const lowerLimit = prompt("Whats your lowerLimit?");
    console.log({ betAmount, lowerLimit, timeStamp });
    const functionSignatureEth = pricePredictionContract.methods
      .createEthBet(timeStamp, betAmount, lowerLimit)
      .encodeABI();

    console.log(functionSignatureEth);
    const nonce = await pricePredictionContract.methods
      .getNonce(userAddress)
      .call();
    //  contractName, contractAddress, nonce, functionSignature;
    console.log(nonce);

    signTx(
      pricePrediction.contractName,
      pricePrediction.contractAddress,
      nonce,
      functionSignatureEth,
      pricePredictionContract
    );
  };

  const claimMatic = async () => {
    const timeStamp = unixTimeStamp.fromDate(date);
    const functionSignatureMaticResolve = pricePredictionContract.methods
      .resolveMaticBet(timeStamp)
      .encodeABI();
    const nonce = await pricePredictionContract.methods
      .getNonce(userAddress)
      .call();
    signTx(
      pricePrediction.contractName,
      pricePrediction.contractAddress,
      nonce,
      functionSignatureMaticResolve,
      pricePredictionContract
    );
  };

  const claimEth = async () => {
    const timeStamp = unixTimeStamp.fromDate(date);
    const functionSignatureEthResolve = pricePredictionContract.methods
      .resolveEthBet(timeStamp)
      .encodeABI();
    const nonce = await pricePredictionContract.methods
      .getNonce(userAddress)
      .call();
    signTx(
      pricePrediction.contractName,
      pricePrediction.contractAddress,
      nonce,
      functionSignatureEthResolve,
      pricePredictionContract
    );
  };

  return (
    <div>
      <h3>Return 1.5 times</h3>
      <Row>
        <CryptoCurrenciesCard
          title="ETH-USD"
          makeBet={() => {
            if (userAddress) {
              makeEthBet();
            } else {
              alert("Please initialize web3");
            }
          }}
          claim={claimEth}
        />
        <CryptoCurrenciesCard title="BTC-USD" />
        <CryptoCurrenciesCard
          title="Matic-USD"
          makeBet={() => {
            if (userAddress) {
              makeMaticBet();
            } else {
              alert("Please initialize web3");
            }
          }}
          claim={claimMatic}
        />
        <CryptoCurrenciesCard title="Link-USD" />
        <CryptoCurrenciesCard title="TRB-USD" />
      </Row>
    </div>
  );
};

export default CryptoCurrencies;
