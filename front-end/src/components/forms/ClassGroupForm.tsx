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
  console.log('teste')
  const [formData, setFormData] = useState<ClassGroupCreate>({
    training: 0,
    name: "",
    start_date: "",
    end_date: "",
    access_link: "",
  });
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (classGroup) {
      setFormData({
        training: classGroup.training,
        name: classGroup.name,
        start_date: classGroup.start_date,
        end_date: classGroup.end_date,
        access_link: classGroup.access_link,
      });
    } else {
      setFormData({
        training: 0,
        name: "",
        start_date: "",
        end_date: "",
        access_link: "",
      });
    }
    setError("");
  }, [classGroup, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("handleSubmit called");
    setError("");

    if (!formData.training || formData.training === 0) {
      console.log("Validation error: training is not selected");
      setError("Please select a training");
      return;
    }

    if (!formData.name.trim()) {
      setError("Please enter the class name");
      return;
    }

    if (!formData.start_date || !formData.end_date) {
      setError("Please fill in the start and end dates");
      return;
    }

    if (new Date(formData.start_date) >= new Date(formData.end_date)) {
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
                  formData.training && formData.training > 0
                    ? formData.training.toString()
                    : ""
                }
                onValueChange={(value) => {
                  console.log("onValueChange called with value:", value);
                  setFormData({
                    ...formData,
                    training: Number.parseInt(value),
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
                <Label htmlFor="start_date">Start Date </Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) =>
                    setFormData({ ...formData, start_date: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="end_date">End Date </Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) =>
                    setFormData({ ...formData, end_date: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="access_link">Access Link</Label>
              <Input
                id="access_link"
                type="url"
                value={formData.access_link}
                onChange={(e) =>
                  setFormData({ ...formData, access_link: e.target.value })
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
