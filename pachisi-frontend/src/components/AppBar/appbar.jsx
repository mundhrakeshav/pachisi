import React, { useState, useContext } from "react";
import "./appbar.css";
import { Link } from "react-router-dom";
import { Navbar, Nav, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { CgProfile } from "react-icons/cg";
import { Web3Context } from "../../context/web3Context";

const AppBar = () => {
  const { connectMetamask, userAddress } = useContext(Web3Context);

  return (
    <Navbar expand="lg" className="appbar" variant="dark">
      <b>
        <Navbar.Brand href="/" className="appbar-brand">
          पचीसी
        </Navbar.Brand>
      </b>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto nav">
          <Nav.Link>
            <Link to="/sport/cricket" className="nav-button">
              Sports
            </Link>
          </Nav.Link>

          <Nav.Link>
            <Link to="/price/crypto" className="nav-button">
              PriceFeeds
            </Link>
          </Nav.Link>

          <Nav.Link>
            <Link to="/number" className="nav-button">
              Numbers
            </Link>
          </Nav.Link>
          <Nav.Link>
            <Link to="/custom" className="nav-button">
              Custom
            </Link>
          </Nav.Link>
          <Nav.Item className="nav-item">
            <Button
              size="sm"
              variant="secondary"
              className="connect-wallet-button"
              onClick={connectMetamask}>
              <strong>{!userAddress ? "Connect Wallet" : "Connected"}</strong>
            </Button>{" "}
          </Nav.Item>
          <OverlayTrigger
            key="user-address-tooltip"
            placement="left"
            overlay={
              <Tooltip id={"user-address-tooltip"}>{userAddress}</Tooltip>
            }>
            <Nav.Link>
              <Link to="/profile" className="nav-button">
                <CgProfile />
              </Link>
            </Nav.Link>
          </OverlayTrigger>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default AppBar;
