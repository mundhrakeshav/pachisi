pragma solidity ^0.6.7;
pragma experimental ABIEncoderV2;

import {NFT} from "./NFT.sol";
import {PachisiCryptoNFTBet} from"./pachisiCryptoNFTBet.sol";
import {ERC20Client} from "../pachisiERC20Client.sol";
contract NFTCryptoPrediction is ERC20Client{
  
    mapping(string => address) public USDPairAggregatorAddress; //TokenName => aggregatorAddress
    mapping(string => address) public ETHPairAggregatorAddress; //TokenName => aggregatorAddress
    
    // mapping(string => mapping (uint => address)) public cryptoBetUSDContractsAddresses; //TokenName => timeResolved => contractAddress
    // mapping(string => mapping (uint => address)) public cryptoBetETHContractsAddresses; //TokenName => timeResolved => contractAddress
    
    address[] public tokenUSDBetAddresses;
    address[] public tokenETHBetAddresses;
    
    //TODO
    mapping(address => mapping(string => address[])) public userBetsUSD;
    mapping(address => mapping(string => address[])) public userBetsETH;
    
    function getUSDBets() public view returns(address[] memory) {
        return tokenUSDBetAddresses;
    }    
    
    function getETHBets() public view returns(address[] memory) {
        return tokenETHBetAddresses;
    }
    
    function addUSDPairAggregatorAddress(string memory _tokenName, address _aggregatorAddress) public {
        require(USDPairAggregatorAddress[_tokenName] == address(0x0));
        USDPairAggregatorAddress[_tokenName] = _aggregatorAddress;
    }
    
    function addETHPairAggregatorAddress(string memory _tokenName, address _aggregatorAddress) public {
        require(ETHPairAggregatorAddress[_tokenName] == address(0x0));
        ETHPairAggregatorAddress[_tokenName] = _aggregatorAddress;
    }
    
     function createUSDBet( string memory _betToken, 
                            uint _betResolveTime, 
                            uint _predictionPrice, 
                            string memory _betSymbol,
                            address _assetNFTAddress,
                            uint _tokenID
                            ) public enoughLinkBalanceOnContract {
        require(USDPairAggregatorAddress[_betToken] != address(0x0));
        PachisiCryptoNFTBet _pachisiCryptoNFTBet = new PachisiCryptoNFTBet(USDPairAggregatorAddress[_betToken], 
                                                                            _betResolveTime, 
                                                                            _predictionPrice, 
                                                                            msg.sender, 
                                                                            _betSymbol, 
                                                                            _betToken, 
                                                                            "USD");
                                                                            
        linkContract.transfer(address(_pachisiCryptoNFTBet), 2 * 10**17);
        
        NFT _nft = NFT(_assetNFTAddress);
        _nft.transferFrom(msg.sender, address(_pachisiCryptoNFTBet), _tokenID);
        _pachisiCryptoNFTBet.initialiseBet( _assetNFTAddress, _tokenID, msg.sender);
        userBetsUSD[msg.sender][_betToken].push(address(_pachisiCryptoNFTBet));
        tokenUSDBetAddresses.push(address(_pachisiCryptoNFTBet));
        
        _pachisiCryptoNFTBet.requestAlarmClock();
    }
    
    
    function createETHBet(  string memory _betToken, 
                            uint _betResolveTime, 
                            uint _predictionPrice, 
                            string memory _betSymbol,
                            address _assetNFTAddress,
                            uint _tokenID
                            ) public enoughLinkBalanceOnContract {
        require(ETHPairAggregatorAddress[_betToken] != address(0x0));
        PachisiCryptoNFTBet _pachisiCryptoNFTBet = new PachisiCryptoNFTBet(ETHPairAggregatorAddress[_betToken], 
                                                                            _betResolveTime, 
                                                                            _predictionPrice, 
                                                                            msg.sender, 
                                                                            _betSymbol, 
                                                                            _betToken, 
                                                                            "ETH");
                                                                            
        _pachisiCryptoNFTBet.initialiseBet( _assetNFTAddress, _tokenID, msg.sender);
        NFT _nft = NFT(_assetNFTAddress);
        _nft.transferFrom(msg.sender, address(_pachisiCryptoNFTBet), _tokenID);
        userBetsETH[msg.sender][_betToken].push(address(_pachisiCryptoNFTBet));
        linkContract.transfer(address(_pachisiCryptoNFTBet), 10**17);
        tokenETHBetAddresses.push(address(_pachisiCryptoNFTBet));
        _pachisiCryptoNFTBet.requestAlarmClock();
    }
    
    function agreeBet(address _assetNFTAddress, uint _tokenID, address _betAddress) public {
        PachisiCryptoNFTBet _pachisiCryptoNFTBet = PachisiCryptoNFTBet(_betAddress);
        _pachisiCryptoNFTBet.agreeBet(_assetNFTAddress, _tokenID, msg.sender);
        NFT _nft = NFT(_assetNFTAddress);
        _nft.transferFrom(msg.sender, _betAddress, _tokenID);
    }
    
    function finaliseBet(address _betAddress) public {
        PachisiCryptoNFTBet _pachisiCryptoNFTBet = PachisiCryptoNFTBet(_betAddress);
        _pachisiCryptoNFTBet.finalise();
    }
    
    function denyBet(address _betAddress) public {
        PachisiCryptoNFTBet _pachisiCryptoNFTBet = PachisiCryptoNFTBet(_betAddress);
        _pachisiCryptoNFTBet.denyBet();
        
    }
    
      
    function claimBet(address _betAddress) public {
        PachisiCryptoNFTBet _pachisiCryptoNFTBet = PachisiCryptoNFTBet(_betAddress);
        _pachisiCryptoNFTBet.claimFunds();
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


