import { Navigate, useLocation } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";

export default function PrivateRoute({ children }) {
  const { authReady, isAuthenticated } = useAdminAuth();
  const location = useLocation();

  if (!authReady) {
    return <p style={{ padding: "24px", textAlign: "center" }}>Comprobando sesion...</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
