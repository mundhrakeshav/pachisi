//SPDX-License-Identifier:MIT
pragma solidity ^0.6.7;
pragma experimental ABIEncoderV2;

import "https://raw.githubusercontent.com/smartcontractkit/chainlink/develop/evm-contracts/src/v0.6/ChainlinkClient.sol";
import "https://github.com/smartcontractkit/chainlink/blob/develop/evm-contracts/src/v0.6/interfaces/AggregatorV3Interface.sol";
import "../Ownable.sol";
import {NFT} from "./NFT.sol";

contract PachisiCryptoNFTBet is ChainlinkClient, Ownable {
    
    
    enum BetStage {Created, Initialised, AgreedOnBet, Finalised, Resolved}
    
    struct Bet{
        address betPartyAddress;
        address assetNFTAddress;
        uint tokenID;
    }
    
    BetStage public betStage;
    
    bool public betResolved; //If bet has been resolved
    AggregatorV3Interface private priceFeed;
    uint public betResolveTime; // Time when bet will be resolved
    
    address public aggregatorAddress;
    address private oracle;
    bytes32 private jobId;
    uint256 private fee;
    int public resolvedPrice; //price during bet resolve time
    bytes public symbol; //greaterThan or lessThan
    bytes public constant greaterSymbol = bytes(">"); //greateThan or lessThan
    bytes public constant lessSymbol = bytes("<"); //greaterThan or lessThan

    uint public predictionPrice; //price is greaterThan/lessThan predictionPrice

    mapping (address => bool) public hasUserClaimed; // Will be turned to true after user has claimed the rewards
    string public betToken; //What token is the bet placed on
    string public betPair; //ETH or USD

    Bet public initialiserBet;
    Bet public secondaryBet;
    
    constructor(address _aggregatorAddress, uint _betResolveTime, uint _predictionPrice, address _betMakerAddress, string memory _betSymbol, string memory _betToken, string memory _betPair) public {
        setPublicChainlinkToken();
        oracle = 0xAA1DC356dc4B18f30C347798FD5379F3D77ABC5b;
        jobId = "982105d690504c5d9ce374d040c08654";
        fee = 0.1 * 10 ** 18; // 0.1 LINK
        
        priceFeed = AggregatorV3Interface(_aggregatorAddress);
        betResolved = false;
        betResolveTime = _betResolveTime;

        symbol = bytes(_betSymbol);
        predictionPrice = _predictionPrice;
        betToken = _betToken;
        betPair = _betPair;
        initialiserBet.betPartyAddress = _betMakerAddress;
        betStage =  BetStage.Created;
    }
    
    modifier afterBetResolveTime() {
        require(block.timestamp >= betResolveTime, "This function can't be called before bet is resolved.");
        _;
    }
    
    modifier twoDaysBeforeBetResolve() {
        require(block.timestamp <= betResolveTime - (86400 * 2), "This functionality isn't available in last 2 days of bet.");
        _;
    }

    function initialiseBet(address _assetNFTAddress, uint _tokenID, address _userAddress) public {
        betStage =  BetStage.Initialised;
        initialiserBet.assetNFTAddress = _assetNFTAddress;
        initialiserBet.tokenID = _tokenID;
        requestAlarmClock();
    }
    
    function agreeBet(address _assetNFTAddress, uint _tokenID, address _userAddress) public {
        require(betStage !=  BetStage.Resolved);
        NFT _nft = NFT(_assetNFTAddress);
        secondaryBet.betPartyAddress = _userAddress;
        secondaryBet.assetNFTAddress = _assetNFTAddress;
        secondaryBet.tokenID = _tokenID;
        betStage =  BetStage.AgreedOnBet;
    }

    function finalise() public {
        require(betStage !=  BetStage.Resolved);
        betStage =  BetStage.Finalised;
    }
    
    function denyBet() public {
        require(betStage !=  BetStage.Resolved);
        NFT _nft = NFT(secondaryBet.assetNFTAddress);
        _nft.transfer(secondaryBet.betPartyAddress, secondaryBet.tokenID);
        betStage =  BetStage.Initialised;
    }
    
        
    function claimFunds() public {
        require(betStage ==  BetStage.Resolved);
      if(keccak256(abi.encodePacked(symbol)) == keccak256(abi.encodePacked(greaterSymbol)) && int(predictionPrice) > resolvedPrice) {
            NFT _nftInitial = NFT(initialiserBet.assetNFTAddress);
            _nftInitial.transfer(initialiserBet.betPartyAddress, initialiserBet.tokenID);
            NFT _nftSecondary = NFT(secondaryBet.assetNFTAddress);
            _nftSecondary.transfer(initialiserBet.betPartyAddress, initialiserBet.tokenID);
        } else {
            NFT _nftInitial = NFT(initialiserBet.assetNFTAddress);
            _nftInitial.transfer(secondaryBet.betPartyAddress, secondaryBet.tokenID);
            NFT _nftSecondary = NFT(secondaryBet.assetNFTAddress);
            _nftSecondary.transfer(secondaryBet.betPartyAddress, secondaryBet.tokenID);
        }
        
        if(keccak256(abi.encodePacked(symbol)) == keccak256(abi.encodePacked(lessSymbol)) && int(predictionPrice) < resolvedPrice) {
            NFT _nftInitial = NFT(initialiserBet.assetNFTAddress);
            _nftInitial.transfer(initialiserBet.betPartyAddress, initialiserBet.tokenID);
            NFT _nftSecondary = NFT(secondaryBet.assetNFTAddress);
            _nftSecondary.transfer(initialiserBet.betPartyAddress, initialiserBet.tokenID);
        } else {
            NFT _nftInitial = NFT(initialiserBet.assetNFTAddress);
            _nftInitial.transfer(secondaryBet.betPartyAddress, secondaryBet.tokenID);
            NFT _nftSecondary = NFT(secondaryBet.assetNFTAddress);
            _nftSecondary.transfer(secondaryBet.betPartyAddress, secondaryBet.tokenID);
        }
        
    }
    
    function requestAlarmClock() public returns(bytes32 requestId) {
        require(block.timestamp <= betResolveTime);
        Chainlink.Request memory request = buildChainlinkRequest(jobId, address(this), this.getPrice.selector);
        request.addUint("until", betResolveTime);

        return sendChainlinkRequestTo(oracle, request, fee);
    }

    
    function getPrice(bytes32 _requestId) public afterBetResolveTime recordChainlinkFulfillment(_requestId) {
        require(betStage !=  BetStage.Resolved);
        resolvedPrice = getLatestPrice();
        betResolved = true;
        betStage =  BetStage.Resolved;
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
