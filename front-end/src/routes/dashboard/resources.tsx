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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Edit,
  Trash2,
  Loader2,
  Search,
  Video,
  FileText,
  File,
} from "lucide-react";
import {
  useResources,
  useClassGroups,
  useCreateResource,
  useUpdateResource,
  useDeleteResource,
} from "@/api/hooks";
import { ResourceForm, DeleteConfirmDialog } from "@/components/forms";
import { VideoPlayerSheet } from "@/components/VideoPlayerSheet";
import type { Resource } from "@/types";

export const Route = createFileRoute("/dashboard/resources")({
  component: ResourcesPage,
});

function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(
    null,
  );
  const [selectedVideoResource, setSelectedVideoResource] =
    useState<Resource | null>(null);

  const { data: resources, isLoading: resourcesLoading } = useResources();
  const { data: classGroups, isLoading: classGroupsLoading } = useClassGroups();

  const createMutation = useCreateResource();
  const updateMutation = useUpdateResource();
  const deleteMutation = useDeleteResource();

  const isLoading = resourcesLoading || classGroupsLoading;

  const handleCreate = () => {
    setSelectedResource(null);
    setFormOpen(true);
  };

  const handleEdit = (resource: Resource) => {
    setSelectedResource(resource);
    setFormOpen(true);
  };

  const handleDelete = (resource: Resource) => {
    setSelectedResource(resource);
    setDeleteOpen(true);
  };

  const handleVideoClick = (resource: Resource) => {
    if (resource.resourceType === "VIDEO") {
      setSelectedVideoResource(resource);
      setVideoOpen(true);
    }
  };

  const handleFormSubmit = (data: any) => {
    if (selectedResource) {
      updateMutation.mutate(
        { id: selectedResource.id, data },
        {
          onSuccess: () => {
            setFormOpen(false);
            setSelectedResource(null);
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
    if (selectedResource) {
      deleteMutation.mutate(selectedResource.id, {
        onSuccess: () => {
          setDeleteOpen(false);
          setSelectedResource(null);
        },
      });
    }
  };

  const filteredResources =
    resources?.filter((resource) => {
      const matchesSearch = resource.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesType =
        filterType === "all" || resource.resourceType === filterType;
      return matchesSearch && matchesType;
    }) || [];

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "VIDEO":
        return (
          <Badge className="bg-blue-100 text-blue-700">
            <Video className="h-3 w-3 mr-1" />
            Video
          </Badge>
        );
      case "PDF":
        return (
          <Badge className="bg-purple-100 text-purple-700">
            <FileText className="h-3 w-3 mr-1" />
            PDF
          </Badge>
        );
      case "ZIP":
        return (
          <Badge className="bg-orange-100 text-orange-700">
            <File className="h-3 w-3 mr-1" />
            ZIP
          </Badge>
        );
      default:
        return <Badge>{type}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2">Loading resources...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Resources</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Manage all resources and materials for classes
          </p>
        </div>
        <Button
          onClick={handleCreate}
          className="!bg-blue-600 !text-white hover:!bg-blue-700 shadow-md hover:shadow-lg transition-all duration-200 font-semibold px-4 sm:px-6 py-2.5 rounded-lg w-full sm:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Resource
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Resource List</CardTitle>
              <CardDescription>
                {resources?.length || 0} resources registered
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="VIDEO">Video</SelectItem>
                  <SelectItem value="PDF">PDF</SelectItem>
                  <SelectItem value="ZIP">ZIP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredResources.length === 0 ? (
            <div className="text-center py-12">
              <File className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchQuery || filterType !== "all"
                  ? "No resource found"
                  : "No resources registered yet"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0">
              <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResources.map((resource) => (
                  <TableRow
                    key={resource.id}
                    className={
                      resource.resourceType === "VIDEO"
                        ? "cursor-pointer hover:bg-gray-50"
                        : ""
                    }
                    onClick={() =>
                      resource.resourceType === "VIDEO" &&
                      handleVideoClick(resource)
                    }
                  >
                    <TableCell>
                      <Badge variant="outline">#{resource.id}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium flex items-center gap-2">
                          {resource.name}
                          {resource.resourceType === "VIDEO" && (
                            <Badge variant="outline" className="text-xs">
                              Click to watch
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 max-w-md truncate">
                          {resource.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{resource.className}</div>
                    </TableCell>
                    <TableCell>
                      {getTypeBadge(resource.resourceType)}
                    </TableCell>
                    <TableCell>
                      {resource.draft ? (
                        <Badge className="bg-gray-100 text-gray-700">
                          Draft
                        </Badge>
                      ) : (
                        <Badge className="bg-green-100 text-green-700">
                          Published
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(resource);
                          }}
                          title="Edit resource"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(resource);
                          }}
                          title="Delete resource"
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

      <ResourceForm
        open={formOpen}
        onOpenChange={setFormOpen}
        resource={selectedResource}
        classGroups={classGroups || []}
        onSubmit={handleFormSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Resource"
        description="Are you sure you want to delete this resource? This action cannot be undone."
        itemName={selectedResource?.name}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteMutation.isPending}
      />

      <VideoPlayerSheet
        open={videoOpen} onOpenChange={setVideoOpen}
        resource={selectedVideoResource}
      />
    </div>
  );
}
