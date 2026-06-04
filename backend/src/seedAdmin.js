const { sequelize, User } = require('./models');

async function seedAdmin() {
  try {
    await sequelize.authenticate();
    console.log('Connected to DB');

    const adminEmail = 'admin@ecommerce.com';
    const adminExists = await User.findOne({ where: { email: adminEmail } });

    if (!adminExists) {
      await User.create({
        name: 'Administrador Principal',
        email: adminEmail,
        password_hash: 'admin123', // Sequelize hook will hash this
        role: 'admin',
        is_active: true
      });
      console.log('Admin user created: admin@ecommerce.com / admin123');
    } else {
      console.log('Admin user already exists');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
}

seedAdmin();
