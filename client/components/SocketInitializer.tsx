import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useSocketSessionStore } from "@/store/useSocketSessionStore";

const SocketInitializer = () => {
  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  useEffect(() => {
    if (hasHydrated && user?.id) {
      useSocketSessionStore.getState().connectSocket(user.id);
    }
  }, [hasHydrated, user?.id]);

  return null;
};

export default SocketInitializer;
