import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Users,
  Calendar,
  Loader2,
  GraduationCap,
  Clock,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";
import {
  useClassGroups,
  useTrainings,
  useEnrollments,
  useCreateClassGroup,
  useUpdateClassGroup,
  useDeleteClassGroup,
} from "@/api/hooks";
import type { ClassGroup } from "@/types";
import { ClassGroupForm, DeleteConfirmDialog } from "@/components/forms";

export const Route = createFileRoute("/dashboard/class")({
  component: ClassGroupsPage,
});

function ClassGroupsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedClassGroup, setSelectedClassGroup] =
    useState<ClassGroup | null>(null);

  const { data: classGroups, isLoading: classGroupsLoading } = useClassGroups();
  const { data: trainings, isLoading: trainingsLoading } = useTrainings();
  const { data: enrollments, isLoading: enrollmentsLoading } = useEnrollments();

  const createMutation = useCreateClassGroup();
  const updateMutation = useUpdateClassGroup();
  const deleteMutation = useDeleteClassGroup();

  const isLoading =
    classGroupsLoading || trainingsLoading || enrollmentsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2">Carregando turmas...</span>
      </div>
    );
  }

  const enrichedClassGroups =
    classGroups?.map((classGroup) => {
      const enrollmentCount =
        enrollments?.filter((e) => e.class_group === classGroup.id).length || 0;

      const now = new Date();
      const startDate = new Date(classGroup.start_date);
      const endDate = new Date(classGroup.end_date);

      let status: "upcoming" | "active" | "completed" = "upcoming";
      if (now >= startDate && now <= endDate) {
        status = "active";
      } else if (now > endDate) {
        status = "completed";
      }

      return {
        ...classGroup,
        enrollmentCount,
        status,
      };
    }) || [];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getStatusBadge = (status: "upcoming" | "active" | "completed") => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            <Clock className="h-3 w-3 mr-1" />
            Em Andamento
          </Badge>
        );
      case "upcoming":
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
            <Calendar className="h-3 w-3 mr-1" />
            Próxima
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">
            Concluída
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const filteredClassGroups = enrichedClassGroups.filter((classGroup) => {
    const matchesSearch =
      classGroup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      classGroup.training_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    return matchesSearch;
  });


  const handleCreate = () => {
    console.log("handleCreate called");
    setSelectedClassGroup(null);
    setFormOpen(true);
    console.log("formOpen set to true");
  };

  const handleEdit = (classGroup: ClassGroup) => {
    setSelectedClassGroup(classGroup);
    setFormOpen(true);
  };

  const handleDelete = (classGroup: ClassGroup) => {
    setSelectedClassGroup(classGroup);
    setDeleteOpen(true);
  };

  const handleFormSubmit = (data: any) => {
    if (selectedClassGroup) {
      updateMutation.mutate(
        { id: selectedClassGroup.id, data },
        {
          onSuccess: () => {
            setFormOpen(false);
            setSelectedClassGroup(null);
          },
          onError: (error) => {
            console.error("Erro ao atualizar turma:", error);
          },
        },
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          setFormOpen(false);
          setSelectedClassGroup(null);
        },
        onError: (error) => {
          console.error("Erro ao criar turma:", error);
        },
      });
    }
  };

  const handleDeleteConfirm = () => {
    if (selectedClassGroup) {
      deleteMutation.mutate(selectedClassGroup.id, {
        onSuccess: () => {
          setDeleteOpen(false);
          setSelectedClassGroup(null);
        },
      });
    }
  };

  if (enrichedClassGroups.length === 0) {
    return (
      <div className="space-y-4 md:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Turmas</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Nenhuma turma disponível no momento
            </p>
          </div>
          <Button
            onClick={handleCreate}
            className="!bg-blue-600 !text-white hover:!bg-blue-700 shadow-md hover:shadow-lg transition-all duration-200 font-semibold px-4 sm:px-6 py-2.5 rounded-lg w-full sm:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nova Turma
          </Button>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              As turmas aparecerão aqui quando forem criadas
            </p>
          </CardContent>
        </Card>
        <ClassGroupForm
          open={formOpen}
          onOpenChange={setFormOpen}
          classGroup={selectedClassGroup}
          trainings={trainings || []}
          onSubmit={handleFormSubmit}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />

        <DeleteConfirmDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          title="Excluir Turma"
          description="Tem certeza que deseja excluir esta turma? Esta ação não pode ser desfeita e todos os dados relacionados serão perdidos."
          itemName={selectedClassGroup?.name}
          onConfirm={handleDeleteConfirm}
          isLoading={deleteMutation.isPending}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Turmas</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Gerencie todas as turmas e seus treinamentos
          </p>
        </div>
        <Button
          onClick={handleCreate}
          className="!bg-blue-600 !text-white hover:!bg-blue-700 shadow-md hover:shadow-lg transition-all duration-200 font-semibold px-4 sm:px-6 py-2.5 rounded-lg w-full sm:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nova Turma
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Lista de Turmas</CardTitle>
              <CardDescription>
                {enrichedClassGroups.length} turmas cadastradas
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar turmas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredClassGroups.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {searchQuery
                  ? "Nenhuma turma encontrada com esses filtros"
                  : "Nenhuma turma cadastrada ainda"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0">
              <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nome da Turma</TableHead>
                  <TableHead>Treinamento</TableHead>
                  <TableHead>Periodo</TableHead>
                  <TableHead>Alunos</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClassGroups.map((classGroup) => (
                  <TableRow key={classGroup.id}>
                    <TableCell>
                      <Badge variant="outline">#{classGroup.id}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{classGroup.name}</div>
                        <div className="text-xs text-gray-500">
                          ID Turma: {classGroup.id}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-blue-600" />
                        <div>
                          <div className="font-medium text-sm">
                            {classGroup.training_name}
                          </div>
                          <div className="text-xs text-gray-500">
                            Training #{classGroup.training}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">
                          <Calendar className="h-3 w-3 inline mr-1" />
                          {formatDate(classGroup.start_date)}
                        </div>
                        <div className="text-sm text-gray-500">
                          até {formatDate(classGroup.end_date)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">
                          {classGroup.enrollmentCount}
                        </span>
                        <span className="text-xs text-gray-500">
                          matriculado
                          {classGroup.enrollmentCount !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(classGroup.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEdit(classGroup)}
                          title="Editar turma"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete(classGroup)}
                          title="Excluir turma"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <ClassGroupForm
        open={formOpen}
        onOpenChange={setFormOpen}
        classGroup={selectedClassGroup}
        trainings={trainings || []}
        onSubmit={handleFormSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Excluir Turma"
        description="Tem certeza que deseja excluir esta turma? Esta ação não pode ser desfeita e todos os dados relacionados serão perdidos."
        itemName={selectedClassGroup?.name}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteMutation.isPending}
      />
     
    </div>
  );
}
