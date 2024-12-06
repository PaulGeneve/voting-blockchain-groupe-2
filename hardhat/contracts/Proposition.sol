// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

contract Proposition {
    address public owner;
    string public description;
    uint256 public endTime;
    mapping(address => bool) public hasVoted;
    uint256 public yesVotes;
    uint256 public noVotes;
    bool public votingEnded;

    event Voted(address indexed voter, bool vote);
    event VotingEnded();

    modifier onlyBeforeEnd() {
        require(block.timestamp < endTime, "Voting period has ended.");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    modifier votingActive() {
        require(!votingEnded, "Voting has ended");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // Function to cast a vote (true for yes, false for no)
    function vote(bool _vote) external votingActive {
        require(!hasVoted[msg.sender], "You have already voted");
        hasVoted[msg.sender] = true;

        if (_vote) {
            yesVotes++;
        } else {
            noVotes++;
        }

        emit Voted(msg.sender, _vote);
    }

    // Function to end the voting process
    function endVoting() external onlyOwner votingActive {
        votingEnded = true;
        emit VotingEnded();
    }

    // Function to retrieve the vote counts (optional, could be public vars)
    function getResults() external view returns (uint256 yes, uint256 no) {
        return (yesVotes, noVotes);
    }

    function getVotePercentage() public view returns (uint256 forPercentage, uint256 againstPercentage) {
        uint256 totalVotes = yesVotes + noVotes;
        if (totalVotes == 0) {
            return (0, 0);
        }
        forPercentage = (yesVotes * 100) / totalVotes;
        againstPercentage = (noVotes * 100) / totalVotes;
        return (forPercentage, againstPercentage);
    }
}
