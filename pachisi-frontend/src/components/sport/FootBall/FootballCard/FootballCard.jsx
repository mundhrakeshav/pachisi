import React from "react";
import { Card, Button, Row, Col } from "react-bootstrap";
import "./FootballCard.jsx";
const FootBallCard = (props) => {
  console.log("MatchCard", props.match);
  const match = props.match;
  return (
    <Card
      style={{ width: "50vw" }}
      variant="dark"
      bg="dark"
      className="match-card">
      <Card.Body>
        <Card.Title>
          {match["away_team_short_code"] +
            " VS " +
            match["home_team_short_code"]}
        </Card.Title>
        <Card.Subtitle>
          {match["home_team"] + " VS " + match["away_team"]}
        </Card.Subtitle>
        <br />
        <Card.Subtitle>{match["status"]}</Card.Subtitle>
        <br />
        Predict Half Time Score:
        <br />
        {match["home_half_timeScore"] + " - " + match["away_half_timeScore"]}
        <br />
        <br />
        <Button
          variant="secondary"
          onClick={() => {
            const data = prompt("Please enter your name");
            console.log(data);
          }}>
          {match["home_team"] + " VS " + match["away_team"]}
        </Button>
        <br />
        <br />
        Predict Full Time Score:
        <br />
        {match["home_full_timeScore"] + " - " + match["away_full_timeScore"]}
        <br />
        <br />
        <Button variant="secondary">
          {match["home_team"] + " VS " + match["away_team"]}
        </Button>
        <br />
        <br />
        <Row>
          <Col xs={12}>
            <Button variant="secondary">
              {" "}
              {match["statusCode"] === 3
                ? "Claim tokens"
                : `Claim tokens after match`}
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default FootBallCard;
