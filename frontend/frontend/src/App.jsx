import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./components/Home/Pages/LoginPage"
import VerifyEmailPage from "./components/Home/Pages/VerifyEmailPage";
import WelcomePage from "./components/Home/Pages/WelcomePage";
import SignUpPage from "./components/Home/Pages/SignUpPage";
import Dashboard from "./components/Main/Pages/Dashboard";
import Schedule from "./components/Main/Pages/Schedule";
import Setting from "./components/Main/Pages/Setting";
import MainPage from "./components/Main/Pages/MainPage";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<WelcomePage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/verify-email" element={<VerifyEmailPage />} />
                <Route path="/mainPage" element={<MainPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/Schedule" element={<Schedule />} />
                <Route path="/settings" element={<Setting />} />
            </Routes>
        </Router>
    );
};

export default App;
