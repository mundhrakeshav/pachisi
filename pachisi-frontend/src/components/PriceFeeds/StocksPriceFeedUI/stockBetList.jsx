import React, { useState, useEffect, useContext } from "react";
import { Button } from "react-bootstrap";
import { PachisiStockPredictionContractContext } from "../../../context/pachisiStockPredicitonContext";
import { StockPriceFeedsPageContext } from "../../../context/StockPriceFeedsPageContext";
import StockBetCards from "./StockBetCard/stockBetCard";

const StockBetList = () => {
  const { createBet, getStockBetsAddresses } = useContext(
    PachisiStockPredictionContractContext
  );
  const { StockAssets } = useContext(StockPriceFeedsPageContext);
  const [stockBetAddressList, setStockBetAddressList] = useState([]);
  useEffect(async () => {
    await init();
  }, []);

  const init = async () => {
    const _stockAddressArray = await getStockBetsAddresses();

    console.log(_stockAddressArray);
    setStockBetAddressList(_stockAddressArray);
  };

  return (
    <div>
      <StockBetCards stockAddressArray={stockBetAddressList} />
    </div>
  );
};

export default StockBetList;
