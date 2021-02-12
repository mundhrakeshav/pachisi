
pragma solidity 0.5.16;
import "./UsingTellor.sol";

contract SampleUsingTellor is UsingTellor {

  constructor(address payable _tellorAddress) UsingTellor(_tellorAddress) public {}

  function readTellorValue(uint256 _tellorID) external view returns (uint256) {
    //Helper function to get latest available value for that Id
    (bool ifRetrieve, uint256 value, uint256 _timestampRetrieved) = getCurrentValue(_tellorID);
    if(!ifRetrieve) return 0;
    return value;
  }

}