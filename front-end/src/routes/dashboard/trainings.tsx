import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import {
  useTrainings,
  useCreateTraining,
  useUpdateTraining,
  useDeleteTraining,
  useClassGroups,
} from "@/api/hooks";
import { TrainingForm, DeleteConfirmDialog } from "@/components/forms";
import type { Training } from "@/types";

export const Route = createFileRoute("/dashboard/trainings")({
  component: TrainingsPage,
});

function TrainingsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(null);

  const { data: trainings, isLoading } = useTrainings();
  const { data: classGroups } = useClassGroups();

  const createMutation = useCreateTraining();
  const updateMutation = useUpdateTraining();
  const deleteMutation = useDeleteTraining();

  const handleCreate = () => {
    setSelectedTraining(null);
    setFormOpen(true);
  };

  const handleEdit = (training: Training) => {
    setSelectedTraining(training);
    setFormOpen(true);
  };

  const handleDelete = (training: Training) => {
    setSelectedTraining(training);
    setDeleteOpen(true);
  };

  const handleFormSubmit = (data: any) => {
    if (selectedTraining) {
      updateMutation.mutate(
        { id: selectedTraining.id, data },
        {
          onSuccess: () => {
            setFormOpen(false);
            setSelectedTraining(null);
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
    if (selectedTraining) {
      deleteMutation.mutate(selectedTraining.id, {
        onSuccess: () => {
          setDeleteOpen(false);
          setSelectedTraining(null);
        },
      });
    }
  };

  const getClassCount = (trainingId: number) => {
    return classGroups?.filter((cg) => cg.trainingId === trainingId).length || 0;
  };

  const filteredTrainings =
    trainings?.filter((training) =>
      training.name.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600 dark:text-gray-400">Loading trainings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Trainings</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {trainings?.length || 0} trainings registered
            </p>
          </div>
          <Button
            onClick={handleCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm flex items-center gap-2 transition-colors"
          >
            <span className="material-icons-round text-lg">add</span>
            New Training
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
            search
          </span>
          <Input
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder-gray-400 dark:placeholder-gray-500 transition-shadow shadow-sm"
            placeholder="Search trainings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Training Cards */}
      <div className="flex flex-col gap-4">
        {filteredTrainings.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <span className="material-icons-round text-5xl text-gray-400 mb-4">school</span>
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery ? "No training found" : "No trainings registered yet"}
            </p>
          </div>
        ) : (
          filteredTrainings.map((training) => {
            const classCount = getClassCount(training.id);
            const isActive = classCount > 0;

            return (
              <div
                key={training.id}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Card Header */}
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs font-mono rounded text-gray-500 dark:text-gray-400">
                      #{training.id}
                    </span>
                    <h3 className="font-semibold text-base text-gray-900 dark:text-white line-clamp-1">
                      {training.name}
                    </h3>
                  </div>
                  <div className="flex gap-1 -mr-2">
                    <button
                      className="p-2 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      onClick={() => handleEdit(training)}
                      title="Edit training"
                    >
                      <span className="material-icons-round text-lg">edit</span>
                    </button>
                    <button
                      className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                      onClick={() => handleDelete(training)}
                      title="Delete training"
                    >
                      <span className="material-icons-round text-lg">delete_outline</span>
                    </button>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed mb-3">
                  {training.description || "No description provided"}
                </p>

                {/* Card Footer */}
                <div className="flex items-center justify-between mt-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                  <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <span className="material-icons-round text-sm">school</span>
                    {classCount} {classCount === 1 ? "Class" : "Classes"}
                  </span>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      isActive
                        ? "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20"
                        : "text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700"
                    }`}
                  >
                    {isActive ? "Active" : "Draft"}
                  </span>
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
      <TrainingForm
        open={formOpen}
        onOpenChange={setFormOpen}
        training={selectedTraining}
        onSubmit={handleFormSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Training"
        description="Are you sure you want to delete this training? This action cannot be undone and all related classes may be affected."
        itemName={selectedTraining?.name}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
