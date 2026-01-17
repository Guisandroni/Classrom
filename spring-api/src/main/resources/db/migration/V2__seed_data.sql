-- ============================================
-- SEED DATA - Classroom Management System
-- ============================================
-- Ordem de inserção respeitando foreign keys:
-- 1. users (independente)
-- 2. students (independente - dados vêm do registro de usuário STUDENT)
-- 3. trainings (independente)
-- 4. classes (depende de trainings)
-- 5. resources (depende de classes)
-- 6. enrollments (depende de classes e students)
-- ============================================

-- ============================================
-- 1. USERS (Usuários para autenticação)
-- ============================================
-- Senha padrão: "password123" (BCrypt encoded)
-- $2a$10$N9qo8uLOickgx2ZMRZoMye.IH5J8h.8M5l.D.YtFjj.K2WJBm6E2i

INSERT INTO users (name, email, phone_number, password, role, created_at, updated_at) VALUES
-- Administradores
('Admin Sistema', 'admin@classroom.com', '11999990001', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IH5J8h.8M5l.D.YtFjj.K2WJBm6E2i', 'ADMIN', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Maria Gestora', 'maria.gestora@classroom.com', '11999990002', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IH5J8h.8M5l.D.YtFjj.K2WJBm6E2i', 'ADMIN', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Estudantes
('João Silva', 'joao.silva@email.com', '11988881001', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IH5J8h.8M5l.D.YtFjj.K2WJBm6E2i', 'STUDENT', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Ana Santos', 'ana.santos@email.com', '11988881002', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IH5J8h.8M5l.D.YtFjj.K2WJBm6E2i', 'STUDENT', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Carlos Oliveira', 'carlos.oliveira@email.com', '11988881003', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IH5J8h.8M5l.D.YtFjj.K2WJBm6E2i', 'STUDENT', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Fernanda Lima', 'fernanda.lima@email.com', '11988881004', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IH5J8h.8M5l.D.YtFjj.K2WJBm6E2i', 'STUDENT', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Pedro Costa', 'pedro.costa@email.com', '11988881005', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IH5J8h.8M5l.D.YtFjj.K2WJBm6E2i', 'STUDENT', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Juliana Mendes', 'juliana.mendes@email.com', '11988881006', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IH5J8h.8M5l.D.YtFjj.K2WJBm6E2i', 'STUDENT', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Roberto Almeida', 'roberto.almeida@email.com', '11988881007', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IH5J8h.8M5l.D.YtFjj.K2WJBm6E2i', 'STUDENT', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Camila Rocha', 'camila.rocha@email.com', '11988881008', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IH5J8h.8M5l.D.YtFjj.K2WJBm6E2i', 'STUDENT', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ============================================
-- 2. STUDENTS (Estudantes - espelho dos users com role STUDENT)
-- ============================================
-- IMPORTANTE: Os dados são iguais aos users com role=STUDENT
-- Na aplicação, são criados automaticamente via /api/auth/student/register

INSERT INTO students (name, email, phone_number) VALUES
('João Silva', 'joao.silva@email.com', '11988881001'),
('Ana Santos', 'ana.santos@email.com', '11988881002'),
('Carlos Oliveira', 'carlos.oliveira@email.com', '11988881003'),
('Fernanda Lima', 'fernanda.lima@email.com', '11988881004'),
('Pedro Costa', 'pedro.costa@email.com', '11988881005'),
('Juliana Mendes', 'juliana.mendes@email.com', '11988881006'),
('Roberto Almeida', 'roberto.almeida@email.com', '11988881007'),
('Camila Rocha', 'camila.rocha@email.com', '11988881008');

-- ============================================
-- 3. TRAININGS (Treinamentos/Cursos)
-- ============================================

INSERT INTO trainings (name, description) VALUES
('Desenvolvimento Web Full Stack', 'Curso completo de desenvolvimento web cobrindo front-end e back-end com tecnologias modernas'),
('Java Spring Boot Avançado', 'Treinamento avançado em Java com foco em Spring Boot, microservices e boas práticas'),
('React e TypeScript', 'Desenvolvimento de aplicações modernas com React, TypeScript e ecossistema front-end'),
('DevOps e Cloud Computing', 'Práticas de DevOps, containerização com Docker, Kubernetes e deploy em cloud'),
('Banco de Dados e SQL', 'Fundamentos de banco de dados relacionais, SQL avançado e otimização de queries'),
('Segurança da Informação', 'Princípios de segurança, OWASP, autenticação, autorização e criptografia');

-- ============================================
-- 4. CLASSES (Aulas/Turmas)
-- ============================================

INSERT INTO classes (training_id, name, start_date, end_date, access_link) VALUES
-- Classes do Training 1: Desenvolvimento Web Full Stack
(1, 'Introdução ao HTML e CSS', '2026-02-01 09:00:00', '2026-02-01 12:00:00', 'https://meet.classroom.com/web-intro-html'),
(1, 'JavaScript Fundamentals', '2026-02-03 09:00:00', '2026-02-03 12:00:00', 'https://meet.classroom.com/web-js-fund'),
(1, 'Node.js e Express', '2026-02-05 09:00:00', '2026-02-05 12:00:00', 'https://meet.classroom.com/web-node'),
(1, 'APIs RESTful', '2026-02-07 09:00:00', '2026-02-07 12:00:00', 'https://meet.classroom.com/web-api'),

-- Classes do Training 2: Java Spring Boot Avançado
(2, 'Spring Boot Fundamentals', '2026-02-10 14:00:00', '2026-02-10 18:00:00', 'https://meet.classroom.com/spring-fund'),
(2, 'Spring Data JPA', '2026-02-12 14:00:00', '2026-02-12 18:00:00', 'https://meet.classroom.com/spring-jpa'),
(2, 'Spring Security', '2026-02-14 14:00:00', '2026-02-14 18:00:00', 'https://meet.classroom.com/spring-security'),
(2, 'Microservices com Spring Cloud', '2026-02-17 14:00:00', '2026-02-17 18:00:00', 'https://meet.classroom.com/spring-cloud'),

-- Classes do Training 3: React e TypeScript
(3, 'Fundamentos de React', '2026-02-20 09:00:00', '2026-02-20 12:00:00', 'https://meet.classroom.com/react-fund'),
(3, 'Hooks e Estado', '2026-02-22 09:00:00', '2026-02-22 12:00:00', 'https://meet.classroom.com/react-hooks'),
(3, 'TypeScript com React', '2026-02-24 09:00:00', '2026-02-24 12:00:00', 'https://meet.classroom.com/react-ts'),

-- Classes do Training 4: DevOps e Cloud Computing
(4, 'Docker Fundamentals', '2026-03-01 10:00:00', '2026-03-01 14:00:00', 'https://meet.classroom.com/devops-docker'),
(4, 'Kubernetes Básico', '2026-03-03 10:00:00', '2026-03-03 14:00:00', 'https://meet.classroom.com/devops-k8s'),
(4, 'CI/CD Pipelines', '2026-03-05 10:00:00', '2026-03-05 14:00:00', 'https://meet.classroom.com/devops-cicd'),

-- Classes do Training 5: Banco de Dados e SQL
(5, 'SQL Básico', '2026-03-10 09:00:00', '2026-03-10 12:00:00', 'https://meet.classroom.com/db-sql-basic'),
(5, 'SQL Avançado', '2026-03-12 09:00:00', '2026-03-12 12:00:00', 'https://meet.classroom.com/db-sql-adv'),
(5, 'Modelagem de Dados', '2026-03-14 09:00:00', '2026-03-14 12:00:00', 'https://meet.classroom.com/db-modeling'),

-- Classes do Training 6: Segurança da Informação
(6, 'Fundamentos de Segurança', '2026-03-17 14:00:00', '2026-03-17 17:00:00', 'https://meet.classroom.com/sec-fund'),
(6, 'OWASP Top 10', '2026-03-19 14:00:00', '2026-03-19 17:00:00', 'https://meet.classroom.com/sec-owasp'),
(6, 'Autenticação e JWT', '2026-03-21 14:00:00', '2026-03-21 17:00:00', 'https://meet.classroom.com/sec-jwt');

-- ============================================
-- 5. RESOURCES (Recursos das aulas)
-- ============================================

INSERT INTO resources (class_id, resource_type, previous_access, draft, name, description) VALUES
-- Recursos da Class 1: Introdução ao HTML e CSS
(1, 'PDF', true, false, 'Apostila HTML Básico', 'Material introdutório sobre tags HTML e estrutura de documentos'),
(1, 'VIDEO', false, false, 'Vídeo: Primeiros passos com HTML', 'Gravação da aula demonstrando criação de páginas HTML'),
(1, 'ZIP', true, false, 'Código de Exemplo HTML', 'Arquivos de exemplo para praticar'),

-- Recursos da Class 2: JavaScript Fundamentals
(2, 'PDF', true, false, 'Guia JavaScript', 'Referência rápida de sintaxe JavaScript'),
(2, 'VIDEO', false, false, 'Aula: Variáveis e Funções', 'Vídeo explicando conceitos fundamentais de JS'),

-- Recursos da Class 3: Node.js e Express
(3, 'PDF', true, false, 'Manual Node.js', 'Documentação de configuração e uso do Node.js'),
(3, 'ZIP', true, false, 'Projeto Starter Express', 'Template de projeto Express.js configurado'),

-- Recursos da Class 5: Spring Boot Fundamentals
(5, 'PDF', true, false, 'Guia Spring Boot', 'Documentação oficial resumida do Spring Boot'),
(5, 'VIDEO', false, false, 'Criando primeiro projeto', 'Tutorial de criação de projeto Spring Boot'),
(5, 'ZIP', true, false, 'Código Base Spring', 'Projeto template Spring Boot'),

-- Recursos da Class 6: Spring Data JPA
(6, 'PDF', true, false, 'JPA e Hibernate', 'Material sobre mapeamento objeto-relacional'),
(6, 'VIDEO', false, false, 'Repositórios e Queries', 'Aula sobre Spring Data repositories'),

-- Recursos da Class 9: Fundamentos de React
(9, 'PDF', true, false, 'React Documentation', 'Resumo da documentação oficial do React'),
(9, 'VIDEO', false, false, 'Criando Componentes', 'Tutorial de criação de componentes React'),
(9, 'ZIP', true, false, 'React Starter Kit', 'Projeto React configurado com Vite'),

-- Recursos da Class 12: Docker Fundamentals
(12, 'PDF', true, false, 'Docker Cheatsheet', 'Comandos essenciais do Docker'),
(12, 'VIDEO', false, false, 'Containers na Prática', 'Demonstração de uso do Docker'),

-- Recursos da Class 15: SQL Básico
(15, 'PDF', true, false, 'SQL Quick Reference', 'Referência rápida de comandos SQL'),
(15, 'VIDEO', false, false, 'Primeiras Queries', 'Tutorial de queries SELECT, INSERT, UPDATE, DELETE'),

-- Recursos da Class 18: Fundamentos de Segurança
(18, 'PDF', true, false, 'Security Best Practices', 'Guia de boas práticas de segurança'),
(18, 'VIDEO', false, false, 'Introdução à Segurança', 'Visão geral de segurança da informação'),

-- Recursos em rascunho (draft)
(1, 'PDF', false, true, 'CSS Avançado (Rascunho)', 'Material em desenvolvimento sobre CSS Grid e Flexbox'),
(5, 'VIDEO', false, true, 'Spring AOP (Rascunho)', 'Aula em preparação sobre Aspect-Oriented Programming');

-- ============================================
-- 6. ENROLLMENTS (Matrículas)
-- ============================================
-- Vincula estudantes às classes

INSERT INTO enrollments (class_id, student_id) VALUES
-- João Silva (id=1) - Web Full Stack + Spring
(1, 1), (2, 1), (3, 1), (4, 1),
(5, 1), (6, 1),

-- Ana Santos (id=2) - React + DevOps
(9, 2), (10, 2), (11, 2),
(12, 2), (13, 2), (14, 2),

-- Carlos Oliveira (id=3) - Spring + Banco de Dados
(5, 3), (6, 3), (7, 3), (8, 3),
(15, 3), (16, 3), (17, 3),

-- Fernanda Lima (id=4) - Web Full Stack completo
(1, 4), (2, 4), (3, 4), (4, 4),

-- Pedro Costa (id=5) - DevOps + Segurança
(12, 5), (13, 5), (14, 5),
(18, 5), (19, 5), (20, 5),

-- Juliana Mendes (id=6) - React + Segurança
(9, 6), (10, 6), (11, 6),
(18, 6), (19, 6), (20, 6),

-- Roberto Almeida (id=7) - Banco de Dados + Spring
(15, 7), (16, 7), (17, 7),
(5, 7), (6, 7), (7, 7),

-- Camila Rocha (id=8) - Todos os cursos de introdução
(1, 8), (5, 8), (9, 8), (12, 8), (15, 8), (18, 8);
