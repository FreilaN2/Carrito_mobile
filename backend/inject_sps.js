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
    
    // 2. Leer los archivos SQL
    const customersSqlPath = path.join(__dirname, 'sp_customers.sql');
    const parametersSqlPath = path.join(__dirname, 'sp_parameters.sql');
    
    if (!fs.existsSync(customersSqlPath) || !fs.existsSync(parametersSqlPath)) {
      throw new Error(`No se encontraron los archivos SQL de SPs.`);
    }
    
    const customersSql = fs.readFileSync(customersSqlPath, 'utf8');
    const parametersSql = fs.readFileSync(parametersSqlPath, 'utf8');

    // 3. Ejecutar todo el SQL en la base de datos
    console.log('⏳ Inyectando los Stored Procedures de Customers...');
    await client.query(customersSql);

    console.log('⏳ Inyectando los Stored Procedures de Parámetros...');
    await client.query(parametersSql);
    
    console.log('✅ ¡Éxito! Todos los Stored Procedures han sido inyectados en la base de datos de tu compañera.');

  } catch (error) {
    console.error('❌ Error inyectando los SPs:', error.message);
  } finally {
    await client.end();
  }
}

injectSPs();
