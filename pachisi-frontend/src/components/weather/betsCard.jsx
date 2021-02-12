import { Card, Row, Col, Button } from "react-bootstrap";
import React, { useEffect, useState, useContext } from "react";

import Web3 from "web3";
import dai from "../../contracts/dai";
import custom from "../../contracts/custom";
import { Web3Context } from "../../context/web3Context";
import { Switch, Route } from "react-router-dom";
import unixtimestamp from "unix-timestamp";
import "./betsCard.css";

const web3 = new Web3();

const BetsCard = (props) => {
  const { web3ConnectStatus, userAddress, signTx } = useContext(Web3Context);
  const [customContract, setCustomContract] = useState({});
  useEffect(() => {
    console.log("UseEffect From appbar");
    setCustomContract(custom.contract);
  }, []);

  const predictCustomBet = async (_predictedOutcome) => {
    const _betAmount = prompt("Bet Amount?");
    const functionSignature = customContract.methods
      .predictCustomBets(props.index, _betAmount, _predictedOutcome)
      .encodeABI();

    console.log(functionSignature);
    const nonce = await customContract.methods.getNonce(userAddress).call();
    console.log(nonce);
    signTx(
      custom.contractName,
      custom.contractAddress,
      nonce,
      functionSignature,
      customContract
    );

    // uint _uid, uint _amount, bool _predictedOutcome
  };

  const claim = async () => {
    const functionSignature = customContract.methods
      .claim(props.index)
      .encodeABI();
    const nonce = await customContract.methods.getNonce(userAddress).call();
    console.log(nonce);
    signTx(
      custom.contractName,
      custom.contractAddress,
      nonce,
      functionSignature,
      customContract
    );
  };

  console.log(props);
  return (
    <Card variant="dark" bg="dark" className="custom-card">
      <Col>
        <Card.Title>{props.element.title}</Card.Title>
      </Col>
      <Row>
        <Col>
          <Button
            variant="secondary"
            onClick={() => {
              predictCustomBet(true);
            }}>
            {props.element.outcome1}
          </Button>
        </Col>
        <Col>
          <Button
            variant="secondary"
            onClick={() => {
              predictCustomBet(false);
            }}>
            {props.element.outcome2}
          </Button>
        </Col>
      </Row>
      <br />
      <Col>
        <Button variant="secondary">Resolve(Only Owner)</Button>
      </Col>
      <br />
      <Col>
        <Button variant="secondary" onClick={claim}>
          Claim
        </Button>
      </Col>
    </Card>
  );
};

export default BetsCard;
