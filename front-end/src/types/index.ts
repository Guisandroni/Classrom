
export interface User {
	id: number;
	username: string;
	email: string;
	role: "admin" | "student";
	is_staff: boolean;
}

export interface Tokens {
	access: string;
	refresh: string;
}

export interface RegisterRequest {
	username: string;
	email: string;
	password: string;
	password_confirm: string;
	role: "admin" | "student";
	first_name?: string;
	last_name?: string;
	student_name?: string;
	student_phone?: string;
}

export interface RegisterResponse {
	message: string;
	user: {
		id: number;
		username: string;
		email: string;
		role: "admin" | "student";
	};
	tokens: Tokens;
}

export interface LoginRequest {
	email: string;
	password: string;
}

export interface LoginResponse {
	access: string;
	refresh: string;
	user: {
		id: number;
		username: string;
		email: string;
		role: "admin" | "student";
	};
}

export interface RefreshTokenRequest {
	refresh: string;
}

export interface RefreshTokenResponse {
	access: string;
}

export interface LogoutRequest {
	refresh: string;
}

export interface LogoutResponse {
	message: string;
}

export interface UserMe {
	id: number;
	user_id: number;
	username: string;
	email: string;
	name: string;
	phone: string;
	role: "admin" | "student";
	date_joined: string;
}

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

export interface ClassGroup {
	id: number;
	training: number;
	training_name: string;
	name: string;
	start_date: string;
	end_date: string;
	access_link: string;
	resources?: Resource[];
}

export interface ClassGroupCreate {
	training: number;
	name: string;
	start_date: string;
	end_date: string;
	access_link: string;
}

export interface ClassGroupUpdate {
	training: number;
	name: string;
	start_date: string;
	end_date: string;
	access_link: string;
}

export type ResourceType = "video" | "pdf" | "zip";

export interface Resource {
	id: number;
	class_group: number;
	class_group_name: string;
	resource_type: ResourceType;
	prior_access: boolean;
	draft: boolean;
	resource_name: string;
	resource_description: string;
}

export interface ResourceCreate {
	class_group: number;
	resource_type: ResourceType;
	prior_access: boolean;
	draft: boolean;
	resource_name: string;
	resource_description: string;
}

export interface ResourceUpdate {
	class_group: number;
	resource_type: ResourceType;
	prior_access: boolean;
	draft: boolean;
	resource_name: string;
	resource_description: string;
}

export interface Student {
	id: number;
	user: number;
	name: string;
	phone: string;
	email: string;
	username: string;
}

export interface StudentCreate {
	name: string;
	email: string;
	username: string;
	phone?: string;
}

export interface Enrollment {
	id: number;
	class_group: number;
	student: number;
	class_group_name: string;
	student_name: string;
}

export interface EnrollmentCreate {
	class_group: number;
	student: number;
}

export interface EnrollmentUpdate {
	class_group: number;
	student: number;
}

export interface ApiError {
	detail?: string;
	message?: string;
	[key: string]: any;
}
