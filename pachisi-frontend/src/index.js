import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Web3ContextProvider from "./context/web3Context";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import LotteryContractContextProvider from "./context/lotteryPredictionContext";
import PachisiCryptoBetProvider from "./context/pachisiCryptoBetContext";
import DaiContractContextProvider from "./context/daiContractContext";
import CryptoPriceFeedsPageContextProvider from "./context/PriceFeedsPageContext";
import PachisiCryptoPredictionContractContextProvider from "./context/pachisiCryptoPredictionContract";
import StockPriceFeedsPageContextProvider from "./context/StockPriceFeedsPageContext";
import PachisiStockPredictionContractContextProvider from "./context/pachisiStockPredicitonContext";
import PachisiStockBetContextProvider from "./context/pachisiStockBetContext";

ReactDOM.render(
  <Web3ContextProvider>
    <StockPriceFeedsPageContextProvider>
      <PachisiStockBetContextProvider>
        <PachisiStockPredictionContractContextProvider>
          <PachisiCryptoBetProvider>
            <DaiContractContextProvider>
              <CryptoPriceFeedsPageContextProvider>
                <PachisiCryptoPredictionContractContextProvider>
                  <LotteryContractContextProvider>
                    <App />
                  </LotteryContractContextProvider>{" "}
                </PachisiCryptoPredictionContractContextProvider>
              </CryptoPriceFeedsPageContextProvider>
            </DaiContractContextProvider>
          </PachisiCryptoBetProvider>{" "}
        </PachisiStockPredictionContractContextProvider>
      </PachisiStockBetContextProvider>
    </StockPriceFeedsPageContextProvider>
  </Web3ContextProvider>,

  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

/*
Sports
  Soccer
  Cricket
  Basket Ball
Price Feeds
  Crypto Prices
  Stocks
  Forex
Number Games
  Odd or Even
  7 Up/ 7 Down
Custom Questions
  Anything with a particular field tag.
  Sports
  Politics
  Weather
*/
