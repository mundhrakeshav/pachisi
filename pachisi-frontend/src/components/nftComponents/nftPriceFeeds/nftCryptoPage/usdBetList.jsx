import React, { useState, useEffect, useContext } from "react";
import {
  Card,
  Row,
  Col,
  Dropdown,
  Button,
  DropdownButton,
  Spinner,
} from "react-bootstrap";
import { NFTCatContractContext } from "../../../../context/NFTContext/nftCatContractContext";
import { NFTCryptoBetContext } from "../../../../context/NFTContext/nftCryptoBetContext";
import { NFTDogContractContext } from "../../../../context/NFTContext/nftDogContractContext";
import { NFTPredictionContractContext } from "../../../../context/NFTContext/nftPredictionContext";
import { Web3Context } from "../../../../context/web3Context";
import config from "./../../../../config";

const USDBetNFTList = (props) => {
  const usdBetList = props.usdBetAddresses.map((usdBetAddress, index) => {
    return <USDBetNFTCard key={index} usdBetAddress={usdBetAddress} />;
  });

  return (
    <div>
      <br />
      {usdBetList}
    </div>
  );
};

const USDBetNFTCard = (props) => {
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
  const [data, setDate] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [initialiserBetDetails, setInitialiserBetDetails] = useState({});
  const [secondaryBetDetails, setSecondaryBetDetails] = useState({});
  const [
    selectedSupportedNFTContract,
    setSelectedSupportedNFTContract,
  ] = useState(0);

  const { createUSDBet, getUSDBets, agreeBet, denyBet } = useContext(
    NFTPredictionContractContext
  );
  const [tokenDetails, setTokenDetails] = useState({});

  const [userTokens, setUserTokens] = useState([]);
  const [userTokenIndex, setUserTokensIndex] = useState(0);

  const { getData } = useContext(NFTCryptoBetContext);
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

  useEffect(async () => {
    const _data = await getData(props.usdBetAddress);
    console.log(_data, "DTA");

    if (_data.data.initialiserBet.assetNFTAddress == config.dogNFTContract) {
      const details = await getDogTokenDetails(
        _data.data.initialiserBet.tokenID
      );

      setInitialiserBetDetails(details);
    } else {
      const details = await getCatTokenDetails(
        _data.data.initialiserBet.tokenID
      );
      setInitialiserBetDetails(details);
    }

    if (parseInt(_data.data.betStage) != 1) {
      if (_data.data.secondaryBet.assetNFTAddress == config.dogNFTContract) {
        const details = await getDogTokenDetails(
          _data.data.secondaryBet.tokenID
        );

        setSecondaryBetDetails(details);
      } else {
        const details = await getCatTokenDetails(
          _data.data.secondaryBet.tokenID
        );

        setSecondaryBetDetails(details);
      }
    }

    // data.secondaryBet;
    setDate(_data.data);
    await getUserTokens();
    setIsLoading(false);
  }, []);

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

  const _agreeBet = () => {
    agreeBet(
      supportedNFTContracts[selectedSupportedNFTContract]["address"],
      userTokens[userTokenIndex],
      props.usdBetAddress,
      userAddress
    );
  };

  const _claimFunds = () => {};
  const _denyBet = () => {
    denyBet(props.usdBetAddress, userAddress);
  };
  const _finaliseBet = () => {};

  if (!isLoading) {
    return (
      <div>
        <Card>
          <Card.Title>{data.betToken + "/" + data.betPair}</Card.Title>
          <Card.Subtitle>
            {"Predicted price of " + data.betToken}{" "}
            {data.symbol == 0x3c ? "<" : ">"} {data.predictionPrice / 10 ** 10}
          </Card.Subtitle>

          <Row>
            <Col>
              <b>Asset Details</b>
              <br />
              {"Name: " + initialiserBetDetails.name}
              <br />
              {"MintTime: " + initialiserBetDetails.mintTime}
            </Col>
            <Col>
              {data.betStage == 1 ? (
                <div>
                  <Row>
                    {" "}
                    <Col>
                      <SupportedNFTsDropDown
                        supportedNFTContracts={supportedNFTContracts}
                        switchSupportedNFTContracts={
                          switchSupportedNFTContracts
                        }
                        selectedSupportedNFTContract={
                          selectedSupportedNFTContract
                        }
                      />
                    </Col>
                    <Col>
                      <UserTokensDropDown
                        userTokens={userTokens}
                        userTokenIndex={userTokenIndex}
                        switchUserTokenIndex={switchUserTokenIndex}
                      />
                    </Col>
                  </Row>

                  <Button onClick={_agreeBet}>Agree Bet</Button>
                </div>
              ) : (
                <div>
                  <b>Asset Details</b>
                  <br />
                  {"Name: " + secondaryBetDetails.name}
                  <br />
                  {"MintTime: " + secondaryBetDetails.mintTime}
                </div>
              )}
            </Col>
          </Row>
          {data.betStage == 2 ? (
            <Row>
              <Col>
                <Button
                  onClick={() => {
                    _denyBet();
                  }}
                  style={{
                    borderRadius: "10px",
                    height: "5vh",
                    backgroundColor: "#340068",
                    border: "1px solid #340068",
                    boxShadow: "10px 10px 8px #888888",
                  }}>
                  Deny Bet
                </Button>
              </Col>
              <Col>
                <Button
                  style={{
                    borderRadius: "10px",
                    height: "5vh",
                    backgroundColor: "#340068",
                    border: "1px solid #340068",
                    boxShadow: "10px 10px 8px #888888",
                  }}>
                  Finalise Bet
                </Button>
              </Col>
            </Row>
          ) : data.betStage != 1 ? (
            <Button
              style={{
                borderRadius: "10px",
                height: "5vh",
                backgroundColor: "#340068",
                border: "1px solid #340068",
                boxShadow: "10px 10px 8px #888888",
              }}>
              Claim Funds
            </Button>
          ) : (
            <div></div>
          )}
        </Card>
        <br />
      </div>
    );
  } else {
    return <Spinner animation="border" />;
  }
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
export default USDBetNFTList;
