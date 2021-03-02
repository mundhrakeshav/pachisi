import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";

const UsdPairCard = () => {
  return (
    <Row className="price-feeds-right-ui-wrapper">
      <Col>
        <Card className="price-feeds-card">
          <Card.Body>
            <Card.Title>USD Pair</Card.Title>
            <Card.Subtitle>
              This is price pair of all the listed assets with USD.
            </Card.Subtitle>
            <br />
            <Row>
              {" "}
              <Col>
                <DropDownButtonUsdpair />
              </Col>
              <Col>{"012 USD"}</Col>
            </Row>{" "}
            <br />
            <Button variant="primary">Go somewhere</Button>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

const DropDownButtonUsdpair = () => {
  return (
    <DropdownButton id="dropdown-basic-button" title="Dropdown button">
      <Dropdown.Item
        eventKey="1"
        onSelect={(eventKey) => {
          console.log(eventKey);
        }}>
        Action
      </Dropdown.Item>
      <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
      <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
    </DropdownButton>
  );
};

export default UsdPairCard;
