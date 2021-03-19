import "./App.css";
import AppBar from "./components/AppBar/appbar";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import HomePage from "./components/Home/homepage";
import ProfilePage from "./components/ProfilePage/profilePage";
import PriceFeedsPage from "./components/PriceFeeds/pricefeeds";
import React, { useState, useEffect, useContext } from "react";
import { Web3Context } from "./context/web3Context";
import { Spinner } from "react-bootstrap";
function App() {
  const { userAddress, web3 } = useContext(Web3Context);

  return (
    <div className="App">
      <Router>
        <AppBar />
        <AppBody />
      </Router>
    </div>
  );
}

const AppBody = () => {
  const { userAddress, web3 } = useContext(Web3Context);
  if (userAddress) {
    return (
      <div className="body-wrapper">
        <Switch>
          <Route path="/" component={HomePage} exact />
          <Route path="/profile" component={ProfilePage} exact />
          <Route path="/price/:asset" component={PriceFeedsPage} exact />
        </Switch>
      </div>
    );
  } else {
    return (
      <div className="body-wrapper">
        <br />
        <br />
        Connect Wallet
        <br />
        <Spinner animation="border" />
        <br />
        Click on connect Wallet button on top right
      </div>
    );
  }
};

export default App;
