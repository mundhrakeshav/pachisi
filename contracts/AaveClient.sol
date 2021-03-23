
pragma solidity ^0.6.7;
import {LendingPool} from "https://github.com/aave/protocol-v2/blob/ice/mainnet-deployment-03-12-2020/contracts/protocol/lendingpool/LendingPool.sol";

contract AaveClient{
    address public AAVE_LENDING_POOL_ADDRESS = 0xE0fBa4Fc209b4948668006B2bE61711b7f465bAe;
    LendingPool public lendingPool = LendingPool(AAVE_LENDING_POOL_ADDRESS);
    
    
    function makeDepositToAave(address asset, uint256 amount, address onBehalfOf) public {
    // uint16 referralCode
        lendingPool.deposit(asset, amount, onBehalfOf, 0);
    }
    
    
    function withdrawFromAave(address asset, uint256 amount, address to) public {
        lendingPool.withdraw(asset, amount, to);
    }
    
}