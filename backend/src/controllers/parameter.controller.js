const { sequelize } = require('../models');

// @desc    Obtener todos los parámetros
// @route   GET /api/parameters
// @access  Public/Admin
exports.getParameters = async (req, res) => {
  try {
    const [results] = await sequelize.query('SELECT * FROM sp_get_parameters()');
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener parámetros', error: error.message });
  }
};

// @desc    Obtener un parámetro por ID
// @route   GET /api/parameters/:id
// @access  Public/Admin
exports.getParameterById = async (req, res) => {
  try {
    const [results] = await sequelize.query(
      'SELECT * FROM sp_get_parameter_by_id(:id)',
      { replacements: { id: req.params.id } }
    );
    const parameter = results[0];

    if (parameter) {
      res.json(parameter);
    } else {
      res.status(404).json({ message: 'Parámetro no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener parámetro', error: error.message });
  }
};

// @desc    Crear un parámetro
// @route   POST /api/parameters
// @access  Private/Admin
exports.createParameter = async (req, res) => {
  try {
    const { key, value, description, status } = req.body;

    await sequelize.query(
      'CALL sp_create_parameter(:key, :value, :description, :status)',
      { replacements: { key, value, description: description || '', status: status || 'A' } }
    );

    res.status(201).json({ message: 'Parámetro creado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear parámetro', error: error.message });
  }
};

// @desc    Actualizar un parámetro
// @route   PUT /api/parameters/:id
// @access  Private/Admin
exports.updateParameter = async (req, res) => {
  try {
    const { key, value, description, status } = req.body;
    
    // Primero validamos si existe
    const [results] = await sequelize.query(
      'SELECT * FROM sp_get_parameter_by_id(:id)',
      { replacements: { id: req.params.id } }
    );
    const parameter = results[0];

    if (!parameter) {
      return res.status(404).json({ message: 'Parámetro no encontrado' });
    }

    // Actualizamos con el SP
    await sequelize.query(
      'CALL sp_update_parameter(:id, :key, :value, :description, :status)',
      { 
        replacements: { 
          id: req.params.id, 
          key: key !== undefined ? key : parameter.key, 
          value: value !== undefined ? value : parameter.value, 
          description: description !== undefined ? description : parameter.description, 
          status: status !== undefined ? status : parameter.status 
        } 
      }
    );

    res.json({ message: 'Parámetro actualizado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar parámetro', error: error.message });
  }
};

// @desc    Eliminar un parámetro
// @route   DELETE /api/parameters/:id
// @access  Private/Admin
exports.deleteParameter = async (req, res) => {
  try {
    const [results] = await sequelize.query(
      'SELECT * FROM sp_get_parameter_by_id(:id)',
      { replacements: { id: req.params.id } }
    );

    if (!results[0]) {
      return res.status(404).json({ message: 'Parámetro no encontrado' });
    }

    await sequelize.query(
      'CALL sp_delete_parameter(:id)',
      { replacements: { id: req.params.id } }
    );

    res.json({ message: 'Parámetro eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar parámetro', error: error.message });
  }
};
