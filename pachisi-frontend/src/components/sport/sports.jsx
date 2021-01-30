import React from "react";
import { Container, Col, Row } from "react-bootstrap";
import BasketBall from "./BasketBall/BasketBall";
import Cricket from "./cricket/cricket";
import FootBall from "./FootBall/FootBall";
import SportsLeftColumn from "./sportsLeftColumn/sportsLeftColumn";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import SportsRightColumn from "./sportsRightColumn/sportsRightColumn";
import "./sports.css";
const SportsPage = () => {
  return (
    <Row className="sports-page-wrapper">
      <Col xl={3} className="left-column column-wrapper">
        <SportsLeftColumn />
      </Col>
      <Col xl={6} className="middle-column column-wrapper">
        <Switch>
          <Route path="/sports/cricket" component={Cricket} />
          <Route path="/sports/football" component={FootBall} exact />
          <Route path="/sports/basketball" component={BasketBall} exact />
        </Switch>
      </Col>
      <Col xl={3} className="right-column column-wrapper">
        <SportsRightColumn />
      </Col>
    </Row>
  );
};

export default SportsPage;
