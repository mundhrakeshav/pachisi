import React from "react";
import { Card, Button, Row, Col } from "react-bootstrap";
import "./matchcard.css";
const MatchCard = (props) => {
  console.log("MatchCard", props);
  const matchDetails = props.matchDetails;
  console.log(matchDetails);
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
            <Button variant="secondary">{matchDetails["team-1"]}</Button>
          </Col>
          <Col xs={6}>
            <Button variant="secondary">{matchDetails["team-2"]}</Button>
          </Col>
        </Row>
        <br />
        <Row>
          <Col xs={12}>
            <Button variant="secondary">
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
