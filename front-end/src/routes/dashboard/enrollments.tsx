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
  Plus,
  Trash2,
  Edit,
  Loader2,
  Search,
  UserCheck,
  Users,
  GraduationCap,
} from "lucide-react";
import {
  useEnrollments,
  useClassGroups,
  useStudents,
  useCreateEnrollment,
  useUpdateEnrollment,
  useDeleteEnrollment,
} from "@/api/hooks";
import { EnrollmentForm, DeleteConfirmDialog } from "@/components/forms";
import type { Enrollment } from "@/types";

export const Route = createFileRoute("/dashboard/enrollments")({
  component: EnrollmentsPage,
});

function EnrollmentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] =
    useState<Enrollment | null>(null);

  const { data: enrollments, isLoading: enrollmentsLoading } = useEnrollments();
  const { data: classGroups, isLoading: classGroupsLoading } = useClassGroups();
  const { data: students, isLoading: studentsLoading } = useStudents();

  const createMutation = useCreateEnrollment();
  const updateMutation = useUpdateEnrollment();
  const deleteMutation = useDeleteEnrollment();

  const isLoading = enrollmentsLoading || classGroupsLoading || studentsLoading;

  const handleCreate = () => {
    setSelectedEnrollment(null);
    setFormOpen(true);
  };

  const handleEdit = (enrollment: Enrollment) => {
    setSelectedEnrollment(enrollment);
    setFormOpen(true);
  };

  const handleDelete = (enrollment: Enrollment) => {
    setSelectedEnrollment(enrollment);
    setDeleteOpen(true);
  };

  const handleFormSubmit = (data: any) => {
    if (selectedEnrollment) {
      updateMutation.mutate(
        { id: selectedEnrollment.id, data },
        {
          onSuccess: () => {
            setFormOpen(false);
            setSelectedEnrollment(null);
          },
        },
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          setFormOpen(false);
        },
      });
    }
  };

  const handleDeleteConfirm = () => {
    if (selectedEnrollment) {
      deleteMutation.mutate(selectedEnrollment.id, {
        onSuccess: () => {
          setDeleteOpen(false);
          setSelectedEnrollment(null);
        },
      });
    }
  };

  const filteredEnrollments =
    enrollments?.filter(
      (enrollment) =>
        enrollment.student_name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        enrollment.class_group_name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()),
    ) || [];

  const totalEnrollments = enrollments?.length || 0;
  const uniqueStudents = new Set(enrollments?.map((e) => e.student)).size;
  const uniqueClasses = new Set(enrollments?.map((e) => e.class_group)).size;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2">Carregando matrículas...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Matrículas</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Gerencie as matrículas de alunos nas turmas
          </p>
        </div>
        <Button
          onClick={handleCreate}
          className="!bg-blue-600 !text-white hover:!bg-blue-700 shadow-md hover:shadow-lg transition-all duration-200 font-semibold px-4 sm:px-6 py-2.5 rounded-lg w-full sm:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nova Matrícula
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Lista de Matrículas</CardTitle>
              <CardDescription>
                {enrollments?.length || 0} matrículas cadastradas
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar matrícula..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredEnrollments.length === 0 ? (
            <div className="text-center py-12">
              <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchQuery
                  ? "Nenhuma matrícula encontrada"
                  : "Nenhuma matrícula cadastrada ainda"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0">
              <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Aluno</TableHead>
                  <TableHead>Turma</TableHead>
                  <TableHead>IDs</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEnrollments.map((enrollment) => (
                  <TableRow key={enrollment.id}>
                    <TableCell>
                      <Badge variant="outline">#{enrollment.id}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-blue-600" />
                        <div>
                          <div className="font-medium">
                            {enrollment.student_name}
                          </div>
                          <div className="text-xs text-gray-500">
                            Student ID: {enrollment.student}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-green-600" />
                        <div>
                          <div className="font-medium">
                            {enrollment.class_group_name}
                          </div>
                          <div className="text-xs text-gray-500">
                            ClassGroup ID: {enrollment.class_group}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs">
                          Student: {enrollment.student}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Class: {enrollment.class_group}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEdit(enrollment)}
                          title="Editar matrícula"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete(enrollment)}
                          title="Excluir matrícula"
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

      <EnrollmentForm
        open={formOpen}
        onOpenChange={setFormOpen}
        classGroups={classGroups || []}
        students={students || []}
        onSubmit={handleFormSubmit}
        initialData={selectedEnrollment}
        mode={selectedEnrollment ? "edit" : "create"}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Excluir Matrícula"
        description="Tem certeza que deseja excluir esta matrícula? O aluno perder irá acesso aos recursos desta turma."
        itemName={
          selectedEnrollment
            ? `${selectedEnrollment.student_name} - ${selectedEnrollment.class_group_name}`
            : undefined
        }
        onConfirm={handleDeleteConfirm}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
