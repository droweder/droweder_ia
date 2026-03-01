-- Schema definitions for DRoweder IA new features
-- Run this in your Supabase SQL Editor

-- 1. FILES TABLE
CREATE TABLE IF NOT EXISTS droweder_ia.files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  name TEXT NOT NULL,
  size BIGINT,
  type TEXT,
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  uploaded_by UUID REFERENCES auth.users(id)
);

-- 2. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS droweder_ia.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- 3. ASSISTANTS TABLE
CREATE TABLE IF NOT EXISTS droweder_ia.assistants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Seed default assistants
INSERT INTO droweder_ia.assistants (name, description, icon, category)
SELECT 'Especialista em Vendas', 'Analisa o funil de vendas, desempenho da equipe e previsões de receita.', 'LineChart', 'Negócios'
WHERE NOT EXISTS (SELECT 1 FROM droweder_ia.assistants WHERE name = 'Especialista em Vendas');

INSERT INTO droweder_ia.assistants (name, description, icon, category)
SELECT 'Analista de Mercado', 'Monitora tendências globais, concorrência e novas oportunidades.', 'Globe', 'Estratégia'
WHERE NOT EXISTS (SELECT 1 FROM droweder_ia.assistants WHERE name = 'Analista de Mercado');

INSERT INTO droweder_ia.assistants (name, description, icon, category)
SELECT 'Engenheiro de Dados', 'Auxilia na limpeza, transformação e organização de bases de dados.', 'Database', 'Tecnologia'
WHERE NOT EXISTS (SELECT 1 FROM droweder_ia.assistants WHERE name = 'Engenheiro de Dados');

INSERT INTO droweder_ia.assistants (name, description, icon, category)
SELECT 'DevOps Assistente', 'Automatiza processos de CI/CD e monitoramento de infraestrutura.', 'Code2', 'Tecnologia'
WHERE NOT EXISTS (SELECT 1 FROM droweder_ia.assistants WHERE name = 'DevOps Assistente');

INSERT INTO droweder_ia.assistants (name, description, icon, category)
SELECT 'Consultor Financeiro', 'Otimização de fluxo de caixa e análise de demonstrativos.', 'BrainCircuit', 'Finanças'
WHERE NOT EXISTS (SELECT 1 FROM droweder_ia.assistants WHERE name = 'Consultor Financeiro');

INSERT INTO droweder_ia.assistants (name, description, icon, category)
SELECT 'Suporte ao Cliente', 'Responde dúvidas frequentes e gerencia tickets de suporte.', 'User', 'Atendimento'
WHERE NOT EXISTS (SELECT 1 FROM droweder_ia.assistants WHERE name = 'Suporte ao Cliente');

-- 4. STORAGE (Instructions)
-- You must create a new public bucket named 'company_files' in the Storage section of your Supabase dashboard.
