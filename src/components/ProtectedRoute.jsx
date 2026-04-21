import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";

// Requires login
export const RequireAuth = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();
  const location = useLocation();
  if (loading) return null;
  if (!isLoggedIn) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  return children;
};

// Requires admin role
export const RequireAdmin = ({ children }) => {
  const { isLoggedIn, isAdmin, loading } = useAuth();
  const location = useLocation();
  if (loading) return null;
  if (!isLoggedIn) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
};
