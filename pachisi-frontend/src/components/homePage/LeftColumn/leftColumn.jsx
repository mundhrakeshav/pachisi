import React from "react";
import { Container, Row, Button } from "react-bootstrap";
import {
  FaHome,
  FaUser,
  FaNewspaper,
  FaBlogger,
  FaUpload,
  FaMoneyBillAlt,
  FaLock,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import "./leftColumn.css";

const LeftColumn = () => {
  return (
    <Container className="left-column-container">
      <Row className="left-column-row">
        <Link to="/">
          <Button variant="secondary" className="left-column-button">
            <FaHome /> Home
          </Button>
        </Link>
      </Row>
      <Row>
        <Link to="/numbers">
          <Button variant="secondary" className="left-column-button">
            <FaUser /> Play With Numbers
          </Button>
        </Link>
      </Row>
      <Row>
        <Link to="/roulette">
          <Button variant="secondary" className="left-column-button">
            <FaBlogger /> Roulette
          </Button>
        </Link>
      </Row>{" "}
      <Row>
        <Link to="/sports">
          <Button variant="secondary" className="left-column-button">
            <FaNewspaper /> Sports
          </Button>
        </Link>
      </Row>{" "}
      <Row>
        <Link to="/prices">
          <Button variant="secondary" className="left-column-button">
            <FaLock /> Price Prediction
          </Button>
        </Link>
      </Row>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <Row>
        <Link to="/add">
          <Button variant="secondary" className="left-column-button">
            <FaUpload /> Add
          </Button>
        </Link>
      </Row>
    </Container>
  );
};

export default LeftColumn;
