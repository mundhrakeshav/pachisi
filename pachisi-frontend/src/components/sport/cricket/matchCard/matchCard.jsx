import React, { useEffect, useState, useContext } from "react";
import { Web3Context } from "../../../../context/web3Context";
import cricketPachisi from "../../../../contracts/CricketPachisi";
import { Card, Button, Row, Col } from "react-bootstrap";
import "./matchcard.css";
import Web3 from "web3";
const web3 = new Web3();

const timestamp = require("unix-timestamp");
const MatchCard = (props) => {
  const { web3ConnectStatus, userAddress, signTx } = useContext(Web3Context);
  const [gameAddress, setGameAddress] = useState("Game Not Created");
  const [cricketPachisiContract, setCricketPachisiContract] = useState({});
  useEffect(() => {
    setCricketPachisiContract(cricketPachisi.contract);
    init();
  });

  const predictMatch = async (_predictedOutcome) => {
    if (userAddress) {
      let _betAmount = prompt("How much you wanna bet?");

      const _gameStartTime = timestamp.fromDate(
        matchDetails.date.split("T")[0]
      );

      const functionSigPreictMatch = cricketPachisiContract.methods
        .predictCricketMatch(
          matchDetails["team-1"] + " vs " + matchDetails["team-2"],
          matchDetails["unique_id"],
          matchDetails["team-1"],
          matchDetails["team-2"],
          _gameStartTime,
          web3.utils.toWei(_betAmount),
          _predictedOutcome
        )
        .encodeABI();

      //   console.log(functionSigPreictMatch);

      const nonce = await cricketPachisiContract.methods
        .getNonce(userAddress)
        .call();
      //  contractName, contractAddress, nonce, functionSignature;

      signTx(
        cricketPachisi.contractName,
        cricketPachisi.contractAddress,
        nonce,
        functionSigPreictMatch,
        cricketPachisiContract
      );
    } else {
      alert("Please allow web3 access.");
    }
  };

  const predictToss = (_predictedOutcome) => {
    // uint _uidOfMatch,
    // string memory _outcome1,
    // string memory _outcome2,
    // uint _gameStartTime,
    // uint _betAmount,
    // bool _predictedOutcome)
    const _gameStartTime = timestamp.fromDate(matchDetails.date.split("T")[0]);
    console.log(_gameStartTime);
    // const _betAmount = prompt("How much you wanna bet?");
  };

  const resolveCricketMatch = async () => {
    if (userAddress) {
      const functionSigResolveMatch = cricketPachisiContract.methods
        .resolveCricketMatch(
          matchDetails["unique_id"].toString(),
          matchDetails["unique_id"]
        )
        .encodeABI();

      //   console.log(functionSigPreictMatch);

      const nonce = await cricketPachisiContract.methods
        .getNonce(userAddress)
        .call();
      //  contractName, contractAddress, nonce, functionSignature;

      signTx(
        cricketPachisi.contractName,
        cricketPachisi.contractAddress,
        nonce,
        functionSigResolveMatch,
        cricketPachisiContract
      );
    } else {
      alert("Please allow web3 access.");
    }
  };

  const claimCricketFunds = async () => {
    if (userAddress) {
      const functionSigResolveMatch = cricketPachisiContract.methods
        .claimCricketFunds(matchDetails["unique_id"])
        .encodeABI();

      const nonce = await cricketPachisiContract.methods
        .getNonce(userAddress)
        .call();
      //  contractName, contractAddress, nonce, functionSignature;

      signTx(
        cricketPachisi.contractName,
        cricketPachisi.contractAddress,
        nonce,
        functionSigResolveMatch,
        cricketPachisiContract
      );
    } else {
      alert("Please allow web3 access.");
    }
  };
  //999054999999999879999984
  const init = async () => {};
  const matchDetails = props.matchDetails;
  return (
    <Card
      style={{ width: "40vw" }}
      variant="dark"
      bg="dark"
      className="match-card">
      <Card.Body>
        <Card.Title>
          {matchDetails["team-1"] + "  VS  " + matchDetails["team-2"]}
        </Card.Title>
        <Card.Subtitle>{matchDetails["unique_id"]}</Card.Subtitle>
        <Card.Text>{matchDetails.type}</Card.Text>
        <Card.Text>{matchDetails.date.split("T")[0]}</Card.Text>
        <Card.Text>
          {matchDetails.winner_team
            ? `Match Finished winner: ${matchDetails.winner_team}`
            : matchDetails.matchStarted
            ? "Match Started"
            : "Match yet to be started"}
        </Card.Text>
        Predict Toss Winner
        <Row>
          <Col xs={6}>
            <Button variant="secondary">{matchDetails["team-1"]}</Button>
          </Col>
          <Col xs={6}>
            <Button variant="secondary">{matchDetails["team-2"]}</Button>
          </Col>
        </Row>
        <br />
        Predict Match Winner
        <Row>
          <Col xs={6}>
            <Button
              variant="secondary"
              onClick={() => {
                predictMatch(true);
              }}>
              {matchDetails["team-1"]}
            </Button>
          </Col>
          <Col xs={6}>
            <Button
              variant="secondary"
              onClick={() => {
                predictMatch(false);
              }}>
              {matchDetails["team-2"]}
            </Button>
          </Col>
        </Row>
        <br />
        <Button variant="secondary" onClick={resolveCricketMatch}>
          Resolve Match
        </Button>
        <br />
        <br />
        <Row>
          <Col xs={12}>
            <Button variant="secondary" onClick={claimCricketFunds}>
              {matchDetails.winner_team
                ? "Claim tokens"
                : `Claim tokens after match`}
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default MatchCard;
