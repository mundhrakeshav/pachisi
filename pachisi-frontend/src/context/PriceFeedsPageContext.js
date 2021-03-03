import React, { createContext, useState, useEffect } from "react";
import Web3 from "web3";
import { getUSDPairPrices, getETHPairPrices } from "../Helper/cryptoPriceAxios";
export const CryptoPriceFeedsPageContext = createContext();
const CryptoPriceFeedsPageContextProvider = (props) => {
  const USDPairAssets = [
    //betRange In USD
    { name: "BAT", betRange: 2.0 },
    { name: "BNB", betRange: 2.0 },
    { name: "BTC", betRange: 2.0 },
    { name: "ETH", betRange: 2.0 },
    { name: "LTC", betRange: 2.0 },
    { name: "SNX", betRange: 2.0 },
    { name: "TRX", betRange: 2.0 },
    { name: "XRP", betRange: 2.0 },
    { name: "XTZ", betRange: 2.0 },
  ];

  const ETHPairAssets = [
    // betRange in ETH
    { name: "AAVE", betRange: 0.001 },
    { name: "BAT", betRange: 0.001 },
    { name: "BTC", betRange: 0.001 },
    { name: "LINK", betRange: 0.001 },
    { name: "MANA", betRange: 0.001 },
    { name: "MKR", betRange: 0.001 },
    { name: "REN", betRange: 0.001 },
    { name: "REP", betRange: 0.001 },
    { name: "SNX", betRange: 0.001 },
    { name: "UNI", betRange: 0.001 },
    { name: "YFI", betRange: 0.001 },
  ];
  const [selectedUSDPair, setSelectedUSDPair] = useState(0);
  const [selectedETHPair, setSelectedETHPair] = useState(0);
  const [selectedUSDPairPriceTag, setSelectedUSDPairPriceTag] = useState(0.0);
  const [selectedETHPairPriceTag, setSelectedETHPairPriceTag] = useState(0.0);

  const init = async () => {
    const usdPairPrice = await getUSDPairPrices(USDPairAssets[0]["name"]);
    const ethpairPrice = await getETHPairPrices(ETHPairAssets[0]["name"]);
    setSelectedUSDPairPriceTag(usdPairPrice);
    setSelectedETHPairPriceTag(ethpairPrice);
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
    setSelectedETHPairPriceTag(newETHPairPrice);
    setSelectedETHPair(selectedCurrencyIndex);
  };

  return (
    <CryptoPriceFeedsPageContext.Provider
      value={{
        USDPairAssets,
        ETHPairAssets,
        selectedUSDPair,
        setSelectedUSDPair,
        selectedETHPair,
        setSelectedETHPair,
        changeUSDPair,
        changeETHPair,
        selectedUSDPairPriceTag,
      }}>
      {props.children}
    </CryptoPriceFeedsPageContext.Provider>
  );
};

export default CryptoPriceFeedsPageContextProvider;
