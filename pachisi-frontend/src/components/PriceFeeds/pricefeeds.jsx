import { Row, Col } from "react-bootstrap";
import LeftColumnPriceFeeds from "./LeftColumn/leftColumn";
import CryptoPriceFeedsRightUI from "./CryptoPriceFeedsUi/priceFeedsUI";
import { Route, Switch } from "react-router-dom";
import StocksPriceFeedUI from "./StocksPriceFeedUI/stocksPriceFeedUi";

const PriceFeedsPage = () => {
  return (
    <div>
      <Row>
        <Col xs={3}>
          <LeftColumnPriceFeeds />
        </Col>
        <Col xs={9}>
          <Switch>
            <Route
              path="/price/crypto"
              component={CryptoPriceFeedsRightUI}
              exact
            />
            <Route path="/price/stocks" component={StocksPriceFeedUI} exact />
          </Switch>
        </Col>
      </Row>
    </div>
  );
};

export default PriceFeedsPage;
