const { Customer } = require('../models');
const jwt = require('jsonwebtoken');
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

    // 1. Verificar si el cliente ya existe
    const customerExists = await Customer.findOne({ where: { email } });
    if (customerExists) {
      if (customerExists.status === 'A') {
        return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
      }
      // Si el status es 'P', permitiremos reenviar o actualizar la contraseña
      await customerExists.destroy(); // Limpiamos el registro pendiente anterior para crear uno nuevo limpio
    }

    // 2. Generar código de 6 dígitos
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // 3. Guardarlo en la memoria del servidor (expira en 15 minutos)
    global.verificationCodes.set(email, {
      code,
      expiresAt: Date.now() + 15 * 60 * 1000
    });

    // 4. Crear el cliente con status 'P' (Pendiente)
    const customer = await Customer.create({
      name,
      email,
      password_hash: password, // Se hashea automáticamente
      status: 'P', 
      level: 'user'
    });

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

    // Código válido, procedemos a activar la cuenta
    const customer = await Customer.findOne({ where: { email } });
    if (!customer) {
      return res.status(404).json({ message: 'Cliente no encontrado en la base de datos.' });
    }

    customer.status = 'A'; // Activo
    await customer.save();

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

    const customer = await Customer.findOne({ where: { email } });

    if (customer && (await customer.validPassword(password))) {
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
