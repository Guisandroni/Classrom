import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { authApi } from "@/api";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: async ({ location }) => {
    if (typeof window === "undefined") {
      return;
    }
    const token = localStorage.getItem("access_token");
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
    name: user.username || user.email || "Usuário",
    email: user.email || "",
    avatar: "",
    role: user.role || "student",
  };

  return (
    <DashboardLayout user={dashboardUser}>
      <Outlet />
    </DashboardLayout>
  );
}
