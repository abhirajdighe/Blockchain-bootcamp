// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";

contract Exchange{
    address public feeAccount;
    uint public feePersent;

    constructor (address _feeAccount,uint _feePersent){
        feeAccount = _feeAccount;
        feePersent = _feePersent;
    }
}
