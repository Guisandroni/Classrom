import { apiClient } from "./client";
import type { ClassGroup, ClassGroupCreate, ClassGroupUpdate } from "@/types";

export const classGroupsApi = {
  getAll: async (): Promise<ClassGroup[]> => {
    const response = await apiClient.get<ClassGroup[]>("/classgroups/");
    return response.data;
  },

  getMy: async (): Promise<ClassGroup[]> => {
    const response = await apiClient.get<ClassGroup[]>("/classgroups/my/");
    return response.data;
  },

  getById: async (id: number): Promise<ClassGroup> => {
    const response = await apiClient.get<ClassGroup>(`/classgroups/${id}/`);
    return response.data;
  },

  create: async (data: ClassGroupCreate): Promise<ClassGroup> => {
    const response = await apiClient.post<ClassGroup>("/classgroups/", data);
    return response.data;
  },

  update: async (id: number, data: ClassGroupUpdate): Promise<ClassGroup> => {
    const response = await apiClient.put<ClassGroup>(
      `/classgroups/${id}/`,
      data,
    );
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/classgroups/${id}/`);
  },
};
