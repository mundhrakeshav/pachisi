import React, { useState, useEffect, useContext } from "react";
import { Col, Row } from "react-bootstrap";
import PricePredictionLeft from "./pricePredictionLeft/pricePredictionLeft";

import PricePredictionRight from "./pricePredictionRight/pricePredictionRight";
import "./PricePrediction.css";
import { Switch, Route } from "react-router-dom";
import CryptoCurrencies from "./pricePredictionMid/CryptoCurrencies/Crypto";
import Stocks from "./pricePredictionMid/Stocks/Stocks";
import Forex from "./pricePredictionMid/Forex/forex";

const PricePredictionPage = () => {
  return (
    <div className="price-prediction">
      <Row>
        <Col xl={3} className="middle-column column-wrapper">
          <PricePredictionLeft />
        </Col>
        <Col xl={6} className="middle-column column-wrapper">
          <Switch>
            <Route
              path="/prices/cryptocurrencies"
              component={CryptoCurrencies}
            />
            <Route path="/prices/stocks" component={Stocks} exact />
            <Route path="/prices/forex" component={Forex} exact />
          </Switch>
        </Col>
        <Col xl={3} className="middle-column column-wrapper">
          <PricePredictionRight />
        </Col>
      </Row>
    </div>
  );
};

export default PricePredictionPage;
