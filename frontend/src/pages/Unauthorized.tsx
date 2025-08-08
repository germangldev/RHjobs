import { Link } from "react-router-dom";

export function Unauthorized() {
  return (
    <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-10 text-center">
      <h1 className="text-3xl font-bold text-red-600 mb-4">Acceso denegado</h1>
      <p className="text-gray-600 mb-6">No tienes permisos para acceder a esta página.</p>
      <Link
        to="/"
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
