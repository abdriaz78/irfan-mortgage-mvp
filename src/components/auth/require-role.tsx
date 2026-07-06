import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import type { UserRole } from "@/lib/database.types";

export function RequireRole({ role, children }: { role: UserRole; children: React.ReactNode }) {
  const { session, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!session) {
      navigate({ to: "/login" });
      return;
    }
    if (!profile) {
      // Session exists but no profile row could be loaded — inconsistent state
      // (e.g. the row genuinely doesn't exist). Don't spin forever; send them back.
      navigate({ to: "/login" });
      return;
    }
    if (profile.role !== role) {
      navigate({ to: profile.role === "admin" ? "/admin" : "/portal" });
    }
  }, [loading, session, profile, role, navigate]);

  if (loading || !session || !profile || profile.role !== role) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-sm text-muted-foreground">Loading…</div>
      </div>
    );
  }

  return <>{children}</>;
}
