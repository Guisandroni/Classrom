
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
