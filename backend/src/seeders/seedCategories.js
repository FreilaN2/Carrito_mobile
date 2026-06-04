require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
  }
);

const Category = sequelize.define('Category', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(100), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  image_url: { type: DataTypes.STRING(255), allowNull: true },
}, {
  tableName: 'categories',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

const categories = [
  {
    name: 'Todos',
    description: 'Ver todos los productos',
    image_url: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=500&auto=format&fit=crop',
  },
  {
    name: 'Farmacia',
    description: 'Medicamentos, vitaminas y suplementos',
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop',
  },
  {
    name: 'Belleza',
    description: 'Maquillaje, skincare y fragancias',
    image_url: 'https://images.unsplash.com/photo-1596462502278-27bf85033e5a?w=500&auto=format&fit=crop',
  },
  {
    name: 'Cuidado Personal',
    description: 'Higiene, shampoo y cuidado del cuerpo',
    image_url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&auto=format&fit=crop',
  },
  {
    name: 'Bebés',
    description: 'Pañales, leche y accesorios para bebé',
    image_url: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=500&auto=format&fit=crop',
  },
  {
    name: 'Alimentos',
    description: 'Comida saludable, cereales y snacks',
    image_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop',
  },
];

async function seedCategories() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado a la base de datos.');

    // Borrar e insertar de nuevo (solo en desarrollo)
    await Category.destroy({ where: {}, truncate: true, cascade: true });
    console.log('🗑️  Categorías anteriores eliminadas.');

    for (const cat of categories) {
      await Category.create(cat);
      console.log(`✅ Categoría creada: ${cat.name}`);
    }

    console.log('\n🎉 ¡Todas las categorías fueron insertadas correctamente!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

seedCategories();
