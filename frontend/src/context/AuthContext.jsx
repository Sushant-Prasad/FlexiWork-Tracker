import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  getCurrentUser,
  loginUser,
  registerUser,
} from "../services/authServices.js";

const AuthContext = createContext(null);
const TOKEN_KEY = "flexiwork_token";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setIsLoading(false);
      return;
    }

    const loadUser = async () => {
      try {
        const data = await getCurrentUser(token);
        const current = data?.user || data?.data || data;
        setUser(current || null);
      } catch (error) {
        localStorage.removeItem(TOKEN_KEY);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async ({ email, password }) => {
    const data = await loginUser({ email, password });
    const token = data?.token || data?.data?.token;
    const current = data?.user || data?.data?.user;

    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    }

    setUser(current || null);
    return { token, user: current };
  };

  const register = async ({ name, email, password, role }) => {
    return registerUser({ name, email, password, role });
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isLoading,
      login,
      register,
      logout,
      setUser,
    }),
    [user, isLoading]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
