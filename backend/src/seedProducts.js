const sequelize = require('./config/database');
const { Category, Product } = require('./models');

const categoriesData = [
  { name: 'Belleza', description: 'Cosméticos y maquillaje' },
  { name: 'Cuidado Personal', description: 'Higiene y cuidado diario' },
  { name: 'Bebés', description: 'Pañales, fórmulas y cuidado infantil' },
  { name: 'Alimentos', description: 'Snacks y bebidas' }
];

const productsData = [
  {
    name: 'Protector Solar Facial SPF 50',
    description: 'Protección solar de alta cobertura, resistente al agua.',
    price: 15.99,
    stock: 50,
    categoryName: 'Belleza',
    image_url: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&q=80'
  },
  {
    name: 'Secador de Cabello Profesional',
    description: 'Secador iónico con 3 niveles de temperatura.',
    price: 45.00,
    stock: 12,
    categoryName: 'Belleza',
    image_url: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=400&q=80'
  },
  {
    name: 'Crema Hidratante Corporal 400ml',
    description: 'Crema de rápida absorción para piel seca.',
    price: 8.50,
    stock: 100,
    categoryName: 'Cuidado Personal',
    image_url: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&q=80'
  },
  {
    name: 'Champú Anticaspa 500ml',
    description: 'Champú con ketoconazol, elimina la caspa desde la primera lavada.',
    price: 6.99,
    stock: 30,
    categoryName: 'Cuidado Personal',
    image_url: 'https://images.unsplash.com/photo-1626015469956-6db3db3a992e?w=400&q=80'
  },
  {
    name: 'Pañales Etapa 3 (Pack x 40)',
    description: 'Pañales ultra absorbentes para bebés de 7 a 10 kg.',
    price: 12.00,
    stock: 200,
    categoryName: 'Bebés',
    image_url: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400&q=80'
  },
  {
    name: 'Fórmula Infantil de Continuación 800g',
    description: 'Enriquecida con hierro y vitaminas para un sano desarrollo.',
    price: 25.50,
    stock: 45,
    categoryName: 'Bebés',
    image_url: 'https://images.unsplash.com/photo-1596755490100-c9a1d120a2cc?w=400&q=80'
  },
  {
    name: 'Chocolate con Leche 100g',
    description: 'Tableta de chocolate premium importado.',
    price: 2.50,
    stock: 150,
    categoryName: 'Alimentos',
    image_url: 'https://images.unsplash.com/photo-1548813354-998f82855fde?w=400&q=80'
  },
  {
    name: 'Bebida Energética 473ml',
    description: 'Bebida energizante sabor original.',
    price: 3.00,
    stock: 80,
    categoryName: 'Alimentos',
    image_url: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80'
  }
];

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('Conectado a la BD');

    for (const cat of categoriesData) {
      await Category.findOrCreate({
        where: { name: cat.name },
        defaults: { description: cat.description }
      });
    }

    const categories = await Category.findAll();
    const catMap = {};
    categories.forEach(c => {
      catMap[c.name] = c.id;
    });

    for (const prod of productsData) {
      await Product.findOrCreate({
        where: { name: prod.name },
        defaults: {
          description: prod.description,
          price: prod.price,
          stock: prod.stock,
          category_id: catMap[prod.categoryName],
          image_url: prod.image_url
        }
      });
    }

    console.log('Productos estáticos sembrados con éxito.');
    process.exit(0);
  } catch (error) {
    console.error('Error sembrando datos:', error);
    process.exit(1);
  }
}

seed();
