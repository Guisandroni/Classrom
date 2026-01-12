import { createFileRoute } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  Clock,
  GraduationCap,
  Loader2,
  BookOpen,
  Users,
  CheckCircle2,
} from "lucide-react";
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
        <span className="ml-2">Carregando informações de matrícula...</span>
      </div>
    );
  }

  if (!enrollments || enrollments.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Minhas Matrículas
          </h1>
          <p className="text-gray-600 mt-1">
            Você ainda não está matriculado em nenhum curso
          </p>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              Entre em contato com o administrador para se matricular
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const extractTrainingName = (classGroupName: string): string => {
    if (!classGroupName) return "Treinamento";
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
      resources?.filter((r) => r.class_group === enrollment.class_group) || [];

    const totalResources = courseResources.length;
    const completedResources = courseResources.filter((r) => !r.draft).length;
    const progress =
      totalResources > 0
        ? Math.round((completedResources / totalResources) * 100)
        : 0;

    const trainingName = extractTrainingName(enrollment.class_group_name);

    let status: "active" | "completed" | "suspended" | "unknown" = "unknown";

    status = "active";

    return {
      id: enrollment.id,
      enrollment,
      trainingName,
      courseName: enrollment.class_group_name,
      status,
      progress,
      completedLessons: completedResources,
      totalLessons: totalResources,
      resources: courseResources,
    };
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Ativa
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Concluída
          </Badge>
        );
      case "suspended":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
            <Clock className="h-3 w-3 mr-1" />
            Não Iniciada
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">
            {status}
          </Badge>
        );
    }
  };

  const totalEnrollments = enrollmentDetails.length;
  const totalLessons = enrollmentDetails.reduce(
    (acc, e) => acc + e.totalLessons,
    0,
  );
  const completedLessons = enrollmentDetails.reduce(
    (acc, e) => acc + e.completedLessons,
    0,
  );
  const overallProgress =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Minhas Matrículas</h1>
        <p className="text-gray-600 mt-1">
          Você está matriculado em {totalEnrollments}{" "}
          {totalEnrollments === 1 ? "Turma" : "Turmas"}
        </p>
      </div>

      <div>
        <div className="grid gap-4">
          {enrollmentDetails.map((details) => (
            <Card
              key={details.id}
              className="border-l-4 border-l-blue-600 hover:shadow-md transition-shadow"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl">
                          {details.trainingName}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {details.courseName}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        {details.totalLessons} recursos
                      </span>
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="h-4 w-4" />
                        {details.completedLessons} concluídos
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        Matrícula #{details.id}
                      </span>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    {getStatusBadge(details.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {details.resources.length > 0 && (
                    <div className="pt-4 border-t">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-gray-900">
                          Recursos do Curso
                        </p>
                        <Badge variant="outline">
                          {details.resources.length} recursos
                        </Badge>
                      </div>
                      <div className="grid gap-2 md:grid-cols-2">
                        {details.resources.slice(0, 4).map((resource) => (
                          <div
                            key={resource.id}
                            className="flex items-center gap-2 text-sm text-gray-600 p-2 bg-gray-50 rounded"
                          >
                            <BookOpen className="h-4 w-4 text-blue-600" />
                            <span className="truncate">
                              {resource.resource_name}
                            </span>
                            {resource.draft && (
                              <Badge
                                variant="outline"
                                className="ml-auto text-xs"
                              >
                                Rascunho
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
