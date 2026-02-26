-- Create a function to be called by the frontend if no company is found
CREATE OR REPLACE FUNCTION planintex.ensure_company_exists_for_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER -- Run as database owner to bypass RLS for initial setup
SET search_path = public
AS $$
DECLARE
    v_company_id UUID;
    v_user_id UUID := auth.uid();
    v_user_email TEXT;
BEGIN
    -- Only proceed if user is authenticated
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- Get user email from auth.users
    SELECT email INTO v_user_email FROM auth.users WHERE id = v_user_id;

    -- Check if user already exists in planintex.users
    IF EXISTS (SELECT 1 FROM planintex.users WHERE id = v_user_id) THEN
        RETURN;
    END IF;

    -- Check if 'Minha Empresa' exists, create if not (Using 'nome' instead of 'name')
    SELECT id INTO v_company_id FROM planintex.empresas WHERE nome = 'Minha Empresa' LIMIT 1;

    IF v_company_id IS NULL THEN
        -- Assuming 'nome' is the column name for the company name
        INSERT INTO planintex.empresas (nome)
        VALUES ('Minha Empresa')
        RETURNING id INTO v_company_id;
    END IF;

    -- Link user to company
    INSERT INTO planintex.users (id, company_id, name, email, role)
    VALUES (v_user_id, v_company_id, 'Novo Usuário', v_user_email, 'admin');

END;
$$;

-- Grant execution to authenticated users
GRANT EXECUTE ON FUNCTION planintex.ensure_company_exists_for_user TO authenticated;
