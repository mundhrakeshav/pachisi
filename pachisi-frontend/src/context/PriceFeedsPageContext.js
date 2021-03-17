import React, { createContext, useState, useEffect } from "react";
import Web3 from "web3";
import { getUSDPairPrices, getETHPairPrices } from "../Helper/cryptoPriceAxios";
export const CryptoPriceFeedsPageContext = createContext();
const CryptoPriceFeedsPageContextProvider = (props) => {
  const USDPairAssets = [
    //betRange In USD
    { name: "BAT" },
    { name: "BNB" },
    { name: "BTC" },
    { name: "ETH" },
    { name: "LTC" },
    { name: "SNX" },
    { name: "TRX" },
    { name: "XRP" },
    { name: "XTZ" },
  ];

  const ETHPairAssets = [
    // betRange in ETH
    { name: "AAVE" },
    { name: "BAT" },
    { name: "BTC" },
    { name: "LINK" },
    { name: "MANA" },
    { name: "MKR" },
    { name: "REN" },
    { name: "REP" },
    { name: "SNX" },
    { name: "UNI" },
    { name: "YFI" },
  ];
  const [selectedUSDPair, setSelectedUSDPair] = useState(0);
  const [selectedETHPair, setSelectedETHPair] = useState(0);
  const [selectedUSDPairPriceTag, setSelectedUSDPairPriceTag] = useState(0.0);
  const [selectedETHPairPriceTag, setSelectedETHPairPriceTag] = useState(0.0);

  const init = async () => {
    const usdPairPrice = await getUSDPairPrices(USDPairAssets[0]["name"]);
    const ethpairPrice = await getETHPairPrices(ETHPairAssets[0]["name"]);
    setSelectedUSDPairPriceTag(usdPairPrice["USD"]);
    setSelectedETHPairPriceTag(ethpairPrice["ETH"]);
    console.log(usdPairPrice);
    console.log(ethpairPrice);
  };
  useEffect(() => {
    init();
  }, []);

  const changeUSDPair = async (selectedCurrencyIndex) => {
    const newUSDPairPrice = await getUSDPairPrices(
      USDPairAssets[selectedCurrencyIndex]["name"]
    );
    console.log(newUSDPairPrice["USD"], "newUSDPairPrice");
    setSelectedUSDPairPriceTag(newUSDPairPrice["USD"]);
    setSelectedUSDPair(selectedCurrencyIndex);
  };

  const changeETHPair = async (selectedCurrencyIndex) => {
    const newETHPairPrice = await getETHPairPrices(
      ETHPairAssets[selectedCurrencyIndex]["name"]
    );
    console.log(newETHPairPrice, "newETHPairPrice");
    setSelectedETHPairPriceTag(newETHPairPrice["ETH"]);
    setSelectedETHPair(selectedCurrencyIndex);
  };

  return (
    <CryptoPriceFeedsPageContext.Provider
      value={{
        USDPairAssets,
        ETHPairAssets,
        selectedUSDPair,
        selectedETHPair,
        changeUSDPair,
        changeETHPair,
        selectedUSDPairPriceTag,
        selectedETHPairPriceTag,
      }}>
      {props.children}
    </CryptoPriceFeedsPageContext.Provider>
  );
};

export default CryptoPriceFeedsPageContextProvider;
