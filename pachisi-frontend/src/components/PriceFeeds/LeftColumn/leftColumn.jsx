import React, { useState, useEffect } from "react";
import { Container, Button, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

import "./leftColumn.css";

const LeftColumnPriceFeeds = () => {
  return (
    <Container className="left-column-container">
      <Col className="left-button-column">
        <Row className="left-button-row">
          <Link to="/price/crypto" className="nav-button">
            <Button className="left-column-button-pricefeeds">Crypto</Button>{" "}
          </Link>
        </Row>
        <Row className="left-button-row">
          <Link to="/price/stocks" className="nav-button">
            <Button className="left-column-button-pricefeeds">Stocks</Button>{" "}
          </Link>
        </Row>{" "}
        <Row className="left-button-row">
          <Link to="/price/forex" className="nav-button">
            <Button className="left-column-button-pricefeeds">Forex</Button>{" "}
          </Link>
        </Row>{" "}
      </Col>
    </Container>
  );
};

export default LeftColumnPriceFeeds;
