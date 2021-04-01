import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { Route, Switch } from "react-router-dom";
import NFTLeftColumnPriceFeeds from "../NFTLeftColumn/nftLeftColumn";
import NFTCryptoPage from "./nftCryptoPage/nftCryptoPage";
import NFTStockPage from "./nftStockPage/nftStockPage";
const NftPriceFeedsPage = () => {
  return (
    <div>
      <Row>
        <Col xs={3}>
          <NFTLeftColumnPriceFeeds />
        </Col>
        <Col xs={9}>
          <Switch>
            <Route path="/nftPage/crypto" component={NFTCryptoPage} exact />
            <Route path="/nftPage/stocks" component={NFTStockPage} exact />
          </Switch>
        </Col>
      </Row>
    </div>
  );
};

export default NftPriceFeedsPage;
