import React, { useEffect, useState, useContext } from "react";

import Web3 from "web3";
import dai from "../../contracts/dai";
import custom from "../../contracts/custom";
import { Web3Context } from "../../context/web3Context";
import { Col, Row, Button } from "react-bootstrap";
import { Switch, Route } from "react-router-dom";
import unixtimestamp from "unix-timestamp";
import BetsCard from "./betsCard";
const web3 = new Web3();

const Custom = () => {
  const [daiContract, setDaiContract] = useState({});
  const { web3ConnectStatus, userAddress, signTx } = useContext(Web3Context);
  const [customContract, setCustomContract] = useState({});
  const [recievedBets, setRecievedBets] = useState([]);
  const [bets, setBets] = useState([]);
  useEffect(() => {
    console.log("UseEffect From appbar");
    setDaiContract(dai.contract);
    setCustomContract(custom.contract);
    init();
  }, []);

  const init = async () => {
    const customContract = custom.contract;
    let _bets = [];

    const totalBets = await customContract.methods.totalbets().call();
    console.log({ totalBets });
    for (let index = 0; index < totalBets; index++) {
      const element = await getBet(index);

      _bets.push(<BetsCard element={element} index={index} />);
    }
    setRecievedBets(_bets);
  };

  const getBet = async (uid) => {
    const bet = await custom.contract.methods.customBets(uid).call();
    return bet;
  };

  const createBet = async () => {
    const title = prompt("What do you wanna predict");
    const outcome1 = prompt("Outcome 1");
    const outcome2 = prompt("Outcome 2");
    const usersPrediction = parseInt(
      prompt(
        "what's your prediction? give 1 for outcome 1 and 2 for outcome 2 "
      )
    );
    const initialAmount = parseInt(prompt("Initial Amount"));
    let resolveTime = unixtimestamp.fromDate(
      prompt("when should it be resolved? Give Date.")
    );

    resolveTime = 1614288919;
    console.log(usersPrediction == 1);
    const functionSignature = customContract.methods
      .createCustomBet(
        title,
        initialAmount,
        usersPrediction == 1,
        outcome1,
        outcome2,
        resolveTime
      )
      .encodeABI();
    console.log(
      title,
      initialAmount,
      usersPrediction == 1,
      outcome1,
      outcome2,
      resolveTime
    );
    const nonce = await customContract.methods.getNonce(userAddress).call();
    console.log(nonce);
    signTx(
      custom.contractName,
      custom.contractAddress,
      nonce,
      functionSignature,
      customContract
    );
    // console.log(functionSignature);
  };
  const approveDai = async () => {
    if (userAddress) {
      const amount = prompt("How much dai you wanna approve?");
      if (amount) {
        console.log(daiContract.methods);
        const nonce = await daiContract.methods.getNonce(userAddress).call();
        console.log(nonce);
        const daiContractName = dai.contractName;
        const functionSignature = daiContract.methods
          .approve(custom.contractAddress, web3.utils.toWei(amount))
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
    <div>
      <Row className="custo,-page-wrapper">
        <Col xl={9} className="middle-column column-wrapper">
          {recievedBets}
        </Col>
        <Col xl={3} className="right-column column-wrapper">
          {" "}
          <Row>
            <Col>
              <Button variant="secondary" onClick={approveDai}>
                Approve Dai for Custom Predictions
              </Button>
            </Col>
          </Row>{" "}
          <br />
          <Row>
            <Col>
              <Button variant="secondary" onClick={createBet}>
                Add Custom Predictions
              </Button>
            </Col>
          </Row>{" "}
        </Col>
      </Row>
    </div>
  );
};

export default Custom;
