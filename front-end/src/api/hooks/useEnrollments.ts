import {
	useMutation,
	useQuery,
	useQueryClient,
	type UseMutationResult,
	type UseQueryResult,
} from "@tanstack/react-query";
import { authApi, enrollmentsApi } from "../index";
import type {
	Enrollment,
	EnrollmentCreate,
	EnrollmentUpdate,
} from "@/types";

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

export const useEnrollment = (
	id: number,
): UseQueryResult<Enrollment, Error> => {
	return useQuery({
		queryKey: ["enrollments", id],
		queryFn: () => enrollmentsApi.getById(id),
		enabled: !!id,
	});
};

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

export const useUpdateEnrollment = (): UseMutationResult<
	Enrollment,
	Error,
	{ id: number; data: EnrollmentUpdate }
> => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }) => enrollmentsApi.update(id, data),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ["enrollments"] });
			queryClient.invalidateQueries({ queryKey: ["enrollments", variables.id] });
		},
	});
};

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
