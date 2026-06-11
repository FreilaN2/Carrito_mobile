require('dotenv').config();
const { Pool } = require('pg');

// Configuración de la conexión a la base de datos "carrito_v2"
// Asegúrate de que la base de datos exista en tu PostgreSQL.
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: 'carrito_v2', // Usaremos una BD nueva para no mezclar con la de Sequelize
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

async function testConnection() {
  try {
    console.log('Intentando conectar a la base de datos carrito_v2...');
    
    // Conectamos a la BD usando pg (tipo JDBC como lo pidió tu amiga)
    const client = await pool.connect();
    console.log('¡Conexión exitosa a PostgreSQL!');

    // Hacemos una consulta básica
    // Nota: Para que esta consulta funcione y no de error, las tablas en schema_v2.sql deben haber sido creadas primero.
    const res = await client.query('SELECT current_timestamp AS hora_actual');
    console.log('Prueba de consulta básica exitosa:', res.rows[0]);

    // Opcional: Probar consulta en la tabla de productos (comentado por si aún no has creado las tablas)
    // const resProductos = await client.query('SELECT * FROM products');
    // console.log('Productos en base de datos:', resProductos.rows);

    // Cerramos la conexión
    client.release();
  } catch (err) {
    console.error('Error al conectar a la base de datos:', err.message);
    console.error('Asegúrate de haber creado la base de datos "carrito_v2" en pgAdmin.');
  } finally {
    await pool.end();
  }
}

testConnection();
