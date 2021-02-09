//SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

import { Dai } from "./dai.sol";
import { EIP712MetaTransaction } from "./EIP712MetaTx.sol";
import { String } from "./stringLibrary.sol";
import "https://github.com/smartcontractkit/chainlink/blob/develop/evm-contracts/src/v0.6/ChainlinkClient.sol";


contract CricketPachisi is ChainlinkClient, EIP712MetaTransaction("CricketPachisi", "1"){
    using String for string;
    
    string public matchURL = "https://pachisi.herokuapp.com/api/sports/cricketMatchResults/";
    string public tossURL = "https://pachisi.herokuapp.com/api/sports/cricketTossResults/";

    event fullfilled(uint team);
    
    address private oracle;
    address constant private DAI_ADDRESS = 0x665F9c9B90aDb43d6a50B6C0bEb6F300f3af723a;
    bytes32 private jobId;
    uint256 private fee;
    
    uint public tossWinner;
    uint public matchWinner;
    
    string public title;
    string public outcome1;
    string public outcome2;
    
    uint public totalVolumeOnMatchOutcome1;
    uint public totalVolumeOnMatchOutcome2;
    uint public gameStartTime;
    uint public gameEndTime;
    
    uint public totalVolumeOnTossOutcome1;
    uint public totalVolumeOnTossOutcome2;
    uint test = 1;
    address public betCreator;        
    
    mapping(address => uint) public betAmountsMatchOutcome1;        
    mapping(address => uint) public betAmountsMatchOutcome2;        
    mapping(address => uint) public betAmountsTossOutcome1;        
    mapping(address => uint) public betAmountsTossOutcome2;      

    
    constructor(string memory _title, string memory _outcome1, string memory _outcome2, uint _gameStartTime, address _betCreator) public {
        setChainlinkToken(0x70d1F773A9f81C852087B77F6Ae6d3032B02D2AB);
        oracle = 0xBf87377162512f8098f78f055DFD2aDAc34cbB47;
        jobId = "6b57e3fe0d904ba48d137b39350c7892";
        fee = 10 ** 16; // 0.01 LINK
        title = _title; 
        outcome1 = _outcome1; 
        outcome2 = _outcome2; 
        gameStartTime = _gameStartTime; 
        betCreator = _betCreator;
        gameEndTime = _gameStartTime + 43200;
    }

    
    function addCricketMatchBet(  
        uint _betAmount,
        bool _predictedOutcome,
        address _userAddress) 
            public {
             if(_predictedOutcome) {
                totalVolumeOnMatchOutcome1 += _betAmount;
                betAmountsMatchOutcome1[_userAddress] += _betAmount;
            } else {
                totalVolumeOnMatchOutcome2 += _betAmount;
                betAmountsMatchOutcome2[_userAddress] += _betAmount;
            }
        }
        
        
    function resolveMatch(string memory _uidOfMatch) public returns (bytes32 requestId) {
        //
        Chainlink.Request memory request = buildChainlinkRequest(jobId, address(this), this.fulfillMatch.selector);
        
        // Set the URL to perform the GET request on
        request.add("get", String.concat2(matchURL, _uidOfMatch));
        
        request.add("path", "RAW");
        
        request.addInt("times", 1);
        
        // Sends the request
        return sendChainlinkRequestTo(oracle, request, fee);
    }
    
    function fulfillMatch(bytes32 _requestId, uint256 _result) public recordChainlinkFulfillment(_requestId) {
        matchWinner = _result;
        emit fullfilled(_result);
    }
    
    
    function resolveToss(string memory _uidOfMatch) public returns (bytes32 requestId) {
        Chainlink.Request memory request = buildChainlinkRequest(jobId, address(this), this.fulfillToss.selector);
        
        // Set the URL to perform the GET request on
        request.add("get", String.concat2(tossURL, _uidOfMatch));
        
        request.add("path", "RAW");
        
        request.addInt("times", 1);
        
        // Sends the request
        return sendChainlinkRequestTo(oracle, request, fee);
    }
    
    function fulfillToss(bytes32 _requestId, uint256 _result) public recordChainlinkFulfillment(_requestId) {
        test = 2;
        tossWinner = _result;
        emit fullfilled(_result);
    }
}
