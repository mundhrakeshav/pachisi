import axios from "axios";
import { config } from "./../config";

const getUSDPairPrices = async (selectedCurrency) => {
  //   console.log(selectedCurrency);
  const response = await axios.get(
    `https://min-api.cryptocompare.com/data/price?fsym=${selectedCurrency}&tsyms=USD&api_key=ebbe8c0cb5d74c5f084257ca11f8589737f83c229c6c250bd8db8139b8211236`
  );

  return response.data;
};

const getETHPairPrices = async (selectedCurrency) => {
  const response = await axios.get(
    `https://min-api.cryptocompare.com/data/price?fsym=${selectedCurrency}&tsyms=ETH&api_key=ebbe8c0cb5d74c5f084257ca11f8589737f83c229c6c250bd8db8139b8211236`
  );
  //   console.log(response.data, "response");
  return response.data;
};

export { getUSDPairPrices, getETHPairPrices };
