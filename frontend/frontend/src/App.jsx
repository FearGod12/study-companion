import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import VerifyEmailPage from "./components/Pages/VerifyEmailPage";
import WelcomePage from "./components/Pages/WelcomePage";
import SignUpPage from "./components/SignUpPage";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<WelcomePage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/verify-email" element={<VerifyEmailPage />} />
            </Routes>
        </Router>
    );
};

export default App;
