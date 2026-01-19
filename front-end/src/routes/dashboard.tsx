import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { authApi } from "@/api";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: async ({ location }) => {
    if (typeof window === "undefined") {
      return;
    }
    const isAuthenticated = authApi.isAuthenticated();
    const currentUser = authApi.getCurrentUser();

    if (!isAuthenticated || !currentUser) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: DashboardLayoutWrapper,
});

function DashboardLayoutWrapper() {
  const user = authApi.getCurrentUser();

  if (!user) {
    return null;
  }

  const dashboardUser = {
    name: user.name || user.email || "Usuário",
    email: user.email || "",
    avatar: "",
    role: user.role === "ADMIN" ? "admin" as const : "student" as const,
  };

  return (
    <DashboardLayout user={dashboardUser}>
      <Outlet />
    </DashboardLayout>
  );
}
