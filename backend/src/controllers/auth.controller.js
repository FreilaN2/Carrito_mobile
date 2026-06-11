const { Customer } = require('../models');
const jwt = require('jsonwebtoken');

const generateToken = (id, level) => {
  return jwt.sign({ id, level }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Verificar si el cliente ya existe
    const customerExists = await Customer.findOne({ where: { email } });
    if (customerExists) {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
    }

    // Crear el cliente (usando 'status'='A' por defecto y level='user')
    const customer = await Customer.create({
      name,
      email,
      password_hash: password, // Se hashea automáticamente por el hook
      status: 'A',
      level: 'user'
    });

    res.status(201).json({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      role: customer.level, // Mapeamos level a role para no romper el frontend
      token: generateToken(customer.id, customer.level)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor: ' + error.message, error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const customer = await Customer.findOne({ where: { email } });

    if (customer && (await customer.validPassword(password))) {
      if (customer.status !== 'A') {
        return res.status(401).json({ message: 'Cuenta desactivada' });
      }

      res.json({
        id: customer.id,
        name: customer.name,
        email: customer.email,
        role: customer.level,
        token: generateToken(customer.id, customer.level)
      });
    } else {
      res.status(401).json({ message: 'Correo o contraseña inválidos' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const customer = await Customer.findOne({ where: { email } });

    if (customer && (await customer.validPassword(password))) {
      if (customer.status !== 'A') {
        return res.status(401).json({ message: 'Cuenta desactivada' });
      }

      if (customer.level !== 'admin') {
        return res.status(403).json({ message: 'Acceso denegado. Se requieren privilegios de administrador.' });
      }

      res.json({
        id: customer.id,
        name: customer.name,
        email: customer.email,
        role: customer.level,
        token: generateToken(customer.id, customer.level)
      });
    } else {
      res.status(401).json({ message: 'Correo o contraseña inválidos' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.user.id, {
      attributes: { exclude: ['password_hash'] }
    });
    
    if (!customer) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    const customerData = customer.toJSON();
    // Mapeamos para que el frontend siga reconociendo 'role'
    customerData.role = customerData.level;

    res.json(customerData);
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};
