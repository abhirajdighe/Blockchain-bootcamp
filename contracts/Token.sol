// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";

contract Token{
    string public name ;
    string public symbol;
    uint256 public decimals = 18;
    uint public totalSupply = 1000000 * (10**decimals);

    constructor(string memory _name,string memory _symbol,uint _totalSupply){
        name= _name;
        symbol = _symbol;
        totalSupply = _totalSupply*(10**decimals);
    }
}