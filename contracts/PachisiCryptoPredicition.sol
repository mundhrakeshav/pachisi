
pragma solidity ^0.6.7;
import "https://github.com/smartcontractkit/chainlink/blob/develop/evm-contracts/src/v0.6/interfaces/AggregatorV3Interface.sol";
import "./pachisiCryptoBet.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol";



contract PachisiCryptoPrediction {
    
    address public daiContractAddress = 0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD;
    address public linkContractAddress = 0xa36085F69e2889c224210F603D836748e7dC0088;
    
    uint public contractDeployedTimestamp;
    uint public intervalTime;
    ERC20 daiContract;
    ERC20 linkContract;

    
    mapping(string => address) public USDPairAggregatorAddress;
    mapping(string => address) public ETHPairAggregatorAddress;
    mapping(string => mapping (uint => address)) public cryptoBetUSDContractsAddresses; //TokenName => timeResolved => contractAddress
    mapping(string => mapping (uint => address)) public cryptoBetETHContractsAddresses; //TokenName => timeResolved => contractAddress
    mapping(string => mapping (uint => uint)) public betETHResolvedPrice; //TokenName => timeResolved => priceAtTimeOfBetResolving
    mapping(string => mapping (uint => uint)) public betUSDResolvedPrice; //TokenName => timeResolved => priceAtTimeOfBetResolving
    mapping(string => uint) public usdBetRange;
    mapping(string => uint) public ethBetRange;
    
    constructor() public {
        contractDeployedTimestamp = block.timestamp;
        intervalTime = 604800;
        daiContract = ERC20(daiContractAddress);
        linkContract = ERC20(linkContractAddress);

    }
    
    
    function setUSDBetRange(string memory _tokenName, uint _betRange) public {
        usdBetRange[_tokenName] = _betRange;
    }
    
    function setETHBetRange(string memory _tokenName, uint _betRange) public {
        ethBetRange[_tokenName] = _betRange;
    }
    
    function addUSDPairAggregatorAddress(string memory _tokenName, address _aggregatorAddress) public {
        require(USDPairAggregatorAddress[_tokenName] == address(0x0));
        USDPairAggregatorAddress[_tokenName] = _aggregatorAddress;
    }
    
    function addETHPairAggregatorAddress(string memory _tokenName, address _aggregatorAddress) public {
        require(ETHPairAggregatorAddress[_tokenName] == address(0x0));
        ETHPairAggregatorAddress[_tokenName] = _aggregatorAddress;
    }
    
    function usdBet(string memory _tokenName ,uint _betResolveTime, uint _amountToBet) public {
        if(cryptoBetUSDContractsAddresses[_tokenName][_betResolveTime] == address(0x0)) {
            makeUSDBet(_tokenName, _betResolveTime);
        } 
        placeUSDBet(_tokenName,_betResolveTime);
    }
    
    function ethBet(string memory _tokenName ,uint _betResolveTime, uint _amountToBet) public {
        if(cryptoBetETHContractsAddresses[_tokenName][_betResolveTime] == address(0x0)){
            makeETHBet(_tokenName, _betResolveTime);
        }
        placeETHBet(_tokenName, _betResolveTime);
    }
    
    //check link balance of this contract
    function makeUSDBet(string memory _tokenName ,uint _betResolveTime) public {
        require(cryptoBetUSDContractsAddresses[_tokenName][_betResolveTime] == address(0x0));
        PachisiCryptoBet _pachisiCryptoBet= new PachisiCryptoBet(USDPairAggregatorAddress[_tokenName], _betResolveTime, usdBetRange[_tokenName]);
        _pachisiCryptoBet.requestAlarmClock(_betResolveTime);
        cryptoBetUSDContractsAddresses[_tokenName][_betResolveTime] = address(_pachisiCryptoBet);
    }
    
    function makeETHBet(string memory _tokenName ,uint _betResolveTime) public {
        require(cryptoBetETHContractsAddresses[_tokenName][_betResolveTime] == address(0x0));
        PachisiCryptoBet _pachisiCryptoBet= new PachisiCryptoBet(ETHPairAggregatorAddress[_tokenName], _betResolveTime, ethBetRange[_tokenName]);
        _pachisiCryptoBet.requestAlarmClock(_betResolveTime);
        cryptoBetETHContractsAddresses[_tokenName][_betResolveTime] = address(_pachisiCryptoBet);
    }
    
    function placeUSDBet(string memory _tokenName ,uint _betResolveTime) public {
        
    }
    
    function placeETHBet(string memory _tokenName ,uint _betResolveTime) public {
        
    }
    
    
    function getLatestPrice(address _aggregatorAddress) public view returns (int) {
        AggregatorV3Interface _priceFeed = AggregatorV3Interface(_aggregatorAddress);
        (
            uint80 roundID, 
            int price,
            uint startedAt,
            uint timeStamp,
            uint80 answeredInRound
        ) = _priceFeed.latestRoundData();
        return price;
    }
    
}  
    /**
     * Network: Kovan
    // BAT / USD	0x8e67A0CFfbbF6A346ce87DFe06daE2dc782b3219
    // BNB / USD	0x8993ED705cdf5e84D0a3B754b5Ee0e1783fcdF16
    // BTC / USD	0x6135b13325bfC4B00278B4abC5e20bbce2D6580e
    // ETH / USD	0x9326BFA02ADD2366b30bacB125260Af641031331
    // LINK / USD	0x396c5E36DD0a0F5a5D33dae44368D4193f69a1F0
    // LTC / USD	0xCeE03CF92C7fFC1Bad8EAA572d69a4b61b6D4640
    // SNX / USD	0x31f93DA9823d737b7E44bdee0DF389Fe62Fd1AcD
    // TRX / USD	0x9477f0E5bfABaf253eacEE3beE3ccF08b46cc79c
    // XRP / USD	0x3eA2b7e3ed9EA9120c3d6699240d1ff2184AC8b3 
    // XTZ / USD	0xC6F39246494F25BbCb0A8018796890037Cb5980C 
     */
     
    // AAVE / ETH	0xd04647B7CB523bb9f26730E9B6dE1174db7591Ad
    // BAT / ETH	0x0e4fcEC26c9f85c3D714370c98f43C4E02Fc35Ae
    // BTC / ETH	0xF7904a295A029a3aBDFFB6F12755974a958C7C25
    // ENJ / ETH	0xfaDbe2ee798889F02d1d39eDaD98Eff4c7fe95D4
    // KNC / ETH	0xb8E8130d244CFd13a75D6B9Aee029B1C33c808A7
    // LINK / ETH	0x3Af8C569ab77af5230596Acf0E8c2F9351d24C38
    // MANA / ETH	0x1b93D8E109cfeDcBb3Cc74eD761DE286d5771511
    // MKR / ETH	0x0B156192e04bAD92B6C1C13cf8739d14D78D5701
    // REN / ETH	0xF1939BECE7708382b5fb5e559f630CB8B39a10ee
    // REP / ETH	0x3A7e6117F2979EFf81855de32819FBba48a63e9e
    // SNX / ETH	0xF9A76ae7a1075Fe7d646b06fF05Bd48b9FA5582e
    // UNI / ETH	0x17756515f112429471F86f98D5052aCB6C47f6ee
    // YFI / ETH	0xC5d1B1DEb2992738C0273408ac43e1e906086B6C
    // ZRX / ETH	0xBc3f28Ccc21E9b5856E81E6372aFf57307E2E883