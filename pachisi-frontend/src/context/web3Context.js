import React, { createContext, useState } from "react";
import Web3 from "web3";
import config from "../config";
import { Biconomy } from "@biconomy/mexa";

export const Web3Context = createContext();

const Web3ContextProvider = (props) => {
  //
  const [web3, setWeb3] = useState();
  const [userAddress, setUserAddress] = useState(null);
  const [web3ConnectStatus, setWeb3ConnectStatus] = useState(0);
  // connectStatus
  //0 -> Not Connected
  //1 -> MetaMask
  //2 -> Portis
  //
  const connectMetamask = async () => {
    if (window.ethereum) {
      try {
        const provider = window.ethereum;
        const biconomy = new Biconomy(provider, {
          apiKey: config.biconomyApiKey,
          debug: true,
        });
        await window.ethereum.enable();
        if (!(provider.networkVersion == "80001")) {
          alert("Please switch to matic mumbai");
        }
        setWeb3(new Web3(biconomy));
        setUserAddress(provider.selectedAddress);

        biconomy
          .onEvent(biconomy.READY, async () => {
            setWeb3ConnectStatus(1);

            provider.on("accountsChanged", function (accounts) {
              setUserAddress(accounts[0]);
            });
          })
          .onEvent(biconomy.ERROR, (err, message) => {
            alert(message);
            console.log(err, message);
          });
      } catch (error) {
        console.log("Please allow access to connect to web3 ");
      }
    } else {
      console.log(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  };
  const connectPortis = async () => {};

  const domainType = [
    { name: "name", type: "string" },
    { name: "version", type: "string" },
    { name: "chainId", type: "uint256" },
    { name: "verifyingContract", type: "address" },
  ];

  const metaTransactionType = [
    { name: "nonce", type: "uint256" },
    { name: "from", type: "address" },
    { name: "functionSignature", type: "bytes" },
  ];

  const signTx = async (
    contractName,
    contractAddress,
    nonce,
    functionSignature,
    contract
  ) => {
    let domainData = {
      name: contractName,
      version: "1",
      chainId: 80001,
      verifyingContract: contractAddress,
    };
    let message = {
      name: contractName,
    };
    message.nonce = parseInt(nonce);
    message.from = userAddress;
    message.functionSignature = functionSignature;
    // let nonce = await contract.methods.getNonce(userAddress).call();
    // let functionSignature = contract.methods.setQuote("newQuote").encodeABI();
    console.log(message);
    const dataToSign = JSON.stringify({
      types: {
        EIP712Domain: domainType,
        MetaTransaction: metaTransactionType,
      },
      domain: domainData,
      primaryType: "MetaTransaction",
      message: message,
    });
    console.log(domainData, "domaindata");

    web3.currentProvider.send(
      {
        jsonrpc: "2.0",
        method: "eth_signTypedData_v4",
        params: [userAddress, dataToSign],
        from: userAddress,
      },
      (error, response) => {
        console.info(`User signature is ${response.result}`);
        let { r, s, v } = getSignatureParameters(response.result);
        console.log(r, s, v);
        sendSignedTransaction(
          userAddress,
          functionSignature,
          r,
          s,
          v,
          contract
        );
      }
    );
  };
  const sendSignedTransaction = async (
    userAddress,
    functionData,
    r,
    s,
    v,
    contract
  ) => {
    try {
      let gasLimit = await contract.methods
        .executeMetaTransaction(userAddress, functionData, r, s, v)
        .estimateGas({ from: userAddress });
      let gasPrice = await web3.eth.getGasPrice();
      console.log(gasLimit);
      console.log(gasPrice);
      let tx = contract.methods
        .executeMetaTransaction(userAddress, functionData, r, s, v)
        .send({
          from: userAddress,
          gasPrice: gasPrice,
          gasLimit: gasLimit,
        });
      console.log(tx);
      tx.on("transactionHash", function (hash) {
        console.log(`Transaction hash is ${hash}`);
        alert(`Transaction sent by relayer with hash ${hash}`);
      })
        .once("confirmation", function (confirmationNumber, receipt) {
          console.log(receipt);
          alert("Transaction confirmed on chain");
        })
        .on("error", (error) => {
          if (error.code == 150 || error.code == 151 || error.code == 152) {
            alert(error.message);
            console.log("Meta Transaction usage limit reached");
          }
          console.log(error);
        });
    } catch (error) {
      alert("you probably forgot give allowance");
      alert(error);
    }
  };
  const getSignatureParameters = (signature) => {
    console.log(signature, "From getParameters");

    if (!web3.utils.isHexStrict(signature)) {
      throw new Error(
        'Given value "'.concat(signature, '" is not a valid hex string.')
      );
    }
    var r = signature.slice(0, 66);
    var s = "0x".concat(signature.slice(66, 130));
    var v = "0x".concat(signature.slice(130, 132));
    v = web3.utils.hexToNumber(v);
    if (![27, 28].includes(v)) v += 27;
    console.log({ v, r, s });
    return {
      r: r,
      s: s,
      v: v,
    };
  };

  return (
    <Web3Context.Provider
      value={{
        connectMetamask,
        connectPortis,
        web3,
        userAddress,
        setUserAddress,
        web3ConnectStatus,
        signTx,
      }}>
      {props.children}
    </Web3Context.Provider>
  );
};

export default Web3ContextProvider;
