import { useState, useEffect, createContext, useContext } from "react";
import { authAPI, setAuthToken, getAuthToken } from "@/services/api";

interface User {
  id: string;
  email: string;
  role: "painter" | "customer";
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  demoLogin: (role: "painter" | "customer") => Promise<void>;
  register: (userData: {
    email: string;
    password: string;
    role: "painter" | "customer";
    name: string;
    phone?: string;
  }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    const response = await authAPI.login(email, password);
    if (response.success) {
      setUser(response.data.user);
    }
  };

  const demoLogin = async (role: "painter" | "customer") => {
    const response = await authAPI.demoLogin(role);
    if (response.success) {
      setUser(response.data.user);
    }
  };

  const register = async (userData: {
    email: string;
    password: string;
    role: "painter" | "customer";
    name: string;
    phone?: string;
  }) => {
    const response = await authAPI.register(userData);
    if (response.success) {
      setUser(response.data.user);
    }
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
  };

  return {
    user,
    isAuthenticated: !!user,
    login,
    demoLogin,
    register,
    logout,
  };
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const state = useAuthState();
  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
};
