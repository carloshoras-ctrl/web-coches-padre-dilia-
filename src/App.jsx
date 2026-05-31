import { Outlet, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import CatalogPage from "./pages/CatalogPage/CatalogPage";
import AdminPage from "./pages/admin/AdminPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import ContactPage from "./pages/ContactPage/ContactPage";
import CarDetailPage from "./pages/CarDetailPage/CarDetailPage";
import PrivateRoute from "./router/PrivateRoute/PrivateRoute";
import WhatsAppButton from "./components/WhatsappButton/WhatsappButton";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";

import "./App.css";

function AppLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
      <WhatsAppButton />
    </>
  );
}

export default function App() {
  return (
    <div className="app">
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalogo" element={<CatalogPage />} />
          <Route path="/coches/:id" element={<CarDetailPage />} />
          <Route path="/contacto" element={<ContactPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin"
            element={(
              <PrivateRoute>
                <AdminPage />
              </PrivateRoute>
            )}
          />
        </Route>
      </Routes>
    </div>
  );
}
