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
import { useRegisterStudent, useRegisterAdmin } from "@/api/hooks";
import { ErrorAlert } from "@/components/ErrorAlert";
import { GraduationCap, Shield } from "lucide-react";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});

type UserRole = "student" | "admin";

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [role, setRole] = useState<UserRole>("student");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [errorMessage, setErrorMessage] = useState("");

  const registerStudentMutation = useRegisterStudent();
  const registerAdminMutation = useRegisterAdmin();

  const isLoading = registerStudentMutation.isPending || registerAdminMutation.isPending;

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!validateForm()) {
      return;
    }

    try {
      const registerData = {
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
      };

      if (role === "admin") {
        await registerAdminMutation.mutateAsync(registerData);
      } else {
        await registerStudentMutation.mutateAsync(registerData);
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.response?.data?.email?.[0] ||
        "Error creating account. Please check your data and try again.";
      setErrorMessage(message);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle className="text-2xl">Create Account</CardTitle>
            <CardDescription>
              Fill in the details below to register
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <ErrorAlert
                  title="Error creating account"
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

              <div className="space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className={`h-11 ${errors.name ? "border-red-500" : ""}`}
                  disabled={isLoading}
                />
                {errors.name && (
                  <p className="text-xs text-red-500 mt-1 min-h-[1rem]">
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className={`h-11 ${errors.email ? "border-red-500" : ""}`}
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1 min-h-[1rem]">
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phoneNumber">Phone</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="(11) 99999-9999"
                  value={formData.phoneNumber}
                  onChange={(e) => handleChange("phoneNumber", e.target.value)}
                  className={`h-11 ${errors.phoneNumber ? "border-red-500" : ""}`}
                  disabled={isLoading}
                />
                {errors.phoneNumber && (
                  <p className="text-xs text-red-500 mt-1 min-h-[1rem]">
                    {errors.phoneNumber}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  className={`h-11 ${errors.password ? "border-red-500" : ""}`}
                  disabled={isLoading}
                />
                {errors.password && (
                  <p className="text-xs text-red-500 mt-1 min-h-[1rem]">
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleChange("confirmPassword", e.target.value)
                  }
                  className={`h-11 ${errors.confirmPassword ? "border-red-500" : ""}`}
                  disabled={isLoading}
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1 min-h-[1rem]">
                    {errors.confirmPassword}
                  </p>
                )}
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
                  ? "Creating account..."
                  : `Create ${role === "admin" ? "Admin" : "Student"} Account`}
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
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-blue-600 hover:text-blue-800 hover:underline"
              >
                Sign In
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
