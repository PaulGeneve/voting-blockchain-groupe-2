// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import "./Proposition.sol";

contract Proposal {
    struct Proposals {
        address proposalAddress;
        string description;
        uint256 createdAt;
        bool isActive;
    }

    Proposals[] public proposals;

    event ProposalCreated(address indexed proposalAddress, string description);

    function createProposal(string memory _description, uint256 _duration) external {
        Proposition newProposal = new Proposition(_description, _duration);
        address proposalAddress = address(newProposal);

        proposals.push(Proposals({
            proposalAddress: proposalAddress,
            description: _description,
            createdAt: block.timestamp,
            isActive: true
        }));

        emit ProposalCreated(proposalAddress, _description);
    }

    function getActiveProposals() external view returns (Proposals[] memory) {
        uint256 count = 0;
        for (uint i = 0; i < proposals.length; i++) {
            if (proposals[i].isActive) {
                count++;
            }
        }

        Proposals[] memory activeProposals = new Proposals[](count);
        uint index;
        for (uint i = 0; i < proposals.length; i++) {
            if (proposals[i].isActive) {
                activeProposals[index++] = proposals[i];
            }
        }

        return activeProposals;
    }

    function getExpiredProposals() external view returns (Proposals[] memory) {
        uint256 count = 0;

        // Compter combien de propositions expirées existent
        for (uint i = 0; i < proposals.length; i++) {
            if (proposals[i].isActive) {
                count++;
            }
        }

        // Créer le tableau dynamique en mémoire de la bonne taille
        Proposals[] memory expiredProposals = new Proposals[](count);
        uint256 index = 0;

        for (uint i = 0; i < proposals.length; i++) {
            if (proposals[i].isActive) {

                expiredProposals[index] = proposals[i];
                index++;
            }
        }

        return expiredProposals;
    }

}