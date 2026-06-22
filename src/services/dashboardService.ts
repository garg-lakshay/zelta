import { apiFetch } from "./api";
import type { Analytics } from "@/types";

export const dashboardService = {
  get: async (): Promise<Analytics> => {
    const data = await apiFetch<{ analytics: Analytics }>("/api/dashboard");
    return data.analytics;
  },
};
