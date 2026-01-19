import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLoginStudent, useLoginAdmin } from "@/api/hooks";
import { ErrorAlert } from "@/components/ErrorAlert";
import { GraduationCap, Shield } from "lucide-react";

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

  const isLoading = loginStudentMutation.isPending || loginAdminMutation.isPending;

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle className="text-2xl">Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <ErrorAlert
                  title="Login error"
                  message={errorMessage}
                  onClose={() => setErrorMessage("")}
                />
              )}

              {/* Role Selection */}
              <div className="space-y-2">
                <Label>Account Type</Label>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant={role === "student" ? "default" : "outline"}
                    className={`h-16 flex flex-col items-center justify-center gap-1 ${
                      role === "student"
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "hover:bg-blue-50"
                    }`}
                    onClick={() => setRole("student")}
                    disabled={isLoading}
                  >
                    <GraduationCap className="h-5 w-5" />
                    <span className="text-sm font-medium">Student</span>
                  </Button>
                  <Button
                    type="button"
                    variant={role === "admin" ? "default" : "outline"}
                    className={`h-16 flex flex-col items-center justify-center gap-1 ${
                      role === "admin"
                        ? "bg-purple-600 hover:bg-purple-700 text-white"
                        : "hover:bg-purple-50"
                    }`}
                    onClick={() => setRole("admin")}
                    disabled={isLoading}
                  >
                    <Shield className="h-5 w-5" />
                    <span className="text-sm font-medium">Admin</span>
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@test.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11"
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                className={`w-full h-11 ${
                  role === "admin"
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
                disabled={isLoading}
              >
                {isLoading
                  ? "Signing in..."
                  : `Sign In as ${role === "admin" ? "Admin" : "Student"}`}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or</span>
              </div>
            </div>

            <p className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-blue-600 hover:text-blue-800 hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
