import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import LeftColumnPriceFeeds from "./LeftColumn/leftColumn";

const PriceFeedsPage = () => {
  let { asset } = useParams();

  return (
    <div>
      <Row>
        <Col xs={2}>
          <LeftColumnPriceFeeds />
        </Col>
        <Col xs={10}>{asset}</Col>
      </Row>
    </div>
  );
};

export default PriceFeedsPage;
