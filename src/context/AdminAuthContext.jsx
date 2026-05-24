import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAdminAuthStateChanged } from "../firebase/authService";

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [adminUser, setAdminUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAdminAuthStateChanged((user) => {
      setAdminUser(user);
      setAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  const value = useMemo(
    () => ({
      adminUser,
      authReady,
      isAuthenticated: Boolean(adminUser),
    }),
    [adminUser, authReady]
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);

  if (!context) {
    throw new Error("useAdminAuth debe usarse dentro de AdminAuthProvider");
  }

  return context;
}
