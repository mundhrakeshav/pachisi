import React, { useState, useEffect, useContext } from "react";
import { Button } from "react-bootstrap";
import { PachisiCryptoPredictionContractContext } from "../../../../context/pachisiCryptoPredictionContract";
import { CryptoPriceFeedsPageContext } from "../../../../context/PriceFeedsPageContext";
import BetCards from "./BetCard/betCards";

const BetList = () => {
  const { getUSDTokenBetsAddresses, getETHTokenBetsAddresses } = useContext(
    PachisiCryptoPredictionContractContext
  );
  const { USDPairAssets, ETHPairAssets } = useContext(
    CryptoPriceFeedsPageContext
  );
  const [USDPairBetAddressList, setUSDPairBetAddressList] = useState([]);
  const [ETHPairBetAddressList, setETHPairBetAddressList] = useState([]);
  useEffect(async () => {
    await init();
  }, []);

  const init = async () => {
    const _usdAddressArray = await getUSDTokenBetsAddresses();
    const _ethAddressArray = await getETHTokenBetsAddresses();

    console.log(_usdAddressArray, _ethAddressArray);
    setUSDPairBetAddressList(_usdAddressArray);
    setETHPairBetAddressList(_ethAddressArray);
  };

  return (
    <div>
      <BetCards
        USDAddressArray={USDPairBetAddressList}
        ETHAddressArray={ETHPairBetAddressList}
      />
    </div>
  );
};

export default BetList;
