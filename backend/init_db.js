const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function setupDatabase() {
  // 1. Conectarnos a la base de datos existente (carrito_db o postgres)
  const client1 = new Client({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'carrito_db'
  });
  
  try {
    await client1.connect();
    // Revisar si ya existe
    const res = await client1.query("SELECT 1 FROM pg_database WHERE datname='carrito_v2'");
    if (res.rowCount === 0) {
      await client1.query('CREATE DATABASE carrito_v2');
      console.log('✅ Base de datos carrito_v2 creada exitosamente.');
    } else {
      console.log('ℹ️ La base de datos carrito_v2 ya existe.');
    }
  } catch (e) {
    console.error('❌ Error al crear la base de datos. Verifica tus credenciales en .env:', e.message);
    return; // Si falla, detenemos el proceso
  } finally {
    await client1.end();
  }

  // 2. Conectarnos a la NUEVA base de datos para importar las tablas
  const client2 = new Client({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
    database: 'carrito_v2'
  });

  try {
    await client2.connect();
    const sqlPath = path.join(__dirname, 'schema_v2.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Ejecutar todas las tablas
    await client2.query(sql);
    console.log('✅ Tablas creadas/importadas exitosamente desde schema_v2.sql.');
  } catch (e) {
    console.error('❌ Error importando las tablas:', e.message);
  } finally {
    await client2.end();
  }
}

setupDatabase();
