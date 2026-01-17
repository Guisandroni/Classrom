# Classroom Management API

A Spring Boot REST API for classroom management with JWT authentication.

## Technologies

- Java 21
- Spring Boot 4.0.1
- Spring Security with JWT
- Spring Data JPA
- PostgreSQL
- Flyway Migration
- Lombok

## Features

- JWT Authentication (Register/Login)
- Training Management (CRUD)
- Class Management (CRUD)
- Student Management (CRUD)
- Resource Management (CRUD)
- Enrollment Management (CRUD)

## Requirements

- Java 21+
- Docker & Docker Compose
- Maven

## Getting Started

### 1. Start the database

```bash
docker-compose up -d
```

### 2. Run the application

```bash
./mvnw spring-boot:run
```

### 3. Access the API

Base URL: `http://localhost:8080`

## API Endpoints

### Authentication

| Method | Endpoint                   | Description |
|--------|----------------------------|-------------|
| POST | `/api/auth/user/register`  | Register a new user |
| POST | `/api/auth/user/login`     | Login and get JWT token |
| POST | `/api/auth/admin/register` | Register a new user |
| POST | `/api/auth/admin/login`    | Login and get JWT token |

### Training

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/trainings` | Get all trainings |
| GET | `/api/trainings/{id}` | Get training by ID |
| POST | `/api/trainings` | Create a new training |
| PUT | `/api/trainings/{id}` | Update a training |
| DELETE | `/api/trainings/{id}` | Delete a training |

### Class

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/classes` | Get all classes |
| GET | `/api/classes/{id}` | Get class by ID |
| GET | `/api/classes/training/{trainingId}` | Get classes by training |
| POST | `/api/classes` | Create a new class |
| PUT | `/api/classes/{id}` | Update a class |
| DELETE | `/api/classes/{id}` | Delete a class |

### Student

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/students` | Get all students |
| GET | `/api/students/{id}` | Get student by ID |
| POST | `/api/students` | Create a new student |
| PUT | `/api/students/{id}` | Update a student |
| DELETE | `/api/students/{id}` | Delete a student |

### Resource

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/resources` | Get all resources |
| GET | `/api/resources/{id}` | Get resource by ID |
| GET | `/api/resources/class/{classId}` | Get resources by class |
| POST | `/api/resources` | Create a new resource |
| PUT | `/api/resources/{id}` | Update a resource |
| DELETE | `/api/resources/{id}` | Delete a resource |

### Enrollment

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/enrollments` | Get all enrollments |
| GET | `/api/enrollments/{id}` | Get enrollment by ID |
| GET | `/api/enrollments/class/{classId}` | Get enrollments by class |
| GET | `/api/enrollments/student/{studentId}` | Get enrollments by student |
| POST | `/api/enrollments` | Create a new enrollment |
| DELETE | `/api/enrollments/{id}` | Delete an enrollment |

## Usage Examples

### Register

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@test.com","password":"123456"}'
```

### Login

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"123456"}'
```

### Authenticated Request

```bash
curl -X GET http://localhost:8080/api/trainings \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

## Project Structure

```
src/main/java/com/guisandroni/classroom/management/
├── Auth/
│   ├── Controller/
│   ├── DTO/
│   ├── Entity/
│   ├── Enum/
│   ├── Repository/
│   └── Service/
├── Class/
│   ├── Controller/
│   ├── DTO/
│   ├── Entity/
│   ├── Mapper/
│   ├── Repository/
│   └── Service/
├── Config/
├── Enrollment/
│   ├── Controller/
│   ├── DTO/
│   ├── Entity/
│   ├── Mapper/
│   ├── Repository/
│   └── Service/
├── Exception/
├── Resource/
│   ├── Controller/
│   ├── DTO/
│   ├── Entity/
│   ├── Enum/
│   ├── Mapper/
│   ├── Repository/
│   └── Service/
├── Student/
│   ├── Controller/
│   ├── DTO/
│   ├── Entity/
│   ├── Mapper/
│   ├── Repository/
│   └── Service/
└── Training/
    ├── Controller/
    ├── DTO/
    ├── Entity/
    ├── Mapper/
    ├── Repository/
    └── Service/
```
