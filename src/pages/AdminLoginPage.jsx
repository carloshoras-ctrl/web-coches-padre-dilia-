import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";
import { loginAdmin } from "../firebase/authService";
import "./AdminPage.css";

export default function AdminLoginPage() {
  const { isAuthenticated, authReady } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [authError, setAuthError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const redirectPath = location.state?.from || "/admin";

  if (authReady && isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  async function handleLogin(event) {
    event.preventDefault();
    setAuthError("");
    setLoginLoading(true);

    try {
      await loginAdmin(credentials.email.trim(), credentials.password);
      navigate(redirectPath, { replace: true });
    } catch (error) {
      setAuthError(error.message || "No se ha podido iniciar sesion.");
    } finally {
      setLoginLoading(false);
    }
  }

  return (
    <>
      <main className="admin-page">
        <section className="admin-shell">
          <header className="admin-shell__header">
            <h1>
              LOGIN <span>ADMIN</span>
            </h1>
            <p>Accede con tu usuario administrador.</p>
          </header>

          <div className="admin-card admin-login">
            <h2>Acceso administrador</h2>
            <p>Introduce email y contraseña para continuar.</p>

            <form className="admin-form" onSubmit={handleLogin}>
              <label>
                Email
                <input
                  type="email"
                  value={credentials.email}
                  onChange={(event) =>
                    setCredentials((prev) => ({ ...prev, email: event.target.value }))
                  }
                  required
                />
              </label>

              <label>
                Contraseña
                <input
                  type="password"
                  value={credentials.password}
                  onChange={(event) =>
                    setCredentials((prev) => ({ ...prev, password: event.target.value }))
                  }
                  required
                />
              </label>

              {authError && <p className="admin-feedback admin-feedback--error">{authError}</p>}

              <button className="admin-btn" type="submit" disabled={loginLoading || !authReady}>
                {loginLoading ? "Entrando..." : "Entrar"}
              </button>
            </form>
          </div>
        </section>
      </main>
    </>
  );
}
