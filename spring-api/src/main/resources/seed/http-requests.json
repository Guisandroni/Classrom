{
  "_info": {
    "description": "JSON payloads para testar endpoints HTTP da API Classroom Management",
    "baseUrl": "http://localhost:8080/api",
    "note": "Use estes payloads com Postman, Insomnia, ou curl"
  },

  "auth": {
    "admin": {
      "register": {
        "endpoint": "POST /api/auth/admin/register",
        "payload": {
          "name": "Novo Admin",
          "email": "novo.admin@classroom.com",
          "phoneNumber": "11999998888",
          "password": "senhaSegura123"
        }
      },
      "login": {
        "endpoint": "POST /api/auth/admin/login",
        "payload": {
          "email": "admin@classroom.com",
          "password": "password123"
        }
      }
    },
    "student": {
      "register": {
        "endpoint": "POST /api/auth/student/register",
        "description": "Cria User + Student automaticamente",
        "payload": {
          "name": "Novo Estudante",
          "email": "novo.estudante@email.com",
          "phoneNumber": "11977776666",
          "password": "senhaSegura123"
        }
      },
      "login": {
        "endpoint": "POST /api/auth/student/login",
        "payload": {
          "email": "joao.silva@email.com",
          "password": "password123"
        }
      }
    }
  },

  "trainings": {
    "create": {
      "endpoint": "POST /api/trainings",
      "requiresAuth": true,
      "requiresRole": "ADMIN",
      "payloads": [
        {
          "name": "Python para Data Science",
          "description": "Curso completo de Python focado em análise de dados, pandas, numpy e visualização"
        },
        {
          "name": "Machine Learning Fundamentals",
          "description": "Introdução ao aprendizado de máquina com scikit-learn e TensorFlow"
        },
        {
          "name": "AWS Cloud Practitioner",
          "description": "Preparatório para certificação AWS Cloud Practitioner"
        }
      ]
    },
    "update": {
      "endpoint": "PUT /api/trainings/{id}",
      "requiresAuth": true,
      "requiresRole": "ADMIN",
      "payload": {
        "name": "Desenvolvimento Web Full Stack 2026",
        "description": "Curso atualizado de desenvolvimento web com as tecnologias mais recentes de 2026"
      }
    },
    "findAll": {
      "endpoint": "GET /api/trainings",
      "requiresAuth": true
    },
    "findById": {
      "endpoint": "GET /api/trainings/{id}",
      "requiresAuth": true
    },
    "findMy": {
      "endpoint": "GET /api/trainings/my",
      "requiresAuth": true,
      "description": "Retorna trainings do usuário autenticado (via enrollments)"
    },
    "delete": {
      "endpoint": "DELETE /api/trainings/{id}",
      "requiresAuth": true,
      "requiresRole": "ADMIN"
    }
  },

  "classes": {
    "create": {
      "endpoint": "POST /api/classes",
      "requiresAuth": true,
      "payloads": [
        {
          "trainingId": 1,
          "name": "React Hooks Avançado",
          "startDate": "2026-04-01T09:00:00",
          "endDate": "2026-04-01T12:00:00",
          "accessLink": "https://meet.classroom.com/react-hooks-adv"
        },
        {
          "trainingId": 2,
          "name": "Spring WebFlux",
          "startDate": "2026-04-05T14:00:00",
          "endDate": "2026-04-05T18:00:00",
          "accessLink": "https://meet.classroom.com/spring-webflux"
        },
        {
          "trainingId": 3,
          "name": "Next.js e SSR",
          "startDate": "2026-04-10T10:00:00",
          "endDate": "2026-04-10T13:00:00",
          "accessLink": "https://meet.classroom.com/nextjs-ssr"
        }
      ]
    },
    "update": {
      "endpoint": "PUT /api/classes/{id}",
      "requiresAuth": true,
      "payload": {
        "trainingId": 1,
        "name": "Introdução ao HTML e CSS - Atualizado",
        "startDate": "2026-02-01T10:00:00",
        "endDate": "2026-02-01T13:00:00",
        "accessLink": "https://meet.classroom.com/web-intro-html-v2"
      }
    },
    "findAll": {
      "endpoint": "GET /api/classes",
      "requiresAuth": true
    },
    "findById": {
      "endpoint": "GET /api/classes/{id}",
      "requiresAuth": true
    },
    "findByTraining": {
      "endpoint": "GET /api/classes/training/{trainingId}",
      "requiresAuth": true
    },
    "delete": {
      "endpoint": "DELETE /api/classes/{id}",
      "requiresAuth": true
    }
  },

  "resources": {
    "create": {
      "endpoint": "POST /api/resources",
      "requiresAuth": true,
      "payloads": [
        {
          "classId": 1,
          "resourceType": "PDF",
          "previousAccess": true,
          "draft": false,
          "name": "Guia Completo CSS Grid",
          "description": "Material detalhado sobre CSS Grid Layout com exemplos práticos"
        },
        {
          "classId": 1,
          "resourceType": "VIDEO",
          "previousAccess": false,
          "draft": false,
          "name": "Vídeo: Flexbox na Prática",
          "description": "Tutorial em vídeo demonstrando uso de Flexbox"
        },
        {
          "classId": 5,
          "resourceType": "ZIP",
          "previousAccess": true,
          "draft": false,
          "name": "Projeto Spring Boot Completo",
          "description": "Código fonte do projeto desenvolvido em aula"
        },
        {
          "classId": 9,
          "resourceType": "PDF",
          "previousAccess": false,
          "draft": true,
          "name": "React Performance (Rascunho)",
          "description": "Material em preparação sobre otimização de performance em React"
        }
      ]
    },
    "update": {
      "endpoint": "PUT /api/resources/{id}",
      "requiresAuth": true,
      "payload": {
        "classId": 1,
        "resourceType": "PDF",
        "previousAccess": true,
        "draft": false,
        "name": "Apostila HTML Básico - Edição Revisada",
        "description": "Material introdutório atualizado sobre tags HTML e estrutura de documentos"
      }
    },
    "findAll": {
      "endpoint": "GET /api/resources",
      "requiresAuth": true
    },
    "findById": {
      "endpoint": "GET /api/resources/{id}",
      "requiresAuth": true
    },
    "findByClass": {
      "endpoint": "GET /api/resources/class/{classId}",
      "requiresAuth": true
    },
    "delete": {
      "endpoint": "DELETE /api/resources/{id}",
      "requiresAuth": true
    }
  },

  "students": {
    "create": {
      "endpoint": "POST /api/students",
      "requiresAuth": true,
      "note": "Normalmente estudantes são criados via /api/auth/student/register",
      "payloads": [
        {
          "name": "Lucas Ferreira",
          "email": "lucas.ferreira@email.com",
          "phoneNumber": "11977775555"
        },
        {
          "name": "Beatriz Souza",
          "email": "beatriz.souza@email.com",
          "phoneNumber": "11977774444"
        }
      ]
    },
    "update": {
      "endpoint": "PUT /api/students/{id}",
      "requiresAuth": true,
      "payload": {
        "name": "João Silva Santos",
        "email": "joao.silva@email.com",
        "phoneNumber": "11988881001"
      }
    },
    "findAll": {
      "endpoint": "GET /api/students",
      "requiresAuth": true
    },
    "findById": {
      "endpoint": "GET /api/students/{id}",
      "requiresAuth": true
    },
    "findMe": {
      "endpoint": "GET /api/students/me",
      "requiresAuth": true,
      "description": "Retorna dados do estudante autenticado"
    },
    "delete": {
      "endpoint": "DELETE /api/students/{id}",
      "requiresAuth": true
    }
  },

  "enrollments": {
    "create": {
      "endpoint": "POST /api/enrollments",
      "requiresAuth": true,
      "payloads": [
        {
          "classId": 7,
          "studentId": 1
        },
        {
          "classId": 8,
          "studentId": 1
        },
        {
          "classId": 1,
          "studentId": 2
        },
        {
          "classId": 15,
          "studentId": 4
        }
      ]
    },
    "findAll": {
      "endpoint": "GET /api/enrollments",
      "requiresAuth": true
    },
    "findById": {
      "endpoint": "GET /api/enrollments/{id}",
      "requiresAuth": true
    },
    "findByClass": {
      "endpoint": "GET /api/enrollments/class/{classId}",
      "requiresAuth": true
    },
    "findByStudent": {
      "endpoint": "GET /api/enrollments/student/{studentId}",
      "requiresAuth": true
    },
    "findMy": {
      "endpoint": "GET /api/enrollments/my",
      "requiresAuth": true,
      "description": "Retorna enrollments do usuário autenticado"
    },
    "delete": {
      "endpoint": "DELETE /api/enrollments/{id}",
      "requiresAuth": true
    }
  },

  "curlExamples": {
    "login": "curl -X POST http://localhost:8080/api/auth/student/login -H 'Content-Type: application/json' -d '{\"email\":\"joao.silva@email.com\",\"password\":\"password123\"}'",
    "getWithToken": "curl -X GET http://localhost:8080/api/trainings -H 'Authorization: Bearer YOUR_TOKEN_HERE'",
    "createTraining": "curl -X POST http://localhost:8080/api/trainings -H 'Content-Type: application/json' -H 'Authorization: Bearer YOUR_TOKEN_HERE' -d '{\"name\":\"Novo Curso\",\"description\":\"Descrição do curso\"}'",
    "createEnrollment": "curl -X POST http://localhost:8080/api/enrollments -H 'Content-Type: application/json' -H 'Authorization: Bearer YOUR_TOKEN_HERE' -d '{\"classId\":1,\"studentId\":1}'"
  }
}
