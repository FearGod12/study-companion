import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/router";
import { useEffect } from "react";

const withAuth = <P extends object>(WrappedComponent: React.FC<P>) => {
  const AuthComponent: React.FC<P> = (props) => {
    const { isAuthenticated, loading,  hasHydrated  } = useAuthStore();
    const router = useRouter();


    // Redirect to login if not authenticated
    useEffect(() => {
      if (hasHydrated && !loading && !isAuthenticated) {
        router.push("/auth/login");
      }
    }, [hasHydrated, isAuthenticated, loading, router]);


    // Show loading spinner
    if (loading || !hasHydrated) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-accent" aria-label="Loading..."></div>
        </div>
      );
    }

    // Show protected content only if authenticated
    return isAuthenticated ? <WrappedComponent {...props} /> : null;
  };

  return AuthComponent;
};

export default withAuth;
