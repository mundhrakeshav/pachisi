import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import LeftColumnPriceFeeds from "./LeftColumn/leftColumn";
import PriceFeedsRightUI from "./PriceFeedsUi/priceFeedsRightUI";

const PriceFeedsPage = () => {
  let { asset } = useParams();

  return (
    <div>
      <Row>
        <Col xs={3}>
          <LeftColumnPriceFeeds />
        </Col>
        <Col xs={9}>
          <PriceFeedsRightUI />
        </Col>
      </Row>
    </div>
  );
};

export default PriceFeedsPage;
