import {Proposal} from "../typechain-types";

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Proposal Contract", function () {
    let proposal: Proposal
    let owner: any, addr1: any;

    beforeEach(async function () {
        // Obtenir les signers
        [owner, addr1] = await ethers.getSigners();
        const description = "Test Proposal";
        const duration = 60;

        // Déployer le contrat Proposal
        const ProposalFactory = await ethers.getContractFactory("Proposal");
        proposal = await ProposalFactory.deploy();
        await proposal.deployed();
    });

    it("Should create a new proposal", async function () {
        const description = "Proposal to upgrade the system";
        const duration = 60; // Durée de 60 secondes

        await proposal.createProposal(description, duration);
        const proposals = await proposal.getActiveProposals();

        expect(proposals.length).to.equal(1);
        expect(proposals[0].description).to.equal(description);
        expect(proposals[0].isActive).to.equal(true);
    });

    it("Should retrieve all active proposals", async function () {
        await proposal.createProposal("Proposal A", 60);
        await proposal.createProposal("Proposal B", 60);

        const activeProposals = await proposal.getActiveProposals();

        expect(activeProposals.length).to.equal(2);
        expect(activeProposals[0].description).to.equal("Proposal A");
        expect(activeProposals[1].description).to.equal("Proposal B");
    });

});