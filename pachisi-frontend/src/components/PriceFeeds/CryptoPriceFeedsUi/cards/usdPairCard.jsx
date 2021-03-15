import React, { useState, useEffect, useContext } from "react";
import { CryptoPriceFeedsPageContext } from "../../../../context/PriceFeedsPageContext";

import {
  Card,
  Row,
  Col,
  Button,
  Dropdown,
  DropdownButton,
  InputGroup,
  FormControl,
} from "react-bootstrap";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const UsdPairCard = () => {
  const {
    selectedUSDPairPriceTag,
    USDPairAssets,
    selectedUSDPair,
  } = useContext(CryptoPriceFeedsPageContext);
  const [date, setStartDate] = useState(new Date());

  return (
    <div className="pair-card-wrapper">
      <Row className="price-feeds-right-ui-wrapper">
        <Col>
          <Card className="price-feeds-card">
            <Card.Body>
              <Card.Title className="price-feeds-card-title">
                USD Pair
              </Card.Title>
              <Card.Subtitle className="price-feeds-card-subtitle">
                This is price pair of all the listed assets with USD.
              </Card.Subtitle>
              <br />
              <Row>
                <Col>
                  <DropDownButtonUSDpair />
                </Col>
                <Col>
                  <b>{"Current Price: " + selectedUSDPairPriceTag + " USD"}</b>
                </Col>
              </Row>
              <br />
              <Row>
                <Col xs="5" className="date-picker">
                  <b>
                    {`Price of ${USDPairAssets[selectedUSDPair]["name"]} on `}
                    <DatePicker
                      selected={date}
                      onChange={(_date) => setStartDate(_date)}
                      minDate={new Date()}
                      placeholderText="Select a date."
                      dateFormat="dd/MM/yyyy"
                    />
                    {` is`}
                  </b>
                </Col>
                <Col xs="2">
                  <SymbolDropDown date={date} />
                </Col>
                <Col xs="5">
                  <InputGroup className="mb-3">
                    <FormControl
                      placeholder="Predicted Price"
                      aria-label="Amount (to the nearest dollar)"
                      type="number"
                    />
                    <InputGroup.Append>
                      <InputGroup.Text>USD</InputGroup.Text>
                    </InputGroup.Append>
                  </InputGroup>
                </Col>
              </Row>
              <br />
              <Row>
                <Col>
                  <InputGroup className="mb-3">
                    <FormControl
                      placeholder="Initial bet should be greater than 20 DAI."
                      aria-label="Amount (to the nearest dollar)"
                      type="number"
                    />
                    <InputGroup.Append>
                      <InputGroup.Text>DAI</InputGroup.Text>
                    </InputGroup.Append>
                  </InputGroup>
                </Col>
                <Col>
                  <Button
                    style={{
                      borderRadius: "20px",
                      width: "20vw",
                      height: "5vh",
                      backgroundColor: "#340068",
                      border: "1px solid #340068",
                      boxShadow: "10px 10px 8px #888888",
                    }}>
                    Create Market
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

const SymbolDropDown = (props) => {
  const [selectedSymbol, setSelectedSymbol] = useState("<");
  const symbols = [">", "<"];

  const dropDownSymbolList = symbols.map((symbol, index) => {
    return (
      <Dropdown.Item
        key={index}
        eventKey={index}
        onSelect={() => {
          setSelectedSymbol(symbols[index]);
        }}>
        {symbol}
      </Dropdown.Item>
    );
  });

  return (
    <DropdownButton id="dropdown-basic-button" title={selectedSymbol}>
      {dropDownSymbolList}
    </DropdownButton>
  );
};

const DropDownButtonUSDpair = () => {
  const {
    USDPairAssets,
    selectedUSDPair,
    setSelectedUSDPair,
    changeUSDPair,
  } = useContext(CryptoPriceFeedsPageContext);
  const dropDownItemList = USDPairAssets.map((USDPairAsset, index) => {
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
      {dropDownItemList}
    </DropdownButton>
  );
};

export default UsdPairCard;
