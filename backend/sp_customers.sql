-- ==========================================
-- STORED PROCEDURES PARA LA TABLA CUSTOMERS
-- ==========================================

-- 1. Procedimiento para insertar un cliente
CREATE OR REPLACE PROCEDURE sp_create_customer(
    p_name TEXT,
    p_email TEXT,
    p_password_hash BYTEA,
    p_status CHAR(1),
    p_level TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO customers (name, email, password_hash, status, level)
    VALUES (p_name, p_email, p_password_hash, p_status, p_level);
END;
$$;

-- 2. Procedimiento para actualizar el estado de un cliente
CREATE OR REPLACE PROCEDURE sp_update_customer_status(
    p_id INT,
    p_status CHAR(1)
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE customers
    SET status = p_status
    WHERE id = p_id;
END;
$$;

-- 3. Función (SP) para obtener un cliente de forma segura (Registro / Verificación)
CREATE OR REPLACE FUNCTION sp_get_customer_by_email(p_email TEXT)
RETURNS TABLE (
    id INT,
    name TEXT,
    email TEXT,
    status CHAR(1),
    level TEXT
) 
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY 
    SELECT c.id, c.name, c.email, c.status, c.level 
    FROM customers c 
    WHERE c.email = p_email;
END;
$$;

-- 4. Función (SP) para el Login (Devuelve el password_hash necesario para comparar)
CREATE OR REPLACE FUNCTION sp_get_customer_for_login(p_email TEXT)
RETURNS TABLE (
    id INT,
    name TEXT,
    email TEXT,
    password_hash BYTEA,
    status CHAR(1),
    level TEXT
) 
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY 
    SELECT c.id, c.name, c.email, c.password_hash, c.status, c.level 
    FROM customers c 
    WHERE c.email = p_email;
END;
$$;

-- 5. Función (SP) para obtener un cliente por ID (Usado para mantener la sesión viva)
CREATE OR REPLACE FUNCTION sp_get_customer_by_id(p_id INT)
RETURNS TABLE (
    id INT,
    name TEXT,
    email TEXT,
    status CHAR(1),
    level TEXT
) 
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY 
    SELECT c.id, c.name, c.email, c.status, c.level 
    FROM customers c 
    WHERE c.id = p_id;
END;
$$;
