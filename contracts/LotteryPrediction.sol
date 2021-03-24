//SPDX-License-Identifier:MIT
pragma solidity ^0.6.7;
pragma experimental ABIEncoderV2;

import "https://github.com/smartcontractkit/chainlink/blob/develop/evm-contracts/src/v0.6/interfaces/AggregatorV3Interface.sol";
import "https://raw.githubusercontent.com/smartcontractkit/chainlink/develop/evm-contracts/src/v0.6/ChainlinkClient.sol";
import {AaveClient} from "./AaveClient.sol";
import {ERC20Client} from "./pachisiERC20Client.sol";

contract LotteryPrediction is AaveClient, ERC20Client, ChainlinkClient {
        
    address private oracle;
    bytes32 private jobId;
    uint256 internal fee;
    // uint public interval = 604800;
    uint public interval = 300;
    uint public currentBetResolveTime;
    uint public totalPriceOfRemainingTokens = 10**30;
    
    struct Bet{
    uint betResolveTime;
    uint volumeUpDown;
    uint resolvedRandomness;
    uint volumeEvenOdd;
    uint totalVolumeUp;
    uint totalVolumeDown;
    uint totalVolumeEven;
    uint totalVolumeOdd;
    bool betResolved;

    mapping(address => uint)  userBetUpAmount;
    mapping(address => uint)  userBetDownAmount;
    mapping(address => uint)  userBetEvenAmount;
    mapping(address => uint)  userBetOddAmount;
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
        Bet memory _bet =  Bet(_betResolveTime, 0, 0, 0, 0, 0, 0, 0, false);
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

    function placeUpDownBet(uint _amount, bool _userBet, uint _betResolveTime) public {
        require(_betResolveTime > block.timestamp);
        Bet storage _bet = betResolveTimeToBet[_betResolveTime];
        _bet.volumeUpDown += _amount;
        if(_userBet) {
            _bet.userBetUpAmount[msg.sender] += _amount;
            _bet.totalVolumeUp += _amount;
        } else {
            _bet.userBetDownAmount[msg.sender] += _amount;
            _bet.totalVolumeDown += _amount;
        }
        betResolveTimeToBet[_betResolveTime] = _bet;
        pullDai(msg.sender, _amount);
        daiContract.approve(AAVE_LENDING_POOL_ADDRESS, _amount);
        makeDepositToAave(daiContractAddress, _amount, address(this)); 
    }

    function placeOddEvenBet(uint _amount, bool _userBet, uint _betResolveTime) public {
        require(_betResolveTime > block.timestamp);
        Bet storage _bet = betResolveTimeToBet[_betResolveTime];
        _bet.volumeEvenOdd += _amount;
        if(_userBet) {
            _bet.userBetEvenAmount[msg.sender] += _amount;
            _bet.totalVolumeEven += _amount;
            
        } else {
            _bet.userBetOddAmount[msg.sender] += _amount;
            _bet.totalVolumeOdd += _amount;
        }
        betResolveTimeToBet[_betResolveTime] = _bet;
        pullDai(msg.sender, _amount);
        daiContract.approve(AAVE_LENDING_POOL_ADDRESS, _amount);
        makeDepositToAave(daiContractAddress, _amount, address(this)); 
    }
    
    function claimOddEvenLotteryFunds(uint _betResolveTime) public {
        Bet storage _bet = betResolveTimeToBet[_betResolveTime];
        require(!_bet.hasUserClaimed[msg.sender] && _bet.betResolved);
        _bet.hasUserClaimed[msg.sender] = true;
        withdrawFromAave(daiContractAddress, claimableEvenOddFunds(msg.sender, _betResolveTime) , msg.sender);
    }
    
    function claimUpDownLotteryFunds(uint _betResolveTime) public {
        Bet storage _bet = betResolveTimeToBet[_betResolveTime];
        require(!_bet.hasUserClaimed[msg.sender] && _bet.betResolved);
        _bet.hasUserClaimed[msg.sender] = true;
        withdrawFromAave(daiContractAddress, claimableUpDownFunds(msg.sender, _betResolveTime) , msg.sender);
    }
    
    function claimableEvenOddFunds(address _userAddress, uint _betResolveTime) public view returns(uint){
        Bet storage _bet = betResolveTimeToBet[_betResolveTime];
        uint _volume =_bet.volumeEvenOdd;
        uint claimable = 0;
        if(_bet.resolvedRandomness % 2 == 0) {
            uint _userBetEven = _bet.userBetEvenAmount[_userAddress];
            uint _totalBetEven = _bet.totalVolumeEven;
            claimable = (_userBetEven * _volume)/_totalBetEven;
        } else {
            uint _userBetOdd = _bet.userBetOddAmount[_userAddress];
            uint _totalBetOdd = _bet.totalVolumeOdd;
            claimable = (_userBetOdd * _volume)/_totalBetOdd;
        }
        return claimable;
    }
    
    function claimableUpDownFunds(address _userAddress, uint _betResolveTime) public view returns(uint){
        Bet storage _bet = betResolveTimeToBet[_betResolveTime];
        uint _volume =_bet.volumeUpDown;
        uint claimable = 0;
        if(_bet.resolvedRandomness % 14 > 7) {
            uint _userBetUp = _bet.userBetUpAmount[_userAddress];
            uint _totalBetUp = _bet.totalVolumeUp;
            claimable = (_userBetUp * _volume)/_totalBetUp;
        } else {
            uint _userBetDown = _bet.userBetDownAmount[_userAddress];
            uint _totalBetDown = _bet.totalVolumeDown;
            claimable = (_userBetDown * _volume)/_totalBetDown;
        }
        return claimable;
    }
    
    function getUserBetAmount(uint _betResolveTime, address _userAddress) public view returns(uint[4] memory) {
        Bet storage _bet = betResolveTimeToBet[_betResolveTime];
        return [_bet.userBetUpAmount[_userAddress], _bet.userBetDownAmount[_userAddress], _bet.userBetEvenAmount[_userAddress], _bet.userBetOddAmount[_userAddress]];
    }//UP> DOWN> EVEN> ODD
    
       
    function hasUserClaimed(uint _betResolveTime, address _userAddress) public view returns(bool) {
        Bet storage _bet = betResolveTimeToBet[_betResolveTime];
        return _bet.hasUserClaimed[_userAddress];
    }
        
    function random() public view returns (uint8) {
        return uint8(uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty, tx.gasprice)))%111);
    }
    
    function setRamdomness() public {
        Bet storage _bet = betResolveTimeToBet[currentBetResolveTime];
        _bet.resolvedRandomness = random();
        _bet.betResolved = true;
    }
    
    function requestAlarmClockGetRandomness(uint256 _betResolveTime) public returns(bytes32 requestId) {
        Chainlink.Request memory request = buildChainlinkRequest(jobId, address(this), this.setRamdomness.selector);
        request.addUint("until", _betResolveTime);
        return sendChainlinkRequestTo(oracle, request, fee);
    }

    function requestAlarmClockCreateBet(uint256 _betResolveTime) public returns(bytes32 requestId) {
        Chainlink.Request memory request = buildChainlinkRequest(jobId, address(this), this.createLotteryBet.selector);
        request.addUint("until", _betResolveTime + interval);
        return sendChainlinkRequestTo(oracle, request, fee);
    }
    
}