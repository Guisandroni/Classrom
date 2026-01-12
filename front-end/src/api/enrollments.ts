import { apiClient } from "./client";
import type { Enrollment, EnrollmentCreate, EnrollmentUpdate } from "@/types";

export const enrollmentsApi = {
  getAll: async (): Promise<Enrollment[]> => {
    const response = await apiClient.get<Enrollment[]>("/enrollments/");
    return response.data;
  },

  getById: async (id: number): Promise<Enrollment> => {
    const response = await apiClient.get<Enrollment>(`/enrollments/${id}/`);
    return response.data;
  },

  create: async (data: EnrollmentCreate): Promise<Enrollment> => {
    const response = await apiClient.post<Enrollment>("/enrollments/", data);
    return response.data;
  },

  update: async (id: number, data: EnrollmentUpdate): Promise<Enrollment> => {
    const response = await apiClient.put<Enrollment>(
      `/enrollments/${id}/`,
      data,
    );
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/enrollments/${id}/`);
  },
};
