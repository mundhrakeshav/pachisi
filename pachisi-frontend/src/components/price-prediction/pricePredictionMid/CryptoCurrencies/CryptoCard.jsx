import React, { useState, useEffect, useContext } from "react";
import { Card, Button, Row, Col } from "react-bootstrap";
import "./cryptoCard.css";
import pricePrediction from "../../../../contracts/pricePrediction";
import { Web3Context } from "../../../../context/web3Context";
import Web3 from "web3";
const unixTimeStamp = require("unix-timestamp");
const web3 = new Web3();
const CryptoCurrenciesCard = (props) => {
  let [date, setDate] = useState("");
  const { web3ConnectStatus, userAddress, signTx } = useContext(Web3Context);
  const [gameAddress, setGameAddress] = useState("Game Not Created");
  const [pricePredictionContract, setPricePredictionContract] = useState({});
  useEffect(() => {
    let newDate = new Date();
    let day = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();
    setDate(`${day}/${month}/${year}`);
    setPricePredictionContract(pricePrediction.contract);
  }, []);

  return (
    <div>
      <Card variant="dark" bg="dark" className="crypto-card">
        <Card.Header>
          <Row> Will be resolved in 24 hours from {date} 0000 hours</Row>{" "}
        </Card.Header>
        <Card.Title>{props.title}</Card.Title>
        <Card.Body>
          <Row>
            <Col>
              <Button variant="secondary" onClick={props.makeBet}>
                Make Bet
              </Button>
            </Col>
            <Col>
              <Button variant="secondary" onClick={props.claim}>
                Claim
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};

export default CryptoCurrenciesCard;
