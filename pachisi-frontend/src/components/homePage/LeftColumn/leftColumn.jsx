import React, { useContext } from "react";
import { Container, Row, Button } from "react-bootstrap";
import {
  FaHome,
  FaUser,
  FaNewspaper,
  FaBlogger,
  FaUpload,
  FaLock,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { Web3Context } from "../../../context/web3Context";
import "./leftColumn.css";
import testContract from "../../../contracts/testContract";

const LeftColumn = () => {
  const { web3, userAddress } = useContext(Web3Context);

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
        <Link to="/home/myprices">
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
      <Row>
        <Button
          variant="secondary"
          className="left-column-button"
          onClick={() => {
            console.log(testContract.methods);
            testContract.methods.setDai(2000).send({ from: userAddress });
          }}>
          <FaUpload /> Add
        </Button>
      </Row>
    </Container>
  );
};

export default LeftColumn;
