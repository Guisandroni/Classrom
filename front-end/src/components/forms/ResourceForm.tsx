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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import type {
  Resource,
  ResourceCreate,
  ResourceUpdate,
  ClassGroup,
  ResourceType,
} from "@/types";

interface ResourceFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resource?: Resource | null;
  classGroups: ClassGroup[];
  onSubmit: (data: ResourceCreate | ResourceUpdate) => void;
  isLoading?: boolean;
}

export function ResourceForm({
  open,
  onOpenChange,
  resource,
  classGroups,
  onSubmit,
  isLoading,
}: ResourceFormProps) {
  const [formData, setFormData] = useState<ResourceCreate>({
    class_group: 0,
    resource_type: "pdf",
    prior_access: false,
    draft: false,
    resource_name: "",
    resource_description: "",
  });

  useEffect(() => {
    if (resource) {
      setFormData({
        class_group: resource.class_group,
        resource_type: resource.resource_type,
        prior_access: resource.prior_access,
        draft: resource.draft,
        resource_name: resource.resource_name,
        resource_description: resource.resource_description,
      });
    } else {
      setFormData({
        class_group: 0,
        resource_type: "pdf",
        prior_access: false,
        draft: false,
        resource_name: "",
        resource_description: "",
      });
    }
  }, [resource, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {resource ? "Editar Recurso" : "Novo Recurso"}
          </DialogTitle>
          <DialogDescription>
            {resource
              ? "Atualize as informações do recurso"
              : "Preencha os dados para criar um novo recurso"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="class_group">Turma </Label>
              <Select
                value={formData.class_group.toString()}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    class_group: Number.parseInt(value),
                  })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma turma" />
                </SelectTrigger>
                <SelectContent>
                  {classGroups.map((classGroup) => (
                    <SelectItem
                      key={classGroup.id}
                      value={classGroup.id.toString()}
                    >
                      {classGroup.name} ({classGroup.training_name})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="resource_name">Nome do Recurso </Label>
              <Input
                id="resource_name"
                value={formData.resource_name}
                onChange={(e) =>
                  setFormData({ ...formData, resource_name: e.target.value })
                }
                placeholder="Ex: Aula 1 - Introdução"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="resource_description">Descrição</Label>
              <textarea
                id="resource_description"
                value={formData.resource_description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    resource_description: e.target.value,
                  })
                }
                placeholder="Descrição do recurso..."
                required
                className="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="resource_type">Tipo de Recurso </Label>
              <Select
                value={formData.resource_type}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    resource_type: value as ResourceType,
                  })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">Vídeo</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="zip">ZIP (Arquivos)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label
                htmlFor="prior_access"
                className="flex flex-col items-start space-y-1"
              >
                <span>Acesso Prévio</span>
                <span className="font-normal text-sm text-muted-foreground">
                  Permitir acesso antes do início da turma
                </span>
              </Label>
              <Switch
                id="prior_access"
                checked={formData.prior_access}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, prior_access: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label
                htmlFor="draft"
                className="flex flex-col space-y-1 items-start"
              >
                <span>Rascunho</span>
                <span className="font-normal text-sm text-muted-foreground">
                  Manter como rascunho
                </span>
              </Label>
              <Switch
                id="draft"
                checked={formData.draft}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, draft: checked })
                }
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
              {resource ? "Atualizar" : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
