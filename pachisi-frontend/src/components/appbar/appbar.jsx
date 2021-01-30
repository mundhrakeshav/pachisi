import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import "./appbar.css";
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

const AppBar = () => {
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
          0xD98B11c92aFC66Dd45E540A1AC17Bdf60beB2d18
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
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default AppBar;
