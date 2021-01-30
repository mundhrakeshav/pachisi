import React from "react";
import { Container, Row, Button } from "react-bootstrap";
import { FaUpload } from "react-icons/fa";
import { GiBasketballBall, GiCricketBat, GiSoccerBall } from "react-icons/gi";
import { Link } from "react-router-dom";
import "./sportsLeftColumn.css";

const SportsLeftColumn = () => {
  return (
    <Container className="sports-left-column-container">
      <Row className="sports-left-column-row">
        <Link to="/sports/cricket">
          <Button variant="secondary" className="sports-left-column-button">
            <GiCricketBat /> Cricket
          </Button>
        </Link>
      </Row>
      <Row>
        <Link to="/sports/football">
          <Button variant="secondary" className="sports-left-column-button">
            <GiSoccerBall /> Soccer
          </Button>
        </Link>
      </Row>
      <Row>
        <Link to="/sports/basketball">
          <Button variant="secondary" className="sports-left-column-button">
            <GiBasketballBall /> BasketBall
          </Button>
        </Link>
      </Row>
      <br />
      <br />
      <br />
      <br />
      <Row>
        <Link to="/sports/add">
          <Button variant="secondary" className="sports-left-column-button">
            <FaUpload /> Add
          </Button>
        </Link>
      </Row>
    </Container>
  );
};

export default SportsLeftColumn;
