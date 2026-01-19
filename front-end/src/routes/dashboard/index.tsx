import { createFileRoute, Link } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import {
  useTrainings,
  useResources,
  useEnrollments,
  useMe,
  useClassGroups,
} from "@/api/hooks";
import { authApi } from "@/api/auth";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardIndex,
});

function DashboardIndex() {
  const { data: me, isLoading: meLoading } = useMe(authApi.isAuthenticated());
  const { data: allTrainings } = useTrainings();
  const { data: allResources, isLoading: resourcesLoading } = useResources();
  const { data: enrollments, isLoading: enrollmentsLoading } = useEnrollments();
  const { data: classGroups, isLoading: classGroupsLoading } = useClassGroups();

  const isAdmin = authApi.isAdmin();

  let trainings = allTrainings;
  let resources = allResources;

  if (!isAdmin && enrollments && classGroups && allTrainings) {
    const enrolledClassGroupIds = enrollments.map((e) => e.classId);

    const enrolledTrainingsIds = new Set(
      classGroups
        .filter((cg) => enrolledClassGroupIds.includes(cg.id))
        .map((cg) => cg.trainingId),
    );

    trainings = allTrainings.filter((t) => enrolledTrainingsIds.has(t.id));
  }

  const recentEnrollments = enrollments?.slice(-5).reverse() || [];

  let displayedClassGroups = classGroups;
  if (!isAdmin && enrollments && classGroups) {
    const enrolledClassGroupIds = enrollments.map((e) => e.classId);
    displayedClassGroups = classGroups.filter((cg) =>
      enrolledClassGroupIds.includes(cg.id),
    );
  }

  const currentClass = displayedClassGroups?.[0];
  const currentTraining = trainings?.find(t => t.id === currentClass?.trainingId);

  if (isAdmin) {
    return <AdminDashboard
      me={me}
      meLoading={meLoading}
      trainings={allTrainings}
      resources={allResources}
      resourcesLoading={resourcesLoading}
      enrollments={enrollments}
      enrollmentsLoading={enrollmentsLoading}
      classGroups={classGroups}
      classGroupsLoading={classGroupsLoading}
    />;
  }

  return (
    <StudentDashboard
      me={me}
      meLoading={meLoading}
      enrollments={recentEnrollments}
      enrollmentsLoading={enrollmentsLoading}
      currentClass={currentClass}
      currentTraining={currentTraining}
      resources={resources}
      resourcesLoading={resourcesLoading}
    />
  );
}

// Admin Dashboard Component
function AdminDashboard({
  me,
  meLoading,
  trainings,
  resources,
  resourcesLoading,
  enrollments,
  enrollmentsLoading,
  classGroups,
  classGroupsLoading,
}: any) {
  const stats = {
    totalStudents: enrollments?.length || 0,
    activeClasses: classGroups?.filter((c: any) => {
      const now = new Date();
      const start = new Date(c.startDate);
      const end = new Date(c.endDate);
      return now >= start && now <= end;
    }).length || 0,
    totalTrainings: trainings?.length || 0,
    totalResources: resources?.length || 0,
  };

  const recentEnrollments = enrollments?.slice(-5).reverse() || [];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          {meLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading...
            </span>
          ) : me ? (
            <>Welcome back, <strong>{me.name}</strong>! Overview of your institution.</>
          ) : (
            "Overview of your institution's performance"
          )}
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Total Students */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between h-[130px]">
          <div className="flex items-start justify-between">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <span className="material-icons-round text-blue-600 dark:text-blue-400 text-xl">groups</span>
            </div>
            <span className="flex items-center text-xs font-medium text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
              <span className="material-icons-round text-sm mr-0.5">trending_up</span>
              Active
            </span>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Enrollments</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.totalStudents}</p>
          </div>
        </div>

        {/* Active Classes */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between h-[130px]">
          <div className="flex items-start justify-between">
            <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <span className="material-icons-round text-orange-600 dark:text-orange-400 text-xl">class</span>
            </div>
            <span className="flex items-center text-xs font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full">
              +{classGroups?.length || 0} Total
            </span>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Active Classes</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.activeClasses}</p>
          </div>
        </div>

        {/* Trainings Card */}
        <div className="col-span-2 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <span className="material-icons-round text-purple-600 dark:text-purple-400 text-xl">school</span>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Trainings</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.totalTrainings}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <span className="material-icons-round text-green-600 dark:text-green-400 text-xl">folder</span>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Resources</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.totalResources}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Activity</h3>
          <Link to="/dashboard/enrollments" className="text-sm font-medium text-blue-600 hover:text-blue-700">
            View All
          </Link>
        </div>
        <div className="flex flex-col gap-3">
          {enrollmentsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            </div>
          ) : recentEnrollments.length === 0 ? (
            <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
              <span className="material-icons-round text-4xl text-gray-400 mb-2">inbox</span>
              <p className="text-gray-500 dark:text-gray-400">No recent activity</p>
            </div>
          ) : (
            recentEnrollments.map((enrollment: any) => (
              <div
                key={enrollment.id}
                className="flex gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm"
              >
                <div className="shrink-0 h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                  <span className="material-icons-round text-blue-600 dark:text-blue-400 text-xl">person_add</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {enrollment.studentName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                    Enrolled in "{enrollment.className}"
                  </p>
                </div>
                <span className="px-2 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-medium rounded-full flex items-center gap-1">
                  <span className="material-icons-round text-sm">check_circle</span>
                  Active
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// Student Dashboard Component
function StudentDashboard({
  me,
  meLoading,
  enrollments,
  enrollmentsLoading,
  currentClass,
  currentTraining,
  resources,
  resourcesLoading,
}: any) {
  const progress = 65; // Mock progress

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-600/90 to-blue-500/80 z-10" />
          <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10" />
          <div className="absolute right-20 -bottom-10 w-32 h-32 rounded-full bg-white/5" />
        </div>
        <div className="relative z-20 p-6 flex flex-col gap-5">
          <div>
            <p className="text-blue-100 text-xs font-medium uppercase tracking-wider mb-1">
              {meLoading ? "Loading..." : `Welcome back, ${me?.name || "Student"}`}
            </p>
            <h2 className="text-2xl font-bold tracking-tight">
              {currentTraining?.name || "Keep Learning!"}
            </h2>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm font-semibold text-white">Course Progress</span>
              <span className="text-2xl font-bold text-white">{progress}%</span>
            </div>
            <div className="w-full bg-black/20 rounded-full h-2">
              <div
                className="bg-white h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <Link
            to="/dashboard/my-class"
            className="w-full bg-white text-blue-600 hover:bg-blue-50 font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-icons-round text-xl">play_circle</span>
            Continue Learning
          </Link>
        </div>
      </section>

      {/* Current Class Section */}
      {currentClass && (
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">My Current Class</h3>
            <Link to="/dashboard/my-class" className="text-sm font-medium text-blue-600 hover:text-blue-700">
              See Schedule
            </Link>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col gap-4">
            <div className="flex gap-4">
              <div className="bg-orange-100 dark:bg-orange-900/30 w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="material-icons-round text-orange-600 dark:text-orange-400 text-2xl">code</span>
              </div>
              <div className="flex flex-col justify-between flex-1 py-1">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 uppercase tracking-wide">
                      Active
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-gray-900 dark:text-white line-clamp-1">
                    {currentClass.name}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-1">
                    <span className="material-icons-round text-sm">schedule</span>
                    {new Date(currentClass.startDate).toLocaleDateString()} - {new Date(currentClass.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-3 pt-3 border-t border-gray-100 dark:border-gray-700">
              <Link
                to="/dashboard/my-class"
                className="flex-1 bg-blue-600 text-white h-10 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
              >
                <span className="material-icons-round text-lg">visibility</span>
                View Details
              </Link>
              <button className="h-10 w-10 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                <span className="material-icons-round text-lg">more_horiz</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Enrollments Section */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">My Enrollments</h3>
          <Link to="/dashboard/my-enrollment" className="text-sm font-medium text-blue-600 hover:text-blue-700">
            View All
          </Link>
        </div>
        <div className="space-y-3">
          {enrollmentsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            </div>
          ) : enrollments.length === 0 ? (
            <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
              <span className="material-icons-round text-4xl text-gray-400 mb-2">school</span>
              <p className="text-gray-500 dark:text-gray-400">No enrollments yet</p>
            </div>
          ) : (
            enrollments.slice(0, 3).map((enrollment: any) => (
              <div
                key={enrollment.id}
                className="flex items-center p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm"
              >
                <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 mr-3">
                  <span className="material-icons-round">school</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {enrollment.className}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Class #{enrollment.classId}
                  </p>
                </div>
                <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium rounded-full">
                  Active
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Quick Access Resources */}
      <section>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Access</h3>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          {resourcesLoading ? (
            <div className="flex items-center justify-center py-8 w-full">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            </div>
          ) : resources && resources.length > 0 ? (
            resources.slice(0, 4).map((resource: any) => (
              <div
                key={resource.id}
                className="min-w-[160px] bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm"
              >
                <div className={`h-10 w-10 rounded-full flex items-center justify-center mb-3 ${
                  resource.resourceType === 'PDF'
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-500'
                    : resource.resourceType === 'VIDEO'
                    ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-500'
                    : 'bg-orange-50 dark:bg-orange-900/20 text-orange-500'
                }`}>
                  <span className="material-icons-round">
                    {resource.resourceType === 'PDF' ? 'picture_as_pdf' :
                     resource.resourceType === 'VIDEO' ? 'play_circle' : 'folder_zip'}
                  </span>
                </div>
                <h5 className="font-medium text-sm text-gray-900 dark:text-white mb-1 line-clamp-1">
                  {resource.name}
                </h5>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  {resource.resourceType}
                </p>
                <button className="w-full py-1.5 rounded-lg bg-gray-50 dark:bg-gray-700 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600">
                  View
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-8 w-full bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
              <span className="material-icons-round text-4xl text-gray-400 mb-2">folder_open</span>
              <p className="text-gray-500 dark:text-gray-400">No resources available</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
