import { createFileRoute } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Users,
  GraduationCap,
  Loader2,
  Database,
  CheckCircle2,
} from "lucide-react";
import {
  useTrainings,
  useStudents,
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
  const { data: allTrainings, isLoading: trainingsLoading } = useTrainings();
  const { data: students, isLoading: studentsLoading } = useStudents();
  const { data: allResources, isLoading: resourcesLoading } = useResources();
  const { data: enrollments, isLoading: enrollmentsLoading } = useEnrollments();
  const { data: classGroups, isLoading: classGroupsLoading } = useClassGroups();

  const isAdmin = authApi.isAdmin();
  const isLoading =
    trainingsLoading ||
    studentsLoading ||
    resourcesLoading ||
    enrollmentsLoading ||
    classGroupsLoading;

  let trainings = allTrainings;
  let resources = allResources;

  if (!isAdmin && enrollments && classGroups && allTrainings) {
    const enrolledClassGroupIds = enrollments.map((e) => e.class_group);

    const enrolledTrainingsIds = new Set(
      classGroups
        .filter((cg) => enrolledClassGroupIds.includes(cg.id))
        .map((cg) => cg.training),
    );

    trainings = allTrainings.filter((t) => enrolledTrainingsIds.has(t.id));

    let resources = classGroups || [];
  }

  const resourcesByType = isAdmin
    ? {
        pdf: resources?.filter((r) => r.resource_type === "pdf").length || 0,
        video:
          resources?.filter((r) => r.resource_type === "video").length || 0,
        zip: resources?.filter((r) => r.resource_type === "zip").length || 0,
        published: resources?.filter((r) => !r.draft).length || 0,
        drafts: resources?.filter((r) => r.draft).length || 0,
      }
    : {
        pdf: 0,
        video: 0,
        zip: 0,
        published: 0,
        drafts: 0,
      };

  const recentEnrollments = enrollments?.slice(-5).reverse() || [];

  let displayedClassGroups = classGroups;
  if (!isAdmin && enrollments && classGroups) {
    const enrolledClassGroupIds = enrollments.map((e) => e.class_group);
    displayedClassGroups = classGroups.filter((cg) =>
      enrolledClassGroupIds.includes(cg.id),
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Dashboard {isAdmin ? "Administrativo" : "do Estudante"}
        </h1>
        <p className="text-gray-600 mt-1">
          {meLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Carregando...
            </span>
          ) : me ? (
            <>
              Bem-vindo de volta, <strong>{me.name}</strong>! Aqui está o resumo
              de hoje.
            </>
          ) : (
            "Bem-vindo de volta! Aqui está o resumo de hoje."
          )}
        </p>
      </div>

      <div
        className={`grid gap-6 ${isAdmin ? "md:grid-cols-2" : "md:grid-cols-1"}`}
      >
        <Card>
          <CardHeader>
            <CardTitle>
              {isAdmin ? "Matrículas Recentes" : "Minhas Matrículas"}
            </CardTitle>
            <CardDescription>
              {enrollmentsLoading
                ? "Carregando..."
                : `${recentEnrollments.length} matrículas ${isAdmin ? "no sistema" : "ativas"}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {enrollmentsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              </div>
            ) : recentEnrollments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Nenhuma matrícula encontrada</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentEnrollments.map((enrollment) => (
                  <div
                    key={enrollment.id}
                    className="flex items-start justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="space-y-1">
                      <p className="font-medium text-sm">
                        {enrollment.student_name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {enrollment.class_group_name}
                      </p>
                    </div>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Ativo
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {isAdmin && (
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas de Recursos</CardTitle>
              <CardDescription>
                {resourcesLoading
                  ? "Carregando..."
                  : `${resources?.length || 0} recursos no total`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {resourcesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">Por Tipo</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 bg-red-50 rounded">
                          <span className="text-sm font-medium">PDFs</span>
                          <Badge className="bg-red-100 text-red-700">
                            {resourcesByType.pdf}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-purple-50 rounded">
                          <span className="text-sm font-medium">Vídeos</span>
                          <Badge className="bg-purple-100 text-purple-700">
                            {resourcesByType.video}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                          <span className="text-sm font-medium">ZIPs</span>
                          <Badge className="bg-blue-100 text-blue-700">
                            {resourcesByType.zip}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">Por Status</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                          <span className="text-sm font-medium">
                            Publicados
                          </span>
                          <Badge className="bg-green-100 text-green-700">
                            {resourcesByType.published}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm font-medium">Rascunhos</span>
                          <Badge className="bg-gray-100 text-gray-700">
                            {resourcesByType.drafts}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {!isAdmin && displayedClassGroups && displayedClassGroups.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Minhas Turmas</CardTitle>
            <CardDescription>
              {classGroupsLoading
                ? "Carregando..."
                : `${displayedClassGroups.length} turmas matriculadas`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {classGroupsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {displayedClassGroups.map((classGroup) => {
                  const training = trainings?.find(
                    (t) => t.id === classGroup.training,
                  );
                  return (
                    <div
                      key={classGroup.id}
                      className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-sm">
                          {classGroup.name}
                        </h4>
                        <Badge variant="outline">#{classGroup.id}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Treinamento:</strong> {training?.name || "N/A"}
                      </p>
                      <div className="text-xs text-gray-500 space-y-1">
                        <p>
                          Início:{" "}
                          {new Date(classGroup.start_date).toLocaleDateString(
                            "pt-BR",
                          )}
                        </p>
                        <p>
                          Término:{" "}
                          {new Date(classGroup.end_date).toLocaleDateString(
                            "pt-BR",
                          )}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
