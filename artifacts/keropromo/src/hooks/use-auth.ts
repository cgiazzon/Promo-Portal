import { useGetMe, useLogin } from "@workspace/api-client-react";
import type { LoginRequest } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

export function useAuth(requireAuth: boolean = false, requireRole?: string) {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const { data: user, isLoading, isError } = useGetMe({
    query: {
      queryKey: ["/api/auth/me"],
      retry: false,
      staleTime: 5 * 60 * 1000,
    }
  });

  useEffect(() => {
    if (!isLoading && requireAuth && (!user || isError)) {
      setLocation("/login");
    }
    if (!isLoading && user && requireRole && user.role !== requireRole) {
      setLocation(user.role === 'admin' ? '/admin' : '/dashboard');
    }
    if (!isLoading && user && requireAuth && user.status === 'overdue') {
      setLocation("/paywall");
    }
  }, [user, isLoading, isError, requireAuth, requireRole, setLocation]);

  const { mutateAsync: loginMutation } = useLogin();

  const login = async (credentials: LoginRequest) => {
    const res = await loginMutation({ data: credentials });
    if (res.token) {
      localStorage.setItem("auth_token", res.token);
    }
    if ((res as unknown as { refreshToken?: string }).refreshToken) {
      localStorage.setItem("refresh_token", (res as unknown as { refreshToken: string }).refreshToken);
    }
    queryClient.setQueryData(["/api/auth/me"], res.user);

    if (res.user.role === 'admin') setLocation('/admin');
    else if (res.user.role === 'collaborator') setLocation('/collaborator');
    else setLocation('/dashboard');
    return res;
  };

  const logout = () => {
    const refreshToken = localStorage.getItem("refresh_token");
    fetch(`${import.meta.env.BASE_URL}api/auth/logout`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("auth_token") || ""}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    }).catch(() => {});
    localStorage.removeItem("auth_token");
    localStorage.removeItem("refresh_token");
    queryClient.removeQueries({ queryKey: ["/api/auth/me"] });
    setLocation("/login");
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
  };
}
