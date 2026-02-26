# DRoweder AI - SaaS B2B Multi-tenant

Aplicação de Inteligência Artificial conectada ao ERP Planintex.

## Stack Tecnológica
- **Frontend:** React 19 (Vite), TypeScript, Tailwind CSS
- **Banco de Dados:** Supabase (PostgreSQL)
- **Hospedagem:** Netlify

## Estrutura do Projeto

- `/src/pages`: Componentes das páginas (Chat, Dashboards).
- `/src/components`: Componentes reutilizáveis (Layout, Sidebar).
- `database_schema.sql`: Script SQL completo para configuração do banco de dados.

## Configuração do Banco de Dados (Supabase)

O script `database_schema.sql` contém toda a definição necessária. Ele deve ser executado no SQL Editor do Supabase.

### Funcionalidades do Script:
1.  **Schemas:** Cria `planintex` (simulando o ERP existente) e `droweder_ia` (dados da IA).
2.  **Tabelas:** Estrutura para conversas, mensagens e logs de faturamento.
3.  **Segurança (RLS):** Ativa Row Level Security para isolamento de dados entre inquilinos (tenants).
4.  **Role de IA:** Configura a `ai_reader_role`.

## Arquitetura de Segurança Text-to-SQL (Crítico)

Para mitigar riscos associados à geração de SQL por Inteligência Artificial, adotamos a seguinte arquitetura:

### 1. Role de Leitura Dedicada (`ai_reader_role`)
Todas as queries geradas pela IA devem ser executadas sob a identidade da role `ai_reader_role` no banco de dados.

*   **Permissões:** `GRANT SELECT` apenas.
*   **Bloqueios:** `REVOKE INSERT, UPDATE, DELETE, TRUNCATE`.
*   **Objetivo:** Mesmo que a IA gere um comando malicioso (ex: `DROP TABLE`), o banco de dados rejeitará a execução por falta de privilégios.

### 2. Isolamento de Tenant (RLS)
As tabelas da aplicação `droweder_ia` possuem políticas RLS ativas.
*   Um usuário só pode ler/escrever registros onde `company_id` seja igual à sua empresa vinculada.
*   Isso impede vazamento de dados entre clientes no ambiente Multi-tenant.

## Deploy no Netlify

O projeto está configurado para deploy contínuo no Netlify.

### Configurações de Build
*   **Base directory:** `/`
*   **Build command:** `npm run build`
*   **Publish directory:** `dist`

### Configuração de Redirecionamento (SPA)
O arquivo `public/_redirects` garante que o roteamento do React (Client-side routing) funcione corretamente ao atualizar a página ou acessar URLs diretas.

Conteúdo necessário em `public/_redirects`:
```
/*  /index.html  200
```

## Executando Localmente

1.  Instale as dependências:
    ```bash
    npm install
    ```
2.  Inicie o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```
3.  Acesse `http://localhost:5173`.
