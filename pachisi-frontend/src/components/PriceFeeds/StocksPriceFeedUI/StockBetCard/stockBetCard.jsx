import React, { useState, useEffect, useContext } from "react";
import { PachisiStockBetContext } from "../../../../context/pachisiStockBetContext";
import { PachisiStockPredictionContractContext } from "../../../../context/pachisiStockPredicitonContext";
import { Web3Context } from "../../../../context/web3Context";

import {
  Button,
  Spinner,
  Card,
  Row,
  Col,
  ButtonGroup,
  Form,
} from "react-bootstrap";
import "./stockBetCard.css";

const StockBetCards = (props) => {
  const stockBetCards = props.stockAddressArray.map((address, index) => {
    return <StockBetCard address={address} key={index} />;
  });
  return <div>{stockBetCards}</div>;
};

const StockBetCard = (props) => {
  const { getData } = useContext(PachisiStockBetContext);
  const { userAddress } = useContext(Web3Context);
  const { createBet, getStockBetsAddresses, placeBet, claimFunds } = useContext(
    PachisiStockPredictionContractContext
  );

  const [isLoading, setIsLoading] = useState(true);
  const [betResolveDate, setBetResolveDate] = useState("");
  const [betResolveTime, setBetResolveTime] = useState(0);
  const [betStock, setBetStock] = useState("");
  const [predictionPrice, setPredictionPrice] = useState(0);
  const [resolvedPrice, setResolvedPrice] = useState(0);
  const [symbol, setSymbol] = useState("");
  const [betResolved, setBetResolved] = useState(false);
  const [volume, setVolume] = useState(0);
  const [trueTokensInMarket, setTrueTokensInMarket] = useState(0);
  const [falseTokensInMarket, setFalseTokensInMarket] = useState(0);
  const [userOwnedTrueTokens, setUserOwnedTrueTokens] = useState(0);
  const [userOwnedFalseTokens, setUserOwnedFalseTokens] = useState(0);
  const [hasUserClaimed, setHasUserClaimed] = useState(false);

  const init = async () => {
    const data = await getData(props.address, userAddress);
    console.log(data, props.address);
    setBetStock(data["betStock"]);
    setBetResolveDate(
      new Date(parseInt(data["betResolveTime"] * 1000)).toString()
    );
    setBetResolveTime(parseInt(data["betResolveTime"]));
    if (data["symbol"] === "0x3e") {
      setSymbol(">");
    } else {
      setSymbol("<");
    }
    setResolvedPrice(parseInt(data["resolvedPrice"] / 1e18));
    setPredictionPrice(data["predictionPrice"]);

    setBetResolved(data["betResolved"] / 1e18);

    setVolume(data["volume"] / 1e18);
    setTrueTokensInMarket(data["trueTokensInMarket"] / 1e18);
    setFalseTokensInMarket(data["falseTokensInMarket"] / 1e18);
    setUserOwnedTrueTokens(data["userOwnedTrueTokens"] / 1e18);
    setUserOwnedFalseTokens(data["userOwnedFalseTokens"] / 1e18);
    setHasUserClaimed(data["hasUserClaimed"]);
    setIsLoading(false);
  };

  const placeNewBet = async (_userBet, _betAmount) => {
    placeBet(props.address, betStock, _betAmount, _userBet, userAddress);
  };

  const claim = () => {
    claimFunds(props.address, userAddress);
  };

  useEffect(() => {
    init();
  });

  if (!isLoading) {
    return (
      <div className="bet-card-wrapper">
        <Card className="bet-card">
          <Row>
            <Col className="bet-card-left-column">
              <Card.Title>
                <h4>{`${betStock}`}</h4>
                <h5>{betResolved ? `Bet Resolved` : `To be Resolved`}</h5>
              </Card.Title>
              <Card.Subtitle>
                <h6>
                  Predicted Price is {`${symbol}`}
                  <b>{` ${predictionPrice}`}</b>
                </h6>
              </Card.Subtitle>
              <Card.Subtitle>
                <h6>
                  Resolve time:
                  <b>{` ${betResolveDate}`}</b>
                </h6>
              </Card.Subtitle>{" "}
              <Card.Subtitle>
                <h6>
                  Volume:
                  <b>{` ${volume} DAI`}</b>
                </h6>
              </Card.Subtitle>
            </Col>
            <Col className="bet-card-right-column">
              <br />
              <br />
              <Card.Subtitle>
                {betResolved ? (
                  <h6>
                    Resolved Price is
                    <b>{` ${resolvedPrice}`}</b>
                  </h6>
                ) : (
                  <div></div>
                )}
              </Card.Subtitle>
            </Col>
          </Row>
          {betResolved ? (
            <ClaimTokensButton hasUserClaimed={hasUserClaimed} claim={claim} />
          ) : (
            <PlaceBetButtonGroup
              placeBetCallBack={placeNewBet}
              trueTokensInMarket={trueTokensInMarket}
              falseTokensInMarket={falseTokensInMarket}
            />
          )}
          <br />
          <Row>
            <Col>
              <Button variant="success" size="sm" className="place-bet-buttons">
                {userOwnedTrueTokens}
              </Button>
            </Col>
            <Col>
              <Button variant="dark" size="sm" className="place-bet-buttons">
                {`<== `} No of Shares owned by you.{` ==>`}
              </Button>
            </Col>
            <Col>
              <Button variant="danger" size="sm" className="place-bet-buttons">
                {userOwnedFalseTokens}
              </Button>
            </Col>
          </Row>
        </Card>
      </div>
    );
  } else {
    return (
      <div>
        <Spinner animation="border" />
      </div>
    );
  }
};

const PlaceBetButtonGroup = (props) => {
  const [betAmount, setBetAmount] = useState(20);
  return (
    <ButtonGroup className="place-bet-button">
      <Button
        variant="outline-success"
        size="sm"
        className="place-bet-buttons"
        onClick={() => {
          props.placeBetCallBack(true, betAmount);
        }}>
        <b>
          Yes
          {` (${
            props.trueTokensInMarket /
            10 ** 18 /
            (props.trueTokensInMarket / 10 ** 18 +
              props.falseTokensInMarket / 10 ** 18)
          } DAI)`}
        </b>
      </Button>
      <Form>
        <Form.Group controlId="formGroupPassword">
          <Form.Control
            type="number"
            placeholder="Amount"
            onChange={(event) => {
              setBetAmount(event.target.value);
            }}
          />
        </Form.Group>
      </Form>{" "}
      <Button
        variant="outline-danger"
        size="sm"
        className="place-bet-buttons"
        onClick={() => {
          props.placeBetCallBack(false, betAmount);
        }}>
        <b>
          No
          {` (${
            props.falseTokensInMarket /
            10 ** 18 /
            (props.trueTokensInMarket / 10 ** 18 +
              props.falseTokensInMarket / 10 ** 18)
          } DAI)`}
        </b>
      </Button>
    </ButtonGroup>
  );
};

const ClaimTokensButton = (props) => {
  return (
    <Button
      variant="outline-success"
      size="sm"
      className="claim-funds-button"
      onClick={() => {
        props.claim();
      }}>
      {props.hasUserClaimed ? "Claimed" : "Claim your Funds"}
    </Button>
  );
};

export default StockBetCards;
