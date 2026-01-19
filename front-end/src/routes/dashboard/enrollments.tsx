import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600 dark:text-gray-400">Loading enrollments...</span>
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
              Manage Enrollments
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {enrollments?.length || 0} enrollments registered
            </p>
          </div>
          <Button
            onClick={handleCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm flex items-center gap-2 transition-colors"
          >
            <span className="material-icons-round text-lg">add</span>
            New Enrollment
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
            search
          </span>
          <Input
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder-gray-400 dark:placeholder-gray-500 transition-shadow shadow-sm"
            placeholder="Search by student or class..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Enrollment Cards */}
      <div className="flex flex-col gap-4">
        {filteredEnrollments.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <span className="material-icons-round text-5xl text-gray-400 mb-4">
              how_to_reg
            </span>
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery
                ? "No enrollment found"
                : "No enrollments registered yet"}
            </p>
          </div>
        ) : (
          filteredEnrollments.map((enrollment) => (
            <div
              key={enrollment.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <div className="flex gap-4">
                {/* Student Avatar */}
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-md">
                  {getInitials(enrollment.studentName || "?")}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-xs font-mono rounded text-gray-500 dark:text-gray-400">
                        #{enrollment.id}
                      </span>
                      <span className="px-2 py-0.5 bg-green-50 dark:bg-green-900/20 text-xs font-medium rounded text-green-600 dark:text-green-400 flex items-center gap-1">
                        <span className="material-icons-round text-xs">check_circle</span>
                        Active
                      </span>
                    </div>
                    <button
                      className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors -mr-2"
                      onClick={() => handleDelete(enrollment)}
                      title="Remove enrollment"
                    >
                      <span className="material-icons-round text-lg">delete_outline</span>
                    </button>
                  </div>

                  {/* Student Info */}
                  <h3 className="font-semibold text-base text-gray-900 dark:text-white truncate">
                    {enrollment.studentName}
                  </h3>

                  {/* Class Info */}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="material-icons-round text-base text-green-600 dark:text-green-400">
                      class
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-300 truncate">
                      {enrollment.className}
                    </span>
                  </div>

                  {/* IDs Section */}
                  <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-1.5">
                      <span className="material-icons-round text-sm text-gray-400">person</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Student ID: <span className="font-medium">{enrollment.studentId}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="material-icons-round text-sm text-gray-400">class</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Class ID: <span className="font-medium">{enrollment.classId}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Floating Action Button for Mobile */}
      <div className="fixed bottom-20 right-4 z-40 lg:hidden">
        <Button
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl w-14 h-14 flex items-center justify-center shadow-lg hover:shadow-xl transition-all active:scale-95"
        >
          <span className="material-icons-round text-2xl">add</span>
        </Button>
      </div>

      {/* Forms */}
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
