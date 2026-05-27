import axios from "axios";
import { useContext, useEffect, type ReactNode } from "react";
import { AuthContext } from "../AuthContext";

export default function AuthAxiosProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const interceptorId = axios.interceptors.request.use((config) => {
      if (user?.id) {
        config.headers = config.headers ?? {};
        config.headers["x-user-id"] = user.id;
      }

      return config;
    });

    return () => {
      axios.interceptors.request.eject(interceptorId);
    };
  }, [user?.id]);

  return children;
}
