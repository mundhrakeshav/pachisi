import React, { useState, useEffect, useContext } from "react";
import { Col, Row, Button, Card } from "react-bootstrap";
import { Switch, Route } from "react-router-dom";
import "./playwithnumbers.css";
import playWithNumbers from "../../contracts/playWithNumbers";

import Web3 from "web3";
import dai from "../../contracts/dai";

import { Web3Context } from "../../context/web3Context";
const web3 = new Web3();

const PlayWithNumbersPage = (props) => {
  const [daiContract, setDaiContract] = useState({});
  const { web3ConnectStatus, userAddress, signTx } = useContext(Web3Context);
  const [playWithNumbersContract, setPlayWithNumbersContract] = useState({});

  useEffect(() => {
    console.log("UseEffect From appbar");
    setDaiContract(dai.contract);
    setPlayWithNumbersContract(playWithNumbers.contract);
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
          .approve(playWithNumbers.contractAddress, web3.utils.toWei(amount))
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

  const betSeven = async (_betBool) => {
    let betAmount = prompt("How much you wanna bet?");
    betAmount = web3.utils.toWei(betAmount);

    const functionSignature = playWithNumbersContract.methods
      .createSeven(betAmount, _betBool)
      .encodeABI();
    console.log(functionSignature);

    const nonce = await playWithNumbersContract.methods
      .getNonce(userAddress)
      .call();
    //  contractName, contractAddress, nonce, functionSignature;

    console.log(nonce);
    signTx(
      playWithNumbers.contractName,
      playWithNumbers.contractAddress,
      nonce,
      functionSignature,
      playWithNumbersContract
    );
  };
  const betOddEven = async (_betBool) => {
    let betAmount = prompt("How much you wanna bet?");
    betAmount = web3.utils.toWei(betAmount);
    const functionSignature = playWithNumbersContract.methods
      .createOddEven(betAmount, _betBool)
      .encodeABI();
    console.log(functionSignature);
    const nonce = await playWithNumbersContract.methods
      .getNonce(userAddress)
      .call();
    //  contractName, contractAddress, nonce, functionSignature;

    console.log(nonce);
    signTx(
      playWithNumbers.contractName,
      playWithNumbers.contractAddress,
      nonce,
      functionSignature,
      playWithNumbersContract
    );
  };

  const claimSeven = () => {};
  const claimOddEven = () => {};

  return (
    <div className="play-with-numbers-wrapper">
      <Row>
        <Col xl={8} className="middle-column column-wrapper">
          <h2>Return 1.25 times</h2>
          <Card variant="dark" bg="dark" className="crypto-card">
            <Card.Title>
              <h4>7UP/7DOWN</h4>
            </Card.Title>
            <Card.Body>
              <Row>
                <h5>Make bet</h5>
              </Row>
              <Row>
                <Col>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      betSeven(true);
                    }}>
                    7UP
                  </Button>
                </Col>
                <Col>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      betSeven(false);
                    }}>
                    {" "}
                    7DOWN{" "}
                  </Button>
                </Col>
              </Row>
              <br />
              <Row>
                <Col>
                  <Button variant="secondary" onClick={claimSeven}>
                    Claim
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          <br />{" "}
          <Card variant="dark" bg="dark" className="crypto-card">
            <Card.Title>
              <h4>ODD / EVEN</h4>
            </Card.Title>
            <Card.Body>
              <Row>
                <h5>Make bet</h5>
              </Row>
              <Row>
                <Col>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      betOddEven(true);
                    }}>
                    Even
                  </Button>
                </Col>
                <Col>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      betOddEven(false);
                    }}>
                    {" "}
                    Odd{" "}
                  </Button>
                </Col>
              </Row>
              <br />
              <Row>
                <Col>
                  <Button variant="secondary" onClick={claimSeven}>
                    Claim
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={4} className="middle-column column-wrapper">
          <Row>
            <Col>
              <Button variant="dark" onClick={approveDai}>
                Approve Dai for Numbers Game
              </Button>
            </Col>
          </Row>{" "}
        </Col>
      </Row>{" "}
    </div>
  );
};

export default PlayWithNumbersPage;
