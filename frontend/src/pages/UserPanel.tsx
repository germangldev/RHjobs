export function UserPanel() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-700 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-blue-600">
          User Panel
        </div>
        <nav className="flex-1 p-4 space-y-4">
          <a href="#" className="block hover:bg-blue-600 p-2 rounded">
            Mi Perfil
          </a>
          <a href="#" className="block hover:bg-blue-600 p-2 rounded">
            Mis Datos
          </a>
          <a href="#" className="block hover:bg-blue-600 p-2 rounded">
            Soporte
          </a>
        </nav>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 bg-white p-8">
        <h1 className="text-3xl font-bold">Bienvenido Usuario</h1>
        <p className="mt-4 text-gray-700">
          Aquí puedes acceder a tus datos y realizar acciones disponibles.
        </p>
        {/* Aquí puedes colocar botones, formularios o cualquier acción */}
      </main>
    </div>
  );
}
