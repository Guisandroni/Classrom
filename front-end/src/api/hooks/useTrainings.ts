import {
	useMutation,
	useQuery,
	useQueryClient,
	type UseMutationResult,
	type UseQueryResult,
} from "@tanstack/react-query";
import { authApi, trainingsApi } from "../index";
import type {
	Training,
	TrainingCreate,
	TrainingUpdate,
} from "@/types";

// Buscar todos os treinamentos (apenas ADMIN)
export const useTrainings = (): UseQueryResult<Training[], Error> => {
	const currentUser = authApi.getCurrentUser();
	const isAdmin = currentUser?.role === "ADMIN";

	return useQuery({
		queryKey: ["trainings"],
		queryFn: async () => {
			return trainingsApi.getAll();
		},
		staleTime: 1000 * 60 * 5,
		enabled: authApi.isAuthenticated() && isAdmin,
	});
};

// Buscar treinamentos do usuário autenticado
export const useMyTrainings = (): UseQueryResult<Training[], Error> => {
	return useQuery({
		queryKey: ["trainings", "my"],
		queryFn: async () => {
			return trainingsApi.getMy();
		},
		staleTime: 1000 * 60 * 5,
		enabled: authApi.isAuthenticated(),
	});
};

// Buscar treinamento por ID
export const useTraining = (id: number): UseQueryResult<Training, Error> => {
	return useQuery({
		queryKey: ["trainings", id],
		queryFn: () => trainingsApi.getById(id),
		enabled: !!id,
	});
};

// Criar treinamento
export const useCreateTraining = (): UseMutationResult<
	Training,
	Error,
	TrainingCreate
> => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: trainingsApi.create,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["trainings"] });
		},
	});
};

// Atualizar treinamento
export const useUpdateTraining = (): UseMutationResult<
	Training,
	Error,
	{ id: number; data: TrainingUpdate }
> => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }) => trainingsApi.update(id, data),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ["trainings"] });
			queryClient.invalidateQueries({ queryKey: ["trainings", variables.id] });
		},
	});
};

// Deletar treinamento
export const useDeleteTraining = (): UseMutationResult<void, Error, number> => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: trainingsApi.delete,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["trainings"] });
		},
	});
};
