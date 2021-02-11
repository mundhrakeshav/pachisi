import React, { useState, useEffect } from "react";
import "./pricePredictionLeft.css";
import { Container, Row, Button } from "react-bootstrap";
import { FaUpload, FaMoneyBill, FaMoneyBillWave } from "react-icons/fa";
import { GiMoneyStack } from "react-icons/gi";
import { Link } from "react-router-dom";
const PricePredictionLeft = () => {
  return (
    <div className="price-prediction-left-wrapper">
      {" "}
      <Container className="sports-left-column-container">
        <Row className="sports-left-column-row">
          <Link to="/prices/forex">
            <Button variant="secondary" className="sports-left-column-button">
              <FaMoneyBill /> Forex
            </Button>
          </Link>
        </Row>
        <Row>
          <Link to="/prices/cryptocurrencies">
            <Button variant="secondary" className="sports-left-column-button">
              <FaMoneyBillWave /> CryptoCurrencies
            </Button>
          </Link>
        </Row>
        <Row>
          <Link to="/prices/stocks">
            <Button variant="secondary" className="sports-left-column-button">
              <GiMoneyStack /> Stocks
            </Button>
          </Link>
        </Row>
        <br />
        <br />
        <br />
        <br />
      </Container>
    </div>
  );
};

export default PricePredictionLeft;
