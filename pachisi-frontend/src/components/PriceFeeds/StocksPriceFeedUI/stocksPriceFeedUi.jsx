import React, { useState, useEffect } from "react";
import ApproveDaiCard from "./approveDaiCard";
import CreateStockBetCard from "./CreateStockBetsCard/createStocksBetCard";
import StockBetList from "./stockBetList";

const StocksPriceFeedUI = () => {
  return (
    <div>
      <ApproveDaiCard />
      <CreateStockBetCard />
      <StockBetList />
    </div>
  );
};

export default StocksPriceFeedUI;
