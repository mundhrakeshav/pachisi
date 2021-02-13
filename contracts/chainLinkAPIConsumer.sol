pragma solidity ^0.6.0;

import "https://github.com/smartcontractkit/chainlink/blob/develop/evm-contracts/src/v0.6/ChainlinkClient.sol";
import { String } from "./stringLibrary.sol";

contract APIConsumer is ChainlinkClient {
    using String for string;

    uint256 public price;
    string path;
    address private oracle;
    bytes32 private jobId;
    uint256 private fee;
    
    /**
     * Network: Matic Mumbai Testnet
     * Oracle: 0xBf87377162512f8098f78f055DFD2aDAc34cbB47
     * Job ID: 6b57e3fe0d904ba48d137b39350c7892
     * LINK address: 0x70d1F773A9f81C852087B77F6Ae6d3032B02D2AB
     * Fee: 0.01 LINK
     */
    constructor(string memory url) public {
        setChainlinkToken(0x70d1F773A9f81C852087B77F6Ae6d3032B02D2AB);
        oracle = 0xBf87377162512f8098f78f055DFD2aDAc34cbB47;
        jobId = "6b57e3fe0d904ba48d137b39350c7892";
        fee = 10 ** 16; // 0.01 LINK
        path= url;
    }
    
    /**
     * Create a Chainlink request to retrieve API response, find the target price
     * data, then multiply by 100 (to remove decimal places from price).
     */
    function requestBTCCNYPrice() public returns (bytes32 requestId) 
    {
        Chainlink.Request memory request = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);
        
        // Set the URL to perform the GET request on
        request.add("get", path);
        
       // Set the path to find the desired data in the API response, where the response format is:
       // {
       //     "Realtime Currency Exchange Rate": {
       //       "1. From_Currency Code": "BTC",
       //       "2. From_Currency Name": "Bitcoin",
       //       "3. To_Currency Code": "CNY",
       //       "4. To_Currency Name": "Chinese Yuan",
       //       "5. Exchange Rate": "207838.88814500",
       //       "6. Last Refreshed": "2021-01-26 11:11:07",
       //       "7. Time Zone": "UTC",
       //      "8. Bid Price": "207838.82343000",
       //       "9. Ask Price": "207838.88814500"
       //     }
       //     }
   
        request.add("path", "RAW");
        
        // Multiply the result by 10000000000 to remove decimals
        request.addInt("times", 10000000000);
        
        // Sends the request
        return sendChainlinkRequestTo(oracle, request, fee);
    }
    
    function getURL() public pure returns(string memory) {
       return String.concat2("https://pachisi.herokuapp.com/api/sports/cricketTossResults/","1");
    }
    
    /**
     * Receive the response in the form of uint256
     */ 
    function fulfill(bytes32 _requestId, uint256 _price) public recordChainlinkFulfillment(_requestId)
    {
        price = _price;
    }
}