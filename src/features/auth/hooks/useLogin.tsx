import { useState } from "react";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth.store";
import { authApi } from "../api";
import type { AxiosError } from "axios";
import type { ApiErrorResponse } from "@/types";
import type { UserCredentials } from "../auth";

export function useLogin() {
  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const mutation = useMutation<
    { token: string },
    AxiosError<ApiErrorResponse>,
    UserCredentials
  >({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setToken(data.token);
      navigate("/", { replace: true });
    },
    onError: (error) => {
      const data = error.response?.data;
      setGlobalError(data?.message ?? "Error al iniciar sesión");
    },
  });

  return {
    login: mutation.mutate,
    isPending: mutation.isPending,
    globalError,
    clearError: () => setGlobalError(null),
  };
}
