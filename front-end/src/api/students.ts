import { apiClient } from "./client";
import type { Student, StudentCreate } from "@/types";

export const studentsApi = {
	getAll: async (): Promise<Student[]> => {
		const response = await apiClient.get<Student[]>("/students");
		return response.data;
	},

	getById: async (id: number): Promise<Student> => {
		const response = await apiClient.get<Student>(`/students/${id}`);
		return response.data;
	},

	create: async (data: StudentCreate): Promise<Student> => {
		const response = await apiClient.post<Student>("/students", data);
		return response.data;
	},

	update: async (id: number, data: Partial<Student>): Promise<Student> => {
		const response = await apiClient.put<Student>(`/students/${id}`, data);
		return response.data;
	},

	delete: async (id: number): Promise<void> => {
		await apiClient.delete(`/students/${id}`);
	},
};
