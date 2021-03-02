import React, { useState, useEffect, useContext } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import EthPairCard from "./cards/ethPairCard";
import FiatPairCard from "./cards/fiatCard";
import UsdPairCard from "./cards/usdPairCard";
import "./priceFeedsRightUI.css";

const PriceFeedsRightUI = () => {
  return (
    <div>
      <UsdPairCard />
      <EthPairCard />
      <FiatPairCard />
    </div>
  );
};

export default PriceFeedsRightUI;
