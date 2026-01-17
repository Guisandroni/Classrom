import { apiClient } from "./client";
import type { ClassGroup, ClassGroupCreate, ClassGroupUpdate } from "@/types";

export const classGroupsApi = {
  getAll: async (): Promise<ClassGroup[]> => {
    const response = await apiClient.get<ClassGroup[]>("/classes");
    return response.data;
  },

  getMy: async (): Promise<ClassGroup[]> => {
    const response = await apiClient.get<ClassGroup[]>("/classes/my");
    return response.data;
  },

  getById: async (id: number): Promise<ClassGroup> => {
    const response = await apiClient.get<ClassGroup>(`/classes/${id}`);
    return response.data;
  },

  getByTraining: async (trainingId: number): Promise<ClassGroup[]> => {
    const response = await apiClient.get<ClassGroup[]>(`/classes/training/${trainingId}`);
    return response.data;
  },

  create: async (data: ClassGroupCreate): Promise<ClassGroup> => {
    const response = await apiClient.post<ClassGroup>("/classes", data);
    return response.data;
  },

  update: async (id: number, data: ClassGroupUpdate): Promise<ClassGroup> => {
    const response = await apiClient.put<ClassGroup>(
      `/classes/${id}`,
      data,
    );
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/classes/${id}`);
  },
};
