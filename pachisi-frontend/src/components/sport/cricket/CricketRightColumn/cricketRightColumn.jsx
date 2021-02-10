import React, { useState, useEffect, useContext } from "react";
import { Web3Context } from "../../../../context/web3Context";
import { ProviderModalContext } from "../../../../context/providerModalContext";
import dai from "../../../../contracts/dai";
import CricketPachisi from "../../../../contracts/CricketPachisi";
import { Button, Col, Row } from "react-bootstrap";
const CricketRightColumn = () => {
  const { setModalShow } = useContext(ProviderModalContext);
  const { web3ConnectStatus, userAddress, signTx } = useContext(Web3Context);
  const [daiContract, setDaiContract] = useState({});
  useEffect(() => {
    console.log("UseEffect From appbar");
    setDaiContract(dai.contract);
  });
  const approveDai = async () => {
    if (userAddress) {
      const amount = prompt("How much dai you wanna approve?");
      if (amount) {
        console.log(daiContract.methods);
        const nonce = await daiContract.methods.getNonce(userAddress).call();
        console.log(nonce);
        const daiContractName = dai.contractName;
        //TODO update hardcoded address
        const functionSignature = daiContract.methods
          .approve(
            CricketPachisi.contractAddress,
            (parseInt(amount) * 10 ** 18).toString()
          )
          .encodeABI();
        console.log(functionSignature);
        signTx(
          daiContractName,
          dai.contractAddress,
          nonce,
          functionSignature,
          daiContract
        );
      }
    } else {
      alert("Please initialize web3 connection.");
    }
  };
  return (
    <Row>
      <Col>
        <Button variant="secondary" onClick={approveDai}>
          Approve Dai for Cricket
        </Button>
      </Col>
    </Row>
  );
};

export default CricketRightColumn;
