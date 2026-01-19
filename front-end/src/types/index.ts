// ============================================
// TIPOS PARA API SPRING BOOT - Classroom Management
// ============================================

// --- Autenticação ---

export interface User {
	id: number;
	name: string;
	email: string;
	phoneNumber: string;
	role: "ADMIN" | "STUDENT";
}

export interface Tokens {
	accessToken: string;
	refreshToken: string;
}

export interface RegisterRequest {
	name: string;
	email: string;
	phoneNumber: string;
	password: string;
}

// Resposta real da API Spring Boot para login/registro
export interface AuthResponse {
	token: string;
	type: string;
	id: number;
	name: string;
	email: string;
	phoneNumber: string;
	role: "ADMIN" | "STUDENT";
}

export interface RegisterResponse extends AuthResponse {}

export interface LoginRequest {
	email: string;
	password: string;
}

export interface LoginResponse extends AuthResponse {}

export interface RefreshTokenRequest {
	refreshToken: string;
}

export interface RefreshTokenResponse {
	accessToken: string;
}

export interface LogoutRequest {
	refreshToken: string;
}

export interface LogoutResponse {
	message: string;
}

// --- Dados do usuário autenticado ---

export interface StudentMe {
	id: number;
	name: string;
	email: string;
	phoneNumber: string;
	enrollments: EnrollmentDetails[];
}

export interface EnrollmentDetails {
	id: number;
	classId: number;
	className: string;
	trainingId: number;
	trainingName: string;
	startDate: string;
	endDate: string;
	accessLink: string;
}

// --- Trainings (Treinamentos) ---

export interface Training {
	id: number;
	name: string;
	description: string;
}

export interface TrainingCreate {
	name: string;
	description: string;
}

export interface TrainingUpdate {
	name: string;
	description: string;
}

// --- Classes (Aulas) ---

export interface ClassGroup {
	id: number;
	trainingId: number;
	trainingName?: string;
	name: string;
	startDate: string;
	endDate: string;
	accessLink: string;
	resources?: Resource[];
}

export interface ClassGroupCreate {
	trainingId: number;
	name: string;
	startDate: string;
	endDate: string;
	accessLink: string;
}

export interface ClassGroupUpdate {
	trainingId: number;
	name: string;
	startDate: string;
	endDate: string;
	accessLink: string;
}

// --- Resources (Recursos/Materiais) ---

export type ResourceType = "VIDEO" | "PDF" | "ZIP";

export interface Resource {
	id: number;
	classId: number;
	className?: string;
	resourceType: ResourceType;
	previousAccess: boolean;
	draft: boolean;
	name: string;
	description: string;
}

export interface ResourceCreate {
	classId: number;
	resourceType: ResourceType;
	previousAccess: boolean;
	draft: boolean;
	name: string;
	description: string;
}

export interface ResourceUpdate {
	classId: number;
	resourceType: ResourceType;
	previousAccess: boolean;
	draft: boolean;
	name: string;
	description: string;
}

// --- Students (Estudantes) ---

export interface Student {
	id: number;
	name: string;
	email: string;
	phoneNumber: string;
	enrollments?: EnrollmentDetails[];
}

export interface StudentCreate {
	name: string;
	email: string;
	phoneNumber: string;
}

export interface StudentUpdate {
	name: string;
	email: string;
	phoneNumber: string;
}

// --- Enrollments (Matrículas) ---

export interface Enrollment {
	id: number;
	classId: number;
	studentId: number;
	className?: string;
	studentName?: string;
}

export interface EnrollmentCreate {
	classId: number;
	studentId: number;
}

export interface EnrollmentUpdate {
	classId: number;
	studentId: number;
}

// --- Erros da API ---

export interface ApiError {
	message?: string;
	error?: string;
	status?: number;
	[key: string]: unknown;
}
