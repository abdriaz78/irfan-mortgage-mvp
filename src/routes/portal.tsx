import { createFileRoute, Outlet } from "@tanstack/react-router";
import { RequireRole } from "@/components/auth/require-role";

export const Route = createFileRoute("/portal")({
  component: () => (
    <RequireRole role="client">
      <Outlet />
    </RequireRole>
  ),
});
