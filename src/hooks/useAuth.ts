"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await authService.login(email, password);
      useAuthStore.getState().setAuth(data.token, data.user);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.register(name, email, password);
      // Auto-login after registration
      const data = await authService.login(email, password);
      useAuthStore.getState().setAuth(data.token, data.user);
      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Registration failed",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearAuth();
    router.push("/");
  };

  return { isLoading, error, login, register, logout };
}
