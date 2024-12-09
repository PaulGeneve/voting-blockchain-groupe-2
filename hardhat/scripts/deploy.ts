import { task, types } from "hardhat/config";

export default task("deploy")
    .addOptionalParam(
        "verify",
        "Flag to verify the contracts after deployment",
        false,
        types.boolean
    )
    .setAction(async (taskArgs, hre) => {
        const accounts = await hre.ethers.getSigners();
        const deployer = accounts[0];
        console.log("Deploying contracts with the account:", deployer.address);

        // Déploiement du contrat Proposal
        console.log("Deploying Proposal contract...");
        const ProposalFactory = await hre.ethers.getContractFactory("Proposal");
        const proposalContract = await ProposalFactory.deploy();
        await proposalContract.deployed();
        console.log("Proposal contract deployed to:", proposalContract.address);

        // Vérification des contrats si le flag "verify" est activé
        if (taskArgs.verify) {
            console.log("Verifying Proposal contract...");
            // Attendre 5 blocs pour la propagation
            let currentBlock = await hre.ethers.provider.getBlockNumber();
            while (currentBlock + 5 > (await hre.ethers.provider.getBlockNumber())) {}

            await hre.run("verify:verify", {
                address: proposalContract.address,
                constructorArguments: [],
            });

            console.log("Proposal contract verified successfully.");
        }

        // Afficher l'adresse de déploiement pour l'utilisation dans le front-end
        console.log(`Proposal contract address: ${proposalContract.address}`);
    });
