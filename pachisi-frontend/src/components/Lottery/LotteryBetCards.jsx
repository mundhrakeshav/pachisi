import React, { useState, useEffect, useContext } from "react";
import { Button, ButtonGroup, Card, Col, Form, Row } from "react-bootstrap";
import { LotteryContractContext } from "../../context/lotteryPredictionContext";
import { Web3Context } from "../../context/web3Context";

const LotteryBetCards = (props) => {
  console.log(props.bets, "BETS");
  const betCards = props.bets.map((bet, index) => {
    return <LotteryBetCard bet={bet} key={index} />;
  });
  betCards.reverse();
  return <div>{betCards}</div>;
};

const LotteryBetCard = (props) => {
  const { userAddress, web3 } = useContext(Web3Context);

  const {
    getCreatedBets,
    getBetDetails,
    getUserBetAmount,
    hasUserClaimed,
    placeEvenOddBet,
    placeUpDownBet,
    claimFundsUpDown,
    claimFundsOddEven,
  } = useContext(LotteryContractContext);
  const [betResolveTime, setBetResolveTime] = useState(0);

  const [betDetails, setBetsDetails] = useState({});
  const [betDate, setBetResolveDate] = useState("");
  const [resolvedRandomness, setResolvedRandomness] = useState();
  const [betResolved, setBetResolved] = useState(false);
  const [volumeEvenOdd, setVolumeEvenOdd] = useState(0);
  const [volumeUpDown, setVolumeUpDown] = useState(0);
  const [userBetAmount, setUserBetAmount] = useState(0);
  const [hasUserClaimedFunds, setHasUserClaimedFunds] = useState(0);

  useEffect(async () => {
    const betDetails = await getBetDetails(props.bet);
    console.log(betDetails);
    setBetsDetails(betDetails);
    setBetResolveTime(parseInt(betDetails["betResolveTime"]));
    setBetResolveDate(
      new Date(parseInt(betDetails["betResolveTime"]) * 1000).toString()
    );

    setResolvedRandomness(betDetails["resolvedRandomness"]);
    setBetResolved(betDetails["betResolved"]);
    setVolumeEvenOdd(betDetails["volumeEvenOdd"]);
    setVolumeUpDown(betDetails["volumeUpDown"]);
    const _userBetAmount = await getUserBetAmount(
      betDetails["betResolveTime"],
      userAddress
    );
    console.log(_userBetAmount, "USERBETAMOUNT");
    //UP> DOWN> EVEN> ODD USERBETAMOUNT
    setUserBetAmount(_userBetAmount);
    const _hasUserClaimed = await hasUserClaimed(
      betDetails["betResolveTime"],
      userAddress
    );
    setHasUserClaimedFunds(_hasUserClaimed);
  }, []);
  return (
    <div className="bet-card-wrapper">
      <Card className="bet-card">
        <Row className="bet-card-left-column">
          <Col>
            <Card.Subtitle>
              <h6>
                Resolve time:
                <b>{` ${betDate}`}</b>
              </h6>
            </Card.Subtitle>{" "}
          </Col>
          <Col className="bet-card-right-column">
            {betResolved
              ? `Resolved Randomness: ${resolvedRandomness % 14}`
              : ""}
          </Col>
        </Row>
        <Row>
          {" "}
          <Col className="bet-card-left-column">
            <b>volume Even/Odd Market: {parseInt(volumeEvenOdd) / 10 ** 18}</b>
          </Col>
        </Row>
        {!betResolved ? (
          <ButtonBar
            trueValue={"Even"}
            falseValue={"Odd"}
            placeBet={placeEvenOddBet}
            betResolveTime={betResolveTime}
          />
        ) : (
          <ClaimButtonBar
            title={hasUserClaimedFunds ? "Claimed" : "Claim Funds Even/Odd"}
            claimFunds={claimFundsOddEven}
            betResolveTime={betResolveTime}
          />
        )}
        <Row>
          <Col>
            <Button variant="secondary" size="sm">
              {parseInt(userBetAmount[2]) / 10 ** 18}
            </Button>
          </Col>
          <Col>Amount invested by you</Col>
          <Col>
            <Button variant="secondary" size="sm">
              {parseInt(userBetAmount[3]) / 10 ** 18}
            </Button>
          </Col>
        </Row>{" "}
        <br /> <br />
        <Row>
          <Col className="bet-card-left-column">
            <b>volume 7Up/7Down Market: {parseInt(volumeUpDown) / 10 ** 18}</b>
          </Col>
        </Row>{" "}
        {!betResolved ? (
          <ButtonBar
            trueValue={"7Up"}
            falseValue={"7Down"}
            betResolveTime={betResolveTime}
            placeBet={placeUpDownBet}
          />
        ) : (
          <ClaimButtonBar
            title={hasUserClaimedFunds ? "Claimed" : "Claim Funds Up/Down"}
            claimFunds={claimFundsUpDown}
            betResolveTime={betResolveTime}
          />
        )}
        <Row>
          <Col>
            <Button variant="secondary" size="sm">
              {parseInt(userBetAmount[0]) / 10 ** 18}
            </Button>
          </Col>
          <Col>Amount invested by you</Col>
          <Col>
            <Button variant="secondary" size="sm">
              {parseInt(userBetAmount[1]) / 10 ** 18}
            </Button>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

const ButtonBar = (props) => {
  const { userAddress, web3 } = useContext(Web3Context);

  const [amount, setAmount] = useState("");
  return (
    <ButtonGroup className="place-bet-button">
      {/* // const placeUpDownBet = async( // _amount, // _userBet, // //
      _betResolveTime, // _userAddress // ); */}
      <Button
        variant="dark"
        size="sm"
        onClick={() => {
          props.placeBet(amount, true, props.betResolveTime, userAddress);
          console.log(amount, true, props.betResolveTime, userAddress);
        }}>
        {props.trueValue}
      </Button>
      <Form>
        <Form.Group controlId="formGroupPassword">
          <Form.Control
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(event) => {
              setAmount(event.target.value);
            }}
          />
        </Form.Group>
      </Form>{" "}
      <Button
        variant="dark"
        size="sm"
        onClick={() => {
          props.placeBet(amount, false, props.betResolveTime, userAddress);
        }}>
        {props.falseValue}
      </Button>
    </ButtonGroup>
  );
};

const ClaimButtonBar = (props) => {
  const { userAddress, web3 } = useContext(Web3Context);

  return (
    <ButtonGroup className="place-bet-button">
      <Button
        variant="dark"
        size="sm"
        onClick={() => {
          props.claimFunds(props.betResolveTime, userAddress);
        }}>
        {props.title}
      </Button>
    </ButtonGroup>
  );
};

export default LotteryBetCards;
