import React, { useState, useEffect, useContext } from "react";

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
import { CryptoPriceFeedsPageContext } from "../../../../context/PriceFeedsPageContext";
import { DaiContractContext } from "../../../../context/daiContractContext";
import { PachisiCryptoPredictionContractContext } from "../../../../context/pachisiCryptoPredictionContract";
import { Web3Context } from "../../../../context/web3Context";
import { NFTCatContractContext } from "../../../../context/NFTContext/nftCatContractContext";

const USDPairCard = () => {
  const [selectedSymbol, setSelectedSymbol] = useState("<");
  const {
    selectedUSDPairPriceTag,
    USDPairAssets,
    selectedUSDPair,
  } = useContext(CryptoPriceFeedsPageContext);

  const { getCatBalance, getCatUserTokens } = useContext(NFTCatContractContext);

  const { userAddress, web3 } = useContext(Web3Context);

  const [date, setStartDate] = useState(new Date());
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
            <Card.Title className="price-feeds-card-title">USD Pair</Card.Title>
            <Card.Subtitle className="price-feeds-card-subtitle">
              This is price pair of all the listed assets with USD.
            </Card.Subtitle>
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
            <Button
              onClick={async () => {
                const balance = await getCatBalance(userAddress);
                console.log(balance);
              }}>
              TEST
            </Button>
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

const SupportedNFTsDropDown = (props) => {
  const dropDownSymbolList = props.supportedNFTContracts.map(
    (supportedNFTContract, index) => {
      return (
        <Dropdown.Item
          key={index}
          eventKey={index}
          onSelect={() => {
            props.switchSupportedNFTContracts(index);
          }}>
          {supportedNFTContract["name"]}
        </Dropdown.Item>
      );
    }
  );

  return (
    <DropdownButton
      id="dropdown-basic-button"
      title={
        props.supportedNFTContracts[props.selectedSupportedNFTContract]["name"]
      }>
      {dropDownSymbolList}
    </DropdownButton>
  );
};

const UserTokensDropDown = (props) => {
  const dropDownUserTokens = props.userTokens.map((userToken, index) => {
    return (
      <Dropdown.Item
        key={index}
        eventKey={index}
        onSelect={() => {
          props.switchUserTokenIndex(index);
        }}>
        {userToken}
      </Dropdown.Item>
    );
  });

  return (
    <DropdownButton
      id="dropdown-basic-button"
      title={
        props.userTokens[props.userTokenIndex]
          ? props.userTokens[props.userTokenIndex]
          : "No Tokens Owned"
      }>
      {dropDownUserTokens}
    </DropdownButton>
  );
};

export default USDPairCard;
