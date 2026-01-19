import { createFileRoute } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useEnrollments, useResources } from "@/api/hooks";

export const Route = createFileRoute("/dashboard/my-enrollment")({
  component: MyEnrollmentPage,
});

function MyEnrollmentPage() {
  const { data: enrollments, isLoading: enrollmentsLoading } = useEnrollments();
  const { data: resources, isLoading: resourcesLoading } = useResources();

  const isLoading = enrollmentsLoading || resourcesLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600 dark:text-gray-400">Loading enrollment information...</span>
      </div>
    );
  }

  if (!enrollments || enrollments.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            My Enrollments
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            You are not enrolled in any course yet
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-12 border border-gray-200 dark:border-gray-700 text-center">
          <span className="material-icons-round text-5xl text-gray-400 mb-4">school</span>
          <p className="text-gray-500 dark:text-gray-400">
            Contact the administrator to enroll in a course
          </p>
        </div>
      </div>
    );
  }

  const extractTrainingName = (classGroupName: string): string => {
    if (!classGroupName) return "Training";
    const dashPattern = classGroupName.split(/[-–—]/);
    if (dashPattern.length > 1) {
      return dashPattern[0].trim();
    }
    const spacePattern = classGroupName.match(
      /^(.+?)(?:\s+(?:Turma|Class|Grupo|T|Aula))/i,
    );
    if (spacePattern && spacePattern[1]) {
      return spacePattern[1].trim();
    }
    return classGroupName;
  };

  const enrollmentDetails = enrollments.map((enrollment) => {
    const courseResources =
      resources?.filter((r) => r.classId === enrollment.classId) || [];

    const totalResources = courseResources.length;
    const completedResources = courseResources.filter((r) => !r.draft).length;
    const progress =
      totalResources > 0
        ? Math.round((completedResources / totalResources) * 100)
        : 0;

    const trainingName = extractTrainingName(enrollment.className || "");

    return {
      id: enrollment.id,
      enrollment,
      trainingName,
      courseName: enrollment.className,
      status: "active" as const,
      progress,
      completedLessons: completedResources,
      totalLessons: totalResources,
      resources: courseResources,
    };
  });

  const totalEnrollments = enrollmentDetails.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Enrollments</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          You are enrolled in {totalEnrollments}{" "}
          {totalEnrollments === 1 ? "class" : "classes"}
        </p>
      </div>

      {/* Enrollment Cards */}
      <div className="space-y-4">
        {enrollmentDetails.map((details) => (
          <div
            key={details.id}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Card Header with gradient */}
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800">
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shrink-0 shadow-md">
                    <span className="material-icons-round text-xl">school</span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate">
                      {details.trainingName}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {details.courseName}
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-green-50 dark:bg-green-900/20 text-xs font-medium rounded-full text-green-600 dark:text-green-400 flex items-center gap-1 shrink-0">
                  <span className="material-icons-round text-sm">check_circle</span>
                  Active
                </span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 p-4 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                  <span className="material-icons-round text-blue-600 dark:text-blue-400 text-lg">folder</span>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Resources</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {details.totalLessons}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                  <span className="material-icons-round text-green-600 dark:text-green-400 text-lg">check_circle</span>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Completed</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {details.completedLessons}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                  <span className="material-icons-round text-purple-600 dark:text-purple-400 text-lg">tag</span>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Enrollment</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    #{details.id}
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            {details.totalLessons > 0 && (
              <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    Course Progress
                  </span>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                    {details.progress}%
                  </span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${details.progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Resources Preview */}
            {details.resources.length > 0 && (
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="material-icons-round text-base text-gray-400">folder_open</span>
                    Course Resources
                  </h4>
                  <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-xs font-medium rounded text-gray-500 dark:text-gray-400">
                    {details.resources.length} items
                  </span>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {details.resources.slice(0, 4).map((resource) => (
                    <div
                      key={resource.id}
                      className="flex items-center gap-2 p-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                    >
                      <span className="material-icons-round text-blue-600 dark:text-blue-400 text-lg">
                        {resource.resourceType === "VIDEO"
                          ? "play_circle"
                          : resource.resourceType === "PDF"
                            ? "picture_as_pdf"
                            : "insert_drive_file"}
                      </span>
                      <span className="text-sm text-gray-700 dark:text-gray-300 truncate flex-1">
                        {resource.name}
                      </span>
                      {resource.draft && (
                        <span className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-600 text-xs rounded text-gray-500 dark:text-gray-400">
                          Draft
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                {details.resources.length > 4 && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                    +{details.resources.length - 4} more resources
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
