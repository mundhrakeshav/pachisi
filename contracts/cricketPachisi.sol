//SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

import "./cricketGame.sol";
import { Dai } from "./dai.sol";
import { EIP712MetaTransaction } from "./EIP712MetaTx.sol";
import { String } from "./stringLibrary.sol";

contract CricketPachisi is EIP712MetaTransaction("CricketPachisi", "1"){
    
    Dai private daiContract;
    address constant private DAI_ADDRESS = 0x665F9c9B90aDb43d6a50B6C0bEb6F300f3af723a;

    
    //UID to CricketMatch
    mapping(uint => CricketGame) public cricketBets;
    mapping(uint => bool) public cricketBetCreated;
        
    //Initial bet amount should be above 10 Dai
    modifier betAbove10(uint betAmount){
        require(betAmount >=10 ** 19, "Initial bet is less than 10");
        _;   
    }
    
    //DaiContract is approved to transfer specified amount
    modifier daiContractApproved(uint betAmount) {
        require(betAmount < daiContract.allowance(msgSender(), address(this)), "This contract is not allowed to transfer specified betAmount");    
        _;
    }
    
    //Specified bet closing time should be after now
    modifier beforeGameStartTime(uint betClosingTime) {
        require(betClosingTime < block.timestamp, "Bet can't be placed after match has started.");
        _;
    }
    
    modifier afterBetEndTime(uint _uidOfMatch) {
        CricketGame _cricketGame = cricketBets[_uidOfMatch];
        require(block.timestamp > _cricketGame.gameEndTime(),"It can only be claimed after bet ends.");
        _;
    }
    
    
    constructor() public {
        daiContract = Dai(DAI_ADDRESS);
    }
    
    function predictCricketMatch( 
        string memory _title, 
        uint _uidOfMatch,
        string memory _outcome1, 
        string memory _outcome2, 
        uint _gameStartTime,
        uint _betAmount,
        bool _predictedOutcome)
             public 
            // betAbove10(_betAmount) 
            // daiContractApproved(_betAmount) 
            // beforeGameStartTime(_gameStartTime) 
            {
        
        if(!cricketBetCreated[_uidOfMatch]){
            createCricketMatchBet(_title, _uidOfMatch, _outcome1, _outcome2, _gameStartTime, _betAmount, _predictedOutcome);
        } else {
            addCricketMatchBet(_uidOfMatch, _betAmount, _predictedOutcome); 
        }

    }
    //100000000000000000000
      function createCricketMatchBet(
        string memory _title, 
        uint _uidOfMatch,
        string memory _outcome1, 
        string memory _outcome2, 
        uint _gameStartTime,
        uint _betAmount,
        bool _predictedOutcome
            ) private {
                
        cricketBets[_uidOfMatch] = new CricketGame(_title, _outcome1, _outcome2, _gameStartTime, msgSender());
        cricketBetCreated[_uidOfMatch] = true;
        
        addCricketMatchBet(_uidOfMatch, _betAmount, _predictedOutcome);
        }

    
    function addCricketMatchBet(  
        uint _uidOfMatch,
        uint _betAmount,
        bool _predictedOutcome) 
            private {
        
            CricketGame _cricketGame = cricketBets[_uidOfMatch];
            _cricketGame.addCricketMatchBet(_betAmount, _predictedOutcome,msgSender()); 
            pullMoney(msgSender(), _betAmount);
        }


      function predictCricketToss( 
        string memory _title, 
        uint _uidOfMatch,
        string memory _outcome1, 
        string memory _outcome2, 
        uint _gameStartTime,
        uint _betAmount,
        bool _predictedOutcome)
             public 
            // betAbove10(_betAmount) 
            // daiContractApproved(_betAmount) 
            // beforeGameStartTime(_gameStartTime) 
            {
        
        if(!cricketBetCreated[_uidOfMatch]){
            createCricketTossBet(_title, _uidOfMatch, _outcome1, _outcome2, _gameStartTime, _betAmount, _predictedOutcome);
        } else {
            addCricketTossBet(_uidOfMatch, _betAmount, _predictedOutcome); 
        }

    }
    //100000000000000000000
      function createCricketTossBet(
        string memory _title, 
        uint _uidOfMatch,
        string memory _outcome1, 
        string memory _outcome2, 
        uint _gameStartTime,
        uint _betAmount,
        bool _predictedOutcome
            ) private {
                
        cricketBets[_uidOfMatch] = new CricketGame(_title, _outcome1, _outcome2, _gameStartTime, msgSender());
        cricketBetCreated[_uidOfMatch] = true;
        
        addCricketTossBet(_uidOfMatch, _betAmount, _predictedOutcome);
        }

    
    function addCricketTossBet(  
        uint _uidOfMatch,
        uint _betAmount,
        bool _predictedOutcome) 
            private {
            CricketGame _cricketGame = cricketBets[_uidOfMatch];
            _cricketGame.addCricketTossBet(_betAmount, _predictedOutcome,msgSender()); 
            pullMoney(msgSender(), _betAmount);
    }
    
    function pullMoney(address _from, uint _amount) private {
        daiContract.pull(_from, _amount);
    }
    
    function pushMoney(address _to, uint _amount) private {
        daiContract.push(_to, _amount);
    }
    
    function resolveCricketToss(string memory _uidOfMatchString, uint _uidOfMatchInt) public {
        CricketGame _cricketGame = cricketBets[_uidOfMatchInt];
        _cricketGame.resolveToss(_uidOfMatchString);
    }
    
    
    function resolveCricketMatch(string memory _uidOfMatchString, uint _uidOfMatchInt) public {
        CricketGame _cricketGame = cricketBets[_uidOfMatchInt];
        _cricketGame.resolveMatch(_uidOfMatchString);
    }
    
    function claimCricketFunds(uint _uidOfMatch) public 
    // afterBetEndTime(_uidOfMatch)
    {
        CricketGame _cricketGame = cricketBets[_uidOfMatch];
        uint _totalVolOnMatchOutcome1 = _cricketGame.totalVolumeOnMatchOutcome1();//1212
        uint _totalVolOnMatchOutcome2 = _cricketGame.totalVolumeOnMatchOutcome2();//1212
        uint _totalVolOnTossOutcome1 = _cricketGame.totalVolumeOnTossOutcome1();
        uint _totalVolOnTossOutcome2 = _cricketGame.totalVolumeOnTossOutcome2();
        
        uint _usersBetOnMatchOutcome1 = _cricketGame.betAmountsMatchOutcome1(msgSender());//1212
        uint _usersBetOnMatchOutcome2 = _cricketGame.betAmountsMatchOutcome2(msgSender());//1212
        uint _usersBetOnTossOutcome1 = _cricketGame.betAmountsTossOutcome1(msgSender());
        uint _usersBetOnTossOutcome2 = _cricketGame.betAmountsTossOutcome2(msgSender());
    
        uint _matchWinner = _cricketGame.matchWinner();//2
        uint _tossWinner = _cricketGame.tossWinner();
        
        uint _amountUserGetsMatch;
        uint _amountUserGetsToss;
        
        if(_matchWinner == 1) {
            uint _usersStakeInFunds = _usersBetOnMatchOutcome1/_totalVolOnMatchOutcome1;
                 _amountUserGetsMatch = _usersStakeInFunds * (_totalVolOnMatchOutcome1 + _totalVolOnMatchOutcome2) * 95 / 100;
        } else if(_matchWinner == 2) {
            uint _usersStakeInFunds = _usersBetOnMatchOutcome2/_totalVolOnMatchOutcome2;
                 _amountUserGetsMatch = _usersStakeInFunds * (_totalVolOnMatchOutcome1 + _totalVolOnMatchOutcome2) * 95 / 100;
        }

        if(_tossWinner == 1) {
            uint _usersStakeInFunds = _usersBetOnTossOutcome1/_totalVolOnTossOutcome1;
                 _amountUserGetsToss = _usersStakeInFunds * (_totalVolOnTossOutcome1 + _totalVolOnTossOutcome2) * 95 / 100;
        } else if(_tossWinner == 2)  {
            uint _usersStakeInFunds = _usersBetOnTossOutcome2/_totalVolOnTossOutcome2;
                 _amountUserGetsToss = _usersStakeInFunds * (_totalVolOnTossOutcome1 + _totalVolOnTossOutcome2) * 95 / 100;
        }
        
        pushMoney(msgSender(), _amountUserGetsToss + _amountUserGetsMatch);
        _cricketGame.claimUserFunds(msgSender());
    }
    
}