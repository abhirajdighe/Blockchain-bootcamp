// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "./Token.sol";

contract Exchange{
    address public feeAccount;
    uint public feePersent;
    mapping(address=>mapping(address=>uint)) public tokens;

    event Deposit(address token,address user,uint amount,uint balance);

    constructor (address _feeAccount,uint _feePersent){
        feeAccount = _feeAccount;
        feePersent = _feePersent;
    }

    //Deposit tokens
    function depositToken(address _token,uint _amount) public{
        // transfer token to exchange
        require(Token(_token).transferFrom(msg.sender, address(this), _amount));
        // update balance
        tokens[_token][msg.sender]=tokens[_token][msg.sender]+ _amount;
        // emit event
        emit Deposit(_token,msg.sender,_amount,tokens[_token][msg.sender]);
    }


    // check balances
    function balanceOf(address _token,address _user)
    public view returns(uint){
        return tokens[_token][_user];
    }
}
