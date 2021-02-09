import React, { useContext, useEffect, useState } from "react";
import { Navbar, Nav, Spinner } from "react-bootstrap";
import { ProviderModalContext } from "../../context/providerModalContext";
import { Web3Context } from "../../context/web3Context";
import dai from "../../contracts/dai";
import "./appbar.css";
import { Button } from "react-bootstrap";

import { Link } from "react-router-dom";

const AppBar = () => {
  const { setModalShow } = useContext(ProviderModalContext);
  const { web3ConnectStatus, userAddress, signTx } = useContext(Web3Context);
  const [daiContract, setDaiContract] = useState({});
  useEffect(() => {
    console.log("UseEffect From appbar");
    setDaiContract(dai.contract);
  });

  const web3ProviderName = () => {
    if (web3ConnectStatus === 0) {
      return "Not Connected";
    } else if (web3ConnectStatus === 1) {
      return "MetaMask";
    } else if (web3ConnectStatus === 0) {
      return "Portis";
    }
  };

  return (
    <Navbar bg="dark" expand="lg" variant="dark">
      <b>
        <Navbar.Brand href="#home" className="appbar-brand">
          पचीसी
        </Navbar.Brand>
      </b>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="user-address">
          {userAddress ? userAddress : <Spinner animation="border" />}
        </Nav>
        <Nav className="ml-auto">
          <Nav.Link>
            <Link to="/home" className="nav-button">
              Home
            </Link>
          </Nav.Link>

          <Nav.Link>
            <Link to="/numbers" className="nav-button">
              Play With Numbers
            </Link>
          </Nav.Link>

          <Nav.Link>
            <Link to="/sports/cricket" className="nav-button">
              Sports
            </Link>
          </Nav.Link>

          <Nav.Link>
            <Link to="/prices" className="nav-button">
              Price Prediction
            </Link>
          </Nav.Link>

          <Nav.Link>
            <Link to="/weather" className="nav-button">
              Weather
            </Link>
          </Nav.Link>
          <Nav.Link>
            <Link to="/" className="nav-button">
              <Button variant="secondary" onClick={() => {}}>
                Your Predicitions
              </Button>
            </Link>
          </Nav.Link>

          <Nav.Item className="nav-item">
            <Button
              variant="secondary"
              onClick={() => {
                setModalShow(true);
              }}>
              {web3ProviderName()}
            </Button>
          </Nav.Item>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default AppBar;
