import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { type JSX } from "react";
type PrivateRouteProps = {
  children: JSX.Element;
  requiredRole?: string | string[];
};

export function PrivateRoute({ children, requiredRole }: PrivateRouteProps) {
  const { isAuthenticated, role, loading } = useAuth();

  // Mientras carga sesión → loader
  if (loading || role === null) {
    return(
      <div className="p-6 text-center">
        Cargando sesión, en caso contrario,pulse para ir a inicio...
        <button onClick={() => window.location.href = "/"}></button>
      </div>
    );    
  }

  // Si no está autenticado → login
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // Si no coincide el rol → unauthorized
  if (requiredRole && role !== requiredRole) {
    const rolesArray = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!rolesArray.includes(role)) {
    
    return <Navigate to="/unauthorized" replace />;
    }
  }
  // Si todo OK → renderizamos el contenido
  return children;
}