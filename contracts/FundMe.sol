// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

//we want fund form some users
//we want withdraw all Funded amount
//we want modify a value

import "./PriceConvertor.sol";

contract FundMe {
    using PriceConvertor for uint256;

    uint256 MINIMUM_AMOUNT = 10 * 1e18; //10000000000000000000 wei = 10 $
    address public i_owner;
    address[] public funders;
    mapping(address => uint256) public funderToAmount;
    AggregatorV3Interface public priceFeed;

    constructor(address priceFeedAddress) {
        i_owner = msg.sender;
        priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    //fund
    function fund() public payable {
        require(
            msg.value.getConversion(priceFeed) > MINIMUM_AMOUNT,
            "Didn't send enough"
        );
        funders.push(msg.sender);
        funderToAmount[msg.sender] += msg.value;
    }

    function withdraw() public onlyOwner {
        for (uint256 funderIndex; funderIndex < funders.length; funderIndex++) {
            address funder = funders[funderIndex];
            funderToAmount[funder] += 0;
        }

        funders = new address[](0);

        //Use call to transfer amount
        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess, "call fail");
    }

    modifier onlyOwner() {
        require(msg.sender == i_owner, "function sender is not owner");
        _;
    }
}
