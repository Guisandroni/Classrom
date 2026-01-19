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
  const deleteMutation = useDeleteEnrollment();

  const isLoading = enrollmentsLoading || classGroupsLoading || studentsLoading;

  const handleCreate = () => {
    setSelectedEnrollment(null);
    setFormOpen(true);
  };

  const handleDelete = (enrollment: Enrollment) => {
    setSelectedEnrollment(enrollment);
    setDeleteOpen(true);
  };

  const handleFormSubmit = (data: any) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        setFormOpen(false);
      },
    });
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
        (enrollment.studentName || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (enrollment.className || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()),
    ) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2">Loading enrollments...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Enrollments</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Manage student enrollments in classes
          </p>
        </div>
        <Button
          onClick={handleCreate}
          className="!bg-blue-600 !text-white hover:!bg-blue-700 shadow-md hover:shadow-lg transition-all duration-200 font-semibold px-4 sm:px-6 py-2.5 rounded-lg w-full sm:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Enrollment
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Enrollment List</CardTitle>
              <CardDescription>
                {enrollments?.length || 0} enrollments registered
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search enrollment..."
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
                  ? "No enrollment found"
                  : "No enrollments registered yet"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0">
              <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>IDs</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
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
                            {enrollment.studentName}
                          </div>
                          <div className="text-xs text-gray-500">
                            Student ID: {enrollment.studentId}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-green-600" />
                        <div>
                          <div className="font-medium">
                            {enrollment.className}
                          </div>
                          <div className="text-xs text-gray-500">
                            Class ID: {enrollment.classId}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs">
                          Student: {enrollment.studentId}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Class: {enrollment.classId}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete(enrollment)}
                          title="Delete enrollment"
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
        isLoading={createMutation.isPending}
      />

      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Enrollment"
        description="Are you sure you want to delete this enrollment? The student will lose access to this class resources."
        itemName={
          selectedEnrollment
            ? `${selectedEnrollment.studentName} - ${selectedEnrollment.className}`
            : undefined
        }
        onConfirm={handleDeleteConfirm}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
