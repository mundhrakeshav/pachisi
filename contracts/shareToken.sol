pragma solidity ^0.6.7;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v3.4/contracts/token/ERC20/ERC20.sol";
import "./Ownable.sol";

contract ShareToken is ERC20("Pachisi Share Token", "PST"), Ownable{
    
    function mint(address _account, uint _amount) public onlyOwner{
        _mint(_account, _amount);
    }
}