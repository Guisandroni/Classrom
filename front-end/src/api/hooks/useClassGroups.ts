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

export const useClassGroups = (): UseQueryResult<ClassGroup[], Error> => {
	const isAuthenticated = authApi.isAuthenticated();
	
	return useQuery({
		queryKey: ["classgroups"],
		queryFn: async () => {
			let isAdmin = false;
			try {
				isAdmin = authApi.isAdmin();
			} catch (e) {
			}
			
			try {
				if (!isAdmin) {
					return await classGroupsApi.getMy();
				}
				
				return await classGroupsApi.getAll();
			} catch (error: any) {
				throw error;
			}
		},
		staleTime: 1000 * 60 * 5,
		enabled: isAuthenticated,
	});
};

export const useClassGroup = (
	id: number,
): UseQueryResult<ClassGroup, Error> => {
	return useQuery({
		queryKey: ["classgroups", id],
		queryFn: () => classGroupsApi.getById(id),
		enabled: !!id,
	});
};

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
