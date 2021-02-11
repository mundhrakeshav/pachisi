import { Col, Container, Row } from "react-bootstrap";
import Switch from "react-bootstrap/esm/Switch";
import { Route } from "react-router-dom";
import "./homepage.css";
import LeftColumn from "./LeftColumn/leftColumn";
import MyPrices from "./myPrices/myPrices";
const HomePage = () => {
  return (
    <Row>
      <Col xl={3} className="left-column column-wrapper">
        <LeftColumn />
      </Col>
      <Col xl={9} className="middle-column column-wrapper">
        {" "}
        <Switch>
          <Route path="/home/myprices" component={MyPrices} />
          {/* <Route path="/sports/football" component={FootBall} exact />
          <Route path="/sports/basketball" component={BasketBall} exact /> */}
        </Switch>
      </Col>
    </Row>
  );
};

export default HomePage;
