import { z } from "zod";

// ============= STUDENT VALIDATION =============
export const studentSchema = z.object({
	name: z
		.string()
		.min(3, "Nome deve ter pelo menos 3 caracteres")
		.max(100, "Nome muito longo"),
	email: z.string().email("Email inválido"),
	phone: z
		.string()
		.min(10, "Telefone deve ter pelo menos 10 dígitos")
		.optional()
		.or(z.literal("")),
	document: z
		.string()
		.min(11, "CPF deve ter 11 dígitos")
		.max(14, "CPF inválido")
		.optional()
		.or(z.literal("")),
});

export type StudentFormData = z.infer<typeof studentSchema>;

// ============= TRAINING VALIDATION =============
export const trainingSchema = z.object({
	name: z
		.string()
		.min(3, "Nome deve ter pelo menos 3 caracteres")
		.max(200, "Nome muito longo"),
	description: z
		.string()
		.min(10, "Descrição deve ter pelo menos 10 caracteres")
		.max(1000, "Descrição muito longa"),
});

export type TrainingFormData = z.infer<typeof trainingSchema>;

// ============= CLASSGROUP VALIDATION =============
export const classGroupSchema = z.object({
	training: z.number().min(1, "Selecione um treinamento"),
	name: z
		.string()
		.min(3, "Nome deve ter pelo menos 3 caracteres")
		.max(200, "Nome muito longo"),
	start_date: z.string().min(1, "Data de início é obrigatória"),
	end_date: z.string().min(1, "Data de término é obrigatória"),
	access_link: z.string().url("URL inválida").optional().or(z.literal("")),
});

export type ClassGroupFormData = z.infer<typeof classGroupSchema>;

// ============= RESOURCE VALIDATION =============
export const resourceSchema = z.object({
	class_group: z.number().min(1, "Selecione uma turma"),
	resource_name: z
		.string()
		.min(3, "Nome deve ter pelo menos 3 caracteres")
		.max(200, "Nome muito longo"),
	resource_description: z
		.string()
		.min(10, "Descrição deve ter pelo menos 10 caracteres")
		.max(500, "Descrição muito longa"),
	resource_type: z.enum(["video", "pdf", "zip"], {
		errorMap: () => ({ message: "Tipo de recurso inválido" }),
	}),
	prior_access: z.boolean(),
	draft: z.boolean(),
});

export type ResourceFormData = z.infer<typeof resourceSchema>;

// ============= ENROLLMENT VALIDATION =============
export const enrollmentSchema = z.object({
	student: z.number().min(1, "Selecione um aluno"),
	class_group: z.number().min(1, "Selecione uma turma"),
});

export type EnrollmentFormData = z.infer<typeof enrollmentSchema>;
