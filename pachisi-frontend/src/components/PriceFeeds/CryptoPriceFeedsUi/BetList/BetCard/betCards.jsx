import React, { useState, useEffect, useContext } from "react";
import { PachisiCryptoBetContext } from "../../../../../context/pachisiCryptoBetContext";
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
  const [isLoading, setIsLoading] = useState(true);
  const [betPair, setBetPair] = useState("");
  const [betResolveDate, setBetResolveDate] = useState(0);
  const [betResolveTime, setBetResolveTime] = useState(0);

  const [betToken, setBetToken] = useState("");
  const [predictionPrice, setPredictionPrice] = useState(0);
  const [resolvedPrice, setResolvedPrice] = useState(0);
  const [symbol, setSymbol] = useState("");
  const [betResolved, setBetResolved] = useState(false);
  useEffect(async () => {
    await init();
  }, []);

  const init = async () => {
    const data = await getData(props.address);
    console.log(data);
    setBetPair(data["betPair"]);
    setBetToken(data["betToken"]);
    setBetResolveDate(new Date(parseInt(data["betResolveTime"]) * 1000));
    setBetResolveTime(parseInt(data["betResolveTime"]));
    setPredictionPrice(data["predictionPrice"]);
    setResolvedPrice(data["resolvedPrice"]);
    if (data["symbol"] === "0x3e") {
      setSymbol(">");
    } else {
      setSymbol("<");
    }
    setBetResolved(data["betResolved"]);
    setIsLoading(false);
  };

  if (!isLoading) {
    return (
      <div className="bet-card-wrapper">
        {" "}
        <Card className="bet-card">
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
          </Card.Subtitle>
          {betResolved ? <ClaimTokensButton /> : <PlaceBetButtonGroup />}
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
  return (
    <ButtonGroup className="place-bet-button">
      <Button variant="outline-success" size="sm" className="place-bet-buttons">
        Yes
      </Button>
      <Form>
        <Form.Group controlId="formGroupPassword">
          <Form.Control type="number" placeholder="Amount" />
        </Form.Group>
      </Form>{" "}
      <Button variant="outline-danger" size="sm" className="place-bet-buttons">
        No
      </Button>
    </ButtonGroup>
  );
};

const ClaimTokensButton = (props) => {
  return (
    <Button variant="outline-success" size="sm" className="claim-funds-button">
      Claim your funds
    </Button>
  );
};

export default BetCards;
