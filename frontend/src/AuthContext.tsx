import { createContext, useState } from "react";
import type { PrivateUser } from "../../types";
import type { ReactNode } from "react";

interface AuthContextType {
  user: PrivateUser | null;
  login: (userData: PrivateUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<null | PrivateUser>(null);

  const login = (userData: PrivateUser) => {
    setUser(userData);
  };

  const logout = () => {
    console.log("Logging out");
    localStorage.removeItem("user");
    window.location.href = "/login";
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
