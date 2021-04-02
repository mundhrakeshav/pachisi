import EthPairCard from "./cards/ethPairCard";
import UsdPairCard from "./cards/usdPairCard";
import ApproveDaiCard from "./approveDaiComponent";
import "./priceFeedsUI.css";
import BetList from "./BetList/betList";

const CryptoPriceFeedsRightUI = () => {
  return (
    <div>
      <ApproveDaiCard />
      <UsdPairCard />
      <EthPairCard />
      <BetList />
    </div>
  );
};

export default CryptoPriceFeedsRightUI;
