// src/services/userService.ts
import api from "../services/axiosInstance";

export async function getUsers() {
  const response = await api.get("/usuarios");
  return response.data;
}


//export async function createUser(data: any) { ... }
//export async function deleteUser(id: number) { ... }
