// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

//import "hardhat/console.sol";

contract CustomAssessment {
    address payable public accountHolder;
    uint256 public balance;

    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);

    constructor(uint256 initialBalance) payable {
        accountHolder = payable(msg.sender);
        balance = initialBalance;
    }

    function getBalance() public view returns(uint256){
        return balance;
    }

    function deposit(uint256 _amount) public payable {
        uint _previousBalance = balance;

        // Ensure the caller is the account holder
        require(msg.sender == accountHolder, "Only the account holder can deposit");

        // Perform the deposit transaction
        balance += _amount;

        // Emit the Deposit event
        emit Deposit(_amount);

        // Assert transaction completed successfully
        assert(balance == _previousBalance + _amount);
    }

    // Custom error for insufficient balance
    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

    function withdraw(uint256 _withdrawAmount) public {
        // Ensure the caller is the account holder
        require(msg.sender == accountHolder, "Only the account holder can withdraw");

        uint _previousBalance = balance;
        
        // Check if the balance is sufficient for withdrawal
        if (balance < _withdrawAmount) {
            revert InsufficientBalance({
                balance: balance,
                withdrawAmount: _withdrawAmount
            });
        }

        // Perform the withdrawal transaction
        balance -= _withdrawAmount;

        // Emit the Withdraw event
        emit Withdraw(_withdrawAmount);

        // Assert the balance is correct
        assert(balance == (_previousBalance - _withdrawAmount));
    }
}
