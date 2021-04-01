import React, { useState, useEffect } from "react";
import NftPriceFeedsPage from "./nftPriceFeeds/nftPriceFeeds";
import { Container, Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { Route, Switch } from "react-router-dom";
import NFTLeftColumnPriceFeeds from "./NFTLeftColumn/nftLeftColumn";

const NFTPage = () => {
  return (
    <div>
      <Row>
        <Col xs={3}>
          <NFTLeftColumnPriceFeeds />
        </Col>
        <Col xs={9}>
          <NftPriceFeedsPage />
        </Col>
      </Row>
    </div>
  );
};

export default NFTPage;
