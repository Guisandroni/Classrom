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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import type { Training, TrainingCreate, TrainingUpdate } from "@/types";

interface TrainingFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  training?: Training | null;
  onSubmit: (data: TrainingCreate | TrainingUpdate) => void;
  isLoading?: boolean;
}

export function TrainingForm({
  open,
  onOpenChange,
  training,
  onSubmit,
  isLoading,
}: TrainingFormProps) {
  const [formData, setFormData] = useState<TrainingCreate>({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (training) {
      setFormData({
        name: training.name,
        description: training.description,
      });
    } else {
      setFormData({
        name: "",
        description: "",
      });
    }
  }, [training, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {training ? "Editar Treinamento" : "Novo Treinamento"}
          </DialogTitle>
          <DialogDescription>
            {training
              ? "Atualize as informações do treinamento"
              : "Preencha os dados para criar um novo treinamento"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome do Treinamento </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Ex: Python para Iniciantes"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Descrição </Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Descrição completa do treinamento..."
                required
                className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
              {training ? "Atualizar" : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
