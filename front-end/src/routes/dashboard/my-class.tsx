import { createFileRoute } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  Loader2,
  BookOpen,
  FileText,
  Video,
  File,
  Download,
  Eye,
} from "lucide-react";
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
          <h1 className="text-3xl font-bold text-gray-900">Minha Turma</h1>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-red-600 mb-2">
              Erro ao carregar informações da turma
            </p>
            <p className="text-sm text-gray-500">
              {classGroupsError?.message ||
                enrollmentsError?.message ||
                "Verifique sua conexão e tente novamente"}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2">Carregando informações da turma...</span>
      </div>
    );
  }

  if (!classGroups || classGroups.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Minha Turma</h1>
          <p className="text-gray-600 mt-1">
            Você ainda não está matriculado em nenhuma turma
          </p>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              Entre em contato com o administrador para se matricular
            </p>
          </CardContent>
        </Card>
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
        return <FileText className="h-4 w-4" />;
      case "VIDEO":
        return <Video className="h-4 w-4" />;
      case "ZIP":
        return <File className="h-4 w-4" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  const getResourceBadge = (type: string) => {
    const colors = {
      PDF: "bg-red-100 text-red-700",
      VIDEO: "bg-purple-100 text-purple-700",
      ZIP: "bg-blue-100 text-blue-700",
    };
    return (
      <Badge
        className={
          colors[type as keyof typeof colors] || "bg-gray-100 text-gray-700"
        }
      >
        {getResourceIcon(type)}
        <span className="ml-1">{type}</span>
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Minhas Turmas</h1>
        <p className="text-gray-600 mt-1">
          Você está matriculado em {classGroups.length}{" "}
          {classGroups.length === 1 ? "turma" : "turmas"}
        </p>
      </div>

      <div className="space-y-6">
        {classGroups.map((classGroup) => {
          const classInfo = getClassGroupInfo(classGroup);

          return (
            <Card key={classGroup.id} className="border-l-4 border-l-blue-600">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-2xl">
                      {classGroup.name}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      <div className="space-y-1">
                        <div>
                          <strong>Treinamento:</strong>{" "}
                          {classGroup.trainingName}
                        </div>
                        <div>ID da Turma: #{classGroup.id}</div>
                      </div>
                    </CardDescription>
                  </div>
                  <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                    <Users className="h-3 w-3 mr-1" />
                    {classInfo.totalStudents} alunos
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Alunos
                      </p>
                      <p className="text-sm text-gray-600">
                        {classInfo.totalStudents} matriculados
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <BookOpen className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Recursos
                      </p>
                      <p className="text-sm text-gray-600">
                        {classInfo.totalResources} disponíveis
                      </p>
                    </div>
                  </div>
                </div>

                {classInfo.resources.length > 0 ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Recursos desta Turma
                      </h3>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                      {classInfo.resources.map((resource) => (
                        <Card
                          key={resource.id}
                          className="hover:shadow-md transition-shadow cursor-pointer"
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                                {getResourceIcon(resource.resourceType)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                  <h5 className="font-medium text-sm truncate">
                                    {resource.name}
                                  </h5>
                                  {getResourceBadge(resource.resourceType)}
                                </div>
                                <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                                  {resource.description}
                                </p>
                                <div className="flex items-center gap-2 flex-wrap mb-2">
                                  {resource.previousAccess && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs bg-green-50 text-green-700"
                                    >
                                      Acesso Prévio
                                    </Badge>
                                  )}
                                  <Badge
                                    variant="outline"
                                    className={`text-xs ${
                                      resource.resourceType === "VIDEO"
                                        ? "bg-blue-50 text-blue-700"
                                        : resource.resourceType === "PDF"
                                          ? "bg-red-50 text-red-700"
                                          : "bg-green-50 text-green-700"
                                    }`}
                                  >
                                    {resource.resourceType === "VIDEO"
                                      ? "Clique para assistir"
                                      : resource.resourceType === "PDF"
                                        ? "Clique para visualizar"
                                        : "Clique para baixar"}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="flex-1"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleResourceClick(resource);
                                    }}
                                  >
                                    {resource.resourceType === "VIDEO" ? (
                                      <>
                                        <Eye className="h-3 w-3 mr-1" />
                                        Assistir
                                      </>
                                    ) : resource.resourceType === "PDF" ? (
                                      <>
                                        <FileText className="h-3 w-3 mr-1" />
                                        Abrir PDF
                                      </>
                                    ) : (
                                      <>
                                        <Download className="h-3 w-3 mr-1" />
                                        Baixar ZIP
                                      </>
                                    )}
                                  </Button>
                                  {(resource.resourceType === "PDF" ||
                                    resource.resourceType === "VIDEO") && (
                                    <Button size="sm" variant="outline">
                                      <Download className="h-3 w-3" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 border rounded-lg bg-gray-50">
                    <BookOpen className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">
                      Nenhum recurso publicado disponível nesta turma ainda
                    </p>
                    {!isAdmin && (
                      <p className="text-xs text-gray-400 mt-1">
                        Apenas recursos com acesso prévio e que não estão como
                        rascunho estão disponíveis
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
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
