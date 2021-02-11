import React, { useState, useEffect, useContext } from "react";
import "./myPrices.css";
import { Web3Context } from "../../../context/web3Context";
import Web3 from "web3";
import pricePrediction from "../../../contracts/pricePrediction";
import { Button, Card, Container } from "react-bootstrap";
const unixTimeStamp = require("unix-timestamp");
const web3 = new Web3();

const MyPrices = () => {
  const { web3ConnectStatus, userAddress, signTx } = useContext(Web3Context);
  const [priceContract, setPriceContract] = useState();
  const [ethBets, setEthBets] = useState([]);
  const [maticBets, setMaticBets] = useState([]);

  useEffect(() => {
    setPriceContract(pricePrediction.contract);
    init();
  }, []);

  const init = async () => {
    const ethBets = await pricePrediction.contract.methods
      .userEthBets(userAddress)
      .call();
    setEthBets(ethBets);
    console.log({ ethBets });
    setMaticBets(
      await pricePrediction.contract.methods.userMaticBets(userAddress).call()
    );
    console.log({ maticBets });
  };

  const ethMatchList = ethBets.map((element, index) => {
    console.log(element);
    return (
      <Card key={index} variant="dark" bg="dark" className="card-match-list">
        <Card.Title>
          {unixTimeStamp.toDate(parseInt(element)).toDateString()}
        </Card.Title>
        <Card.Body>
          <Button variant="secondary">Claim Funds</Button>
        </Card.Body>
      </Card>
    );
  });
  const maticMatchList = maticBets.map((element, index) => {
    console.log(element);
    return <Container key={index}>{element}</Container>;
  });

  return (
    <div className="myPrices-wrapper">
      <h3>Eth Predictions</h3>
      {ethMatchList}
      <h3>Matic Predictions</h3>
      {maticMatchList}
    </div>
  );
};

export default MyPrices;
