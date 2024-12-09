import React from "react";
import { ethers } from "ethers";

type UserContextType = {
    user: ethers.JsonRpcSigner | null;
    connectUser: () => void;
};

const UserContext = React.createContext<UserContextType>({
    user: null,
    connectUser: () => {},
});

type UserContextProviderProps = {
    children: React.ReactNode;
};

export function UserContextProvider(props: UserContextProviderProps) {
    const [userAccount, setUserAccount] =
        React.useState<ethers.JsonRpcSigner | null>(null);

    const connectUser = async () => {
        try {
            if (window.ethereum) {
                const provider = new ethers.BrowserProvider(window.ethereum);
                await provider.send("eth_requestAccounts", []);
                const providerAccounts = await provider.listAccounts();

                const supportedHexChainId = `0x${parseInt(
                    import.meta.env.VITE_SUPPORTED_CHAIN_ID
                ).toString(16)}`;

                const currentChainId = await provider.send("eth_chainId", []);

                // ChainId must be amoy 80002
                if (currentChainId !== supportedHexChainId) {
                    try {
                        // Request to switch Ethereum network
                        await provider.send("wallet_switchEthereumChain", [
                            { chainId: supportedHexChainId },
                        ]);
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    } catch (error: any) {
                        console.log("error", error);
                        if (error.error.code === 4902 || error.code === 4902) {
                            try {
                                // Request to add a new network if it's not available
                                await provider.send("wallet_addEthereumChain", [
                                    {
                                        chainId: supportedHexChainId,
                                        chainName: import.meta.env.VITE_SUPPORTED_CHAIN_NAME,
                                        nativeCurrency: {
                                            name: "Ethereum",
                                            symbol: "ETH",
                                            decimals: 18,
                                        },
                                        rpcUrls: [import.meta.env.VITE_SUPPORTED_CHAIN_RPC_URL],
                                        blockExplorerUrls: [
                                            import.meta.env.VITE_SUPPORTED_CHAIN_SCANNER_URL,
                                        ],
                                    },
                                ]);
                            } catch (addError) {
                                console.error("Failed to add the network:", addError);
                                return;
                            }
                        } else {
                            console.error("Failed to switch the network:", error);
                            return;
                        }
                    }
                }

                const walletAddress = providerAccounts[0];
                setUserAccount(walletAddress);
            } else {
                console.error(
                    "Failed connecting to wallet, no ethereum found in your browser, please use the latest version of firefox browser or chromium browsers."
                );
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.log("Upgrade Plans Failed: " + error.message);

            if (
                error.message === "Already processing eth_requestAccounts. Please wait."
            ) {
                console.log("Please sign in to your MetaMask.");

                if (window.ethereum && window.ethereum.request) {
                    await window.ethereum.request({
                        method: "wallet_requestPermissions",
                        params: [{ eth_accounts: {} }],
                    });
                }
            }
        }
    };

    React.useEffect(() => {
        connectUser();
    }, []);

    return (
        <UserContext.Provider
            value={{
                user: userAccount,
                connectUser: connectUser,
            }}
        >
            {props.children}
        </UserContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUser() {
    const userContext = React.useContext(UserContext);
    if (!userContext) {
        throw new Error("useUser must be used within a UserContextProvider");
    }

    return userContext;
}
