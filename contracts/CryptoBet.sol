
pragma solidity ^0.6.7;
import "https://raw.githubusercontent.com/smartcontractkit/chainlink/develop/evm-contracts/src/v0.6/ChainlinkClient.sol";
import "https://github.com/smartcontractkit/chainlink/blob/develop/evm-contracts/src/v0.6/interfaces/AggregatorV3Interface.sol";
import "./CryptoPrediction.sol";
import "./ShareToken.sol";
import "./Ownable.sol";

contract PachisiCryptoBet is ChainlinkClient, Ownable {
    
    ShareToken public trueToken;
    ShareToken public falseToken;
        
    uint public totalPriceOfRemainingTokens;
    
    bool public betResolved; //If bet has been resolved
    AggregatorV3Interface private priceFeed;
    uint public betResolveTime; // Time when bet will be resolved
    string public betToken; //What token is the bet placed on
    string public betPair; //ETH or USD
    address public aggregatorAddress;
    address private oracle;
    bytes32 private jobId;
    uint256 private fee;
    int public resolvedPrice; //price during bet resolve time
    bytes public symbol; //greaterThan or lessThan
    bytes public constant greaterSymbol = bytes(">"); //greateThan or lessThan
    bytes public constant lessSymbol = bytes("<"); //greaterThan or lessThan

    uint public predictionPrice; //price is greaterThan/lessThan predictionPrice
    uint public volume;
    uint public trueTokensInMarket;
    uint public falseTokensInMarket;
    
    mapping (address => uint) public userOwnedTrueTokens;
    mapping (address => uint) public userOwnedFalseTokens;
    mapping (address => bool) public hasUserClaimed; // Will be turned to true after user has claimed the rewards

    constructor(address _aggregatorAddress, uint _betResolveTime, string memory _betPair, string memory _betToken, uint _predictionPrice, string memory _betSymbol) public {
        setPublicChainlinkToken();
        oracle = 0xAA1DC356dc4B18f30C347798FD5379F3D77ABC5b;
        jobId = "982105d690504c5d9ce374d040c08654";
        fee = 0.1 * 10 ** 18; // 0.1 LINK
        
        priceFeed = AggregatorV3Interface(_aggregatorAddress);
        betResolved = false;
        betResolveTime = _betResolveTime;
        betToken = _betToken;
        betPair = _betPair;
        trueToken = new ShareToken();
        falseToken = new ShareToken();
        trueToken.mint(address(this), 10**30);  //10^12 tokens considering decimal 18
        falseToken.mint(address(this), 10**30); //10^12 tokens
        
        symbol = bytes(_betSymbol);
        predictionPrice = _predictionPrice;
        totalPriceOfRemainingTokens = 10**30;
    }
    
    modifier afterBetResolveTime() {
        require(block.timestamp >= betResolveTime, "This function can't be called before bet is resolved.");
        _;
    }
    
    modifier twoDaysBeforeBetResolve() {
        require(block.timestamp <= betResolveTime - (86400 * 2), "This functionality isn't available in last 2 days of bet.");
        _;
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
        uint userOwnedShareTokens;
        if(keccak256(abi.encodePacked(symbol)) == keccak256(abi.encodePacked(greaterSymbol)) && int(predictionPrice) > resolvedPrice) {
            return userOwnedTrueTokens[_userAddress] * volume/trueTokensInMarket;
        } else {
            return userOwnedFalseTokens[_userAddress] * volume/falseTokensInMarket;    
        }
        
        if(keccak256(abi.encodePacked(symbol)) == keccak256(abi.encodePacked(lessSymbol)) && int(predictionPrice) < resolvedPrice) {
            return userOwnedTrueTokens[_userAddress] * volume/trueTokensInMarket;
        } else {
            return userOwnedFalseTokens[_userAddress] * volume/falseTokensInMarket;    
        }
    }
    
    function claimFunds(address _userAddress) public {
        hasUserClaimed[_userAddress] = true;

    }
    
    function requestAlarmClock(uint256 _betResolveTime) public returns(bytes32 requestId) {
        Chainlink.Request memory request = buildChainlinkRequest(jobId, address(this), this.getPrice.selector);
        request.addUint("until", _betResolveTime);
        return sendChainlinkRequestTo(oracle, request, fee);
    }
    
    function getPrice(bytes32 _requestId, uint256 _volume) public afterBetResolveTime recordChainlinkFulfillment(_requestId) {
        resolvedPrice = getLatestPrice();
        betResolved = true;
    }
    
    function getLatestPrice() public view returns (int) {
        (
            uint80 roundID, 
            int price,
            uint startedAt,
            uint timeStamp,
            uint80 answeredInRound
        ) = priceFeed.latestRoundData();
        return price;
    }
    
}  
