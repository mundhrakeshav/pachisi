//SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;
import "./TellorLatestPrice.sol";
import "./dai.sol";
import { EIP712MetaTransaction } from "./EIP712MetaTx.sol";

contract PricePachisi is EIP712MetaTransaction("PricePachisi", "1") {

   
    Dai private daiContract;
    address constant private DAI_ADDRESS = 0x665F9c9B90aDb43d6a50B6C0bEb6F300f3af723a;
    TellorGetLatestPrice tellorContract;

    address private tellorLatestPriceContractAddress = 0x1913713d479259580Be39969C89f4d162dA3b2d3;

    struct Bet {
        mapping(address => uint) lowerLimit;
        mapping(address => uint) amount;
        uint totalAmount;
    }
    
    mapping (uint => Bet) public EthUsdBets;
    mapping (uint => Bet) public MaticUsdBets;
    mapping (uint => bool) public EthUsdBetsCreated;
    mapping (uint => bool) public MaticUsdBetsCreated;
    
    mapping (address => uint[]) _userMaticBets;
    mapping (address => uint[]) _userEthBets;

     
     
    constructor() public {
        daiContract = Dai(DAI_ADDRESS);
        tellorContract = TellorGetLatestPrice(tellorLatestPriceContractAddress);

    }

    /**
     * Returns the latest price
     */
     
    modifier daiContractApproved(uint betAmount) {
        require(betAmount < daiContract.allowance(msgSender(), address(this)), "This contract is not allowed to transfer specified betAmount");    
        _;
    }
    
    modifier beforeBetResolveTime(uint _betTime) {
        require(_betTime + 86400 > block.timestamp, "Bet can't be placed after match has started.");
        _;
    }
    
    function getLatestPrice(uint _dataId) view public  returns(uint value) {
        
        return tellorContract.readTellorValue(_dataId)/1e6;
        
    }    
     
     function createMaticBet(uint _uidOfBet, uint _betAmount, uint _lowerLimit) public
    //  beforeBetResolveTime(_uidOfBet) 
     daiContractApproved(_betAmount) 
     {
        MaticUsdBets[_uidOfBet].lowerLimit[msgSender()] = _lowerLimit;
        MaticUsdBets[_uidOfBet].amount[msgSender()] += _betAmount;
        MaticUsdBets[_uidOfBet].totalAmount += _betAmount;
        _userMaticBets[msgSender()].push(_uidOfBet);
        pullMoney(msgSender(), _betAmount); 
    }
    
    function createEthBet(uint _uidOfBet, uint _betAmount, uint _lowerLimit) public
    //  beforeBetResolveTime(_uidOfBet) 
     daiContractApproved(_betAmount) 
     {
        EthUsdBets[_uidOfBet].lowerLimit[msgSender()] = _lowerLimit;
        EthUsdBets[_uidOfBet].amount[msgSender()] += _betAmount;
        EthUsdBets[_uidOfBet].totalAmount += _betAmount;
        _userEthBets[msgSender()].push(_uidOfBet);
        pullMoney(msgSender(), _betAmount); 
    }

    function resolveEthBet(uint _uidOfBet) public {
        uint _usersBet = EthUsdBets[_uidOfBet].amount[msgSender()];
        uint ethPrice = uint(getLatestPrice(1)); 
        if(EthUsdBets[_uidOfBet].lowerLimit[msgSender()] < ethPrice + 3 || EthUsdBets[_uidOfBet].lowerLimit[msgSender()] > ethPrice ){
            EthUsdBets[_uidOfBet].amount[msgSender()] = 0;
            pushMoney(msgSender(), _usersBet * 3/2 );
        }
 
    }
    
    function resolveMaticBet(uint _uidOfBet) public {
    
        uint _usersBet = MaticUsdBets[_uidOfBet].amount[msgSender()];
        uint maticPrice = uint(getLatestPrice(31)); 
        if(MaticUsdBets[_uidOfBet].lowerLimit[msgSender()] < maticPrice + 3 * 10 ** 8 || MaticUsdBets[_uidOfBet].lowerLimit[msgSender()] > maticPrice ){
            MaticUsdBets[_uidOfBet].amount[msgSender()] = 0;
            pushMoney(msgSender(), _usersBet * 3/2 );
        }
     }
     
    function pullMoney(address _from, uint _amount) private {
        daiContract.pull(_from, _amount);
    }
    
    function pushMoney(address _to, uint _amount) private {
        daiContract.push(_to, _amount);
    }
     
     
    function getETHLatestPrice() public view returns (int) {
        (
            uint80 roundID, 
            int price,
            uint startedAt,
            uint timeStamp,
            uint80 answeredInRound
        ) = ethPriceFeed.latestRoundData();
        return price;
    }
    
    function getMaticLatestPrice() public view returns (int) {
        (
            uint80 roundID, 
            int price,
            uint startedAt,
            uint timeStamp,
            uint80 answeredInRound
        ) = maticPriceFeed.latestRoundData();
        return price;
    }
    
    function userEthBets(address userAddress) public view returns(uint[] memory){
        return _userEthBets[userAddress];
    }
    
    function userMaticBets(address userAddress) public view returns(uint[] memory){
        return _userMaticBets[userAddress];
    }
}

