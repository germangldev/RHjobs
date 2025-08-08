import { useEffect, useState } from "react";
import { getUsers } from "../services/userService";

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  role: string;
}

export function UserList() {
  const [users, setUsers] = useState<Usuario[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getUsers()
      .then(data => setUsers(data))
      .catch(err => {
        console.error("Error al obtener usuarios:", err);
        setError("No se pudieron cargar los usuarios");
      });
  }, []);

  if (error) return <p>{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Lista de Usuarios</h2>
      <ul className="list-disc pl-6">
        {users.map(user => (
          <li key={user.id}>
            <strong>{user.nombre}</strong> ({user.email}) - {user.role}
          </li>
        ))}
      </ul>
    </div>
  );
}
