import React, { useState, useEffect, useContext } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import EthPairCard from "./cards/ethPairCard";
import UsdPairCard from "./cards/usdPairCard";
import CryptoPriceFeedsPageContextProvider from "../../../context/PriceFeedsPageContext";
import PachisiCryptoPredictionContractContextProvider from "../../../context/pachisiCryptoPredictionContract";
import ApproveDaiCard from "./approveDaiComponent";
import "./priceFeedsUI.css";
import DaiContractContextProvider from "../../../context/daiContractContext";
import BetList from "./BetList/betList";
import PachisiCryptoBetProvider from "../../../context/pachisiCryptoBetContext";

const CryptoPriceFeedsRightUI = () => {
  return (
    <div>
      <PachisiCryptoBetProvider>
        <DaiContractContextProvider>
          <CryptoPriceFeedsPageContextProvider>
            <PachisiCryptoPredictionContractContextProvider>
              <ApproveDaiCard />
              <UsdPairCard />
              <EthPairCard />
              <BetList />
            </PachisiCryptoPredictionContractContextProvider>
          </CryptoPriceFeedsPageContextProvider>
        </DaiContractContextProvider>
      </PachisiCryptoBetProvider>
    </div>
  );
};

export default CryptoPriceFeedsRightUI;
