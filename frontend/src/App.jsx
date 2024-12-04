import { createBrowserRouter, RouterProvider } from "react-router-dom";
import WelcomePage from "./components/Pages/Authentification/WelcomePage";
import GetStarted from "./components/Pages/Authentification/GetStarted";
import SignUpPage from "./components/Pages/Authentification/SignUpPage";
import LoginPage from "./components/Pages/Authentification/LoginPage";
import VerifyEmailPage from "./components/Pages/Authentification/VerifyEmailPage";
import ForgotPassword from "./components/auth/ForgotPassword";
import Layout from "./components/Pages/Main/Layout";
import Schedule from "./components/Pages/Main/Schedule";
import Setting from "./components/Pages/Main/Setting";
import ProtectedRoute from "./components/Pages/Authentification/ProtectedRoute";
import { AuthProvider } from "./context/AuthProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Suspense, lazy } from "react";
import ReadingMode from "./components/Pages/Main/ReadingMode";
import ProfileEdit from "./components/common/ProfileEdit";
import ErrorBoundary from "./components/ErrorBoundary";
import PasswordReset from "./components/auth/PasswordReset";

// Lazy load Dashboard component
const Dashboard = lazy(() => import("./components/Pages/Main/Dashboard"));

// Define routes
const router = createBrowserRouter(
    [
        {
            path: "/",
            element: <WelcomePage />,
        },
        {
            path: "/get-started",
            element: <GetStarted />,
        },
        {
            path: "/signup",
            element: <SignUpPage />,
        },
        {
            path: "/login",
            element: <LoginPage />,
        },
        {
            path: "/verify-email",
            element: <VerifyEmailPage />,
        },
        {
            path: "/forgot-password",
            element: <ForgotPassword />,
        },
        {
            path: "/reset-password",
            element: <PasswordReset />,
        },
        {
            path: "/",
            element: <Layout />,
            children: [
                {
                    path: "dashboard",
                    element: (
                        <Suspense fallback={<div>Loading Dashboard...</div>}>
                            <Dashboard />
                        </Suspense>
                    ),
                },
                {
                    path: "schedule",
                    element: (
                        <ProtectedRoute>
                            <Schedule />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "settings",
                    element: (
                        <ProtectedRoute>
                            <Setting />
                        </ProtectedRoute>
                    ),
                },
            ],
        },
        {
            path: "/reading-mode",
            element: (
                <ProtectedRoute>
                    <ReadingMode />
                </ProtectedRoute>
            ),
        },
        {
            path: "/profile-edit",
            element: (
                <ProtectedRoute>
                    <ProfileEdit />
                </ProtectedRoute>
            ),
        },
    ],
    {
        future: {
            v7_startTransition: true,
            v7_relativeSplatPath: true,
        },
    }
);

const App = () => {
    return (
        <AuthProvider>
            {" "}
            {/* Keep AuthProvider here */}
            <ToastContainer />
            <ErrorBoundary>
                <RouterProvider router={router} hydration={true} />{" "}
                {/* Wrap RouterProvider here */}
            </ErrorBoundary>
        </AuthProvider>
    );
};

export default App;
