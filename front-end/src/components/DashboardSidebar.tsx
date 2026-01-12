import { Link, useLocation } from "@tanstack/react-router";
import {
  BookOpen,
  GraduationCap,
  Home,
  LayoutDashboard,
  Library,
  Users,
  UserPlus,
  ClipboardList,
  FolderOpen,
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
    description: "Visão geral",
  },
  {
    title: "Treinamentos",
    href: "/dashboard/trainings",
    icon: GraduationCap,
    description: "Gerenciar treinamentos",
  },
  {
    title: "Turmas",
    href: "/dashboard/class",
    icon: BookOpen,
    description: "Gerenciar Turmas",
  },
  {
    title: "Recursos",
    href: "/dashboard/resources",
    icon: Library,
    description: "Materiais e recursos",
  },
  {
    title: "Alunos",
    href: "/dashboard/students",
    icon: Users,
    description: "Gerenciar alunos",
  },
  {
    title: "Matrículas",
    href: "/dashboard/enrollments",
    icon: ClipboardList,
    description: "Gerenciar matrículas",
  },
];

const studentNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
    description: "Página inicial",
  },
  {
    title: "Minha Matrícula",
    href: "/dashboard/my-enrollment",
    icon: ClipboardList,
    description: "Detalhes da matrícula",
  },
  {
    title: "Minha Turma",
    href: "/dashboard/my-class",
    icon: Users,
    description: "Informações da turma",
  },
];

export function DashboardSidebar({ role }: SidebarProps) {
  const logoutMutation = useLogout();

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

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
              {role === "admin" ? "Administrador" : "Aluno"}
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
            <span>{logoutMutation.isPending ? "Saindo..." : "Sair"}</span>
          </Button>
        </nav>
      </div>
    </aside>
  );
}
