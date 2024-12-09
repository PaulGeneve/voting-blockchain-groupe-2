import { useUser } from "../contexts/UserContext";

const Header = () => {
    const { user, connectUser } = useUser();

    const handleConnectWallet = async () => {
        if (!user) connectUser();
    };

    return (
        <header className="flex justify-between items-center p-4 border-b border-gray-200 mb-8 bg-amber-400">
            <h1 className="text-3xl font-bold">Voting App</h1>
            <div className="flex items-center space-x-4">
                <button
                    onClick={handleConnectWallet}
                    className={`btn ${user ? "btn-success" : "btn-primary"}`}
                >
                    {user ? `Connected ${user.address}` : "Connect Wallet"}
                </button>
            </div>
        </header>
    );
};

export default Header;
