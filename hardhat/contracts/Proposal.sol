// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import "./Proposition.sol";

contract Proposal {
    Proposition[] public proposals;

    event ProposalCreated(address indexed proposalAddress, string description);

    function createProposal(string memory _description, uint256 _duration) external {
        Proposition newProposal = new Proposition(_description, _duration);
        proposals.push(newProposal);

        emit ProposalCreated(address(newProposal), _description);
    }

    function getActiveProposals() external view returns (Proposition[] memory) {
        uint256 count = 0;
        for (uint i = 0; i < proposals.length; i++) {
            if (proposals[i].isActive()) {
                count++;
            }
        }

        Proposition[] memory activeProposals = new Proposition[](count);
        uint index;
        for (uint i = 0; i < proposals.length; i++) {
            if (proposals[i].isActive()) {
                activeProposals[index++] = proposals[i];
            }
        }

        return activeProposals;
    }

    function getExpiredProposals() external view returns (Proposition[] memory) {
        uint256 count = 0;
        for (uint i = 0; i < proposals.length; i++) {
            if (!proposals[i].isActive()) {
                count++;
            }
        }

        Proposition[] memory expiredProposals = new Proposition[](count);
        uint256 index = 0;

        for (uint i = 0; i < proposals.length; i++) {
            if (!proposals[i].isActive()) {

                expiredProposals[index] = proposals[i];
                index++;
            }
        }

        return expiredProposals;
    }

}
