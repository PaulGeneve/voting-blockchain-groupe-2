import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useParams } from "react-router-dom";
import PropositionArtifact from "../../../../hardhat/artifacts/contracts/Proposition.sol/Proposition.json";
import { useUser } from "../../contexts/UserContext";
import "./Proposition.css";

type PropositionType = {
    description: string;
    yesVotes: number;
    noVotes: number;
    endTime: number;
    votingEnded: boolean;
    canVote: boolean;
};

const Proposition: React.FC = () => {
    const { address } = useParams<{ address: string }>();
    const { user } = useUser();
    const [details, setDetails] = useState<PropositionType | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchPropositionDetails = async () => {
        if (!user || !address) {
            setError("Impossible de charger les détails.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const contract = new ethers.Contract(
                address,
                PropositionArtifact.abi,
                user
            );

            const description = await contract.description();
            const yesVotes = await contract.yesVotes();
            const noVotes = await contract.noVotes();
            const endTime = await contract.endTime();
            const votingEnded = await contract.votingEnded();
            const hasVoted = await contract.hasVoted(user.address);

            setDetails({
                description,
                yesVotes: Number(yesVotes),
                noVotes: Number(noVotes),
                endTime: Number(endTime),
                votingEnded,
                canVote: !hasVoted && !votingEnded,
            });
        } catch (error) {
            console.error(error);
            setError("Erreur lors de la récupération des détails.");
        } finally {
            setLoading(false);
        }
    };

    const vote = async (voteYes: boolean) => {
        if (!user || !address || !details?.canVote) {
            setError("Vous ne pouvez pas voter.");
            return;
        }

        try {
            const contract = new ethers.Contract(
                address,
                PropositionArtifact.abi,
                user
            );

            const tx = await contract.vote(voteYes);
            await tx.wait();

            fetchPropositionDetails();
        } catch (error) {
            console.error(error);
            setError("Erreur lors du vote.");
        }
    };

    useEffect(() => {
        fetchPropositionDetails();
    }, [user, address]);

    return (
        <div className="proposition-details-container">
            <h1>Détails de la proposition</h1>
            {error && <p className="error">{error}</p>}
            {loading ? (
                <p className="loading">Chargement des détails...</p>
            ) : details ? (
                <div className="details">
                    <p>
                        <strong>Description :</strong> {details.description}
                    </p>
                    <p>
                        <strong>Votes pour :</strong> {details.yesVotes}
                    </p>
                    <p>
                        <strong>Votes contre :</strong> {details.noVotes}
                    </p>
                    <p>
                        <strong>Fin du vote :</strong>{" "}
                        {new Date(details.endTime * 1000).toLocaleString()}
                    </p>
                    <p>
                        <strong>Status :</strong>{" "}
                        {details.votingEnded ? "Terminé" : "En cours"}
                    </p>

                    {!details.votingEnded && details.canVote && (
                        <div className="vote-buttons">
                            <button onClick={() => vote(true)}>Voter Oui</button>
                            <button onClick={() => vote(false)}>Voter Non</button>
                        </div>
                    )}
                </div>
            ) : (
                <p>Aucune information disponible.</p>
            )}
        </div>
    );
};

export default Proposition;
