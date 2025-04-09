// pages/_app.tsx
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuthStore } from "@/store/useAuthStore";

// 1. Add types to support getLayout
type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, []);

  // 2. Use getLayout if it exists, or render the page as-is
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <>
      {getLayout(<Component {...pageProps} />)}
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
    </>
  );
}
