import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { PrivateRoute } from "./components/PrivateRoute";
import { LoginPage } from "./pages/LoginPage";
import BlogPage from "./pages/BlogPage";
import BlogForm from "./components/BlogForm";
import BlogPost from "./pages/BlogPost";
import { RegisterForm } from "./components/RegisterForm";
import { LandingPage } from "./pages/LandingPage";
import { Unauthorized } from "./pages/Unauthorized";
import { Dashboard } from "./pages/Dashboard";
import { AdminDashboard } from "./pages/AdminDashboard";
import { Layout } from "./components/Layout";
import { InfoModal } from "./components/Modal";
import React, { useState } from "react";
import './index.css';
import { Navbar } from "./components/Navbar";
import { useLocation } from "react-router-dom";

export default function App() {
  const [showSessionClosed, setShowSessionClosed] = useState(false);

  return (
    <AuthProvider>
      <Router>
        {/* Aquí sí funciona useLocation */}
        <InnerApp showSessionClosed={showSessionClosed} setShowSessionClosed={setShowSessionClosed} />
      </Router>
    </AuthProvider>
  );
}

interface InnerAppProps {
  showSessionClosed: boolean;
  setShowSessionClosed: React.Dispatch<React.SetStateAction<boolean>>;
}

function InnerApp({ showSessionClosed, setShowSessionClosed }: InnerAppProps) {
  const location = useLocation();
  const isBlog = location.pathname.startsWith("/blog");

  return (
    <>
      {isBlog ? (
        <Navbar className="fixed top-0 left-0 w-full bg-white dark:bg-dark shadow-md z-50" />
      ) : (
        <Navbar />
      )}

      <Routes>
        {/* Rutas principales */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute requiredRole="ROLE_USER">
              <Layout>
                <Dashboard />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute requiredRole="ROLE_ADMIN">
              <Layout>
                <AdminDashboard />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Rutas del blog */}
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/new" element={<BlogForm />} />
        <Route path="/blog/:id" element={<BlogPost />} />
      </Routes>

      {showSessionClosed && (
        <InfoModal
          message="Por motivos de seguridad hemos cerrado tu sesión. Por favor, vuelve a iniciar sesión."
          onClose={() => {
            setShowSessionClosed(false);
            window.location.replace("/login");
          }}
        />
      )}
    </>
  );
}
