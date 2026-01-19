import { Link, useLocation } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useLogout } from "@/api/hooks/useAuth";

interface SidebarProps {
  role: "admin" | "student";
}

interface NavItem {
  title: string;
  href: string;
  icon: string;
  description?: string;
}

const adminNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "dashboard",
    description: "Overview",
  },
  {
    title: "Trainings",
    href: "/dashboard/trainings",
    icon: "school",
    description: "Manage trainings",
  },
  {
    title: "Classes",
    href: "/dashboard/class",
    icon: "class",
    description: "Manage classes",
  },
  {
    title: "Resources",
    href: "/dashboard/resources",
    icon: "folder_open",
    description: "Materials and resources",
  },
  {
    title: "Students",
    href: "/dashboard/students",
    icon: "people",
    description: "Manage students",
  },
  {
    title: "Enrollments",
    href: "/dashboard/enrollments",
    icon: "assignment",
    description: "Manage enrollments",
  },
];

const studentNavItems: NavItem[] = [
  {
    title: "Home",
    href: "/dashboard",
    icon: "home",
    description: "Home page",
  },
  {
    title: "My Enrollment",
    href: "/dashboard/my-enrollment",
    icon: "assignment_ind",
    description: "Enrollment details",
  },
  {
    title: "My Class",
    href: "/dashboard/my-class",
    icon: "menu_book",
    description: "Class information",
  },
  {
    title: "Resources",
    href: "/dashboard/resources",
    icon: "library_books",
    description: "Learning materials",
  },
];

export function DashboardSidebar({ role }: SidebarProps) {
  const logoutMutation = useLogout();
  const location = useLocation();
  const navItems = role === "admin" ? adminNavItems : studentNavItems;

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return location.pathname === "/dashboard" || location.pathname === "/dashboard/";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <aside className="w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 min-h-[calc(100vh-4rem)] sticky top-16">
      <div className="flex flex-col h-full">
        <div className="p-4">
          <div className="mb-2">
            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-semibold">
              <span className="material-icons-round text-sm mr-1">
                {role === "admin" ? "admin_panel_settings" : "school"}
              </span>
              {role === "admin" ? "Administrator" : "Student"}
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group",
                  active
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
                )}
              >
                <span
                  className={cn(
                    "material-icons-round text-xl",
                    active
                      ? "text-white"
                      : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200",
                  )}
                >
                  {item.icon}
                </span>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{item.title}</span>
                  {item.description && !active && (
                    <span className="text-xs text-gray-500 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400">
                      {item.description}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
          >
            <span className="material-icons-round text-xl mr-2">logout</span>
            <span>{logoutMutation.isPending ? "Signing out..." : "Sign Out"}</span>
          </Button>
        </div>
      </div>
    </aside>
  );
}
