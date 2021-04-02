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
import { NFTDogContractContext } from "../../../../context/NFTContext/nftDogContractContext";
import { Web3Context } from "../../../../context/web3Context";

import "./cryptoPage.css";

const ApproveNFTCard = () => {
  const supportedNFTContracts = [{ name: "CryptoKit" }, { name: "CryptoDog" }];
  const [
    selectedSupportedNFTContract,
    setSelectedSupportedNFTContract,
  ] = useState(0);

  const [tokenDetails, setTokenDetails] = useState({});

  const [userTokens, setUserTokens] = useState([]);
  const [userTokenIndex, setUserTokensIndex] = useState(0);

  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    setIsLoading(true);
    const userTokens = await getCatUserTokens(userAddress);
    switchUserTokenIndex(0);
    setUserTokens(userTokens);
    setIsLoading(false);
  };

  const getDogTokens = async () => {
    setIsLoading(true);
    const userTokens = await getDogUserTokens(userAddress);
    setUserTokensIndex(0);
    setUserTokens(userTokens);
    setIsLoading(false);
  };

  const approve = () => {
    console.log(selectedSupportedNFTContract);
    if (selectedSupportedNFTContract === 0) {
      approveCat(userTokenIndex, userAddress);
    } else {
      approveDog(userTokenIndex, userAddress);
    }
  };
  const switchSupportedNFTContracts = async (index) => {
    if (index === 1) {
      getDogTokens();
    } else {
      init();
    }
    setSelectedSupportedNFTContract(index);
    switchUserTokenIndex(0);
  };

  const switchUserTokenIndex = async (index) => {
    setUserTokensIndex(index);
    let _tokenDetails;
    if (selectedSupportedNFTContract === 0) {
      _tokenDetails = await getCatTokenDetails(index);
    } else {
      _tokenDetails = await getDogTokenDetails(index);
    }

    setTokenDetails(_tokenDetails);
  };
  if (!isLoading) {
    return (
      <div className="approve-nft-card-wrapper">
        <Card className="approve-nft-card">
          <Card.Title>
            <Row>
              <Col>
                <SupportedNFTsDropDown
                  supportedNFTContracts={supportedNFTContracts}
                  switchSupportedNFTContracts={switchSupportedNFTContracts}
                  selectedSupportedNFTContract={selectedSupportedNFTContract}
                />
              </Col>{" "}
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
                    approve();
                  }}>
                  Approve
                </Button>
              </Col>
            </Row>
            <Row>
              <Col>{"Name: " + tokenDetails["name"]}</Col>
            </Row>
            <Row>
              <Col>{"MintTime: " + tokenDetails["mintTime"]}</Col>
            </Row>
          </Card.Title>
        </Card>
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

export default ApproveNFTCard;
