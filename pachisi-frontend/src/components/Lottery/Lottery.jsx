import React, { useState, useEffect, useContext } from "react";
import { Button } from "react-bootstrap";
import LotteryContractContextProvider, {
  LotteryContractContext,
} from "../../context/lotteryPredictionContext";
import ApproveDaiCard from "../PriceFeeds/CryptoPriceFeedsUi/approveDaiComponent";
import LotteryBetCards from "./LotteryBetCards";

const LotteryPage = () => {
  const { getCreatedBets, getBetDetails } = useContext(LotteryContractContext);
  const [createdBets, setCreatedBets] = useState([]);
  useEffect(async () => {
    init();
  }, []);
  const init = async () => {
    const createdBets = await getCreatedBets();

    setCreatedBets(createdBets);
  };
  return (
    <div>
      Lottery
      <ApproveDaiCard />
      <LotteryBetCards bets={createdBets} />
    </div>
  );
};

export default LotteryPage;
