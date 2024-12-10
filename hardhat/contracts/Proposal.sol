// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import "./Proposition.sol";

contract Proposal {
    Proposition[] public propositions;

    event ProposalCreated(address indexed propositionAddress, string description);

    function addProposition(Proposition proposition) external {
        propositions.push(proposition);

        emit ProposalCreated(address(proposition), proposition.description());
    }

    function getActiveProposals() external view returns (Proposition[] memory) {
        uint256 count = 0;
        for (uint i = 0; i < propositions.length; i++) {
            if (propositions[i].isActive()) {
                count++;
            }
        }

        Proposition[] memory activeProposals = new Proposition[](count);
        uint index;
        for (uint i = 0; i < propositions.length; i++) {
            if (propositions[i].isActive()) {
                activeProposals[index++] = propositions[i];
            }
        }

        return activeProposals;
    }

    function getExpiredProposals() external view returns (Proposition[] memory) {
        uint256 count = 0;

        for (uint i = 0; i < propositions.length; i++) {
            if (!propositions[i].isActive()) {
                count++;
            }
        }
        if (count == 0) {
            return new Proposition[](0);
        }

        Proposition[] memory expiredProposals = new Proposition[](count);
        uint256 index = 0;

        for (uint i = 0; i < propositions.length; i++) {
            if (propositions[i].isActive()) {

                expiredProposals[index] = propositions[i];
                index++;
            }
        }

        return expiredProposals;
    }
}