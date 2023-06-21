// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./MyNFT.sol";

contract Deposit {
    IERC20 public usdt;

    MyNFT public myNft;

    constructor( address _usdt, address _myNft) {
        usdt = IERC20(_usdt);
        myNft = MyNFT(_myNft);
    }

    function deposit(address _tokenType, uint256 _amount, string memory tokenURI) public {
        // Amount must be greater than zero
        require(_amount > 0, "amount cannot be 0");

        // Transfer MyToken to smart contract
        // token.safeTransferFrom(msg.sender, address(this), _amount);
        IERC20(_tokenType).transferFrom(msg.sender, address(this), _amount);

        // Mint FarmToken to msg sender
        myNft.mintNFT(msg.sender, tokenURI);
    }
}