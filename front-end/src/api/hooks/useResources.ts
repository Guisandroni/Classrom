import {
	useMutation,
	useQuery,
	useQueryClient,
	type UseMutationResult,
	type UseQueryResult,
} from "@tanstack/react-query";
import { authApi, resourcesApi } from "../index";
import type {
	Resource,
	ResourceCreate,
	ResourceUpdate,
} from "@/types";

// Buscar todos os recursos
export const useResources = (): UseQueryResult<Resource[], Error> => {
	const isAuthenticated = authApi.isAuthenticated();

	return useQuery({
		queryKey: ["resources"],
		queryFn: async () => {
			return await resourcesApi.getAll();
		},
		staleTime: 1000 * 60 * 5,
		enabled: isAuthenticated,
		retry: 1,
	});
};

// Buscar recurso por ID
export const useResource = (id: number): UseQueryResult<Resource, Error> => {
	return useQuery({
		queryKey: ["resources", id],
		queryFn: () => resourcesApi.getById(id),
		enabled: !!id,
	});
};

// Buscar recursos por aula
export const useResourcesByClass = (
	classId: number,
): UseQueryResult<Resource[], Error> => {
	return useQuery({
		queryKey: ["resources", "class", classId],
		queryFn: () => resourcesApi.getByClass(classId),
		enabled: !!classId,
	});
};

// Criar recurso
export const useCreateResource = (): UseMutationResult<
	Resource,
	Error,
	ResourceCreate
> => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: resourcesApi.create,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["resources"] });
		},
	});
};

// Atualizar recurso
export const useUpdateResource = (): UseMutationResult<
	Resource,
	Error,
	{ id: number; data: ResourceUpdate }
> => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }) => resourcesApi.update(id, data),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ["resources"] });
			queryClient.invalidateQueries({ queryKey: ["resources", variables.id] });
		},
	});
};

// Deletar recurso
export const useDeleteResource = (): UseMutationResult<void, Error, number> => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: resourcesApi.delete,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["resources"] });
		},
	});
};
