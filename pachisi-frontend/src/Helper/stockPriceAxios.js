import axios from "axios";

const getStockPrices = async (selectedStock) => {
  const response = await axios.get(
    `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${selectedStock}&apikey=EHZZFEOMSTGL3I2V`
  );
  console.log(response.data, "response");
  return response.data;
};
// getStockPrices("AAPL");
export { getStockPrices };
