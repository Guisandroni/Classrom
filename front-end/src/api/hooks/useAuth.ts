import {
	useMutation,
	useQuery,
	useQueryClient,
	type UseMutationResult,
	type UseQueryResult,
} from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { authApi } from "../index";
import type {
	LoginRequest,
	LoginResponse,
	RegisterRequest,
	RegisterResponse,
	StudentMe,
} from "@/types";

// Hook para login de estudante
export const useLoginStudent = (): UseMutationResult<
	LoginResponse,
	Error,
	LoginRequest
> => {
	const router = useRouter();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: authApi.loginStudent,
		onSuccess: () => {
			queryClient.invalidateQueries();
			router.navigate({ to: "/dashboard" });
		},
	});
};

// Hook para login de admin
export const useLoginAdmin = (): UseMutationResult<
	LoginResponse,
	Error,
	LoginRequest
> => {
	const router = useRouter();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: authApi.loginAdmin,
		onSuccess: () => {
			queryClient.invalidateQueries();
			router.navigate({ to: "/dashboard" });
		},
	});
};

// Hook para registro de estudante
export const useRegisterStudent = (): UseMutationResult<
	RegisterResponse,
	Error,
	RegisterRequest
> => {
	const router = useRouter();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: authApi.registerStudent,
		onSuccess: () => {
			queryClient.invalidateQueries();
			router.navigate({ to: "/dashboard" });
		},
	});
};

// Hook para registro de admin
export const useRegisterAdmin = (): UseMutationResult<
	RegisterResponse,
	Error,
	RegisterRequest
> => {
	const router = useRouter();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: authApi.registerAdmin,
		onSuccess: () => {
			queryClient.invalidateQueries();
			router.navigate({ to: "/dashboard" });
		},
	});
};

// Hook para logout
export const useLogout = (): UseMutationResult<void, Error, void> => {
	const router = useRouter();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: authApi.logout,
		onSuccess: () => {
			queryClient.clear();
			router.navigate({ to: "/login" });
		},
	});
};

// Hook para buscar dados do estudante autenticado
export const useMe = (enabled = true): UseQueryResult<StudentMe, Error> => {
	return useQuery({
		queryKey: ["student-me"],
		queryFn: authApi.getStudentMe,
		enabled: enabled && authApi.isAuthenticated() && authApi.isStudent(),
		retry: false,
	});
};

// Alias para compatibilidade - usa loginStudent como padrão
export const useLogin = useLoginStudent;

// Alias para compatibilidade - usa registerStudent como padrão
export const useRegister = useRegisterStudent;
