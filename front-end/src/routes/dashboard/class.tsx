import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
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
  const [selectedClassGroup, setSelectedClassGroup] = useState<ClassGroup | null>(null);

  const { data: classGroups, isLoading: classGroupsLoading } = useClassGroups();
  const { data: trainings, isLoading: trainingsLoading } = useTrainings();
  const { data: enrollments, isLoading: enrollmentsLoading } = useEnrollments();

  const createMutation = useCreateClassGroup();
  const updateMutation = useUpdateClassGroup();
  const deleteMutation = useDeleteClassGroup();

  const isLoading = classGroupsLoading || trainingsLoading || enrollmentsLoading;

  const enrichedClassGroups =
    classGroups?.map((classGroup) => {
      const enrollmentCount =
        enrollments?.filter((e) => e.classId === classGroup.id).length || 0;

      const now = new Date();
      const startDate = new Date(classGroup.startDate);
      const endDate = new Date(classGroup.endDate);

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
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const filteredClassGroups = enrichedClassGroups.filter((classGroup) => {
    const matchesSearch =
      classGroup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (classGroup.trainingName || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleCreate = () => {
    setSelectedClassGroup(null);
    setFormOpen(true);
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
        },
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          setFormOpen(false);
          setSelectedClassGroup(null);
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600 dark:text-gray-400">Loading classes...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Classes</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {enrichedClassGroups.length} classes registered
            </p>
          </div>
          <Button
            onClick={handleCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm flex items-center gap-2 transition-colors"
          >
            <span className="material-icons-round text-lg">add</span>
            New Class
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
            search
          </span>
          <Input
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder-gray-400 dark:placeholder-gray-500 transition-shadow shadow-sm"
            placeholder="Search classes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Class Cards */}
      <div className="flex flex-col gap-4">
        {filteredClassGroups.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <span className="material-icons-round text-5xl text-gray-400 mb-4">class</span>
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery ? "No class found" : "No classes registered yet"}
            </p>
          </div>
        ) : (
          filteredClassGroups.map((classGroup) => {
            const getStatusStyles = () => {
              switch (classGroup.status) {
                case "active":
                  return {
                    bg: "bg-green-50 dark:bg-green-900/30",
                    text: "text-green-600 dark:text-green-400",
                    icon: "check_circle",
                    label: "Active",
                  };
                case "upcoming":
                  return {
                    bg: "bg-blue-50 dark:bg-blue-900/30",
                    text: "text-blue-600 dark:text-blue-400",
                    icon: "event",
                    label: "Upcoming",
                  };
                case "completed":
                  return {
                    bg: "bg-gray-100 dark:bg-gray-700",
                    text: "text-gray-500 dark:text-gray-400",
                    icon: "check",
                    label: "Completed",
                  };
              }
            };

            const statusStyles = getStatusStyles();

            return (
              <div
                key={classGroup.id}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700"
              >
                {/* Card Header */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-600">
                      #{classGroup.id}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles.bg} ${statusStyles.text}`}>
                      <span className="material-icons-round text-[14px]">{statusStyles.icon}</span>
                      {statusStyles.label}
                    </span>
                  </div>
                  <div className="flex gap-1 -mr-2">
                    <button
                      className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      onClick={() => handleEdit(classGroup)}
                      title="Edit class"
                    >
                      <span className="material-icons-round text-lg">edit</span>
                    </button>
                    <button
                      className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                      onClick={() => handleDelete(classGroup)}
                      title="Delete class"
                    >
                      <span className="material-icons-round text-lg">delete</span>
                    </button>
                  </div>
                </div>

                {/* Class Name */}
                <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">
                  {classGroup.name}
                </h3>

                {/* Training Info */}
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-1.5">
                  <span className="material-icons-round text-base">school</span>
                  {classGroup.trainingName} (Training #{classGroup.trainingId})
                </p>

                {/* Card Footer */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-400 dark:text-gray-500 font-medium uppercase">
                      Period
                    </span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-0.5">
                      {formatDate(classGroup.startDate)}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-400 dark:text-gray-500 font-medium uppercase">
                      Students
                    </span>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="material-icons-round text-base text-gray-400">group</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {classGroup.enrollmentCount} enrolled
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
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
        title="Delete Class"
        description="Are you sure you want to delete this class? This action cannot be undone and all related data will be lost."
        itemName={selectedClassGroup?.name}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
