-- Script to ensure the currently logged-in user is linked to a valid company in the mock ERP schema.
-- Run this in the Supabase SQL Editor.

-- 1. Create a demo company if it doesn't exist
DO $$
DECLARE
    v_company_id UUID;
BEGIN
    -- Check if 'Minha Empresa' exists, if not create it (Using 'nome' instead of 'name')
    SELECT id INTO v_company_id FROM planintex.empresas WHERE nome = 'Minha Empresa' LIMIT 1;

    IF v_company_id IS NULL THEN
        -- Assuming 'nome' is the column name for the company name based on the screenshot/error
        INSERT INTO planintex.empresas (nome)
        VALUES ('Minha Empresa')
        RETURNING id INTO v_company_id;
        RAISE NOTICE 'Created new company: Minha Empresa (ID: %)', v_company_id;
    ELSE
        RAISE NOTICE 'Using existing company: Minha Empresa (ID: %)', v_company_id;
    END IF;

    -- 2. Link ALL existing auth users to this company if they are missing in planintex.users
    -- This uses the auth.users table which is available in the Supabase backend context
    -- Note: We need to use a security definer function or run this as a superuser/postgres role.

    INSERT INTO planintex.users (id, company_id, name, email, role)
    SELECT
        au.id,
        v_company_id,
        COALESCE(au.raw_user_meta_data->>'full_name', 'Usuário'),
        au.email,
        'admin'
    FROM auth.users au
    WHERE NOT EXISTS (
        SELECT 1 FROM planintex.users pu WHERE pu.id = au.id
    );

    RAISE NOTICE 'Linked missing users to Minha Empresa';
END $$;
