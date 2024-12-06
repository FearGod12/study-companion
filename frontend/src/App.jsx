import { createBrowserRouter, RouterProvider } from "react-router-dom";
import GetStartedPage from "./components/Pages/Authentification/GetStartedPage";
import Welcome from "./components/Pages/Authentification/Welcome";
import SignUpPage from "./components/Pages/Authentification/SignUpPage";
import LoginPage from "./components/Pages/Authentification/LoginPage";
import VerifyEmailPage from "./components/Pages/Authentification/VerifyEmailPage";
import ForgotPassword from "./components/auth/ForgotPassword";
import Layout from "./components/Pages/Main/Layout";
import Schedule from "./components/Pages/Main/Schedule";
import  AuthProvider  from "./context/AuthProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Suspense, lazy } from "react";
import ReadingMode from "./components/Pages/Main/ReadingMode";
import ErrorBoundary from "./components/ErrorBoundary";
import PasswordReset from "./components/auth/PasswordReset";
import PrivateRoute from "./components/Pages/Authentification/PrivateRoute";
import Loading from "./components/common/Loading";

const Dashboard = lazy(() => import("./components/Pages/Main/Dashboard"));


const router = createBrowserRouter(
    [
        {
            path: "/",
            element: <GetStartedPage />,
        },
        {
            path: "/welcome",
            element: <Welcome />,
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
                        <Suspense fallback={<div className="container max-w-none h-screen"><Loading/></div>}>
                            <Dashboard />
                        </Suspense>
                    ),
                },
                {
                    path: "schedule",
                    element: (
                        <PrivateRoute>
                            <Schedule />
                        </PrivateRoute>
                    ),
                },
            ],
        },
        {
            path: "/reading-mode",
            element: (
                <PrivateRoute>
                    <ReadingMode />
                </PrivateRoute>
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
        <ErrorBoundary>
        <AuthProvider>
            <ToastContainer />
            <RouterProvider router={router} />
        </AuthProvider>
    </ErrorBoundary>
    );
};

export default App;
