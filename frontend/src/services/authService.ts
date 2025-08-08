// Importamos api para hacer peticiones HTTP.
// Podríamos usar fetch, pero api facilita interceptores y manejo de errores.
import api from "../services/axiosInstance";

// URL base de nuestro backend para autenticación.
// Si mañana el backend está en otro servidor (ej: producción), lo cambiamos aquí.
const API_URL = "http://localhost:8081/api/auth";

// Claves para guardar los tokens en localStorage.
// Las ponemos como constantes para evitar errores de escritura ("magic strings").
const AUTH_KEY = "authKey"; //accestToken
const SESSION_KEY = "sessionKey";//refreshToken (para renovarlo)

/**
 * LOGIN:
 * 1. Envía email y password al backend (/auth/login)
 * 2. Recibe accessToken + refreshToken
 * 3. Los guarda en localStorage
 * 4. Devuelve toda la respuesta (por si el componente quiere usar email o role)
 */
export const loginUser = async (
  email: string,
  password: string
): Promise<{
  success: boolean;
  message: string;
  data?: { accessToken: string; refreshToken: string; email: string; role: string };
}> => {
  try {
    const response = await api.post(`${API_URL}/login`, { email, password });
    // Guardar tokens en localStorage
    localStorage.setItem(AUTH_KEY, response.data.accessToken);
    localStorage.setItem(SESSION_KEY, response.data.refreshToken);
    localStorage.setItem("email", response.data.email);
    const roleFromServer = response.data.role;
    const normalizedRole = roleFromServer.startsWith("ROLE_") ? roleFromServer : `ROLE_${roleFromServer}`;
    localStorage.setItem("role", normalizedRole);

    return {
      success: true,
      message: "Inicio de sesión exitoso",
      data: response.data, // devolvemos accessToken, refreshToken, email, role
    };
  } catch (error: any) {
    if (error.response) {
      return { success: false, message: error.response.data.error || "Credenciales incorrectas" };
    }
    return { success: false, message: "Error de conexión con el servidor" };
  }
};

/**
 * REGISTER:
 * Igual que el login, pero crea un nuevo usuario.
 */
export async function registerUser(nombre: string, email: string, password: string,) {
  
  try {
    // Llamamos al endpoint de registro del backend
    const response = await api.post(`${API_URL}/register`, { nombre, email, password});
    return response.data; // el backend devuelve "Registro exitoso"
    return { success: true, message: response.data }; // el backend devuelve "Registro exitoso"
  } catch (error: any) {
    if (error.response) {
      return { success: false, message: error.response.data.error || "Error al registrar" };
    }
    return { success: false, message: "Error de conexión con el servidor" };
  }
};

/**
 * GET AUTH KEY:
 * Devuelve el authKey actual almacenado.
 */
export function getAuthKey(): string | null {
  return localStorage.getItem(AUTH_KEY);
}

/**
 * GET SESSION KEY:
 * Devuelve el sessionKey actual almacenado.
 */
export function getSessionKey(): string | null {
  return localStorage.getItem(SESSION_KEY);
}

/**
 * REFRESH TOKEN:
 * Usa el sessionKey para pedir un nuevo authKey.
 */
export async function renewAuthKey(): Promise<string> {
  const sessionKey = getSessionKey();
  if (!sessionKey) throw new Error("No hay sessionKey");

  const response = await api.post(`${API_URL}/renew`, { sessionKey });
  const { accessToken, refreshToken, email, role } = response.data;

  // Guardamos el nuevo access token
  localStorage.setItem(AUTH_KEY, accessToken);

  // Por si el backend manda un nuevo refreshToken, lo actualizamos
  if (refreshToken) {
    localStorage.setItem(SESSION_KEY, refreshToken);
  }

  // Actualizamos datos de usuario
  localStorage.setItem("email", email);
  localStorage.setItem("role", role);

  // Emitimos evento para avisar al AuthContext
  window.dispatchEvent(new Event("token-renewed"));

  return accessToken;
}
/**
 * LOGOUT:
 * Borra tokens de LocalStorage y avisa al backend para invalidar el sessionKey.
 */
export async function logout() {
  const sessionKey = getSessionKey();
  try{
  if (sessionKey) {
    await api.post(`${API_URL}/logout`, { sessionKey });
  }
} catch (error) {
  console.error("Error al cerrar sesión:", error);
}
  // Limpiar LocalStorage
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem("email");
  localStorage.removeItem("role");
}

export function decodeJWT(token: string): { exp: number; iat: number; sub: string } | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload;
  } catch (e) {
    console.error("Error al decodificar el token:", e);
    return null;
  }
}
export function getTokenRemainingTime(token: string): number {
  const payload = decodeJWT(token);
  if (!payload) return 0;

  const now = Math.floor(Date.now() / 1000); // tiempo actual en segundos
  return payload.exp - now; // tiempo restante en segundos
}

// Devuelve el tiempo de expiración (en segundos) de un token JWT
export function getTokenExpiration(token: string): number {
  try {
    const payloadBase64 = token.split(".")[1]; // Parte intermedia del JWT
    const decoded = JSON.parse(atob(payloadBase64));
    return decoded.exp * 1000; // Lo pasamos a milisegundos
  } catch (e) {
    console.error("No se pudo leer el tiempo de expiración del token");
    return 0;
  }
}
