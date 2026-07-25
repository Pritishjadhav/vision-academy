"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, UserRole } from "@/store/authStore";

export function ProtectedRoute({ 
  children, 
  allowedRoles 
}: { 
  children: React.ReactNode;
  allowedRoles: UserRole[];
}) {
  const { user, role, loading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // Wait for auth state to resolve

    if (!user) {
      // Not logged in → send to login
      router.push("/login");
      return;
    }

    if (!role) {
      // Logged in but no role document found → broken account state
      router.push("/login");
      return;
    }

    if (!allowedRoles.includes(role)) {
      // Logged in but wrong role for this page → send to their dashboard
      if (role === "student") router.push("/student");
      else if (role === "admin" || role === "super_admin") router.push("/admin");
      else if (role === "parent") router.push("/parent");
      else router.push("/");
    }
  }, [user, role, loading, router, allowedRoles]);

  // Show spinner while loading, or if the user/role checks aren't met yet
  if (loading || !user || !role || !allowedRoles.includes(role)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-4 border-t-blue-600 border-blue-200 animate-spin"></div>
          <p className="text-zinc-500 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
