//SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;
import "./dai.sol";
import { EIP712MetaTransaction } from "./EIP712MetaTx.sol";

contract PlayWithNumbers is EIP712MetaTransaction("PlayWithNumbers", "1") {
    
    Dai private daiContract;
    address constant private DAI_ADDRESS = 0x665F9c9B90aDb43d6a50B6C0bEb6F300f3af723a;
    
    uint public currentOddEvenCreatedTimeStamp; //Latest timestamp for oddEvenBet
    uint public currentSevenCreatedTimeStamp;
    
    struct OddEvenBet {
        uint timeCreated;
        uint totalAmount;
        mapping(address => uint) amount;
        mapping(address => bool) bets; // true => even
    }
    
    struct Seven {
        uint timeCreated;
        uint totalAmount;
        mapping(address => uint) amount;
        mapping(address => bool) sevenUp; //true means user has bet on seven up
    }
    
    
      modifier afterBetResolveTime(uint _betTime) {
        require(_betTime + 21600 > block.timestamp, "Bet can't be resolved right now.");
        _;
    }
    
    mapping(uint => OddEvenBet) public oddEvenBets; 
        //timestamp => bet
        
    mapping(uint => Seven) public sevenBets; 
    
    
    mapping(address => uint[]) public oddEvenBetsUsers;
    
    mapping(address => uint[]) public sevenBetsUsers;
    
    mapping(uint => uint) public oddEvenResults;
    mapping(uint => bool) public oddEvenResultsCreated;
    
    mapping(uint => uint) public sevenResults;
    mapping(uint => bool) public sevenResultsCreated;
    
    constructor() public {
        daiContract = Dai(DAI_ADDRESS);
    }
    
    function random() private view returns (uint8) {
        return uint8(uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty)))%251);
    //TODO Change to chainlink VRF

    }
    
         
    function pullMoney(address _from, uint _amount) private {
        daiContract.pull(_from, _amount);
    }
    
    function pushMoney(address _to, uint _amount) private {
        daiContract.push(_to, _amount);
    }
     
    
    function createSeven(uint _betAmount, bool _bet) public {
        if(block.timestamp > currentSevenCreatedTimeStamp + 21600){
            sevenBets[block.timestamp].timeCreated = block.timestamp;
            sevenBets[block.timestamp].totalAmount += _betAmount;
            sevenBets[block.timestamp].amount[msgSender()] += _betAmount;
            sevenBets[block.timestamp].sevenUp[msgSender()] = _bet;
            currentSevenCreatedTimeStamp = block.timestamp;
            sevenBetsUsers[msgSender()].push(block.timestamp);
        } else {
            sevenBets[currentSevenCreatedTimeStamp].totalAmount += _betAmount;
            sevenBets[currentSevenCreatedTimeStamp].amount[msgSender()] += _betAmount;
            sevenBets[currentSevenCreatedTimeStamp].sevenUp[msgSender()] = _bet;
            sevenBetsUsers[msgSender()].push(currentSevenCreatedTimeStamp);
        }     
        pullMoney(msgSender(), _betAmount);
    }
    
    
    function createOddEven(uint _betAmount, bool _oddEven) public {
        if(block.timestamp > currentOddEvenCreatedTimeStamp + 21600){
            oddEvenBets[block.timestamp].timeCreated = block.timestamp;
            oddEvenBets[block.timestamp].totalAmount += _betAmount;
            oddEvenBets[block.timestamp].amount[msgSender()] += _betAmount;
            oddEvenBets[block.timestamp].bets[msgSender()] = _oddEven;
            currentOddEvenCreatedTimeStamp = block.timestamp;
            oddEvenBetsUsers[msgSender()].push(block.timestamp);
        } else {
            oddEvenBets[currentOddEvenCreatedTimeStamp].totalAmount += _betAmount;
            oddEvenBets[currentOddEvenCreatedTimeStamp].amount[msgSender()] += _betAmount;
            oddEvenBets[currentOddEvenCreatedTimeStamp].bets[msgSender()] = _oddEven;
            oddEvenBetsUsers[msgSender()].push(currentOddEvenCreatedTimeStamp);
        }     
        pullMoney(msgSender(), _betAmount);

    }
    
    
    function resolveOddeven(uint _timestamp) public 
    // afterBetResolveTime(_timestamp)
    {
        uint randomRes;
        
        if(!oddEvenResultsCreated[_timestamp]) {
             randomRes = oddEvenResults[_timestamp];
        } else {
            randomRes = random();
            oddEvenResults[_timestamp] = randomRes;
            oddEvenResultsCreated[_timestamp] = true;
        }
        
        bool isEven = randomRes % 2 == 0;
        if(oddEvenBets[_timestamp].bets[msgSender()] == isEven) {
            pushMoney(msgSender(), oddEvenBets[_timestamp].amount[msgSender()] * 5/4);
        }
    } 
    
    function resolveSeven(uint _timestamp) public {
        uint randomRes;
        
        if(sevenResultsCreated[_timestamp]){
            randomRes = sevenResults[_timestamp];
        } else {
            randomRes = random();
            sevenResults[_timestamp] = randomRes;
            sevenResultsCreated[_timestamp] = true;
        }
        
        bool isSevenUp = randomRes % 14 > 7;
        
        if(sevenBets[_timestamp].sevenUp[msgSender()] == isSevenUp) {
            pushMoney(msgSender(), sevenBets[_timestamp].amount[msgSender()] * 5/4);
        }

    } 
    
}

// contract PlayWithNumbers is EIP712MetaTransaction("PlayWithNumbers", "1") {
    
//     Dai private daiContract;
//     address constant private DAI_ADDRESS = 0x665F9c9B90aDb43d6a50B6C0bEb6F300f3af723a;
  
//     struct OddEven{
//         uint totalAmount;
//         mapping (address => uint) userBetAmount;
//         mapping (address => bool) userPrediction; //true => Even
//     }
    
//     uint currentTimeStampOddEven;
//     uint currentTImeStampSeven;
    
//     struct Seven{
//         uint totalAmount;
//         mapping (address => uint) userBetAmount;
//         mapping (address => bool) userPrediction; //true => sevenUp
//     }
    
//     function random() private view returns (uint8) {
//         return uint8(uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty)))%251);
//     }
    
         
//     function pullMoney(address _from, uint _amount) private {
//         daiContract.pull(_from, _amount);
//     }
    
//     function pushMoney(address _to, uint _amount) private {
//         daiContract.push(_to, _amount);
//     }
     
     
//     function predictOddEven(uint _betAmount, bool _prediction ) public {
//         pullMoney(msgSender(), _betAmount);
//     }
    
// }