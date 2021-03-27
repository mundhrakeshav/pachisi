//SPDX-License-Identifier:MIT
pragma solidity ^0.6.7;
pragma experimental ABIEncoderV2;
import "https://github.com/smartcontractkit/chainlink/blob/develop/evm-contracts/src/v0.6/ChainlinkClient.sol";
import "./Ownable.sol";
import "./ShareToken.sol";


contract StockBet is ChainlinkClient, Ownable {
    
    address private oracle;
    bytes32 private getCallJobId;
    bytes32 private alamClockJobId;
    uint256 private fee;
    
    string public url;
    string public betStock;
    
    bool public betResolved;
    bool public alarmClockResolved;
    
    ShareToken public trueToken;
    ShareToken public falseToken;
    
    bytes public symbol; //greaterThan or lessThan
    bytes public constant greaterSymbol = bytes(">"); //greateThan or lessThan
    bytes public constant lessSymbol = bytes("<"); //greaterThan or lessThan
    
    uint public betResolveTime;
    uint public resolvedPrice;
    uint public totalPriceOfRemainingTokens;
    uint public predictionPrice; //price is greaterThan/lessThan predictionPrice
    uint public volume;
    uint public trueTokensInMarket;
    uint public falseTokensInMarket;
    
    mapping (address => uint) public userOwnedTrueTokens;
    mapping (address => uint) public userOwnedFalseTokens;
    mapping (address => bool) public hasUserClaimed; // Will be turned to true after user has claimed the rewards
    /**
     * Network: Kovan
     * Oracle: 0x2f90A6D021db21e1B2A077c5a37B3C7E75D15b7e
     * Job ID: 29fa9aa13bf1468788b7cc4a500a45b8
     * Fee: 0.1 LINK
     */
//      Oracle address: 0x2f90A6D021db21e1B2A077c5a37B3C7E75D15b7e
//      JobID: a7ab70d561d34eb49e9b1612fd2e044b
     
    constructor(string memory _url, uint _betResolveTime, string memory _betStock, uint _predictionPrice, string memory _betSymbol) public {
        setPublicChainlinkToken();
        oracle = 0x2f90A6D021db21e1B2A077c5a37B3C7E75D15b7e;
        getCallJobId = "29fa9aa13bf1468788b7cc4a500a45b8";
        alamClockJobId = "a7ab70d561d34eb49e9b1612fd2e044b";
        fee = 0.1 * 10 ** 18; // 0.1 LINK
        url = _url;
        betResolveTime = _betResolveTime;
        betStock = _betStock;
        predictionPrice = _predictionPrice;
        symbol = bytes(_betSymbol);
        
        betResolved = false;
        alarmClockResolved = false;
        
        trueToken = new ShareToken();
        falseToken = new ShareToken();
        trueToken.mint(address(this), 10**30);  //10^12 tokens considering decimal 18
        falseToken.mint(address(this), 10**30); //10^12 tokens
        
        totalPriceOfRemainingTokens = 10**30;

    }
    
     function bet(uint _amount, bool _userBet, address _userAddress) public 
                                                                    // twoDaysBeforeBetResolve 
                                                                    onlyOwner {
        require(_amount != 0);
        ShareToken _shareToken;
        if(_userBet) {
            _shareToken = trueToken;
        } else {
            _shareToken = falseToken;
        }
        uint _sharesLeft = _shareToken.balanceOf(address(this));
        uint _sharesToBeTransferred = _amount * _sharesLeft/totalPriceOfRemainingTokens;
        volume += _amount;
        _userBet ? userOwnedTrueTokens[_userAddress] += _sharesToBeTransferred : userOwnedFalseTokens[_userAddress] += _sharesToBeTransferred;
        _userBet ? trueTokensInMarket += _sharesToBeTransferred : falseTokensInMarket += _sharesToBeTransferred;
        _shareToken.transfer(_userAddress, _sharesToBeTransferred);
    }
    
    function claimableFunds(address _userAddress) public view returns(uint){
        if(keccak256(abi.encodePacked(symbol)) == keccak256(abi.encodePacked(greaterSymbol)) && predictionPrice * 10e18 > resolvedPrice) {
            return userOwnedTrueTokens[_userAddress] * volume/trueTokensInMarket;
        } else {
            return userOwnedFalseTokens[_userAddress] * volume/falseTokensInMarket;    
        }
        
        if(keccak256(abi.encodePacked(symbol)) == keccak256(abi.encodePacked(lessSymbol)) && predictionPrice * 10e18 < resolvedPrice) {
            return userOwnedTrueTokens[_userAddress] * volume/trueTokensInMarket;
        } else {
            return userOwnedFalseTokens[_userAddress] * volume/falseTokensInMarket;    
        }
    }
    
    function claimFunds(address _userAddress) public {
        hasUserClaimed[_userAddress] = true;
    }
    
    function requestAlarmClock() public onlyOwner{
        Chainlink.Request memory req = buildChainlinkRequest(alamClockJobId, address(this), this.requestVolumeData.selector);
        req.addUint("until", betResolveTime);
        sendChainlinkRequestTo(oracle, req, fee);
    }
    
    /**0xb113D314C4946B328a44efE177DC956B77094337,0x405D6C6551a91F0e9eEFfB7b9d0f731FeD3A061f
     * Create a Chainlink request to retrieve API response, find the target
     * data, then multiply by 1000000000000000000 (to remove decimal places from data).
     */
    function requestVolumeData() public returns (bytes32 requestId) 
    {
        require(block.timestamp > betResolveTime);
        Chainlink.Request memory request = buildChainlinkRequest(getCallJobId, address(this), this.fulfill.selector);
        
        request.add("get", url);
        
        string[] memory path = new string[](2);
        path[0] = "Global Quote";
        path[1] = "05. price";
        request.addStringArray("path", path);
        alarmClockResolved = true;  
        int timesAmount = 10**18;
        request.addInt("times", timesAmount);
        return sendChainlinkRequestTo(oracle, request, fee);
    }
    
    /**
     * Receive the response in the form of uint256
     */ 
    function fulfill(bytes32 _requestId, uint256 _price) public recordChainlinkFulfillment(_requestId)
    {
        require(block.timestamp > betResolveTime && !betResolved);
        resolvedPrice = _price;
        betResolved = true;
    }

    
} 