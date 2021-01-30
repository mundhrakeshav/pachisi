import React from "react";
import { Container, Row, Button } from "react-bootstrap";
import { FaUpload } from "react-icons/fa";
import { GiBasketballBall, GiCricketBat, GiSoccerBall } from "react-icons/gi";
import { Link } from "react-router-dom";
import CricketRightColumn from "../cricket/CricketRightColumn/CricketRightColumn";
import "./sportsRightColumn.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import FootballRightColumn from "../FootBall/FootBallRightColumn/footballRightColumn";
import BasketBallRightColumn from "../BasketBall/BasketBallRightColumn/BasketBallRightColumn";

const SportsRightColumn = () => {
  return (
    <div className="sports-right-column-container">
      <Switch>
        <Route path="/sports/cricket" component={CricketRightColumn} />
        <Route path="/sports/football" component={FootballRightColumn} exact />
        <Route
          path="/sports/basketball"
          component={BasketBallRightColumn}
          exact
        />
      </Switch>
    </div>
  );
};

export default SportsRightColumn;
