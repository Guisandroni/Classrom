import {
	useMutation,
	useQuery,
	useQueryClient,
	type UseMutationResult,
	type UseQueryResult,
} from "@tanstack/react-query";
import { authApi, classGroupsApi } from "../index";
import type {
	ClassGroup,
	ClassGroupCreate,
	ClassGroupUpdate,
} from "@/types";

// Buscar todas as aulas
export const useClassGroups = (): UseQueryResult<ClassGroup[], Error> => {
	const isAuthenticated = authApi.isAuthenticated();

	return useQuery({
		queryKey: ["classgroups"],
		queryFn: async () => {
			const isAdmin = authApi.isAdmin();

			// Admin vê todas as aulas, estudante vê apenas as suas
			if (isAdmin) {
				return await classGroupsApi.getAll();
			}

			// Para estudante, buscar aulas por treinamento (via enrollments)
			return await classGroupsApi.getAll();
		},
		staleTime: 1000 * 60 * 5,
		enabled: isAuthenticated,
	});
};

// Buscar aula por ID
export const useClassGroup = (
	id: number,
): UseQueryResult<ClassGroup, Error> => {
	return useQuery({
		queryKey: ["classgroups", id],
		queryFn: () => classGroupsApi.getById(id),
		enabled: !!id,
	});
};

// Buscar aulas por treinamento
export const useClassGroupsByTraining = (
	trainingId: number,
): UseQueryResult<ClassGroup[], Error> => {
	return useQuery({
		queryKey: ["classgroups", "training", trainingId],
		queryFn: () => classGroupsApi.getByTraining(trainingId),
		enabled: !!trainingId,
	});
};

// Criar aula
export const useCreateClassGroup = (): UseMutationResult<
	ClassGroup,
	Error,
	ClassGroupCreate
> => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: classGroupsApi.create,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["classgroups"] });
		},
	});
};

// Atualizar aula
export const useUpdateClassGroup = (): UseMutationResult<
	ClassGroup,
	Error,
	{ id: number; data: ClassGroupUpdate }
> => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }) => classGroupsApi.update(id, data),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ["classgroups"] });
			queryClient.invalidateQueries({
				queryKey: ["classgroups", variables.id],
			});
		},
	});
};

// Deletar aula
export const useDeleteClassGroup = (): UseMutationResult<
	void,
	Error,
	number
> => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: classGroupsApi.delete,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["classgroups"] });
		},
	});
};
