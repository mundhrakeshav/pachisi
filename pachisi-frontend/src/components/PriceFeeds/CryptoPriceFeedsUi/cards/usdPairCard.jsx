import React, { useState, useEffect, useContext } from "react";
import { CryptoPriceFeedsPageContext } from "../../../../context/PriceFeedsPageContext";

import {
  Card,
  Row,
  Col,
  Button,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";

const UsdPairCard = () => {
  const { selectedUSDPairPriceTag } = useContext(CryptoPriceFeedsPageContext);
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
              <Col>
                <b>{selectedUSDPairPriceTag + " USD"}</b>
              </Col>
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
  const {
    USDPairAssets,
    selectedUSDPair,
    setSelectedUSDPair,
    changeUSDPair,
  } = useContext(CryptoPriceFeedsPageContext);
  const dropDownItemList = USDPairAssets.map((USDPairAsset, index) => {
    console.log(USDPairAsset);

    return (
      <Dropdown.Item
        key={index}
        eventKey={index}
        onSelect={() => {
          changeUSDPair(index);
        }}>
        {USDPairAsset["name"]}
      </Dropdown.Item>
    );
  });

  return (
    <DropdownButton
      id="dropdown-basic-button"
      title={USDPairAssets[selectedUSDPair]["name"]}>
      {/* <Dropdown.Item
        eventKey="1"
        onSelect={(eventKey) => {
          console.log(eventKey);
        }}>
        Action
      </Dropdown.Item>
      <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
      <Dropdown.Item href="#/action-3">Something else</Dropdown.Item> */}

      {dropDownItemList}
    </DropdownButton>
  );
};

export default UsdPairCard;
