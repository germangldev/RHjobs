// Dashboard.tsx
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { LogOut, AlertTriangle } from "lucide-react";

export function Dashboard() {
  const { loading, nombre, logout } = useAuth();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleConfirmLogout = async () => {
      try {
        await logout();
      } catch {
        console.log("Error cerrando sesión en el servidor, limpiando cliente...");
      } finally {
        window.location.href = "/"; // redirigir siempre
      }
    };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <svg className="animate-spin h-10 w-10 text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
        </svg>
        <p className="text-gray-700 font-medium">Cargando tu panel...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800">Bienvenido, {nombre}</h1>
      {/* Contenido del dashboard */}

    <button
        id="logout-button"
        onClick={() => setShowConfirm(true)}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded flex items-center gap-2 hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg"
      >
        <LogOut size={18} />
        Cerrar sesión
      </button>

      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
          <div className="bg-white p-6 rounded-2xl shadow-2xl transform transition-all duration-300 scale-95 hover:scale-100">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="text-yellow-500" size={32} />
              <h2 className="text-xl font-semibold text-gray-800">
                ¿Cerrar sesión?
              </h2>
            </div>
            <p className="text-gray-600 mb-6">
              Perderás el acceso a tu sesión actual. ¿Estás seguro?
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleConfirmLogout}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300"
              >
                Sí, salir
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-300"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}