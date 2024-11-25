import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomePage from "./components/Pages/Authentification/WelcomePage";
import GetStarted from "./components/Pages/Authentification/GetStarted";
import SignUpPage from "./components/Pages/Authentification/SignUpPage";
import LoginPage from "./components/Pages/Authentification/LoginPage";
import VerifyEmailPage from "./components/Pages/Authentification/VerifyEmailPage";
import ForgotPassword from "./components/Pages/Authentification/ForgotPassword";
import Layout from "./components/Pages/Main/Layout";
import Schedule from "./components/Pages/Main/Schedule";
import Setting from "./components/Pages/Main/Setting";
import ProtectedRoute from "./components/Pages/Authentification/ProtectedRoute";
import {AuthProvider} from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Suspense, lazy } from "react";
import ReadingMode from "./components/Pages/Main/ReadingMode";
import ProfileEdit from "./components/common/ProfileEdit";

// Lazy load Dashboard component
const Dashboard = lazy(() => import("./components/Pages/Main/Dashboard"));

const App = () => {
    return (
        <AuthProvider>
            <ToastContainer />
            <Router>
                <Routes>
                    {/* Routes outside of the dashboard */}
                    <Route path="/" element={<WelcomePage />} />
                    <Route path="/get-started" element={<GetStarted />} />
                    <Route path="/signup" element={<SignUpPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/verify-email" element={<VerifyEmailPage />} />
                    <Route
                        path="/forgot-password"
                        element={<ForgotPassword />}
                    />

                    {/* Protected Routes with the SideMenu */}
                    <Route element={<Layout />}>
                        <Route
                            path="/dashboard"
                            element={
                                <Suspense
                                    fallback={<div>Loading Dashboard...</div>}
                                >
                                    <Dashboard />
                                </Suspense>
                            }
                        />
                        <Route
                            path="/schedule"
                            element={
                                <ProtectedRoute>
                                    <Schedule />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/settings"
                            element={
                                <ProtectedRoute>
                                    <Setting />
                                </ProtectedRoute>
                            }
                        />
                    </Route>

                    <Route
                        path="/reading-mode"
                        element={
                            <ProtectedRoute>
                                <ReadingMode />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/profile-edit"
                        element={
                            <ProtectedRoute>
                                <ProfileEdit />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
