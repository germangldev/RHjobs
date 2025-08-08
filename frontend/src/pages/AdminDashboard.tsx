import { useEffect, useState } from "react";

export function AdminDashboard() {
  const [email, setEmail] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    const storedRole = localStorage.getItem("role");
    setEmail(storedEmail);
    setRole(storedRole);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-blue-600">Panel Admin</h2>
        </div>
        <nav className="px-4">
          <ul className="space-y-3">
            <li><a href="/admin/users" className="block p-2 rounded hover:bg-blue-100">Usuarios</a></li>
            <li><a href="/admin/products" className="block p-2 rounded hover:bg-blue-100">Productos</a></li>
            <li><a href="/admin/orders" className="block p-2 rounded hover:bg-blue-100">Pedidos</a></li>
            <li><a href="/admin/settings" className="block p-2 rounded hover:bg-blue-100">Configuración</a></li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-4">Bienvenido {email} al Dashboard</h1>
        <p className="text-lg mb-6">
          Usuario: <span className="font-semibold">{email}</span> | Rol: <span className="font-semibold">{role}</span>
        </p>

        {/* Cards resumen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h2 className="text-xl font-bold">Usuarios</h2>
            <p className="text-2xl mt-2">125</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h2 className="text-xl font-bold">Productos</h2>
            <p className="text-2xl mt-2">58</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h2 className="text-xl font-bold">Pedidos</h2>
            <p className="text-2xl mt-2">34</p>
          </div>
        </div>
      </main>
    </div>
  );
}
