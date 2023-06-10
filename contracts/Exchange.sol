 // SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "./Token.sol";

contract Exchange{
    address public feeAccount;
    uint public feePersent;
    mapping(address=>mapping(address=>uint)) public tokens;
    mapping(uint => _Order) public orders;
    uint public orderCount;

    event Deposit(address token,address user,uint amount,uint balance);
    event Withdraw(address token,address user,uint amount,uint balance);
    
    event Order(
        // Attribute of an order :
        uint id,
        address user,
        address tokenGet,
        uint amountGet,
        address tokenGive,
        uint amountGive,
        uint timestamp
    );


    // A way to model order
    struct _Order{
        // Attribute of an order :
        uint id;
        address user;
        address tokenGet;
        uint amountGet;
        address tokenGive;
        uint amountGive;
        uint timestamp;
    }

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


    function withdrawToken(address _token,uint _amount)public{
        // Ensure user have enough tokens to withdraw : 
        require(tokens[_token][msg.sender]>=_amount);
        // transfer token to user
        Token(_token).transfer(msg.sender, _amount);
        // update balance
        tokens[_token][msg.sender]=tokens[_token][msg.sender]- _amount;
        // emit event
        emit Withdraw(_token,msg.sender,_amount,tokens[_token][msg.sender]);
    }

    // check balances
    function balanceOf(address _token,address _user)
    public view returns(uint){
        return tokens[_token][_user];
    }

    // Make and cancel order :

    function makeOrder(
        address _tokenGet,
        uint _amountGet,
        address _tokenGive,
        uint _amountGive
    ) public {
    // Token give (the token they want to spend) - which token and how much
    // token get  (the token they want to receive) - which token and how much
    require(balanceOf(_tokenGive,msg.sender)>=_amountGive);
    
    orderCount = orderCount+1;
    orders[orderCount]=_Order(
        orderCount,
        msg.sender,
        _tokenGet,
        _amountGet,
        _tokenGive,
        _amountGive,
        block.timestamp
    );

    // emit event :
    emit Order(
        orderCount,
        msg.sender,
        _tokenGet,
        _amountGet,
        _tokenGive,
        _amountGive,
        block.timestamp
    );

    }

}
