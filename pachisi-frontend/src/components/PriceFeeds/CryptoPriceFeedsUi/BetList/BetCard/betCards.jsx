import React, { useState, useEffect, useContext } from "react";
import { PachisiCryptoBetContext } from "../../../../../context/pachisiCryptoBetContext";
import { PachisiCryptoPredictionContractContext } from "../../../../../context/pachisiCryptoPredictionContract";
import { Web3Context } from "../../../../../context/web3Context";

import {
  Button,
  Spinner,
  Card,
  Row,
  Col,
  ButtonGroup,
  Form,
} from "react-bootstrap";
import "./betCard.css";
const BetCards = (props) => {
  const usdCards = props.USDAddressArray.map((address, index) => {
    return <BetCard address={address} key={index} />;
  });

  const ethCards = props.ETHAddressArray.map((address, index) => {
    return <BetCard address={address} key={index} />;
  });

  console.log(props);
  return (
    <div>
      <div>{usdCards}</div>
      <div>{ethCards}</div>
    </div>
  );
};

const BetCard = (props) => {
  const { getData } = useContext(PachisiCryptoBetContext);
  const { userAddress } = useContext(Web3Context);
  const { placeUSDBets, placeETHBets, claimFunds } = useContext(
    PachisiCryptoPredictionContractContext
  );

  const [isLoading, setIsLoading] = useState(true);
  const [betPair, setBetPair] = useState("");
  const [betResolveDate, setBetResolveDate] = useState(0);
  const [betResolveTime, setBetResolveTime] = useState(0);
  const [betToken, setBetToken] = useState("");
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

  useEffect(async () => {
    await init();
  }, []);

  const placeBet = async (_userBet, _betAmount) => {
    if (betPair === "USD") {
      placeUSDBets(props.address, betToken, _betAmount, _userBet, userAddress);
      // _betAddress, _betToken, _betAmount, _userBet;
    } else {
      placeETHBets(props.address, betToken, _betAmount, _userBet, userAddress);
    }
  };

  const claim = () => {
    claimFunds(props.address, userAddress);
  };

  const init = async () => {
    const data = await getData(props.address, userAddress);
    console.log(data, "data");
    setBetPair(data["betPair"]);
    setBetToken(data["betToken"]);
    setBetResolveDate(new Date(parseInt(data["betResolveTime"] * 1000)));
    setBetResolveTime(parseInt(data["betResolveTime"]));
    if (data["symbol"] === "0x3e") {
      setSymbol(">");
    } else {
      setSymbol("<");
    }
    if (data["betPair"] === "USD") {
      setResolvedPrice(parseInt(data["resolvedPrice"]) / 10 ** 8);
      setPredictionPrice(data["predictionPrice"] / 10 ** 8);
    } else {
      setResolvedPrice(parseInt(data["resolvedPrice"]) / 10 ** 18);
      setPredictionPrice(data["predictionPrice"] / 10 ** 18);
    }
    setBetResolved(data["betResolved"]);

    setVolume(data["volume"]);
    setTrueTokensInMarket(data["trueTokensInMarket"]);
    setFalseTokensInMarket(data["falseTokensInMarket"]);
    setUserOwnedTrueTokens(data["userOwnedTrueTokens"]);
    setUserOwnedFalseTokens(data["userOwnedFalseTokens"]);
    setHasUserClaimed(data["hasUserClaimed"]);
    setIsLoading(false);
  };

  if (!isLoading) {
    return (
      <div className="bet-card-wrapper">
        <Card className="bet-card">
          <Row>
            <Col className="bet-card-left-column">
              <Card.Title>
                <h4>{`${betToken} / ${betPair}`}</h4>
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
                  <b>{` ${volume / 10 ** 18} DAI`}</b>
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
              placeBetCallBack={placeBet}
              trueTokensInMarket={trueTokensInMarket}
              falseTokensInMarket={falseTokensInMarket}
            />
          )}
          <br />
          <Row>
            <Col>
              <Button variant="success" size="sm" className="place-bet-buttons">
                {userOwnedTrueTokens / 10 ** 18}
              </Button>
            </Col>
            <Col>
              <Button variant="dark" size="sm" className="place-bet-buttons">
                {`<== `} No of Shares owned by you.{` ==>`}
              </Button>
            </Col>
            <Col>
              <Button variant="danger" size="sm" className="place-bet-buttons">
                {userOwnedFalseTokens / 10 ** 18}
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

export default BetCards;
