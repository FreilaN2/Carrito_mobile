-- ==========================================
-- STORED PROCEDURES PARA PARAMETERS_VALUES
-- ==========================================

DROP FUNCTION IF EXISTS sp_get_parameters();
-- 1. Función para consultar todos los parámetros
CREATE OR REPLACE FUNCTION sp_get_parameters()
RETURNS TABLE (
    id INT,
    key TEXT,
    value TEXT,
    description TEXT,
    status BOOLEAN
) 
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY 
    SELECT p.id, p.key, p.value, p.description, p.status 
    FROM parameters_values p;
END;
$$;

DROP FUNCTION IF EXISTS sp_get_parameter_by_id(INT);
-- 2. Función para consultar un parámetro por ID
CREATE OR REPLACE FUNCTION sp_get_parameter_by_id(p_id INT)
RETURNS TABLE (
    id INT,
    key TEXT,
    value TEXT,
    description TEXT,
    status BOOLEAN
) 
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY 
    SELECT p.id, p.key, p.value, p.description, p.status 
    FROM parameters_values p
    WHERE p.id = p_id;
END;
$$;

-- 3. Procedimiento para insertar un parámetro
CREATE OR REPLACE PROCEDURE sp_create_parameter(
    p_key TEXT,
    p_value TEXT,
    p_description TEXT,
    p_status BOOLEAN
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO parameters_values (key, value, description, status)
    VALUES (p_key, p_value, p_description, p_status);
END;
$$;

-- 4. Procedimiento para actualizar un parámetro
CREATE OR REPLACE PROCEDURE sp_update_parameter(
    p_id INT,
    p_key TEXT,
    p_value TEXT,
    p_description TEXT,
    p_status BOOLEAN
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE parameters_values
    SET key = p_key,
        value = p_value,
        description = p_description,
        status = p_status
    WHERE id = p_id;
END;
$$;

-- 5. Procedimiento para eliminar un parámetro
CREATE OR REPLACE PROCEDURE sp_delete_parameter(
    p_id INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM parameters_values
    WHERE id = p_id;
END;
$$;
