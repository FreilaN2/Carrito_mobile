const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function injectSPs() {
  // 1. Conectarnos a la base de datos de la compañera usando sus credenciales del .env
  const client = new Client({
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '2004jesus',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'carrito_v2',
  });

  try {
    console.log('⏳ Conectando a la base de datos...');
    await client.connect();
    
    // 2. Leer el archivo unificado de SQL
    const sqlPath = path.join(__dirname, 'sp_customers.sql');
    if (!fs.existsSync(sqlPath)) {
      throw new Error(`No se encontró el archivo: ${sqlPath}`);
    }
    
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // 3. Ejecutar todo el SQL en la base de datos
    console.log('⏳ Inyectando los 5 Stored Procedures...');
    await client.query(sql);
    
    console.log('✅ ¡Éxito! Todos los Stored Procedures para la tabla customers han sido creados/actualizados.');

  } catch (error) {
    console.error('❌ Error inyectando los SPs:', error.message);
  } finally {
    await client.end();
  }
}

injectSPs();
