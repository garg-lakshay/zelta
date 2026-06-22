import { useAuthStore } from "@/store/authStore";

export async function apiFetch<T = unknown>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = useAuthStore.getState().token;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string>),
  };

  const response = await fetch(endpoint, { ...options, headers });

  if (response.status === 401) {
    useAuthStore.getState().clearAuth();
    if (typeof window !== "undefined") window.location.href = "/login";
    throw new Error("Unauthorized");
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      (data as { message?: string; error?: string }).message ??
        (data as { message?: string; error?: string }).error ??
        "Something went wrong",
    );
  }

  return data as T;
}
