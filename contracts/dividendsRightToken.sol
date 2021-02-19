//SPDX-License-Identifier:MIT
pragma solidity 0.8.0;
pragma experimental ABIEncoderV2;


import {
    ISuperfluid,
    ISuperToken,
    SuperAppBase,
    SuperAppDefinitions
} from "https://github.com/superfluid-finance/protocol-monorepo/blob/remix-support/packages/ethereum-contracts/contracts/apps/SuperAppBase.sol";
import {
    IInstantDistributionAgreementV1
} from "https://github.com/superfluid-finance/protocol-monorepo/blob/remix-support/packages/ethereum-contracts/contracts/interfaces/agreements/IInstantDistributionAgreementV1.sol";

import { Ownable } from "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";
import { ERC20 } from "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol";


contract DividendRightsToken is
    Ownable,
    ERC20,
    SuperAppBase
{

    uint32 public constant INDEX_ID = 0;

    ISuperToken private _cashToken;
    ISuperfluid private _host;
    IInstantDistributionAgreementV1 private _ida;

    // use callbacks to track approved subscriptions
    mapping (address => bool) public isSubscribing;

    constructor(
        string memory name,
        string memory symbol,
        ISuperToken cashToken,
        ISuperfluid host,
        IInstantDistributionAgreementV1 ida)
        ERC20(name, symbol)
    {
        _cashToken = cashToken;
        _host = host;
        _ida = ida;

  
        _host.callAgreement(
            _ida,
            abi.encodeWithSelector(
                _ida.createIndex.selector,
                _cashToken,
                INDEX_ID,
                new bytes(0) // placeholder ctx
            ),
            new bytes(0) // user data
        );

        transferOwnership(msg.sender);
        // _setupDecimals(0); // no decimals
    }

    //Mint function
    /// @dev Issue new `amount` of giths to `beneficiary`
    function issue(address beneficiary, uint256 amount) external onlyOwner {
        // then adjust beneficiary subscription units
        uint256 currentAmount = balanceOf(beneficiary);

        // first try to do ERC20 mint
        ERC20._mint(beneficiary, amount);

        _host.callAgreement(
            _ida,
            abi.encodeWithSelector(
                _ida.updateSubscription.selector,
                _cashToken,
                INDEX_ID,
                beneficiary,
                uint128(currentAmount) + uint128(amount),
                new bytes(0) // placeholder ctx
            ),
            new bytes(0) // user data
        );
    }


    function approveSubscription() public {
                _host.callAgreement(
            _ida,
            abi.encodeWithSelector(
            _ida.approveSubscription.selector,
                _cashToken,
                address(this),
                INDEX_ID,
                new bytes(0) // placeholder ctx
            ),
            new bytes(0) // user data
        );
    }

    /// @dev Distribute `amount` of cash among all token holders
    function distribute(uint256 cashAmount) external onlyOwner {
        (uint256 actualCashAmount,) = _ida.calculateDistribution(
            _cashToken,
            address(this), INDEX_ID,
            cashAmount);

        _cashToken.transferFrom(owner(), address(this), actualCashAmount);

        _host.callAgreement(
            _ida,
            abi.encodeWithSelector(
                _ida.distribute.selector,
                _cashToken,
                INDEX_ID,
                actualCashAmount,
                new bytes(0) // placeholder ctx
            ),
            new bytes(0) // user data
        );
    }
    
    

    /// @dev ERC20._transfer override
    function _transfer(address sender, address recipient, uint256 amount) internal override {
        uint128 senderUnits = uint128(ERC20.balanceOf(sender));
        uint128 recipientUnits = uint128(ERC20.balanceOf(recipient));
        // first try to do ERC20 transfer
        ERC20._transfer(sender, recipient, amount);

        _host.callAgreement(
            _ida,
            abi.encodeWithSelector(
                _ida.updateSubscription.selector,
                _cashToken,
                INDEX_ID,
                sender,
                senderUnits - uint128(amount),
                new bytes(0) // placeholder ctx
            ),
            new bytes(0) // user data
        );

        _host.callAgreement(
            _ida,
            abi.encodeWithSelector(
                _ida.updateSubscription.selector,
                _cashToken,
                INDEX_ID,
                recipient,
                recipientUnits + uint128(amount),
                new bytes(0) // placeholder ctx
            ),
            new bytes(0) // user data
        );
    }

}
