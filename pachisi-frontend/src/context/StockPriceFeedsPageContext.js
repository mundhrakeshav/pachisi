import React, { createContext, useState, useEffect } from "react";
import Web3 from "web3";
import { getStockPrices } from "../Helper/stockPriceAxios";

export const StockPriceFeedsPageContext = createContext();

const StockPriceFeedsPageContextProvider = (props) => {
  const StockAssets = [
    { name: "AAPL" },
    { name: "GOOGL" },
    { name: "FB" },
    { name: "AMZN" },
  ];

  const [selectedStockPair, setSelectedStockPair] = useState(0);
  const [selectedStockPairPriceTag, setSelectedStockPairPriceTag] = useState(
    0.0
  );

  const init = async () => {
    const stockPrice = await getStockPrices(StockAssets[0]["name"]);
    setSelectedStockPairPriceTag(stockPrice["Global Quote"]["05. price"]);
  };
  useEffect(() => {
    init();
  }, []);

  const changeSelectedStock = async (selectedIndex) => {
    const newStockPairPrice = await getStockPrices(
      StockAssets[selectedIndex]["name"]
    );
    setSelectedStockPairPriceTag(
      newStockPairPrice["Global Quote"]["05. price"]
    );
    setSelectedStockPair(selectedIndex);
  };

  return (
    <StockPriceFeedsPageContext.Provider
      value={{
        selectedStockPair,
        selectedStockPairPriceTag,
        changeSelectedStock,
        StockAssets,
      }}>
      {props.children}
    </StockPriceFeedsPageContext.Provider>
  );
};

export default StockPriceFeedsPageContextProvider;
