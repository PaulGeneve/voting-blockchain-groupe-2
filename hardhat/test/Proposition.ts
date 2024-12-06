import { Proposition } from "../typechain-types";
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Proposition Contract", function () {
    let proposition: Proposition;
    let owner: any, voter1: any, voter2: any;
    const VOTING_DURATION = 3600; // 1 hour in seconds

    beforeEach(async function () {
        [owner, voter1, voter2] = await ethers.getSigners();

        const PropositionFactory = await ethers.getContractFactory("Proposition");
        proposition = (await PropositionFactory.deploy("Test Proposition", VOTING_DURATION)) as Proposition;
        await proposition.deployed();
    });

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            expect(await proposition.owner()).to.equal(owner.address);
        });

        it("Should initialize votes and state correctly", async function () {
            expect(await proposition.yesVotes()).to.equal(0);
            expect(await proposition.noVotes()).to.equal(0);
            expect(await proposition.votingEnded()).to.equal(false);
        });
    });

    describe("Voting", function () {
        it("Should allow a user to vote 'yes'", async function () {
            await proposition.connect(voter1).vote(true);
            expect(await proposition.yesVotes()).to.equal(1);
            expect(await proposition.hasVoted(voter1.address)).to.equal(true);
        });

        it("Should allow a user to vote 'no'", async function () {
            await proposition.connect(voter1).vote(false);
            expect(await proposition.noVotes()).to.equal(1);
            expect(await proposition.hasVoted(voter1.address)).to.equal(true);
        });

        it("Should prevent double voting by the same user", async function () {
            await proposition.connect(voter1).vote(true);
            await expect(proposition.connect(voter1).vote(false)).to.be.revertedWith("You have already voted");
        });

        it("Should prevent voting after voting ends", async function () {
            // Move time forward by VOTING_DURATION
            await ethers.provider.send("evm_increaseTime", [VOTING_DURATION]);
            await expect(proposition.connect(voter1).vote(true)).to.be.revertedWith("Voting has ended");
        });
    });

    // Uncomment this block if we have implemented the endVoting function, for now we only base ourselves on time
    // describe("Ending Voting", function () {
    //     it("Should allow the owner to end voting", async function () {
    //         await proposition.connect(owner).endVoting();
    //         expect(await proposition.votingEnded()).to.equal(true);
    //     });
    //
    //     it("Should emit VotingEnded event when voting ends", async function () {
    //         await expect(proposition.connect(owner).endVoting()).to.emit(proposition, "VotingEnded");
    //     });
    //
    //     it("Should prevent non-owners from ending voting", async function () {
    //         await expect(proposition.connect(voter1).endVoting()).to.be.revertedWith("Only the owner can perform this action");
    //     });
    // });

    describe("Results and Percentages", function () {
        it("Should return correct vote counts", async function () {
            await proposition.connect(voter1).vote(true); // yes
            await proposition.connect(voter2).vote(false); // no

            const [yes, no] = await proposition.getResults();
            expect(yes).to.equal(1);
            expect(no).to.equal(1);
        });

        it("Should calculate correct vote percentages", async function () {
            await proposition.connect(voter1).vote(true); // yes
            await proposition.connect(voter2).vote(false); // no

            const [forPercentage, againstPercentage] = await proposition.getVotePercentage();
            expect(forPercentage).to.equal(50);
            expect(againstPercentage).to.equal(50);
        });

        it("Should return zero percentages if no votes have been cast", async function () {
            const [forPercentage, againstPercentage] = await proposition.getVotePercentage();
            expect(forPercentage).to.equal(0);
            expect(againstPercentage).to.equal(0);
        });
    });
});
