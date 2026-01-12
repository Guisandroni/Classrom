import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import type { Student } from "@/types";

interface StudentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
  initialData?: Student | null;
  mode?: "create" | "edit";
}

export function StudentForm({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
  initialData,
  mode = "create",
}: StudentFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    phone: "",
  });

  useEffect(() => {
    if (open) {
      if (mode === "edit" && initialData) {
        setFormData({
          name: initialData.name,
          email: initialData.email,
          username: initialData.username,
          phone: initialData.phone || "",
        });
      } else {
        setFormData({
          name: "",
          email: "",
          username: "",
          phone: "",
        });
      }
    }
  }, [open, mode, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Editar Aluno" : "Novo Aluno"}
          </DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Atualize as informações do aluno"
              : "Adicione um novo aluno a plataforma"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Nome completo"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="username">Username </Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                placeholder="Nome de usuário"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="email@exemplo.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="!bg-blue-600 !text-white hover:!bg-blue-700 shadow-md hover:shadow-lg transition-all duration-200 font-semibold"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === "edit" ? "Atualizar" : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
