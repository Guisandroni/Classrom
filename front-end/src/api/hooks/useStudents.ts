import {
	useMutation,
	useQuery,
	useQueryClient,
	type UseMutationResult,
	type UseQueryResult,
} from "@tanstack/react-query";
import { authApi, studentsApi } from "../index";
import type { Student, StudentCreate } from "@/types";

export const useStudents = (): UseQueryResult<Student[], Error> => {
	const currentUser = authApi.getCurrentUser();
	const isAdmin = currentUser?.role === "admin";

	return useQuery({
		queryKey: ["students"],
		queryFn: async () => {
			return studentsApi.getAll();
		},
		staleTime: 1000 * 60 * 5,
		enabled: authApi.isAuthenticated() && isAdmin,
	});
};

export const useStudent = (id: number): UseQueryResult<Student, Error> => {
	return useQuery({
		queryKey: ["students", id],
		queryFn: () => studentsApi.getById(id),
		enabled: !!id,
	});
};

export const useCreateStudent = (): UseMutationResult<
	Student,
	Error,
	StudentCreate
> => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: studentsApi.create,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["students"] });
		},
	});
};

export const useUpdateStudent = (): UseMutationResult<
	Student,
	Error,
	{ id: number; data: Partial<Student> }
> => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }) => studentsApi.update(id, data),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ["students"] });
			queryClient.invalidateQueries({ queryKey: ["students", variables.id] });
		},
	});
};

export const useDeleteStudent = (): UseMutationResult<void, Error, number> => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: studentsApi.delete,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["students"] });
		},
	});
};
