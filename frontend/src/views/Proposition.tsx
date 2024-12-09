import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useParams } from "react-router-dom";
// import PropositionArtifact from "../artifacts/contracts/Proposition.sol/Proposition.json";
import { useUser } from "../contexts/UserContext";
import Header from "../components/Header.tsx";

type PropositionDetailsType = {
    description: string;
    yesVotes: number;
    noVotes: number;
    endTime: number;
    votingEnded: boolean;
};

const PropositionDetails: React.FC = () => {
    const { address } = useParams<{ address: string }>();
    const { user } = useUser();
    const [details, setDetails] = useState<PropositionDetailsType | null>(null);
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
                // to update with contract
                "PropositionArtifact.abi",
                user
            );

            const description = await contract.description();
            const yesVotes = await contract.yesVotes();
            const noVotes = await contract.noVotes();
            const endTime = await contract.endTime();
            const votingEnded = await contract.votingEnded();

            setDetails({
                description,
                yesVotes: Number(yesVotes),
                noVotes: Number(noVotes),
                endTime: Number(endTime),
                votingEnded,
            });
        } catch (err: any) {
            console.error(err);
            setError("Erreur lors de la récupération des détails.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPropositionDetails();
    }, [user, address]);

    return (
        <div>
            <Header />
            <h1>Détails de la proposition</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {loading ? (
                <p>Chargement des détails...</p>
            ) : details ? (
                <div>
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
                </div>
            ) : (
                <p>Aucune information disponible.</p>
            )}
        </div>
    );
};

export default PropositionDetails;
