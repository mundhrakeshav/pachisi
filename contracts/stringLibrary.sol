//SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;


library String {
 
    function setDai(string memory a, string memory b) public pure returns(bool){
        return keccak256(abi.encode(a)) == keccak256(abi.encode(b));
    }
    
    
    function concat5(string memory  a, string memory  b, string memory c, string memory d, string memory e) internal pure returns (string memory) {
        return string(abi.encodePacked(a, b, c, d, e));
    }
    
    
    function concat2(string memory  a, string memory  b) internal pure returns (string memory) {
        return string(abi.encodePacked(a, b));
    }
    
    function compareCOn() public {
        
    }
 
}