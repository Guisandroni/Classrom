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
	UserMe,
} from "@/types";

export const useLogin = (): UseMutationResult<
	LoginResponse,
	Error,
	LoginRequest
> => {
	const router = useRouter();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: authApi.login,
		onSuccess: () => {
			queryClient.invalidateQueries();
			router.navigate({ to: "/dashboard" });
		},
	});
};

export const useRegister = (): UseMutationResult<
	RegisterResponse,
	Error,
	RegisterRequest
> => {
	const router = useRouter();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: authApi.register,
		onSuccess: () => {
			queryClient.invalidateQueries();
			router.navigate({ to: "/dashboard" });
		},
	});
};

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

export const useMe = (enabled = true): UseQueryResult<UserMe, Error> => {
	return useQuery({
		queryKey: ["me"],
		queryFn: authApi.me,
		enabled: enabled && authApi.isAuthenticated(),
		retry: false,
	});
};
