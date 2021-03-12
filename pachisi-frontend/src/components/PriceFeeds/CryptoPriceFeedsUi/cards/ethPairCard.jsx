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

const EthPairCard = () => {
  const { selectedETHPairPriceTag } = useContext(CryptoPriceFeedsPageContext);
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
                <DropDownButtonETHpair />
              </Col>
              <Col>
                <b>{selectedETHPairPriceTag + " ETH"}</b>
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
const DropDownButtonETHpair = () => {
  const { ETHPairAssets, selectedETHPair, changeETHPair } = useContext(
    CryptoPriceFeedsPageContext
  );
  const dropDownItemList = ETHPairAssets.map((ETHPairAsset, index) => {
    console.log(ETHPairAsset);

    return (
      <Dropdown.Item
        key={index}
        eventKey={index}
        onSelect={() => {
          changeETHPair(index);
        }}>
        {ETHPairAsset["name"]}
      </Dropdown.Item>
    );
  });

  return (
    <DropdownButton
      id="dropdown-basic-button"
      title={ETHPairAssets[selectedETHPair]["name"]}>
      {dropDownItemList}
    </DropdownButton>
  );
};

export default EthPairCard;
