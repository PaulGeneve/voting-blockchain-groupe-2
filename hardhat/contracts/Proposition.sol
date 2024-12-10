// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

contract Proposition {
    address public owner;
    string public description;
    uint256 public endTime;
    mapping(address => bool) public hasVoted;
    uint256 public yesVotes;
    uint256 public noVotes;

    event Voted(address indexed voter, bool vote);

    modifier onlyBeforeEnd() {
        require(block.timestamp < endTime, "Voting has ended");
        _;
    }

    modifier hasAlreadyVoted() {
        require(!hasVoted[msg.sender], "You have already voted");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    constructor(string memory _description, uint256 _durationInSeconds) {
        description = _description;
        owner = msg.sender;
        endTime = block.timestamp + _durationInSeconds;
    }

    // Function to cast a vote (true for yes, false for no)
    function vote(bool _vote) external onlyBeforeEnd hasAlreadyVoted {
        hasVoted[msg.sender] = true;

        if (_vote) {
            yesVotes++;
        } else {
            noVotes++;
        }

        emit Voted(msg.sender, _vote);
    }

    function isActive() external view returns (bool) {
        return block.timestamp < endTime;
    }

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
