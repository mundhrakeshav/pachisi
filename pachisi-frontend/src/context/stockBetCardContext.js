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
    // const stockPrice = await getStockPrices(StockAssets[0]["name"]);
    // // setSelectedStockPairPriceTag(usdPairPrice["USD"]);
    // console.log("stockPrice");
  };
  useEffect(() => {
    init();
  }, []);

  const changeSelectedStock = async (selectedIndex) => {
    // const newStockPairPrice = await getUSDPairPrices(
    //   StockAssets[selectedCurrencyIndex]["name"]
    // );
    // console.log(newStockPairPrice);
    // setSelectedStockPairPriceTag(newStockPairPrice["USD"]);
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
