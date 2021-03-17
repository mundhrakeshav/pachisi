import React, { useState, useEffect, useContext } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import EthPairCard from "./cards/ethPairCard";
import UsdPairCard from "./cards/usdPairCard";
import CryptoPriceFeedsPageContextProvider from "../../../context/PriceFeedsPageContext";
import PachisiCryptoPredictionContractContextProvider from "../../../context/pachisiCryptoPredictionContract";
import ApproveDaiCard from "./approveDaiComponent";
import "./priceFeedsUI.css";
import DaiContractContextProvider from "../../../context/daiContractContext";

const CryptoPriceFeedsRightUI = () => {
  return (
    <div>
      <DaiContractContextProvider>
        <CryptoPriceFeedsPageContextProvider>
          <PachisiCryptoPredictionContractContextProvider>
            <ApproveDaiCard />
            <UsdPairCard />
            <EthPairCard />
          </PachisiCryptoPredictionContractContextProvider>
        </CryptoPriceFeedsPageContextProvider>
      </DaiContractContextProvider>
    </div>
  );
};

export default CryptoPriceFeedsRightUI;
