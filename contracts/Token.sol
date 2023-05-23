// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";

contract Token {
    string public name;
    string public symbol;
    uint256 public decimals = 18;
    uint public totalSupply = 1000000 * (10 ** decimals);
    // Tracking balance:
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint)) public allowance;

    event Transfer(address indexed from, address indexed to, uint value);
    event approval(address owner, address spender, uint value);

    constructor(string memory _name, string memory _symbol, uint _totalSupply) {
        name = _name;
        symbol = _symbol;
        totalSupply = _totalSupply * (10 ** decimals);
        balanceOf[msg.sender] = totalSupply;
    }

    function transfer(address _to, uint _value) public returns (bool sucess) {
        // Requires that spender has enough amount to spend :
        require(balanceOf[msg.sender] >= _value);
        _transfer(msg.sender,_to,_value);

        return true;
    }

    function _transfer(address _from, address _to, uint _value) internal {
        require(_to != address(0));
        
        // debet tokens from account / deduct tokens from spender
        balanceOf[_from] = balanceOf[_from] - _value;
        // credit tokens to another account
        balanceOf[_to] = balanceOf[_to] + _value;


        emit Transfer(_from, _to, _value);
    }

    function approve(
        address _spender,
        uint _value
    ) public returns (bool sucess) {
        require(_spender != address(0));

        allowance[msg.sender][_spender] = _value;
        emit approval(msg.sender, _spender, _value);
        return true;
    }

    function transferFrom(
        address _from,
        address _to,
        uint _value
    ) public returns (bool success) {
        // check approval
        require(_value<=balanceOf[_from]);
        require(_value<=allowance[_from][msg.sender]);

        //reset allownace : 
        allowance[_from][msg.sender] =allowance[_from][msg.sender] - _value;    
        // spend tokens
        _transfer(_from,_to,_value);
        return true;
    }
}
