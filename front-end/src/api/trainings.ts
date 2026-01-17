import { apiClient } from "./client";
import type { Training, TrainingCreate, TrainingUpdate } from "@/types";

export const trainingsApi = {
	getAll: async (): Promise<Training[]> => {
		const response = await apiClient.get<Training[]>("/trainings");
		return response.data;
	},

	getById: async (id: number): Promise<Training> => {
		const response = await apiClient.get<Training>(`/trainings/${id}`);
		return response.data;
	},

	create: async (data: TrainingCreate): Promise<Training> => {
		const response = await apiClient.post<Training>("/trainings", data);
		return response.data;
	},

	update: async (id: number, data: TrainingUpdate): Promise<Training> => {
		const response = await apiClient.put<Training>(`/trainings/${id}`, data);
		return response.data;
	},

	delete: async (id: number): Promise<void> => {
		await apiClient.delete(`/trainings/${id}`);
	},
};
