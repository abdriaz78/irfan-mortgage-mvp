import { createFileRoute, Outlet } from "@tanstack/react-router";
import { RequireRole } from "@/components/auth/require-role";

export const Route = createFileRoute("/admin")({
  component: () => (
    <RequireRole role="admin">
      <Outlet />
    </RequireRole>
  ),
});
