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
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import type {
  Resource,
  ResourceCreate,
  ResourceUpdate,
  ClassGroup,
  ResourceType,
} from "@/types";

interface ResourceFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resource?: Resource | null;
  classGroups: ClassGroup[];
  onSubmit: (data: ResourceCreate | ResourceUpdate) => void;
  isLoading?: boolean;
}

export function ResourceForm({
  open,
  onOpenChange,
  resource,
  classGroups,
  onSubmit,
  isLoading,
}: ResourceFormProps) {
  const [formData, setFormData] = useState<ResourceCreate>({
    classId: 0,
    resourceType: "PDF",
    previousAccess: false,
    draft: false,
    name: "",
    description: "",
  });

  useEffect(() => {
    if (resource) {
      setFormData({
        classId: resource.classId,
        resourceType: resource.resourceType,
        previousAccess: resource.previousAccess,
        draft: resource.draft,
        name: resource.name,
        description: resource.description,
      });
    } else {
      setFormData({
        classId: 0,
        resourceType: "PDF",
        previousAccess: false,
        draft: false,
        name: "",
        description: "",
      });
    }
  }, [resource, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {resource ? "Edit Resource" : "New Resource"}
          </DialogTitle>
          <DialogDescription>
            {resource
              ? "Update the resource information"
              : "Fill in the details to create a new resource"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="classId">Class </Label>
              <Select
                value={formData.classId.toString()}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    classId: Number.parseInt(value),
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
                      {classGroup.name} ({classGroup.trainingName})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Resource Name </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="E.g.: Lesson 1 - Introduction"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
                placeholder="Resource description..."
                required
                className="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="resourceType">Resource Type </Label>
              <Select
                value={formData.resourceType}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    resourceType: value as ResourceType,
                  })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VIDEO">Video</SelectItem>
                  <SelectItem value="PDF">PDF</SelectItem>
                  <SelectItem value="ZIP">ZIP (Files)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label
                htmlFor="previousAccess"
                className="flex flex-col items-start space-y-1"
              >
                <span>Prior Access</span>
                <span className="font-normal text-sm text-muted-foreground">
                  Allow access before class starts
                </span>
              </Label>
              <Switch
                id="previousAccess"
                checked={formData.previousAccess}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, previousAccess: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label
                htmlFor="draft"
                className="flex flex-col space-y-1 items-start"
              >
                <span>Draft</span>
                <span className="font-normal text-sm text-muted-foreground">
                  Keep as draft
                </span>
              </Label>
              <Switch
                id="draft"
                checked={formData.draft}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, draft: checked })
                }
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
              {resource ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
