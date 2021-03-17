import React, { useState, useEffect, useContext } from "react";
import {
  Card,
  Row,
  Col,
  InputGroup,
  FormControl,
  Button,
} from "react-bootstrap";
import { DaiContractContext } from "../../../context/daiContractContext";
import { Web3Context } from "../../../context/web3Context";

const ApproveDaiCard = () => {
  const { approveDaiContract, getAllowance } = useContext(DaiContractContext);
  const { userAddress } = useContext(Web3Context);
  const [amount, setAmount] = useState("");

  return (
    <div className="approve-dai-card-wrapper">
      <Card className="approve-dai-card">
        <Card.Title>
          <div>
            <Row>
              <Col>
                <InputGroup className="mb-3">
                  <FormControl
                    placeholder="How much dai you wanna approve?"
                    aria-label="How much dai you wanna approve?"
                    aria-describedby="basic-addon2"
                    type="number"
                    onChange={(event) => {
                      setAmount(event.target.value);
                    }}
                  />
                  <InputGroup.Append>
                    <InputGroup.Text id="basic-addon2">DAI</InputGroup.Text>
                  </InputGroup.Append>
                </InputGroup>
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
                    if (userAddress) {
                      approveDaiContract(amount, userAddress);
                    } else {
                      alert("Allow web3 access");
                    }
                  }}>
                  Approve
                </Button>
              </Col>
            </Row>
          </div>
        </Card.Title>
      </Card>
    </div>
  );
};

export default ApproveDaiCard;
