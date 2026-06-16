const { Customer, sequelize } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

// Caché temporal para guardar los códigos en memoria (email -> { code, expiresAt })
global.verificationCodes = global.verificationCodes || new Map();

const generateToken = (id, level) => {
  return jwt.sign({ id, level }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// Configuración del transportador de correos
const getTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Verificar si el cliente ya existe usando el SP
    const [existingCustomers] = await sequelize.query(
      'SELECT * FROM sp_get_customer_by_email(:email)',
      { replacements: { email } }
    );
    const customerExists = existingCustomers[0];

    if (customerExists) {
      if (customerExists.status === 'A') {
        return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
      }
      // Si el status es 'P', lo eliminamos con Sequelize por ahora
      await Customer.destroy({ where: { id: customerExists.id } });
    }

    // 2. Generar código de 6 dígitos
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // 3. Guardarlo en la memoria del servidor (expira en 15 minutos)
    global.verificationCodes.set(email, {
      code,
      expiresAt: Date.now() + 15 * 60 * 1000
    });

    // 4. Crear el cliente con status 'P' usando el SP
    // (Como ya no usamos el modelo de Sequelize, tenemos que hashear la contraseña manualmente)
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    await sequelize.query(
      'CALL sp_create_customer(:name, :email, :password_hash, :status, :level)',
      { 
        replacements: { 
          name, 
          email, 
          password_hash: Buffer.from(password_hash), 
          status: 'P', 
          level: 'user' 
        } 
      }
    );

    // 5. Enviar el correo
    try {
      const transporter = getTransporter();
      await transporter.sendMail({
        from: `"Shopping Car" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Verifica tu cuenta - Código de Seguridad',
        html: `
          <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
            <h2>¡Hola, ${name}!</h2>
            <p>Gracias por registrarte. Para activar tu cuenta, ingresa el siguiente código de 6 dígitos en la aplicación:</p>
            <h1 style="color: #4CAF50; font-size: 40px; letter-spacing: 5px;">${code}</h1>
            <p style="color: #777; font-size: 12px;">Este código expirará en 15 minutos.</p>
          </div>
        `
      });
      console.log(`✉️ Correo de verificación enviado a ${email} con código ${code}`);
    } catch (emailError) {
      console.error('Error enviando correo, revisa tu .env:', emailError.message);
      // Opcional: imprimir el código en consola para facilitar pruebas si falla el correo
      console.log(`[MODO PRUEBA] Tu código de verificación es: ${code}`);
    }

    // No devolvemos JWT todavía.
    res.status(201).json({ 
      message: 'Usuario creado. Por favor verifica tu correo electrónico.',
      requireVerification: true,
      email: email 
    });

  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor: ' + error.message, error: error.message });
  }
};

exports.verifyCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    const cacheData = global.verificationCodes.get(email);

    if (!cacheData) {
      return res.status(400).json({ message: 'No hay ningún código pendiente para este correo. Intenta registrarte de nuevo.' });
    }

    if (Date.now() > cacheData.expiresAt) {
      global.verificationCodes.delete(email);
      return res.status(400).json({ message: 'El código ha expirado.' });
    }

    if (cacheData.code !== code) {
      return res.status(400).json({ message: 'Código incorrecto.' });
    }

    // Código válido, procedemos a activar la cuenta usando el SP
    const [results] = await sequelize.query(
      'SELECT * FROM sp_get_customer_by_email(:email)',
      { replacements: { email } }
    );
    const customer = results[0];

    if (!customer) {
      return res.status(404).json({ message: 'Cliente no encontrado en la base de datos.' });
    }

    // Usar el SP para actualizar el estatus
    await sequelize.query(
      'CALL sp_update_customer_status(:id, :status)',
      { replacements: { id: customer.id, status: 'A' } }
    );

    // Limpiamos el caché
    global.verificationCodes.delete(email);

    // Devolvemos la sesión (JWT)
    res.json({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      role: customer.level,
      token: generateToken(customer.id, customer.level)
    });

  } catch (error) {
    res.status(500).json({ message: 'Error al verificar: ' + error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [results] = await sequelize.query(
      'SELECT * FROM sp_get_customer_for_login(:email)',
      { replacements: { email } }
    );
    const customer = results[0];

    if (customer && (await bcrypt.compare(password, customer.password_hash.toString()))) {
      if (customer.status === 'P') {
        return res.status(401).json({ message: 'Cuenta pendiente. Revisa tu correo y verifica tu cuenta.' });
      }
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

    const [results] = await sequelize.query(
      'SELECT * FROM sp_get_customer_for_login(:email)',
      { replacements: { email } }
    );
    const customer = results[0];

    if (customer && (await bcrypt.compare(password, customer.password_hash.toString()))) {
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
    const [results] = await sequelize.query(
      'SELECT * FROM sp_get_customer_by_id(:id)',
      { replacements: { id: req.user.id } }
    );
    const customer = results[0];
    
    if (!customer) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    // Mapeamos para que el frontend siga reconociendo 'role'
    customer.role = customer.level;

    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};
