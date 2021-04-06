pragma solidity ^0.6.7;
pragma experimental ABIEncoderV2;


import {NFT} from "./NFT.sol";

contract Kitty is NFT {
    
    enum Breed{Persian, RagDoll, British}
    
    struct Cat {
        string name;
        uint mintTime;
        Breed breed;
    }
    
    
    mapping(uint => Cat) public tokenDetails;
    constructor(string memory _name, string memory _symbol) public NFT(_name, _symbol) {
    }
    
    function mint(address _to, string memory _name, Breed _breed, uint _tokenID) public {
        Cat memory _cat = Cat(_name, block.timestamp, _breed);
        _mint(_to, _tokenID);
        tokenDetails[_tokenID] = _cat;
    } 
    

}
// 