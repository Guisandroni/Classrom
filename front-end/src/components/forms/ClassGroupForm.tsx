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
import { Loader2 } from "lucide-react";
import type {
  ClassGroup,
  ClassGroupCreate,
  ClassGroupUpdate,
  Training,
} from "@/types";

interface ClassGroupFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classGroup?: ClassGroup | null;
  trainings: Training[];
  onSubmit: (data: ClassGroupCreate | ClassGroupUpdate) => void;
  isLoading?: boolean;
}

export function ClassGroupForm({
  open,
  onOpenChange,
  classGroup,
  trainings,
  onSubmit,
  isLoading,
}: ClassGroupFormProps) {
  const [formData, setFormData] = useState<ClassGroupCreate>({
    trainingId: 0,
    name: "",
    startDate: "",
    endDate: "",
    accessLink: "",
  });
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (classGroup) {
      setFormData({
        trainingId: classGroup.trainingId,
        name: classGroup.name,
        startDate: classGroup.startDate,
        endDate: classGroup.endDate,
        accessLink: classGroup.accessLink,
      });
    } else {
      setFormData({
        trainingId: 0,
        name: "",
        startDate: "",
        endDate: "",
        accessLink: "",
      });
    }
    setError("");
  }, [classGroup, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.trainingId || formData.trainingId === 0) {
      setError("Please select a training");
      return;
    }

    if (!formData.name.trim()) {
      setError("Please enter the class name");
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      setError("Please fill in the start and end dates");
      return;
    }

    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      setError("The end date must be after the start date");
      return;
    }

    onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {classGroup ? "Edit Class" : "New Class"}
          </DialogTitle>
          <DialogDescription>
            {classGroup
              ? "Update the class information"
              : "Fill in the details to create a new class"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="training">Training </Label>
              <Select
                value={
                  formData.trainingId && formData.trainingId > 0
                    ? formData.trainingId.toString()
                    : ""
                }
                onValueChange={(value) => {
                  setFormData({
                    ...formData,
                    trainingId: Number.parseInt(value),
                  });
                }}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a training" />
                </SelectTrigger>
                <SelectContent>
                  {trainings.map((training) => (
                    <SelectItem
                      key={training.id}
                      value={training.id.toString()}
                    >
                      {training.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Class Name </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="E.g.: Python Class 2024-1"
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startDate">Start Date </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="endDate">End Date </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="accessLink">Access Link</Label>
              <Input
                id="accessLink"
                type="url"
                value={formData.accessLink}
                onChange={(e) =>
                  setFormData({ ...formData, accessLink: e.target.value })
                }
                placeholder="https://classroom.example.com/..."
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
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="!bg-blue-600 !text-white hover:!bg-blue-700 shadow-md hover:shadow-lg transition-all duration-200 font-semibold"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {classGroup ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
