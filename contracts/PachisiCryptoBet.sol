
pragma solidity ^0.6.7;
import "https://raw.githubusercontent.com/smartcontractkit/chainlink/develop/evm-contracts/src/v0.6/ChainlinkClient.sol";
import "https://github.com/smartcontractkit/chainlink/blob/develop/evm-contracts/src/v0.6/interfaces/AggregatorV3Interface.sol";
import "./pachisiCryptoPrediction.sol";



contract PachisiCryptoBet is ChainlinkClient {
       
       
    address daiContractAddress = 0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD;
     
     
    bool public betResolved;
    ERC20 daiContract;
    AggregatorV3Interface private priceFeed;
    uint public betResolveTime;
    string public betToken;
    address public aggregatorAddress;
    address private oracle;
    bytes32 private jobId;
    uint256 private fee;
    uint public betRange;
    int public resolvedPrice;
    
    constructor(address _aggregatorAddress, uint _betResolveTime, uint _betRange) public {
        setPublicChainlinkToken();
        oracle = 0xAA1DC356dc4B18f30C347798FD5379F3D77ABC5b;
        jobId = "982105d690504c5d9ce374d040c08654";
        fee = 0.1 * 10 ** 18; // 0.1 LINK
        betResolved = false;
        betResolveTime = _betResolveTime;
        priceFeed = AggregatorV3Interface(_aggregatorAddress);
        betRange = _betRange;
    }
    
    modifier afterBetResolveTime() {
        require(block.timestamp >= betResolveTime, "This function can't be called before bet is resolved.");
        _;
    }
    
    modifier twoDaysBeforeBetResolve() {
        require(block.timestamp <= betResolveTime + (86400 * 2), "This functionality isn't available in last 2 days of bet.");
        _;
    }
    
    modifier betNotMadeYet() {
        require(amountUsersBet[msg.sender] != 0);
        require(usersBetsLowerLimit[msg.sender] != 0);
        _;
    }
    
    mapping(address => uint256) amountUsersBet;
    mapping(address => uint256) usersBetsLowerLimit;
    
    function bet(uint _amount, uint _lowerLimit) public betNotMadeYet twoDaysBeforeBetResolve {
        require(_amount != 0);
        amountUsersBet[msg.sender] = _amount;
        usersBetsLowerLimit[msg.sender] = _lowerLimit;
    }
    
    
    function requestAlarmClock(uint256 timeInSeconds) public returns (bytes32 requestId) {
        Chainlink.Request memory request = buildChainlinkRequest(jobId, address(this), this.getPrice.selector);
        request.addUint("until", block.timestamp + timeInSeconds);
        return sendChainlinkRequestTo(oracle, request, fee);
    }
    
     function getPrice(bytes32 _requestId, uint256 _volume) public recordChainlinkFulfillment(_requestId) {
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
