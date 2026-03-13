import { useGetMe, useLogin } from "@workspace/api-client-react";
import type { LoginRequest } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { useEffect } from "react";

export function useAuth(requireAuth: boolean = false, requireRole?: string) {
  const [, setLocation] = useLocation();
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
    if (res.user.role === 'admin') setLocation('/admin');
    else if (res.user.role === 'collaborator') setLocation('/collaborator');
    else setLocation('/dashboard');
    return res;
  };

  const logout = () => {
    fetch(`${import.meta.env.BASE_URL}api/auth/logout`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("auth_token") || ""}`,
      },
    }).catch(() => {});
    localStorage.removeItem("auth_token");
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
