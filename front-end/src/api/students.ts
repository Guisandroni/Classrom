import { apiClient } from "./client";
import type { Student, StudentCreate, StudentUpdate, StudentMe } from "@/types";

export const studentsApi = {
  // Listar todos os estudantes
  // Endpoint: GET /api/students
  getAll: async (): Promise<Student[]> => {
    const response = await apiClient.get<Student[]>("/students");
    return response.data;
  },

  // Buscar estudante por ID
  // Endpoint: GET /api/students/{id}
  getById: async (id: number): Promise<Student> => {
    const response = await apiClient.get<Student>(`/students/${id}`);
    return response.data;
  },

  // Buscar dados do estudante autenticado
  // Endpoint: GET /api/students/me
  getMe: async (): Promise<StudentMe> => {
    const response = await apiClient.get<StudentMe>("/students/me");
    return response.data;
  },

  // Criar novo estudante
  // Endpoint: POST /api/students
  create: async (data: StudentCreate): Promise<Student> => {
    const response = await apiClient.post<Student>("/students", data);
    return response.data;
  },

  // Atualizar estudante
  // Endpoint: PUT /api/students/{id}
  update: async (id: number, data: StudentUpdate): Promise<Student> => {
    const response = await apiClient.put<Student>(`/students/${id}`, data);
    return response.data;
  },

  // Deletar estudante
  // Endpoint: DELETE /api/students/{id}
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/students/${id}`);
  },
};
