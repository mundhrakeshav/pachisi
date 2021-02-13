//SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;
import "./dai.sol";
import { EIP712MetaTransaction } from "./EIP712MetaTx.sol";


contract CustomPachisi is EIP712MetaTransaction("Custom", "1") {
       Dai private daiContract;
    address constant private DAI_ADDRESS = 0x665F9c9B90aDb43d6a50B6C0bEb6F300f3af723a;
    
    struct customBet {
        uint toBeResolvedTime;
        string title;
        uint totalAmount;
        mapping(address => uint) usersBetAmountOnOutcome1;
        mapping(address => uint) usersBetAmountOnOutcome2;
        uint totalAmountOnOutcome1;
        uint totalAmountOnOutcome2;
        string outcome1;
        string outcome2;
        bool outcome; //true => outcome is 1
    }
    
    constructor() public {
        daiContract = Dai(DAI_ADDRESS);
    }
    
    function pullMoney(address _from, uint _amount) private {
        daiContract.pull(_from, _amount);
    }
    
    function pushMoney(address _to, uint _amount) private {
        daiContract.push(_to, _amount);
    }
    
    uint public totalbets;
    mapping(uint => customBet) public customBets;
    
    function createCustomBet(string memory _title, 
                            uint _initialAmount,
                            bool _outcome,
                            string memory _outcome1, 
                            string memory _outcome2, 
                            uint _toBeResolvedTime) public {
        customBets[totalbets].title = _title;
        customBets[totalbets].totalAmount = _initialAmount;
        customBets[totalbets].outcome1 = _outcome1;
        customBets[totalbets].outcome2 = _outcome2;
        customBets[totalbets].toBeResolvedTime = _toBeResolvedTime;
        
        if(_outcome){
        customBets[totalbets].usersBetAmountOnOutcome1[msgSender()] = _initialAmount;
        customBets[totalbets].totalAmountOnOutcome1 = _initialAmount;
        } else {
        customBets[totalbets].usersBetAmountOnOutcome2[msgSender()] = _initialAmount;
        customBets[totalbets].totalAmountOnOutcome2 = _initialAmount;
        }
        totalbets++;
        pullMoney(msgSender(), _initialAmount);
        
    }
    
    function predictCustomBets(uint _uid, uint _amount, bool _predictedOutcome) public {
        customBets[_uid].totalAmount += _amount;
        
          if(_predictedOutcome){
        customBets[totalbets].usersBetAmountOnOutcome1[msgSender()] = _amount;
        customBets[totalbets].totalAmountOnOutcome1 = _amount;
        } else {
        customBets[totalbets].usersBetAmountOnOutcome2[msgSender()] = _amount;
        customBets[totalbets].totalAmountOnOutcome2 = _amount;
        }
        
        pullMoney(msgSender(), _amount);
    }
    
    function resolveBet(bool _outcome, uint _uid) public
    // onlyOwner
    {
        customBets[_uid].outcome = _outcome;
    }
    
    function claim(uint _uid) public {
      customBet memory _bet = customBets[_uid];
      uint _amountToBeSent;
      uint _totalAmountBetPlaced = customBets[_uid].totalAmount;
      uint _totalAmountBetPlacedOutcome1 = customBets[_uid].totalAmountOnOutcome1;
      uint _totalAmountBetPlacedOutcome2 = customBets[_uid].totalAmountOnOutcome2;

      if(_bet.outcome) {
        uint usersPercentageInOutcome1 = customBets[_uid].usersBetAmountOnOutcome1[msgSender()] * 100/_totalAmountBetPlacedOutcome1;
        uint ninetyPercentOfUsersStake = 90 * usersPercentageInOutcome1/100;
            _amountToBeSent = ninetyPercentOfUsersStake * _totalAmountBetPlacedOutcome1;
      } else {
        uint usersPercentageInOutcome2 = customBets[_uid].usersBetAmountOnOutcome2[msgSender()] * 100/_totalAmountBetPlacedOutcome2;
        uint ninetyPercentOfUsersStake = 90 * usersPercentageInOutcome2/100;
            _amountToBeSent = ninetyPercentOfUsersStake * _totalAmountBetPlacedOutcome2;
      }
      pushMoney(msgSender(), _amountToBeSent);
      
    }
    
    
}