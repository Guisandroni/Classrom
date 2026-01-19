import { Link, useLocation } from "@tanstack/react-router";

interface NavItem {
  icon: string;
  label: string;
  href: string;
}

interface BottomNavigationProps {
  role: "admin" | "student";
}

const adminNavItems: NavItem[] = [
  { icon: "dashboard", label: "Dashboard", href: "/dashboard" },
  { icon: "school", label: "Trainings", href: "/dashboard/trainings" },
  { icon: "class", label: "Classes", href: "/dashboard/class" },
  { icon: "people", label: "Students", href: "/dashboard/students" },
];

const studentNavItems: NavItem[] = [
  { icon: "home", label: "Home", href: "/dashboard" },
  { icon: "menu_book", label: "My Class", href: "/dashboard/my-class" },
  { icon: "library_books", label: "Resources", href: "/dashboard/resources" },
  { icon: "person", label: "Profile", href: "/dashboard/my-enrollment" },
];

export function BottomNavigation({ role }: BottomNavigationProps) {
  const location = useLocation();
  const navItems = role === "admin" ? adminNavItems : studentNavItems;

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return location.pathname === "/dashboard" || location.pathname === "/dashboard/";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pb-safe z-50 lg:hidden">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
                active
                  ? "text-blue-600 dark:text-blue-500"
                  : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              }`}
            >
              <span className="material-icons-round text-2xl">{item.icon}</span>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
