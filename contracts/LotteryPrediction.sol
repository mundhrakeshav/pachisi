
pragma solidity ^0.6.7;
// pragma experimental ABIEncoderV2;

import "https://github.com/smartcontractkit/chainlink/blob/develop/evm-contracts/src/v0.6/interfaces/AggregatorV3Interface.sol";
import "./CryptoBet.sol";
import {ChainlinkClient} from "https://raw.githubusercontent.com/smartcontractkit/chainlink/develop/evm-contracts/src/v0.6/ChainlinkClient.sol";
import {AaveClient} from "./AaveClient.sol";
import {ERC20Client} from "./pachisiERC20Client.sol";

contract LotteryPrediction is AaveClient, ERC20Client, ChainlinkClient {
        
    address private oracle;
    bytes32 private jobId;
    uint256 internal fee;
    // uint public interval = 604800;
    uint public interval = 200;
    uint currentBetResolveTime;
    uint public totalPriceOfRemainingTokens = 10**30;
    
    struct Bet{
    uint betResolveTime;
    uint volumeUpDown;
    uint resolvedRandomness;
    bool betResolved;
    mapping(address => uint)  userBetUpAmount;
    uint totalVolumeUp;
    mapping(address => uint)  userBetDownAmount;
    uint totalVolumeDown;
    uint volumeEvenOdd;
    mapping(address => uint)  userBetEvenAmount;
    uint totalVolumeEven;
    mapping(address => uint)  userBetOddAmount;
    uint totalVolumeOdd;
    mapping(address => bool)  hasUserClaimed; // Will be turned to true after user has claimed the rewards

    }
    mapping(uint => Bet) public betResolveTimeToBet;

    
    uint[] public createdBets;
        // LINK token address: 0xa36085F69e2889c224210F603D836748e7dC0088
        // Oracle address: 0x2f90A6D021db21e1B2A077c5a37B3C7E75D15b7e
        // JobID: a7ab70d561d34eb49e9b1612fd2e044b
        
    constructor() public {
        setPublicChainlinkToken();
        oracle = 0xAA1DC356dc4B18f30C347798FD5379F3D77ABC5b;
        jobId = "982105d690504c5d9ce374d040c08654";
        fee = 0.1 * 10 ** 18; // 0.1 LINK
    }
    
    function createLotteryBet() public {
        uint _betResolveTime = block.timestamp + interval;
        Bet memory _bet =  Bet(_betResolveTime, 0, 0, false, 0, 0, 0, 0, 0);
        currentBetResolveTime = _betResolveTime;
        _bet.betResolveTime = _betResolveTime;
        betResolveTimeToBet[_betResolveTime] = _bet;
        createdBets.push(_betResolveTime);
        requestAlarmClockGetRandomness(_betResolveTime);
        requestAlarmClockCreateBet(_betResolveTime);
    }
    
    function getCreatedBets() public view returns(uint[] memory) {
        return createdBets;
    }
    
    function random() public view returns (uint8) {
        return uint8(uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty, tx.gasprice)))%111);
    //TODO Change to chainlink VRF
    }
    
    function placeUpDownBet(uint _amount, bool _userBet, uint _betResolveTime) public {
        require(block.timestamp < _betResolveTime);
        Bet storage _bet = betResolveTimeToBet[_betResolveTime];
        _bet.volumeUpDown += _amount;
        if(_userBet) {
        _bet.totalVolumeUp += _amount;    
        _bet.userBetUpAmount[msg.sender] += _amount;
        } else {
        _bet.totalVolumeDown += _amount;    
        _bet.userBetDownAmount[msg.sender] += _amount;
        }
        pullDai(msg.sender, _amount);
        daiContract.approve(AAVE_LENDING_POOL_ADDRESS, _amount);
        makeDepositToAave(daiContractAddress, _amount, address(this)); 
    }

    function placeOddEvenBet(uint _amount, bool _userBet, uint _betResolveTime) public{
        require(block.timestamp < _betResolveTime);
        Bet storage _bet = betResolveTimeToBet[_betResolveTime];
        _bet.volumeEvenOdd += _amount;
        if(_userBet) {
        _bet.totalVolumeEven += _amount;    
        _bet.userBetEvenAmount[msg.sender] += _amount;
        } else {
        _bet.totalVolumeOdd += _amount;    
        _bet.userBetOddAmount[msg.sender] += _amount;
        }
        pullDai(msg.sender, _amount);
        daiContract.approve(AAVE_LENDING_POOL_ADDRESS, _amount);
        makeDepositToAave(daiContractAddress, _amount, address(this)); 
    }
    
    function claimFunds(uint _betResolveTime) public {
        Bet storage _bet = betResolveTimeToBet[_betResolveTime];
        require(_bet.hasUserClaimed[msg.sender] && _bet.betResolved);
        _bet.hasUserClaimed[msg.sender] = true;
        withdrawFromAave(daiContractAddress, claimableEvenOddFunds(msg.sender, _betResolveTime) + claimableUpDownFunds(msg.sender, _betResolveTime), msg.sender);
    }
    
    function claimableEvenOddFunds(address _userAddress, uint _betResolveTime) public view returns(uint){
        Bet storage _bet = betResolveTimeToBet[_betResolveTime];
        uint _volume =_bet.volumeEvenOdd;
        
        if(_bet.resolvedRandomness % 2 == 0) {
            uint _userBetEven = _bet.userBetEvenAmount[_userAddress];
            uint _totalBetEven = _bet.totalVolumeEven;
            return (_userBetEven * _volume)/_totalBetEven;
        } else {
            uint _userBetOdd = _bet.userBetOddAmount[_userAddress];
            uint _totalBetOdd = _bet.totalVolumeOdd;
            return (_userBetOdd * _volume)/_totalBetOdd;
        }
    }
    
    function claimableUpDownFunds(address _userAddress, uint _betResolveTime) public view returns(uint){
        Bet storage _bet = betResolveTimeToBet[_betResolveTime];
        uint _volume =_bet.volumeUpDown;
        
        if(_bet.resolvedRandomness % 2 == 0) {
            uint _userBetUp = _bet.userBetUpAmount[_userAddress];
            uint _totalBetUp = _bet.totalVolumeUp;
            return (_userBetUp * _volume)/_totalBetUp;
        } else {
            uint _userBetDown = _bet.userBetDownAmount[_userAddress];
            uint _totalBetDown = _bet.totalVolumeDown;
            return (_userBetDown * _volume)/_totalBetDown;
        }
    }
    
   function setBetRamdomness() public {
        Bet storage _bet = betResolveTimeToBet[currentBetResolveTime];
        _bet.resolvedRandomness = random();
        _bet.betResolved = true;

    }
    
    function requestAlarmClockGetRandomness(uint256 _betResolveTime) public returns(bytes32 requestId) {
        Chainlink.Request memory request = buildChainlinkRequest(jobId, address(this), this.setBetRamdomness.selector);
        request.addUint("until", _betResolveTime);
        return sendChainlinkRequestTo(oracle, request, fee);
    }

    function requestAlarmClockCreateBet(uint256 _betResolveTime) public returns(bytes32 requestId) {
        Chainlink.Request memory request = buildChainlinkRequest(jobId, address(this), this.createLotteryBet.selector);
        request.addUint("until", _betResolveTime + interval);
        return sendChainlinkRequestTo(oracle, request, fee);
    }
    
}