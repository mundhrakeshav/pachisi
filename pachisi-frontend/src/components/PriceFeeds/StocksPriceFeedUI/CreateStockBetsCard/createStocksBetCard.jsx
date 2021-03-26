import React, { useState, useEffect, useContext } from "react";
import { StockPriceFeedsPageContext } from "../../../../context/stockBetCardContext";
import { Web3Context } from "../../../../context/web3Context";
import { DaiContractContext } from "../../../../context/daiContractContext";
import DatePicker from "react-datepicker";

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

import "react-datepicker/dist/react-datepicker.css";
import config from "../../../../config";
import "./createStockBetCard.css";

const CreateStockBetCard = () => {
  const symbols = [">", "<"];
  const [date, setDate] = useState(new Date());
  const [selectedSymbol, setSelectedSymbol] = useState("<");
  const [predictedPrice, setPredictedPrice] = useState(0);
  const [initialBetAmount, setInitialBetAmount] = useState(0);

  const { userAddress, web3 } = useContext(Web3Context);

  const { approveDaiContract, getAllowance, getBalance } = useContext(
    DaiContractContext
  );

  const {
    selectedStockPair,
    selectedStockPairPriceTag,
    StockAssets,
  } = useContext(StockPriceFeedsPageContext);

  useEffect(() => {
    console.log(StockAssets[selectedStockPair]);
  });

  const switchSymbol = (index) => {
    setSelectedSymbol(symbols[index]);
  };

  return (
    <div className="pair-card-wrapper">
      <Row className="price-feeds-right-ui-wrapper">
        <Col>
          <Card className="price-feeds-card">
            <Card.Body>
              <Card.Title className="price-feeds-card-title">Stock</Card.Title>
            </Card.Body>{" "}
            <br />
            <Row>
              <Col>
                <DropDownButtonStocks />
              </Col>
              <Col>
                <b>{"Current Price: " + selectedStockPairPriceTag + " USD"}</b>
              </Col>
            </Row>
            <br />
            <Row>
              <Col xs="5" className="date-picker">
                <b>
                  {`Price of ${StockAssets[selectedStockPair]["name"]} on `}
                  <DatePicker
                    selected={date}
                    onChange={(_date) => setDate(_date)}
                    minDate={new Date()}
                    showTimeSelect
                    placeholderText="Select a date."
                    dateFormat="MMMM d, yyyy h:mm aa"
                  />
                  {` is`}
                </b>
              </Col>
              <Col xs="2">
                <SymbolDropDown
                  selectedSymbol={selectedSymbol}
                  switchSymbol={switchSymbol}
                  symbols={symbols}
                />
              </Col>
              <Col xs="5">
                <InputGroup className="mb-3">
                  <FormControl
                    placeholder="Predicted Price"
                    aria-label="Amount (to the nearest dollar)"
                    type="number"
                    value={predictedPrice}
                    onChange={(event) => {
                      setPredictedPrice(event.target.value);
                    }}
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
                    value={initialBetAmount}
                    onChange={(event) => {
                      setInitialBetAmount(event.target.value);
                    }}
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
                  }}
                  onClick={(event) => {
                    console.log(
                      date.getTime(),
                      StockAssets[selectedStockPair]["name"],
                      selectedSymbol,
                      predictedPrice,
                      initialBetAmount,
                      userAddress
                    );
                  }}>
                  Create Market
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

const DropDownButtonStocks = (props) => {
  const {
    selectedStockPair,
    selectedStockPairPriceTag,
    StockAssets,
    changeSelectedStock,
  } = useContext(StockPriceFeedsPageContext);
  console.log(StockAssets, "StockAssets");
  const dropDownItemList = StockAssets.map((StockAsset, index) => {
    console.log(StockAsset, "StockAsset");

    return (
      <Dropdown.Item
        key={index}
        eventKey={index}
        onSelect={() => {
          changeSelectedStock(index);
        }}>
        {StockAsset["name"]}
      </Dropdown.Item>
    );
  });

  return (
    <DropdownButton
      id="dropdown-basic-button"
      title={StockAssets[selectedStockPair]["name"]}>
      {dropDownItemList}
    </DropdownButton>
  );
};

const SymbolDropDown = (props) => {
  const dropDownSymbolList = props.symbols.map((symbol, index) => {
    return (
      <Dropdown.Item
        key={index}
        eventKey={index}
        onSelect={() => {
          props.switchSymbol(index);
        }}>
        {symbol}
      </Dropdown.Item>
    );
  });

  return (
    <DropdownButton id="dropdown-basic-button" title={props.selectedSymbol}>
      {dropDownSymbolList}
    </DropdownButton>
  );
};
export default CreateStockBetCard;
