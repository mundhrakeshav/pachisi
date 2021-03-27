// https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=AAPL&apikey=EHZZFEOMSTGL3I2V
// 0xb113D314C4946B328a44efE177DC956B77094337,0x405D6C6551a91F0e9eEFfB7b9d0f731FeD3A061f,0xCacf67a8F62F46905967661de09C88Db252235DB,0xf2f19043Dda4c2a4231140e522BaA05D1d7bb744


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
    
    
    function getURL(string memory _stock) public view returns(string memory) {
        return string(abi.encodePacked("https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=",_stock,"&apikey=EHZZFEOMSTGL3I2V"));
    }    
    
// string memory _url, uint _betResolveTime, string memory _betStock, uint _predictionPrice, string memory _betSymbol
    function createStockBet(  uint _betResolveTime, 
                            string memory _betStock, 
                            string memory _symbol, 
                            uint _predictionPrice, 
                            uint _initialBetAmount, 
                            bool _userBet) public enoughLinkBalanceOnContract {
        StockBet _stockBet = new StockBet(getURL(_betStock), _betResolveTime, _betStock, _predictionPrice, _symbol);
        _stockBet.bet(_initialBetAmount, _userBet, msg.sender);
        linkContract.transfer(address(_stockBet), 2 * 10**17);
        stockBetAddresses.push(address(_stockBet));
        _stockBet.requestAlarmClock();
        pullDai(msg.sender, _initialBetAmount);
        daiContract.approve(AAVE_LENDING_POOL_ADDRESS, _initialBetAmount);
        makeDepositToAave(daiContractAddress, _initialBetAmount, address(this)); 
    }
    
    
    function placeStockBet(address _betAddress, string memory _betStock, uint _betAmount, bool _userBet) public {
        StockBet _stockBet = StockBet(_betAddress);
        _stockBet.bet(_betAmount, _userBet, msg.sender);
        userStockBets[msg.sender][_betStock].push(_betAddress);
        pullDai(msg.sender, _betAmount);
        daiContract.approve(AAVE_LENDING_POOL_ADDRESS, _betAmount);
        makeDepositToAave(daiContractAddress, _betAmount, address(this)); 
    }
    
    function claimStockFunds(address _betAddress) public {
        StockBet _stockBet = StockBet(_betAddress);
        require(_stockBet.betResolved(),"Bet hasn't been resolved.");
        require(!_stockBet.hasUserClaimed(msg.sender),"Funds have been claimed.");
        uint _totalFundsToBeClaimed = _stockBet.claimableFunds(msg.sender);
        _stockBet.claimFunds(msg.sender);
        withdrawFromAave(daiContractAddress, _totalFundsToBeClaimed, msg.sender);
    }
    

}