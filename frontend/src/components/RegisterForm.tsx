import { useState } from "react";
import { useAuth } from "../context/AuthContext"; // usamos el contexto
import { useNavigate } from "react-router-dom";

export function RegisterForm() {
  // Estados para los campos del formulario
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth(); // obtenemos el método del contexto
  const navigate = useNavigate(); // para redirigir después de registrar

  // Validación simple de email (puedes ampliarla si necesitas)
  const isEmailValid = (email: string) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // evita que se recargue la página
    setMessage("");

    // Validaciones antes de enviar
    if (!isEmailValid(email)) {
      setMessage("Correo no válido");
      return;
    }
    if (password !== confirm) {
      setMessage("Las contraseñas no coinciden");
      return;
    }

    setLoading(true); // activamos el estado de carga

    try {
      // Llamada al método del contexto (que usa el servicio y backend)
      await register(nombre, email, password);
      setMessage("Registro exitoso. Redirigiendo...");
      // Redirigimos al dashboard tras registro exitoso
      navigate("/dashboard");
    } catch (err: any) {
      setMessage(err.message || "Error al registrar. Intenta de nuevo.");
    } finally {
      setLoading(false); // desactivamos el estado de carga
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Crear cuenta
      </h2>

      {/* Mensaje de feedback (error o éxito) */}
      {message && (
        <p
          className={`text-center text-sm mb-4 transition-opacity duration-300 ${
            message.includes("exitoso") ? "text-green-500" : "text-red-500"
          }`}
        >
          {message}
        </p>
      )}

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Nombre completo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a6b08f]"
          required
        />
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a6b08f]"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a6b08f]"
          required
        />
        <input
          type="password"
          placeholder="Confirmar contraseña"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a6b08f]"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#a6b08f] text-white py-3 rounded-md hover:bg-[#8c9679] transition disabled:opacity-50"
        >
          {loading ? "Registrando..." : "Registrarse"}
        </button>
      </form>
    </div>
  );
}
