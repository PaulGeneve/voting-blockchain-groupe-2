import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Link } from "react-router-dom";
// import ProposalArtifact from "../artifacts/contracts/Proposal.sol/Proposal.json";
import { useUser } from "../contexts/UserContext";

type Proposal = {
    proposalAddress: string;
    description: string;
    createdAt: number;
    isActive: boolean;
};

const Proposals: React.FC = () => {
    const { user } = useUser();
    const [proposals, setProposals] = useState<Proposal[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [newProposalDescription, setNewProposalDescription] = useState<string>("");
    const [newProposalDuration, setNewProposalDuration] = useState<number>(0);

    const proposalContractAddress = import.meta.env.VITE_PROPOSAL_CONTRACT_ADDRESS;

    const fetchProposals = async () => {
        if (!user) {
            setError("Veuillez connecter votre portefeuille.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const contract = new ethers.Contract(
                proposalContractAddress,
                // to update with contract
                "PropositionArtifact.abi",
                user
            );

            const activeProposals = await contract.getActiveProposals();
            const expiredProposals = await contract.getExpiredProposals();

            const formattedProposals: Proposal[] = [
                ...activeProposals.map((p: any) => ({
                    proposalAddress: p.proposalAddress,
                    description: p.description,
                    createdAt: Number(p.createdAt),
                    isActive: p.isActive,
                })),
                ...expiredProposals.map((p: any) => ({
                    proposalAddress: p.proposalAddress,
                    description: p.description,
                    createdAt: Number(p.createdAt),
                    isActive: p.isActive,
                }))
            ];

            setProposals(formattedProposals);
        } catch (err: any) {
            console.error(err);
            setError("Erreur lors de la récupération des propositions.");
        } finally {
            setLoading(false);
        }
    };

    const submitProposal = async () => {
        if (!user || !newProposalDescription || newProposalDuration <= 0) {
            setError("Veuillez remplir tous les champs.");
            return;
        }

        try {
            const contract = new ethers.Contract(
                proposalContractAddress,
                // to update with contract
                "PropositionArtifact.abi",
                user
            );

            const tx = await contract.createProposal(
                newProposalDescription,
                newProposalDuration
            );
            await tx.wait();

            setNewProposalDescription("");
            setNewProposalDuration(0);
            fetchProposals();
        } catch (err: any) {
            console.error(err);
            setError("Erreur lors de la soumission de la proposition.");
        }
    };

    useEffect(() => {
        if (user) {
            fetchProposals();
        }
    }, [user]);

    return (
        <div>
            <h1>Propositions de vote</h1>

            {error && <p style={{ color: "red" }}>{error}</p>}

            {/* Formulaire pour soumettre une nouvelle proposition */}
            <h2>Soumettre une nouvelle proposition</h2>
            <input
                type="text"
                placeholder="Description de la proposition"
                value={newProposalDescription}
                onChange={(e) => setNewProposalDescription(e.target.value)}
            />
            <input
                type="number"
                placeholder="Durée (en secondes)"
                value={newProposalDuration}
                onChange={(e) => setNewProposalDuration(Number(e.target.value))}
            />
            <button onClick={submitProposal}>Soumettre</button>

            {loading ? (
                <p>Chargement des propositions...</p>
            ) : proposals.length > 0 ? (
                <>
                    <h2>Propositions en cours</h2>
                    <ul>
                        {proposals.map((proposal) => (
                            <li key={proposal.proposalAddress}>
                                <strong>Description :</strong> {proposal.description} <br />
                                <strong>Créée le :</strong>{" "}
                                {new Date(proposal.createdAt * 1000).toLocaleString()} <br />
                                <strong>Status :</strong> {proposal.isActive ? "Active" : "Fermée"} <br />
                                <Link to={`/proposition/${proposal.proposalAddress}`}>
                                    Voir les détails
                                </Link>
                            </li>
                        ))}
                    </ul>
                </>
            ) : (
                <p>Aucune proposition disponible.</p>
            )}
        </div>
    );
};

export default Proposals;
