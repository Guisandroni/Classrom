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
import { Plus, Edit, Trash2, Loader2, Search, BookOpen } from "lucide-react";
import {
  useTrainings,
  useCreateTraining,
  useUpdateTraining,
  useDeleteTraining,
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
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(
    null,
  );

  const { data: trainings, isLoading } = useTrainings();

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

  const filteredTrainings =
    trainings?.filter((training) =>
      training.name.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2">Loading trainings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Trainings</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Manage all available trainings
          </p>
        </div>
        <Button
          onClick={handleCreate}
          className="!bg-blue-600 !text-white hover:!bg-blue-700 shadow-md hover:shadow-lg transition-all duration-200 font-semibold px-4 sm:px-6 py-2.5 rounded-lg w-full sm:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Training
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Training List</CardTitle>
              <CardDescription>
                {trainings?.length || 0} trainings registered
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search trainings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredTrainings.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchQuery
                  ? "No training found"
                  : "No trainings registered yet"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0">
              <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTrainings.map((training) => (
                  <TableRow key={training.id}>
                    <TableCell>
                      <Badge variant="outline">#{training.id}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{training.name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-500 max-w-md truncate">
                        {training.description}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEdit(training)}
                          title="Edit training"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete(training)}
                          title="Delete training"
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
