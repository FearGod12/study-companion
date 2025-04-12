import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/router";
import { useEffect } from "react";

const withAuth = <P extends object>(WrappedComponent: React.FC<P>) => {
  const AuthComponent: React.FC<P> = (props) => {
    const { isAuthenticated, loading } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !isAuthenticated) {
        router.push("/auth/login");
      }
    }, [isAuthenticated, loading, router]);

    if (loading) return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-accent"></div>
      </div>
    );
    

    return isAuthenticated ? <WrappedComponent {...props} /> : null;
  };

  // Set the display name for debugging
  AuthComponent.displayName = `withAuth(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return AuthComponent;
};

export default withAuth;
