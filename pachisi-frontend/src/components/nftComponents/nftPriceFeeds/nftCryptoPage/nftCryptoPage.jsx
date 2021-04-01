import React, { useState, useEffect } from "react";

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
import USDPairCard from "./usdPairCard";
import ApproveNFTCard from "./approveNFTCard";

const NFTCryptoPage = () => {
  return (
    <div>
      <ApproveNFTCard />
      <USDPairCard />
    </div>
  );
};

export default NFTCryptoPage;
