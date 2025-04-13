import "@/styles/globals.css";
import type { AppProps } from "next/app";
import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuthStore } from "@/store/useAuthStore";  
import Router from "next/router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

import SocketInitializer from "@/components/SocketInitializer"; 
import ErrorBoundary from "@/components/ErrorBoundary";  

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);  
  const fetchUserData = useAuthStore((state) => state.fetchUserData); 

  // Initializes authentication when the app first loads
  useEffect(() => {
    initializeAuth();
    // Manage NProgress (loading indicator) during route transitions
    Router.events.on("routeChangeStart", () => NProgress.start());
    Router.events.on("routeChangeComplete", () => NProgress.done());
    Router.events.on("routeChangeError", () => NProgress.done());

    // Clean up event listeners
    return () => {
      Router.events.off("routeChangeStart", () => NProgress.start());
      Router.events.off("routeChangeComplete", () => NProgress.done());
      Router.events.off("routeChangeError", () => NProgress.done());
    };
  }, [initializeAuth]); 

  // Fetch user data after hydration is complete
  useEffect(() => {
    if (!hasHydrated) {
      return;  
    }
    fetchUserData();  
  }, [hasHydrated, fetchUserData]); 

  // Layout wrapper for pages that want a custom layout
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <ErrorBoundary>
      {/* Initialize socket connections */}
      <SocketInitializer />

      {/* Render page with layout */}
      {getLayout(<Component {...pageProps} />)}

      {/* Global toast notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </ErrorBoundary>
  );
}
