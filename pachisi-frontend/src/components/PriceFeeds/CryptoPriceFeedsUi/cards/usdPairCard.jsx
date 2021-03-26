import React, { useState, useEffect, useContext } from "react";
import { CryptoPriceFeedsPageContext } from "../../../../context/PriceFeedsPageContext";
import { PachisiCryptoPredictionContractContext } from "../../../../context/pachisiCryptoPredictionContract";
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

const UsdPairCard = () => {
  const {
    selectedUSDPairPriceTag,
    USDPairAssets,
    selectedUSDPair,
  } = useContext(CryptoPriceFeedsPageContext);

  const { createUSDBet } = useContext(PachisiCryptoPredictionContractContext);
  const { userAddress, web3 } = useContext(Web3Context);
  const { approveDaiContract, getAllowance, getBalance } = useContext(
    DaiContractContext
  );

  const [selectedSymbol, setSelectedSymbol] = useState("<");
  const [date, setStartDate] = useState(new Date());
  const [initialBetAmount, setInitialBetAmount] = useState(0);
  const [predictedPrice, setPredictedPrice] = useState(0);

  const symbols = [">", "<"];
  const switchSymbol = (index) => {
    setSelectedSymbol(symbols[index]);
  };

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
                    onClick={async () => {
                      if (!userAddress) {
                        alert("Please allow web3 access");
                        return;
                      }

                      const agreement = window.confirm(
                        `You are predicting price of ${USDPairAssets[selectedUSDPair]["name"]} on ${date} to be ${selectedSymbol} ${predictedPrice} and your initial bet is ${initialBetAmount}.`
                      );
                      if (agreement) {
                        const balance = await getBalance(userAddress);
                        const allowance = await getAllowance(userAddress);

                        console.log(balance);
                        if (
                          parseInt(balance) <
                          parseInt(
                            web3.utils.toWei(initialBetAmount.toString())
                          )
                        ) {
                          alert(
                            `Insufficient Balance. Your balance is ${
                              balance / 10 ** 18
                            }`
                          );
                          return;
                        }
                        if (
                          parseInt(allowance) <
                          parseInt(
                            web3.utils.toWei(initialBetAmount.toString())
                          )
                        ) {
                          alert(
                            `Insufficient allowance. Your allowance is ${
                              allowance / 10 ** 18
                            }`
                          );
                          return;
                        }
                        console.log(
                          date.getTime(),
                          USDPairAssets[selectedUSDPair]["name"],
                          selectedSymbol,
                          predictedPrice,
                          initialBetAmount,
                          userAddress
                        );
                        createUSDBet(
                          date.getTime(),
                          USDPairAssets[selectedUSDPair]["name"],
                          selectedSymbol,
                          predictedPrice,
                          initialBetAmount,
                          userAddress
                        );
                      }
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
