import {
	useMutation,
	useQuery,
	useQueryClient,
	type UseMutationResult,
	type UseQueryResult,
} from "@tanstack/react-query";
import { authApi, enrollmentsApi } from "../index";
import type { Enrollment, EnrollmentCreate } from "@/types";

// Buscar todas as matrículas
export const useEnrollments = (): UseQueryResult<Enrollment[], Error> => {
	return useQuery({
		queryKey: ["enrollments"],
		queryFn: async () => {
			return enrollmentsApi.getAll();
		},
		staleTime: 1000 * 60 * 5,
		enabled: authApi.isAuthenticated(),
	});
};

// Buscar matrícula por ID
export const useEnrollment = (
	id: number,
): UseQueryResult<Enrollment, Error> => {
	return useQuery({
		queryKey: ["enrollments", id],
		queryFn: () => enrollmentsApi.getById(id),
		enabled: !!id,
	});
};

// Buscar matrículas do usuário autenticado
export const useMyEnrollments = (): UseQueryResult<Enrollment[], Error> => {
	return useQuery({
		queryKey: ["enrollments", "my"],
		queryFn: () => enrollmentsApi.getMy(),
		enabled: authApi.isAuthenticated() && authApi.isStudent(),
	});
};

// Buscar matrículas por aula
export const useEnrollmentsByClass = (
	classId: number,
): UseQueryResult<Enrollment[], Error> => {
	return useQuery({
		queryKey: ["enrollments", "class", classId],
		queryFn: () => enrollmentsApi.getByClass(classId),
		enabled: !!classId,
	});
};

// Buscar matrículas por estudante
export const useEnrollmentsByStudent = (
	studentId: number,
): UseQueryResult<Enrollment[], Error> => {
	return useQuery({
		queryKey: ["enrollments", "student", studentId],
		queryFn: () => enrollmentsApi.getByStudent(studentId),
		enabled: !!studentId,
	});
};

// Criar matrícula
export const useCreateEnrollment = (): UseMutationResult<
	Enrollment,
	Error,
	EnrollmentCreate
> => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: enrollmentsApi.create,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["enrollments"] });
		},
	});
};

// Deletar matrícula
export const useDeleteEnrollment = (): UseMutationResult<
	void,
	Error,
	number
> => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: enrollmentsApi.delete,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["enrollments"] });
		},
	});
};
