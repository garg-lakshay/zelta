"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, _hasHydrated, user } = useAuthStore();
  const { logout } = useAuth();

  // Redirect to login once the store has hydrated and auth is absent
  useEffect(() => {
    if (_hasHydrated && !isAuthenticated) {
      router.replace("/login");
    }
  }, [_hasHydrated, isAuthenticated, router]);

  // Avoid flash while waiting for localStorage to hydrate
  if (!_hasHydrated) return null;
  if (!isAuthenticated) return null;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0A0A0F" }}>
      {/* Navbar */}
      <nav
        className="flex h-14 items-center justify-between px-6"
        style={{
          backgroundColor: "#111118",
          borderBottom: "1px solid #1E1E2E",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <span className="text-lg font-bold" style={{ color: "#6366F1" }}>
          Zelta
        </span>

        <div className="flex items-center gap-5">
          {user && (
            <span className="text-sm" style={{ color: "#94A3B8" }}>
              {user.name}
            </span>
          )}
          <button
            onClick={logout}
            className="text-sm transition-colors hover:text-white"
            style={{ color: "#94A3B8" }}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main content */}
      <main
        className="mx-auto max-w-7xl px-6 py-8"
        style={{ minHeight: "calc(100vh - 56px)" }}
      >
        {children}
      </main>
    </div>
  );
}
