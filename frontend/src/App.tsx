import { UserContextProvider } from "./contexts/UserContext";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Proposals from "./views/Proposals/Proposals.tsx";
import Proposition from "./views/Proposition/Proposition.tsx";

function App() {
    return (
        <>
            <UserContextProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<Proposals />} />
                        <Route path="/proposition/:address" element={<Proposition />} />
                    </Routes>
                </Router>
            </UserContextProvider>
        </>
    );
}

export default App;
