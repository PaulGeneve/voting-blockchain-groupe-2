import { useUser } from "../../contexts/UserContext";
import './Header.css';  // Importation du fichier CSS

const Header = () => {
    const { user, connectUser } = useUser();

    const handleConnectWallet = async () => {
        if (!user) connectUser();
    };

    return (
        <header className="header-container">
            <h1 className="header-title">Voting App</h1>
            <div className="header-buttons">
                <button
                    onClick={handleConnectWallet}
                    className={`header-button ${user ? "header-button-connected" : "header-button-primary"}`}
                >
                    {user ? `Connected ${user.address}` : "Connect Wallet"}
                </button>
            </div>
        </header>
    );
};

export default Header;
