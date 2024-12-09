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
                "ProposalArtifact.abi",
                user
            );

            const activeProposals = await contract.getActiveProposals();

            const formattedProposals: Proposal[] = activeProposals.map(
                (p: any) => ({
                    proposalAddress: p.proposalAddress,
                    description: p.description,
                    createdAt: Number(p.createdAt),
                    isActive: p.isActive,
                })
            );

            setProposals(formattedProposals);
        } catch (err: any) {
            console.error(err);
            setError("Erreur lors de la récupération des propositions.");
        } finally {
            setLoading(false);
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
            {loading ? (
                <p>Chargement des propositions...</p>
            ) : proposals.length > 0 ? (
                <ul>
                    {proposals.map((proposal) => (
                        <li key={proposal.proposalAddress}>
                            <strong>Description :</strong> {proposal.description} <br />
                            <strong>Créée le :</strong>{" "}
                            {new Date(proposal.createdAt * 1000).toLocaleString()} <br />
                            <strong>Status :</strong> {proposal.isActive ? "Active" : "Fermée"}{" "}
                            <br />
                            <Link to={`/proposition/${proposal.proposalAddress}`}>
                                Voir les détails
                            </Link>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Aucune proposition active pour le moment.</p>
            )}
        </div>
    );
};

export default Proposals;
