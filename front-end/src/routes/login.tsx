import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoginStudent, useLoginAdmin } from "@/api/hooks";
import { ErrorAlert } from "@/components/ErrorAlert";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

type UserRole = "student" | "admin";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("student");
  const [errorMessage, setErrorMessage] = useState("");

  const loginStudentMutation = useLoginStudent();
  const loginAdminMutation = useLoginAdmin();

  const isLoading =
    loginStudentMutation.isPending || loginAdminMutation.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      if (role === "admin") {
        await loginAdminMutation.mutateAsync({ email, password });
      } else {
        await loginStudentMutation.mutateAsync({ email, password });
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Invalid email or password";
      setErrorMessage(message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
            {/* Title */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Welcome Back
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
                Sign in to continue to your account
              </p>
            </div>

            {/* Role Selection */}
            <div className="flex gap-3 mb-6">
              <button
                type="button"
                onClick={() => setRole("student")}
                disabled={isLoading}
                className={`flex-1 py-3 px-4 rounded-xl flex flex-col items-center gap-2 transition-all ${
                  role === "student"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                <span className="material-icons-round text-2xl">school</span>
                <span className="text-sm font-medium">Student</span>
              </button>
              <button
                type="button"
                onClick={() => setRole("admin")}
                disabled={isLoading}
                className={`flex-1 py-3 px-4 rounded-xl flex flex-col items-center gap-2 transition-all ${
                  role === "admin"
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                <span className="material-icons-round text-2xl">
                  admin_panel_settings
                </span>
                <span className="text-sm font-medium">Admin</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <ErrorAlert
                  title="Login error"
                  message={errorMessage}
                  onClose={() => setErrorMessage("")}
                />
              )}

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Email
                </Label>
                <div className="relative">
                  <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                    email
                  </span>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 h-12 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500/50"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="password"
                    className="text-gray-700 dark:text-gray-300"
                  >
                    Password
                  </Label>
                  {/*<a
                    href="#"
                    className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium"
                  >
                    Forgot password?
                  </a>*/}
                </div>
                <div className="relative">
                  <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                    lock
                  </span>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 h-12 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500/50"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className={`w-full h-12 rounded-xl font-semibold text-white shadow-lg transition-all ${
                  role === "admin"
                    ? "bg-purple-600 hover:bg-purple-700 shadow-purple-600/20"
                    : "bg-blue-600 hover:bg-blue-700 shadow-blue-600/20"
                }`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="material-icons-round animate-spin text-xl">
                      refresh
                    </span>
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <span className="material-icons-round text-xl">login</span>
                    Sign In as {role === "admin" ? "Admin" : "Student"}
                  </span>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200 dark:border-gray-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-gray-800 px-3 text-gray-500">
                  Or
                </span>
              </div>
            </div>

            {/* Sign Up Link */}
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
