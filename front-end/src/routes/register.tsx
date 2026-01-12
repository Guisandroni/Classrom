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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRegister } from "@/api/hooks";
import { ErrorAlert } from "@/components/ErrorAlert";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});

function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student" as "student" | "admin",
    student_name: "",
    student_phone: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [errorMessage, setErrorMessage] = useState("");

  const registerMutation = useRegister();

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.username.trim()) {
      newErrors.username = "Usuário é obrigatório";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (formData.role === "student") {
      if (!formData.student_name.trim()) {
        newErrors.student_name = "Nome completo é obrigatório";
      }
      if (!formData.student_phone.trim()) {
        newErrors.student_phone = "Telefone é obrigatório";
      }
    }

    if (!formData.password) {
      newErrors.password = "Senha é obrigatória";
    } else if (formData.password.length < 8) {
      newErrors.password = "Senha deve ter no mínimo 8 caracteres";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem";
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
      await registerMutation.mutateAsync({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        password_confirm: formData.confirmPassword,
        role: formData.role,
        student_name:
          formData.role === "student" ? formData.student_name : undefined,
        student_phone:
          formData.role === "student" ? formData.student_phone : undefined,
      });
    } catch (error: any) {
      const message =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.response?.data?.username?.[0] ||
        error?.response?.data?.email?.[0] ||
        "Erro ao criar conta. Verifique os dados e tente novamente.";
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
            <CardTitle className="text-2xl">Criar Conta</CardTitle>
            <CardDescription>
              Preencha os dados abaixo para se cadastrar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <ErrorAlert
                  title="Erro ao criar conta"
                  message={errorMessage}
                  onClose={() => setErrorMessage("")}
                />
              )}

              <div className="space-y-1.5">
                <Label htmlFor="username">Usuário</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="joao_silva"
                  value={formData.username}
                  onChange={(e) => handleChange("username", e.target.value)}
                  className={`h-11 ${errors.username ? "border-red-500" : ""}`}
                  disabled={registerMutation.isPending}
                />
                {errors.username && (
                  <p className="text-xs text-red-500 mt-1 min-h-[1rem]">{errors.username}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="joao@email.com"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className={`h-11 ${errors.email ? "border-red-500" : ""}`}
                  disabled={registerMutation.isPending}
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1 min-h-[1rem]">{errors.email}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="role">Tipo de Conta</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => handleChange("role", value)}
                  disabled={registerMutation.isPending}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Selecione o tipo de conta" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Aluno</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.role === "student" && (
                <>
                  <div className="space-y-1.5">
                    <Label htmlFor="student_name">Nome Completo</Label>
                    <Input
                      id="student_name"
                      type="text"
                      placeholder="João Silva"
                      value={formData.student_name}
                      onChange={(e) =>
                        handleChange("student_name", e.target.value)
                      }
                      className={`h-11 ${errors.student_name ? "border-red-500" : ""}`}
                      disabled={registerMutation.isPending}
                    />
                    {errors.student_name && (
                      <p className="text-xs text-red-500 mt-1 min-h-[1rem]">
                        {errors.student_name}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="student_phone">Telefone</Label>
                    <Input
                      id="student_phone"
                      type="tel"
                      placeholder="99 9999-9999"
                      value={formData.student_phone}
                      onChange={(e) =>
                        handleChange("student_phone", e.target.value)
                      }
                      className={`h-11 ${errors.student_phone ? "border-red-500" : ""}`}
                      disabled={registerMutation.isPending}
                    />
                    {errors.student_phone && (
                      <p className="text-xs text-red-500 mt-1 min-h-[1rem]">
                        {errors.student_phone}
                      </p>
                    )}
                  </div>
                </>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  className={`h-11 ${errors.password ? "border-red-500" : ""}`}
                  disabled={registerMutation.isPending}
                />
                {errors.password && (
                  <p className="text-xs text-red-500 mt-1 min-h-[1rem]">{errors.password}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleChange("confirmPassword", e.target.value)
                  }
                  className={`h-11 ${errors.confirmPassword ? "border-red-500" : ""}`}
                  disabled={registerMutation.isPending}
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1 min-h-[1rem]">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-blue-600 hover:bg-blue-700"
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending
                  ? "Criando conta..."
                  : "Criar Conta"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Ou</span>
              </div>
            </div>

            <p className="text-center text-sm text-gray-600">
              Já tem uma conta?{" "}
              <Link
                to="/login"
                className="font-semibold text-blue-600 hover:text-blue-800 hover:underline"
              >
                Entrar
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
