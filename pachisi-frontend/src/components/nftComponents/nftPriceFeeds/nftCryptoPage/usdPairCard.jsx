import React, { useState, useEffect, useContext } from "react";

import DatePicker from "react-datepicker";
import USDBetNFTList from "./usdBetList";
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
import { Web3Context } from "../../../../context/web3Context";
import { NFTCatContractContext } from "../../../../context/NFTContext/nftCatContractContext";
import { NFTDogContractContext } from "../../../../context/NFTContext/nftDogContractContext";
import { NFTPredictionContractContext } from "../../../../context/NFTContext/nftPredictionContext";

const USDPairCard = () => {
  const supportedNFTContracts = [
    {
      name: "CryptoKit",
      address: "0x3385d9Ae9EB2A6735b5395E0eD9a121035E0b633",
    },
    {
      name: "CryptoDog",
      address: "0x46cfaA11e227431433D1F7c357d8BF45860a6655",
    },
  ];

  const [selectedSymbol, setSelectedSymbol] = useState("<");

  const {
    selectedUSDPairPriceTag,
    USDPairAssets,
    selectedUSDPair,
  } = useContext(CryptoPriceFeedsPageContext);

  const {
    getCatBalance,
    getCatUserTokens,
    getCatTokenDetails,
    approveCat,
  } = useContext(NFTCatContractContext);

  const {
    getDogBalance,
    getDogUserTokens,
    getDogTokenDetails,
    approveDog,
  } = useContext(NFTDogContractContext);

  const { userAddress, web3 } = useContext(Web3Context);

  const { createUSDBet, getUSDBets, agreeBet } = useContext(
    NFTPredictionContractContext
  );

  const [date, setStartDate] = useState(new Date());
  const [predictedPrice, setPredictedPrice] = useState(0);

  const [
    selectedSupportedNFTContract,
    setSelectedSupportedNFTContract,
  ] = useState(0);
  const [usdBetAddresses, setUsdBetAddresses] = useState([]);

  const [tokenDetails, setTokenDetails] = useState({});

  const [userTokens, setUserTokens] = useState([]);
  const [userTokenIndex, setUserTokensIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const symbols = [">", "<"];
  const switchSymbol = (index) => {
    setSelectedSymbol(symbols[index]);
  };

  const switchSupportedNFTContracts = async (index) => {
    getUserTokens(index);
    setSelectedSupportedNFTContract(index);
  };

  const switchUserTokenIndex = async (index) => {
    setUserTokensIndex(index);
  };

  const getUserTokens = async (index) => {
    if (index === 0) {
      const _userTokens = await getCatUserTokens(userAddress);
      setUserTokensIndex(0);
      setUserTokens(_userTokens);
    } else {
      const _userTokens = await getDogUserTokens(userAddress);
      setUserTokensIndex(0);
      setUserTokens(_userTokens);
    }
  };

  const getUSDBetAddresses = async () => {
    const usdBetAddresess = await getUSDBets();
    console.log(usdBetAddresess, "usdBetAddresess");
    setUsdBetAddresses(usdBetAddresess);
  };

  const init = async () => {
    await getUSDBetAddresses();
    await getUserTokens();
    setIsLoading(false);
  };

  useEffect(() => {
    init();
  }, []);

  const _createUSDBet = (
    _betToken,
    _betResolveTime,
    _predictionPrice,
    _betSymbol,
    _assetNFTAddress,
    _tokenID
  ) => {
    console.log(
      _betToken,
      _betResolveTime,
      _predictionPrice,
      _betSymbol,
      _assetNFTAddress,
      _tokenID,
      userAddress
    );

    createUSDBet(
      _betToken,
      _betResolveTime,
      _predictionPrice,
      _betSymbol,
      _assetNFTAddress,
      _tokenID,
      userAddress
    );
  };

  if (!isLoading) {
    return (
      <div className="pair-card-wrapper">
        <Row className="price-feeds-right-ui-wrapper">
          <Col>
            <Card className="price-feeds-card">
              <Card.Title className="price-feeds-card-title">
                USD Pair
              </Card.Title>
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
              <Row>
                <Col>
                  <SupportedNFTsDropDown
                    supportedNFTContracts={supportedNFTContracts}
                    switchSupportedNFTContracts={switchSupportedNFTContracts}
                    selectedSupportedNFTContract={selectedSupportedNFTContract}
                  />
                </Col>
                <Col>
                  <UserTokensDropDown
                    userTokens={userTokens}
                    userTokenIndex={userTokenIndex}
                    switchUserTokenIndex={switchUserTokenIndex}
                  />
                </Col>
                <Col>
                  <Button
                    style={{
                      borderRadius: "10px",
                      width: "20vw",
                      height: "5vh",
                      backgroundColor: "#340068",
                      border: "1px solid #340068",
                      boxShadow: "10px 10px 8px #888888",
                    }}
                    onClick={() => {
                      _createUSDBet(
                        USDPairAssets[selectedUSDPair]["name"],
                        date.getTime(),
                        predictedPrice * 10 ** 10,
                        selectedSymbol,
                        supportedNFTContracts[selectedSupportedNFTContract][
                          "address"
                        ],
                        userTokens[userTokenIndex],
                        userAddress
                      );
                    }}>
                    Bet
                  </Button>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
        <USDBetNFTList usdBetAddresses={usdBetAddresses} />
      </div>
    );
  } else {
    return <div>Loading...</div>;
  }
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
