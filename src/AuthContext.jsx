import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser]   = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("jordan_user");
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("jordan_token", token);
    localStorage.setItem("jordan_user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("jordan_token");
    localStorage.removeItem("jordan_user");
    setUser(null);
  };

  const isAdmin = user?.role === "admin";
  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, isLoggedIn, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
