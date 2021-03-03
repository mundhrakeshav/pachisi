import React, { useState, useEffect, useContext } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import EthPairCard from "./cards/ethPairCard";
import UsdPairCard from "./cards/usdPairCard";
import CryptoPriceFeedsPageContextProvider from "../../../context/PriceFeedsPageContext";
import "./priceFeedsUI.css";

const CryptoPriceFeedsRightUI = () => {
  return (
    <div>
      <CryptoPriceFeedsPageContextProvider>
        <UsdPairCard />
        <EthPairCard />
      </CryptoPriceFeedsPageContextProvider>
    </div>
  );
};

export default CryptoPriceFeedsRightUI;
