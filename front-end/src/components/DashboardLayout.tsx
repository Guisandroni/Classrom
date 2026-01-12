import { useState } from "react";
import { Menu } from "lucide-react";
import { Navbar } from "./Navbar";
import { DashboardSidebar } from "./DashboardSidebar";
import { Button } from "./ui/button";
import { Sheet, SheetContent } from "./ui/sheet";

interface DashboardLayoutProps {
  children: React.ReactNode;
  user?: {
    name: string;
    email: string;
    avatar?: string;
    role: "admin" | "student";
  };
}

export function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      <div className="flex">
        {/* Desktop Sidebar - Hidden on mobile */}
        <aside className="hidden lg:block">
          <DashboardSidebar role={user?.role || "student"} />
        </aside>

        {/* Mobile Sidebar - Sheet */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="w-64 p-0">
            <DashboardSidebar role={user?.role || "student"} />
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 w-full min-w-0">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden mb-4"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          {children}
        </main>
      </div>
    </div>
  );
}
