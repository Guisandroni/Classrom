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

export const useResources = (): UseQueryResult<Resource[], Error> => {
	const isAuthenticated = authApi.isAuthenticated();
	
	let isAdmin = false;
	try {
		isAdmin = authApi.isAdmin();
	} catch (e) {
	}
	
	return useQuery({
		queryKey: ["resources"],
		queryFn: async () => {
			let isAdminCheck = false;
			try {
				isAdminCheck = authApi.isAdmin();
			} catch (e) {
			}
		
			try {
				if (!isAdminCheck) {
					return await resourcesApi.getMy();
				}
				
				return await resourcesApi.getAll();
			} catch (error: any) {
				throw error;
			}
		},
		staleTime: 1000 * 60 * 5,
		enabled: isAuthenticated,
		retry: 1,
	});
};

export const useResource = (id: number): UseQueryResult<Resource, Error> => {
	return useQuery({
		queryKey: ["resources", id],
		queryFn: () => resourcesApi.getById(id),
		enabled: !!id,
	});
};

export const useResourcesByType = (
	type: string,
): UseQueryResult<Resource[], Error> => {
	return useQuery({
		queryKey: ["resources", "type", type],
		queryFn: () => resourcesApi.getByType(type),
		enabled: !!type,
	});
};

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

export const useDeleteResource = (): UseMutationResult<void, Error, number> => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: resourcesApi.delete,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["resources"] });
		},
	});
};
