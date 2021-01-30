import { Col, Container, Row } from "react-bootstrap";
import "./homepage.css";
import LeftColumn from "./LeftColumn/leftColumn";
const HomePage = () => {
  return (
    <Row>
      <Col xl={3} className="left-column column-wrapper">
        <LeftColumn />
      </Col>
      <Col xl={7} className="middle-column column-wrapper">
        Keshav Right
      </Col>
    </Row>
  );
};

export default HomePage;
