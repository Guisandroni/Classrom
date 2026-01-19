import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "VIDEO":
        return "play_circle";
      case "PDF":
        return "picture_as_pdf";
      case "ZIP":
        return "folder_zip";
      default:
        return "insert_drive_file";
    }
  };

  const getTypeStyles = (type: string) => {
    switch (type) {
      case "VIDEO":
        return {
          bg: "bg-purple-100 dark:bg-purple-900/30",
          text: "text-purple-600 dark:text-purple-400",
          iconBg: "bg-purple-600",
        };
      case "PDF":
        return {
          bg: "bg-red-100 dark:bg-red-900/30",
          text: "text-red-600 dark:text-red-400",
          iconBg: "bg-red-600",
        };
      case "ZIP":
        return {
          bg: "bg-orange-100 dark:bg-orange-900/30",
          text: "text-orange-600 dark:text-orange-400",
          iconBg: "bg-orange-600",
        };
      default:
        return {
          bg: "bg-gray-100 dark:bg-gray-700",
          text: "text-gray-600 dark:text-gray-400",
          iconBg: "bg-gray-600",
        };
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600 dark:text-gray-400">Loading resources...</span>
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
              Manage Resources
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {resources?.length || 0} resources registered
            </p>
          </div>
          <Button
            onClick={handleCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm flex items-center gap-2 transition-colors"
          >
            <span className="material-icons-round text-lg">add</span>
            New Resource
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
              search
            </span>
            <Input
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder-gray-400 dark:placeholder-gray-500 transition-shadow shadow-sm"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-[150px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="VIDEO">Video</SelectItem>
              <SelectItem value="PDF">PDF</SelectItem>
              <SelectItem value="ZIP">ZIP</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Resource Cards */}
      <div className="flex flex-col gap-4">
        {filteredResources.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <span className="material-icons-round text-5xl text-gray-400 mb-4">
              folder_open
            </span>
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery || filterType !== "all"
                ? "No resource found"
                : "No resources registered yet"}
            </p>
          </div>
        ) : (
          filteredResources.map((resource) => {
            const typeStyles = getTypeStyles(resource.resourceType);
            const isVideo = resource.resourceType === "VIDEO";

            return (
              <div
                key={resource.id}
                onClick={() => isVideo && handleVideoClick(resource)}
                className={`bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow ${isVideo ? "cursor-pointer" : ""}`}
              >
                <div className="flex gap-4">
                  {/* Resource Icon */}
                  <div
                    className={`h-12 w-12 rounded-xl ${typeStyles.iconBg} flex items-center justify-center text-white shrink-0 shadow-md`}
                  >
                    <span className="material-icons-round text-xl">
                      {getTypeIcon(resource.resourceType)}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-xs font-mono rounded text-gray-500 dark:text-gray-400">
                          #{resource.id}
                        </span>
                        <span
                          className={`px-2 py-0.5 ${typeStyles.bg} ${typeStyles.text} text-xs font-medium rounded flex items-center gap-1`}
                        >
                          <span className="material-icons-round text-xs">
                            {getTypeIcon(resource.resourceType)}
                          </span>
                          {resource.resourceType}
                        </span>
                        {resource.draft ? (
                          <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-xs font-medium rounded text-gray-500 dark:text-gray-400">
                            Draft
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-green-50 dark:bg-green-900/20 text-xs font-medium rounded text-green-600 dark:text-green-400">
                            Published
                          </span>
                        )}
                      </div>
                      <div className="flex gap-1 -mr-2">
                        <button
                          className="p-2 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(resource);
                          }}
                          title="Edit resource"
                        >
                          <span className="material-icons-round text-lg">edit</span>
                        </button>
                        <button
                          className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(resource);
                          }}
                          title="Delete resource"
                        >
                          <span className="material-icons-round text-lg">delete_outline</span>
                        </button>
                      </div>
                    </div>

                    <h3 className="font-semibold text-base text-gray-900 dark:text-white truncate">
                      {resource.name}
                    </h3>

                    {resource.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                        {resource.description}
                      </p>
                    )}

                    {/* Class Info */}
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                      <span className="material-icons-round text-base text-gray-400">
                        class
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {resource.className}
                      </span>
                      {isVideo && (
                        <span className="ml-auto text-xs font-medium text-purple-600 dark:text-purple-400 flex items-center gap-1">
                          <span className="material-icons-round text-sm">play_arrow</span>
                          Click to watch
                        </span>
                      )}
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
        open={videoOpen}
        onOpenChange={setVideoOpen}
        resource={selectedVideoResource}
      />
    </div>
  );
}
