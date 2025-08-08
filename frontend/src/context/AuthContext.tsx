import { createContext, useContext, useEffect, useState } from "react";
import { 
  getSessionKey, 
  getAuthKey, 
  logout as doLogout, 
  loginUser as doLogin, 
  registerUser as doRegister,
  renewAuthKey, 
  getTokenExpiration 
} from "../services/authService";
import api from "../services/axiosInstance";
import { jwtDecode } from "jwt-decode";

// Definimos la estructura del contexto de autenticación
interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  email: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  showSessionClosed?: boolean;
  setShowSessionClosed?: (value: boolean) => void;
  loading: boolean;
  email: string | null;
  role: string | null;
  nombre: string | null;
  login: (email: string, password: string) => Promise<LoginResponse>;
  logout: () => void;
  register: (nombre: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const normalizeRole = (role: string | null): string | null => {
  if (!role) return null;
  return role.startsWith("ROLE_") ? role : `ROLE_${role}`;
};

interface DecodedToken {
  roles?: string[];
  role?: string;
  sub?: string;
}

const decodeToken = (token: string): DecodedToken | null => {
  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
};

const extractRoleFromToken = (token: string): string | null => {
  const decoded = decodeToken(token);
  if (decoded?.roles && decoded.roles.length > 0) return decoded.roles[0];
  if (decoded?.role) return decoded.role;
  return null;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [nombre, setNombre] = useState<string | null>(null);
  const [showSessionClosed, setShowSessionClosed] = useState(false);

  const handleLogin = async (email: string, password: string): Promise<LoginResponse> => {
  const result = await doLogin(email, password);
  if (!result.success || !result.data) throw new Error(result.message);

  // Guardar tokens y datos
  localStorage.setItem("authKey", result.data.accessToken);
  localStorage.setItem("sessionKey", result.data.refreshToken);
  localStorage.setItem("email", result.data.email);
  localStorage.setItem("role", result.data.role);

  // Cargar perfil inmediatamente
  const response = await api.get("/api/auth/profile");

  // Actualizar contexto
  setEmail(result.data.email);
  setRole(result.data.role);
  setNombre(response.data.nombre);
  setIsAuthenticated(true);
  setLoading(false);

  return { ...result.data, role: result.data.role ?? "" };
};

const handleRegister = async (nombre: string, email: string, password: string): Promise<void> => {
  const data = await doRegister(nombre, email, password);

  // Guardar tokens y datos
  localStorage.setItem("authKey", data.accessToken);
  localStorage.setItem("sessionKey", data.refreshToken);
  localStorage.setItem("email", data.email);
  localStorage.setItem("role", data.role);

  // Cargar perfil inmediatamente
  const response = await api.get("/api/auth/profile");

  // Actualizar contexto
  setEmail(data.email);
  setRole(data.role);
  setNombre(response.data.nombre);
  setIsAuthenticated(true);
  setLoading(false);
};

  // Carga inicial de sesión
  useEffect(() => {
    const initSession = async () => {
      let token = getAuthKey();
      const session = getSessionKey();

      if (!token && !session) {
        setIsAuthenticated(false);
        setEmail("");
        setRole(null);
        setLoading(false);
        api.interceptors.response.use(
          (res) => res,
          (error) => {
            if (error.response?.status === 401) setShowSessionClosed(true);
            return Promise.reject(error);
          }
        );
        return;
      }

      if (token) {
        try {
          await api.get("/api/user/profile");
          setIsAuthenticated(true);
          setEmail(localStorage.getItem("email") || "");
          setRole(normalizeRole(extractRoleFromToken(token)));
        } catch {
          console.log("AuthKey inválido, cerrando sesión");
          doLogout();
          setIsAuthenticated(false);
          setEmail("");
          setRole(null);
          token = null;
        }
      } else if (session) {
        try {
          const newAuth = await renewAuthKey();
          console.log("Token renovado automáticamente:", newAuth);
          setIsAuthenticated(true);
          setEmail(localStorage.getItem("email") || "");
          setRole(normalizeRole(extractRoleFromToken(newAuth)));
          token = newAuth;
        } catch {
          console.log("No se pudo renovar sesión");
          doLogout();
          setIsAuthenticated(false);
          setEmail("");
          setRole(null);
          token = null;
        }
      } else {
        doLogout();
        setIsAuthenticated(false);
        setEmail("");
        setRole(null);
        token = null;
      }
      setLoading(false);
    };
    initSession();
  }, []);

  // Intervalo para renovar token
  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(async () => {
      const token = getAuthKey();
      if (!token) return;

      const expiration = getTokenExpiration(token);
      if (!expiration) return;

      const timeLeft = expiration - Date.now();
      if (timeLeft > 0 && timeLeft < 60_000) {
        try {
          await renewAuthKey();
          console.log("Token renovado automáticamente");
        } catch (err) {
          console.error("Error al renovar token automáticamente:", err);
        }
      }
    }, 30_000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Actualización al renovar token
  useEffect(() => {
    const handleTokenRenewed = () => {
      const token = getAuthKey();
      setIsAuthenticated(true);
      setEmail(localStorage.getItem("email"));
      if (token) setRole(extractRoleFromToken(token));
    };
    window.addEventListener("token-renewed", handleTokenRenewed);
    return () => window.removeEventListener("token-renewed", handleTokenRenewed);
  }, []);

  // LOGOUT
  const handleLogout = async () => {
  setLoading(true);
  await doLogout();
  setIsAuthenticated(false);
  setEmail("");
  setRole(null);
  setNombre(null);
  window.location.replace("/"); // redirige a landing
};


  return (
    <AuthContext.Provider
      value={{
        showSessionClosed,
        setShowSessionClosed,
        isAuthenticated,
        loading,
        email,
        role,
        nombre,
        login: handleLogin,
        logout: handleLogout,
        register: handleRegister,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de un AuthProvider");
  return context;
}
