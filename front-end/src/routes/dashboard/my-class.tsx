import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useClassGroups, useEnrollments, useStudents } from "@/api/hooks";
import { authApi } from "@/api";
import { VideoPlayerSheet } from "@/components/VideoPlayerSheet";
import type { Resource } from "@/types";

export const Route = createFileRoute("/dashboard/my-class")({
  component: MyClassPage,
});

function MyClassPage() {
  const [videoResource, setVideoResource] = useState<Resource | null>(null);
  const [videoOpen, setVideoOpen] = useState(false);

  const {
    data: classGroups,
    isLoading: classGroupsLoading,
    error: classGroupsError,
  } = useClassGroups();
  const {
    data: enrollments,
    isLoading: enrollmentsLoading,
    error: enrollmentsError,
  } = useEnrollments();
  const {
    data: allStudents,
    isLoading: studentsLoading,
    error: studentsError,
  } = useStudents();

  const isLoading = classGroupsLoading || enrollmentsLoading || studentsLoading;
  const isAdmin = authApi.isAdmin();
  const hasError = classGroupsError || enrollmentsError || studentsError;

  if (!isLoading && hasError) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Classes</h2>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 text-center">
          <span className="material-icons-round text-5xl text-red-500 mb-4">error</span>
          <p className="text-red-600 dark:text-red-400 mb-2 font-medium">
            Error loading class information
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {classGroupsError?.message ||
              enrollmentsError?.message ||
              "Check your connection and try again"}
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600 dark:text-gray-400">Loading class information...</span>
      </div>
    );
  }

  if (!classGroups || classGroups.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Classes</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            You are not enrolled in any class yet
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-12 border border-gray-200 dark:border-gray-700 text-center">
          <span className="material-icons-round text-5xl text-gray-400 mb-4">school</span>
          <p className="text-gray-500 dark:text-gray-400">
            Contact the administrator to enroll in a class
          </p>
        </div>
      </div>
    );
  }

  const getClassGroupInfo = (classGroup: (typeof classGroups)[0]) => {
    const classEnrollments =
      enrollments?.filter((e) => e.classId === classGroup.id) || [];

    const classmates = classEnrollments.map((enrollment) => {
      const student = allStudents?.find((s) => s.id === enrollment.studentId);
      return {
        id: enrollment.studentId,
        name: enrollment.studentName || student?.name || "Unknown",
        email: student?.email || "email@example.com",
        avatar: "",
        enrollmentDate: classGroup.name,
        status: "active" as const,
      };
    });

    const classResources = (classGroup.resources || []).filter(
      (resource) => !resource.draft,
    );

    return {
      classGroup,
      totalStudents: classmates.length,
      totalResources: classResources.length,
      publishedResources: classResources.length,
      resources: classResources,
      classmates,
    };
  };

  const handleResourceClick = (resource: Resource) => {
    if (resource.resourceType === "VIDEO") {
      setVideoResource(resource);
      setVideoOpen(true);
    } else if (resource.resourceType === "PDF") {
      window.open(`/api/resources/${resource.id}/download`, "_blank");
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "PDF":
        return "picture_as_pdf";
      case "VIDEO":
        return "play_circle";
      case "ZIP":
        return "folder_zip";
      default:
        return "insert_drive_file";
    }
  };

  const getResourceStyles = (type: string) => {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Classes</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          You are enrolled in {classGroups.length}{" "}
          {classGroups.length === 1 ? "class" : "classes"}
        </p>
      </div>

      {/* Class Cards */}
      <div className="space-y-6">
        {classGroups.map((classGroup) => {
          const classInfo = getClassGroupInfo(classGroup);

          return (
            <div
              key={classGroup.id}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden"
            >
              {/* Class Header */}
              <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800">
                <div className="flex items-start justify-between">
                  <div className="flex gap-3">
                    <div className="h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-md">
                      <span className="material-icons-round text-xl">class</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                        {classGroup.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="material-icons-round text-sm text-gray-400">school</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {classGroup.trainingName}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-blue-100 dark:bg-blue-900/30 text-xs font-medium rounded-full text-blue-600 dark:text-blue-400 flex items-center gap-1">
                    <span className="material-icons-round text-sm">people</span>
                    {classInfo.totalStudents} students
                  </span>
                </div>
              </div>

              {/* Class Stats */}
              <div className="grid grid-cols-2 gap-4 p-4 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                    <span className="material-icons-round text-blue-600 dark:text-blue-400">people</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium">Students</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {classInfo.totalStudents} enrolled
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                    <span className="material-icons-round text-green-600 dark:text-green-400">folder</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium">Resources</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {classInfo.totalResources} available
                    </p>
                  </div>
                </div>
              </div>

              {/* Resources Section */}
              <div className="p-4">
                {classInfo.resources.length > 0 ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="material-icons-round text-lg text-gray-400">folder_open</span>
                        Class Resources
                      </h4>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {classInfo.resources.map((resource) => {
                        const styles = getResourceStyles(resource.resourceType);
                        return (
                          <div
                            key={resource.id}
                            className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => handleResourceClick(resource)}
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={`h-10 w-10 rounded-lg ${styles.iconBg} flex items-center justify-center text-white shrink-0`}
                              >
                                <span className="material-icons-round text-lg">
                                  {getResourceIcon(resource.resourceType)}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span
                                    className={`px-2 py-0.5 ${styles.bg} ${styles.text} text-xs font-medium rounded`}
                                  >
                                    {resource.resourceType}
                                  </span>
                                  {resource.previousAccess && (
                                    <span className="px-2 py-0.5 bg-green-50 dark:bg-green-900/20 text-xs font-medium rounded text-green-600 dark:text-green-400">
                                      Early Access
                                    </span>
                                  )}
                                </div>
                                <h5 className="font-medium text-sm text-gray-900 dark:text-white truncate">
                                  {resource.name}
                                </h5>
                                {resource.description && (
                                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">
                                    {resource.description}
                                  </p>
                                )}
                                <div className="flex items-center gap-2 mt-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 text-xs"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleResourceClick(resource);
                                    }}
                                  >
                                    {resource.resourceType === "VIDEO" ? (
                                      <>
                                        <span className="material-icons-round text-sm mr-1">play_arrow</span>
                                        Watch
                                      </>
                                    ) : resource.resourceType === "PDF" ? (
                                      <>
                                        <span className="material-icons-round text-sm mr-1">visibility</span>
                                        View
                                      </>
                                    ) : (
                                      <>
                                        <span className="material-icons-round text-sm mr-1">download</span>
                                        Download
                                      </>
                                    )}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                    <span className="material-icons-round text-4xl text-gray-400 mb-2">folder_off</span>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No published resources available yet
                    </p>
                    {!isAdmin && (
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        Only published resources with access are shown
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <VideoPlayerSheet
        open={videoOpen}
        onOpenChange={setVideoOpen}
        resource={videoResource}
      />
    </div>
  );
}
