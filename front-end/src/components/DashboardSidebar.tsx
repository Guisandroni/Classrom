import { Link, useLocation } from "@tanstack/react-router";
import {
  BookOpen,
  GraduationCap,
  Home,
  LayoutDashboard,
  Library,
  Users,
  ClipboardList,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useLogout } from "@/api/hooks/useAuth";

interface SidebarProps {
  role: "admin" | "student";
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  description?: string;
}

const adminNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Overview",
  },
  {
    title: "Trainings",
    href: "/dashboard/trainings",
    icon: GraduationCap,
    description: "Manage trainings",
  },
  {
    title: "Classes",
    href: "/dashboard/class",
    icon: BookOpen,
    description: "Manage classes",
  },
  {
    title: "Resources",
    href: "/dashboard/resources",
    icon: Library,
    description: "Materials and resources",
  },
  {
    title: "Students",
    href: "/dashboard/students",
    icon: Users,
    description: "Manage students",
  },
  {
    title: "Enrollments",
    href: "/dashboard/enrollments",
    icon: ClipboardList,
    description: "Manage enrollments",
  },
];

const studentNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
    description: "Home page",
  },
  {
    title: "My Enrollment",
    href: "/dashboard/my-enrollment",
    icon: ClipboardList,
    description: "Enrollment details",
  },
  {
    title: "My Class",
    href: "/dashboard/my-class",
    icon: Users,
    description: "Class information",
  },
];

export function DashboardSidebar({ role }: SidebarProps) {
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const location = useLocation();
  const navItems = role === "admin" ? adminNavItems : studentNavItems;

  return (
    <aside className="w-64 border-r bg-gray-50/50 min-h-[calc(100vh-4rem)] sticky top-16">
      <div className="flex flex-col h-full">
        <div className="p-4">
          <div className="mb-4">
            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">
              {role === "admin" ? "Administrator" : "Student"}
            </div>
          </div>
        </div>

        <nav className="flex-1 px-2 space-y-1 relative">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;

            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group",
                  isActive
                    ? "bg-blue-800 text-white"
                    : "text-primary hover:bg-gray-100",
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5",
                    isActive
                      ? "text-white"
                      : "text-primary group-hover:text-gray-700",
                  )}
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{item.title}</span>
                  {item.description && !isActive && (
                    <span className="text-xs text-gray-500 group-hover:text-gray-600">
                      {item.description}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}

          <Button
            variant="ghost"
            size="icon"
            className="text-red-600 mt-10 px-10 hover:cursor-pointer"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>{logoutMutation.isPending ? "Signing out..." : "Sign Out"}</span>
          </Button>
        </nav>
      </div>
    </aside>
  );
}
