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
  EnrollmentCreate,
  Enrollment,
  ClassGroup,
  Student,
} from "@/types";

interface EnrollmentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classGroups: ClassGroup[];
  students: Student[];
  onSubmit: (data: EnrollmentCreate) => void;
  isLoading?: boolean;
  initialData?: Enrollment | null;
  mode?: "create" | "edit";
}

export function EnrollmentForm({
  open,
  onOpenChange,
  classGroups,
  students,
  onSubmit,
  isLoading,
  initialData,
  mode = "create",
}: EnrollmentFormProps) {
  const [formData, setFormData] = useState<EnrollmentCreate>({
    class_group: 0,
    student: 0,
  });

  useEffect(() => {
    if (open) {
      if (mode === "edit" && initialData) {
        setFormData({
          class_group: initialData.class_group,
          student: initialData.student,
        });
      } else {
        setFormData({
          class_group: 0,
          student: 0,
        });
      }
    }
  }, [open, mode, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.student > 0 && formData.class_group > 0) {
      onSubmit(formData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Edit Enrollment" : "New Enrollment"}
          </DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Update the student enrollment"
              : "Enroll a student in a class"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="student">Student </Label>
              <Select
                value={
                  formData.student > 0 ? formData.student.toString() : undefined
                }
                onValueChange={(value) =>
                  setFormData({ ...formData, student: Number.parseInt(value) })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a student" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id.toString()}>
                      {student.name} ({student.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="class_group">Class </Label>
              <Select
                value={
                  formData.class_group > 0
                    ? formData.class_group.toString()
                    : undefined
                }
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    class_group: Number.parseInt(value),
                  })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent>
                  {classGroups.map((classGroup) => (
                    <SelectItem
                      key={classGroup.id}
                      value={classGroup.id.toString()}
                    >
                      {classGroup.name} - {classGroup.training_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              {mode === "edit" ? "Update" : "Enroll"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
