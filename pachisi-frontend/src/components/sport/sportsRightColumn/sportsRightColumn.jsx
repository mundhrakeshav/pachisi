import React from "react";
import CricketRightColumn from "../cricket/CricketRightColumn/cricketRightColumn";
import "./sportsRightColumn.css";
import { Switch, Route } from "react-router-dom";
// import FootballRightColumn from "../FootBall/FootBallRightColumn/footballRightColumn";
// import BasketBallRightColumn from "../BasketBall/BasketBallRightColumn/BasketBallRightColumn";

const SportsRightColumn = () => {
  return (
    <div className="sports-right-column-container">
      <Switch>
        <Route path="/sports/cricket" component={CricketRightColumn} />
        {/* <Route path="/sports/football" component={FootballRightColumn} exact />
        <Route
          path="/sports/basketball"
          component={BasketBallRightColumn}
          exact
        /> */}
      </Switch>
    </div>
  );
};

export default SportsRightColumn;
