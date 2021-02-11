import React, { useState, useEffect, useContext } from "react";
import "./pricePredictionRight.css";
import dai from "../../../contracts/dai";
import pricePrediction from "../../../contracts/pricePrediction";
import Web3 from "web3";
import { Web3Context } from "../../../context/web3Context";
import { Switch, Route } from "react-router-dom";
import { Row, Col, Button } from "react-bootstrap";
const web3 = new Web3();

const PricePredictionRight = () => {
  const [daiContract, setDaiContract] = useState({});
  const { web3ConnectStatus, userAddress, signTx } = useContext(Web3Context);

  useEffect(() => {
    console.log("UseEffect From appbar");
    setDaiContract(dai.contract);
  });
  const approveDai = async () => {
    if (userAddress) {
      const amount = prompt("How much dai you wanna approve?");
      if (amount) {
        console.log(daiContract.methods);
        const nonce = await daiContract.methods.getNonce(userAddress).call();
        console.log(nonce);
        const daiContractName = dai.contractName;
        //TODO update hardcoded address
        const functionSignature = daiContract.methods
          .approve(pricePrediction.contractAddress, web3.utils.toWei(amount))
          .encodeABI();
        console.log(functionSignature);
        signTx(
          daiContractName,
          dai.contractAddress,
          nonce,
          functionSignature,
          daiContract
        );
      }
    } else {
      alert("Please initialize web3 connection.");
    }
  };
  return (
    <Row>
      <Col>
        <Button variant="dark" onClick={approveDai}>
          Approve Dai for Price Prediction
        </Button>
      </Col>
    </Row>
  );
};

export default PricePredictionRight;
