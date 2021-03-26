// https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=AAPL&apikey=EHZZFEOMSTGL3I2V


pragma solidity ^0.6.7;
pragma experimental ABIEncoderV2;

import "./stockBet.sol";
import {AaveClient} from "./AaveClient.sol";
import {ERC20Client} from "./pachisiERC20Client.sol";

contract PachisiStockPrediction is AaveClient, ERC20Client {
    
    address[] public stockBetAddresses;

    mapping(address => mapping(string => address[])) public userStockBets; //user => stock => addresses[]

    function getStockBets() public view returns(address[] memory) {
        return stockBetAddresses;
    }    

    function createStockBet(  uint _betResolveTime, 
                            string memory _betToken, 
                            string memory _symbol, 
                            uint _predictionPrice, 
                            uint _initialBetAmount, 
                            bool _userBet) public enoughLinkBalanceOnContract {
        // StockBet _stockBet = StockBet();
        // PachisiCryptoBet(address _aggregatorAddress, uint _betResolveTime, string memory _betPair, string memory _betToken, uint _predictionPrice, string memory _betSymbol)
        // require(USDPairAggregatorAddress[_betToken] != address(0x0));
        // PachisiCryptoBet _pachisiCryptoBet = new PachisiCryptoBet(USDPairAggregatorAddress[_betToken], _betResolveTime, "USD", _betToken, _predictionPrice, _symbol);
        // _pachisiCryptoBet.bet(_initialBetAmount, _userBet, msg.sender);
        // linkContract.transfer(address(_pachisiCryptoBet), 10**17);
        // tokenUSDBetAddresses.push(address(_pachisiCryptoBet));
        // _pachisiCryptoBet.requestAlarmClock(_betResolveTime);
        // pullDai(msg.sender, _initialBetAmount);
        // daiContract.approve(AAVE_LENDING_POOL_ADDRESS, _initialBetAmount);
        // makeDepositToAave(daiContractAddress, _initialBetAmount, address(this)); 
    }
    

}