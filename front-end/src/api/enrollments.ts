import { apiClient } from "./client";
import type { Enrollment, EnrollmentCreate } from "@/types";

export const enrollmentsApi = {
  // Listar todas as matrículas
  // Endpoint: GET /api/enrollments
  getAll: async (): Promise<Enrollment[]> => {
    const response = await apiClient.get<Enrollment[]>("/enrollments");
    return response.data;
  },

  // Buscar matrícula por ID
  // Endpoint: GET /api/enrollments/{id}
  getById: async (id: number): Promise<Enrollment> => {
    const response = await apiClient.get<Enrollment>(`/enrollments/${id}`);
    return response.data;
  },

  // Buscar matrículas por aula
  // Endpoint: GET /api/enrollments/class/{classId}
  getByClass: async (classId: number): Promise<Enrollment[]> => {
    const response = await apiClient.get<Enrollment[]>(
      `/enrollments/class/${classId}`
    );
    return response.data;
  },

  // Buscar matrículas por estudante
  // Endpoint: GET /api/enrollments/student/{studentId}
  getByStudent: async (studentId: number): Promise<Enrollment[]> => {
    const response = await apiClient.get<Enrollment[]>(
      `/enrollments/student/${studentId}`
    );
    return response.data;
  },

  // Buscar matrículas do usuário autenticado
  // Endpoint: GET /api/enrollments/my
  getMy: async (): Promise<Enrollment[]> => {
    const response = await apiClient.get<Enrollment[]>("/enrollments/my");
    return response.data;
  },

  // Criar nova matrícula
  // Endpoint: POST /api/enrollments
  create: async (data: EnrollmentCreate): Promise<Enrollment> => {
    const response = await apiClient.post<Enrollment>("/enrollments", data);
    return response.data;
  },

  // Deletar matrícula
  // Endpoint: DELETE /api/enrollments/{id}
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/enrollments/${id}`);
  },
};
