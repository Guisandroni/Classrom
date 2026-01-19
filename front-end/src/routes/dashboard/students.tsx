import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import {
  useStudents,
  useCreateStudent,
  useUpdateStudent,
  useDeleteStudent,
} from "@/api/hooks";
import { authApi } from "@/api";
import { StudentForm, DeleteConfirmDialog } from "@/components/forms";
import type { Student } from "@/types";

export const Route = createFileRoute("/dashboard/students")({
  component: StudentsPage,
});

function StudentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

  const createMutation = useCreateStudent();
  const updateMutation = useUpdateStudent();
  const deleteMutation = useDeleteStudent();

  const { data: students, isLoading, error } = useStudents();
  const isAdmin = authApi.isAdmin();

  const handleCreate = () => {
    setSelectedStudent(null);
    setFormOpen(true);
  };

  const handleEdit = (student: Student) => {
    setSelectedStudent(student);
    setFormOpen(true);
  };

  const handleDelete = (student: Student) => {
    setSelectedStudent(student);
    setDeleteOpen(true);
  };

  const handleFormSubmit = (data: any) => {
    if (selectedStudent) {
      updateMutation.mutate(
        { id: selectedStudent.id, data },
        {
          onSuccess: () => {
            setFormOpen(false);
            setSelectedStudent(null);
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
    if (selectedStudent) {
      deleteMutation.mutate(selectedStudent.id, {
        onSuccess: () => {
          setDeleteOpen(false);
          setSelectedStudent(null);
        },
      });
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const filteredStudents =
    students?.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    }) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600 dark:text-gray-400">Loading students...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700">
          <span className="material-icons-round text-5xl text-red-500 mb-4">error</span>
          <p className="text-red-600 text-lg font-medium mb-2">Error loading students</p>
          <p className="text-gray-500 dark:text-gray-400">
            {(error as any)?.response?.data?.detail || "Please try again later"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isAdmin ? "Manage Students" : "Students"}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {students?.length || 0} students registered
            </p>
          </div>
          {isAdmin && (
            <Button
              onClick={handleCreate}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm flex items-center gap-2 transition-colors"
            >
              <span className="material-icons-round text-lg">add</span>
              New Student
            </Button>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
            search
          </span>
          <Input
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder-gray-400 dark:placeholder-gray-500 transition-shadow shadow-sm"
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Student Cards */}
      <div className="flex flex-col gap-4">
        {filteredStudents.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <span className="material-icons-round text-5xl text-gray-400 mb-4">people</span>
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery ? "No student found" : "No students registered yet"}
            </p>
          </div>
        ) : (
          filteredStudents.map((student) => (
            <div
              key={student.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <div className="flex gap-4">
                {/* Avatar */}
                <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-md">
                  {getInitials(student.name)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-xs font-mono rounded text-gray-500 dark:text-gray-400">
                        #{student.id}
                      </span>
                      {!isAdmin && (
                        <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-xs font-medium rounded text-blue-600 dark:text-blue-400">
                          You
                        </span>
                      )}
                    </div>
                    {isAdmin && (
                      <div className="flex gap-1 -mr-2">
                        <button
                          className="p-2 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          onClick={() => handleEdit(student)}
                          title="Edit student"
                        >
                          <span className="material-icons-round text-lg">edit</span>
                        </button>
                        <button
                          className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                          onClick={() => handleDelete(student)}
                          title="Delete student"
                        >
                          <span className="material-icons-round text-lg">delete_outline</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <h3 className="font-semibold text-base text-gray-900 dark:text-white truncate">
                    {student.name}
                  </h3>

                  {/* Contact Info */}
                  <div className="flex flex-col gap-1 mt-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="material-icons-round text-base">email</span>
                      <span className="truncate">{student.email}</span>
                    </div>
                    {student.phoneNumber && (
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="material-icons-round text-base">phone</span>
                        <span>{student.phoneNumber}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                <button className="flex-1 py-2 px-3 rounded-lg bg-gray-50 dark:bg-gray-700 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2">
                  <span className="material-icons-round text-lg">visibility</span>
                  View Details
                </button>
                <button className="py-2 px-3 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <span className="material-icons-round text-lg">email</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Floating Action Button for Mobile */}
      {isAdmin && (
        <div className="fixed bottom-20 right-4 z-40 lg:hidden">
          <Button
            onClick={handleCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl w-14 h-14 flex items-center justify-center shadow-lg hover:shadow-xl transition-all active:scale-95"
          >
            <span className="material-icons-round text-2xl">add</span>
          </Button>
        </div>
      )}

      {/* Forms */}
      <StudentForm
        open={formOpen}
        onOpenChange={setFormOpen}
        initialData={selectedStudent}
        mode={selectedStudent ? "edit" : "create"}
        onSubmit={handleFormSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Student"
        description="Are you sure you want to delete this student? This action cannot be undone."
        itemName={selectedStudent?.name}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
