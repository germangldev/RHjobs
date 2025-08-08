import { LoginForm } from "../components/LoginForm";
import '../index.css'; // Importa el CSS de Tailwind

export function LoginPage() {
  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Columna izquierda: formulario */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-[#f7f7f5] p-8">
        <div className="max-w-md w-full">
          <LoginForm />
        </div>
      </div>

      {/* Columna derecha: imagen */}
      <div
        className="w-full md:w-1/2 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/library.webp')",
        }}
      ></div>
    </div>
  );
}
