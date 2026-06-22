"use client";

import { useState, useEffect, useCallback } from "react";
import { dashboardService } from "@/services/dashboardService";
import { useAuthStore } from "@/store/authStore";
import type { Analytics } from "@/types";

export function useDashboard() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { isAuthenticated, _hasHydrated } = useAuthStore();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await dashboardService.get();
      setAnalytics(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      // 404 = no analytics yet — treat as empty state, not an error
      if (msg.includes("No analytics found")) {
        setAnalytics(null);
      } else {
        setError(msg || "Failed to load dashboard data");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (_hasHydrated && isAuthenticated) {
      fetchData();
    } else if (_hasHydrated && !isAuthenticated) {
      setIsLoading(false);
    }
  }, [_hasHydrated, isAuthenticated, fetchData]);

  return { analytics, isLoading, error, refetch: fetchData };
}
