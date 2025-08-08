import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const isEmailValid = (email: string) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEmailValid(email)) {
      setMessage("Correo no válido");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const result = await login(email, password);
      setMessage("Inicio de sesión exitoso. Redirigiendo...");

      // Redirigir según el rol
      if (result.role === "ROLE_ADMIN") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setMessage("Credenciales incorrectas o error en el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Inicia sesión</h2>
      {message && (
        <p
          className={`text-center text-sm mb-4 transition-opacity duration-300 ${
            message.includes("exitoso") ? "text-green-500" : "text-red-500"
          }`}
        >
          {message}
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a6b08f]"
          required
        />
        {!isEmailValid(email) && email && (
          <p className="text-xs text-red-500">Correo no válido</p>
        )}
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a6b08f]"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-3 rounded-md hover:bg-[#8c9679] transition disabled:opacity-50 flex items-center justify-center"
        >
          {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
                Procesando...
              </>
            ) : (
              "Acceder"
            )}
          </button>
      </form>
      <a
        href="#"
        className="text-sm text-[#8c9679] hover:underline block text-center mt-4"
      >
        Olvidé mi contraseña
      </a>
    </div>
  );
}
