import {
	useMutation,
	useQuery,
	useQueryClient,
	type UseMutationResult,
	type UseQueryResult,
} from "@tanstack/react-query";
import { authApi, studentsApi } from "../index";
import type { Student, StudentCreate, StudentUpdate, StudentMe } from "@/types";

// Buscar todos os estudantes (apenas ADMIN)
export const useStudents = (): UseQueryResult<Student[], Error> => {
	const currentUser = authApi.getCurrentUser();
	const isAdmin = currentUser?.role === "ADMIN";

	return useQuery({
		queryKey: ["students"],
		queryFn: async () => {
			return studentsApi.getAll();
		},
		staleTime: 1000 * 60 * 5,
		enabled: authApi.isAuthenticated() && isAdmin,
	});
};

// Buscar estudante por ID
export const useStudent = (id: number): UseQueryResult<Student, Error> => {
	return useQuery({
		queryKey: ["students", id],
		queryFn: () => studentsApi.getById(id),
		enabled: !!id,
	});
};

// Buscar dados do estudante autenticado
export const useStudentMe = (): UseQueryResult<StudentMe, Error> => {
	return useQuery({
		queryKey: ["students", "me"],
		queryFn: () => studentsApi.getMe(),
		enabled: authApi.isAuthenticated() && authApi.isStudent(),
	});
};

// Criar estudante
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

// Atualizar estudante
export const useUpdateStudent = (): UseMutationResult<
	Student,
	Error,
	{ id: number; data: StudentUpdate }
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

// Deletar estudante
export const useDeleteStudent = (): UseMutationResult<void, Error, number> => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: studentsApi.delete,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["students"] });
		},
	});
};
