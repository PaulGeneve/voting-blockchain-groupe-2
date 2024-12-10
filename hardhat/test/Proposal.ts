import {Proposal} from "../typechain-types";

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Proposal Contract", function () {
    let proposal: Proposal
    let owner: any, addr1: any;

    beforeEach(async function () {
        [owner, addr1] = await ethers.getSigners();

        const PropositionFactory = await ethers.getContractFactory("Proposition");
        const proposition1 = await PropositionFactory.deploy("Proposition 1", 60);
        const proposition2 = await PropositionFactory.deploy("Proposition 2", 120);
        await proposition1.deployed();
        await proposition2.deployed();

        const ProposalFactory = await ethers.getContractFactory("Proposal");
        proposal = await ProposalFactory.deploy();
        await proposal.deployed();

        await proposal.addProposition(proposition1.address);
        await proposal.addProposition(proposition2.address);
    });

    it("Should emit event ProposalCreated when creating a proposal", async function () {
        // We added two propositions, so we should have two events
        const events = await proposal.queryFilter(proposal.filters.ProposalCreated());
        expect(events.length).to.equal(2);
    })

    it("Should retrieve all active proposals", async function () {
        const activeProposals = await proposal.getActiveProposals();

        expect(activeProposals.length).to.equal(2);
    });

    it("Should retrieve all expired proposals", async function () {
        // Advance time for 60 seconds
        await ethers.provider.send("evm_increaseTime", [60]);
        await ethers.provider.send("evm_mine");

        const expiredProposals = await proposal.getExpiredProposals();

        expect(expiredProposals.length).to.equal(1);
    });
});