const fs = require('fs');
const { Product, Category, Price, Inventory, ProductPhoto, sequelize } = require('../models');

// @desc    Obtener todos los productos
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        { model: Category, as: 'category' },
        { model: Price, as: 'price' },
        { model: Inventory, as: 'inventory' }
      ]
    });

    // Mapear para mantener el formato antiguo para el frontend
    const mappedProducts = products.map(p => {
      const data = p.toJSON();
      return {
        id: data.id,
        name: data.name,
        description: data.description,
        price: data.price ? data.price.base_amount : 0,
        stock: data.inventory && data.inventory.length > 0 ? data.inventory[0].stock : 0,
        category_id: data.category_id,
        category: data.category,
        image_url: `/api/products/${data.id}/image` // Nueva URL para servir la imagen binaria
      };
    });

    res.json(mappedProducts);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener productos', error: error.message });
  }
};

// @desc    Obtener un producto por ID
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        { model: Category, as: 'category' },
        { model: Price, as: 'price' },
        { model: Inventory, as: 'inventory' }
      ]
    });
    
    if (product) {
      const data = product.toJSON();
      res.json({
        id: data.id,
        name: data.name,
        description: data.description,
        price: data.price ? data.price.base_amount : 0,
        stock: data.inventory && data.inventory.length > 0 ? data.inventory[0].stock : 0,
        category_id: data.category_id,
        category: data.category,
        image_url: `/api/products/${data.id}/image`
      });
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el producto', error: error.message });
  }
};

// @desc    Obtener la imagen de un producto
// @route   GET /api/products/:id/image
// @access  Public
exports.getProductImage = async (req, res) => {
  try {
    const photo = await ProductPhoto.findOne({ where: { product_id: req.params.id } });
    if (photo && photo.photo) {
      res.set('Content-Type', 'image/jpeg');
      res.send(photo.photo);
    } else {
      res.status(404).send('Not found');
    }
  } catch (error) {
    res.status(500).send('Error');
  }
};

// @desc    Crear un producto
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { name, description, price, stock, category_id } = req.body;

    // 1. Crear Precio
    const newPrice = await Price.create({
      base_amount: price || 0,
      total_amount: price || 0
    }, { transaction });

    // 2. Crear Producto
    const product = await Product.create({
      name,
      description,
      category_id: category_id || null,
      price_id: newPrice.id,
      status: 'A'
    }, { transaction });

    // 3. Crear Inventario
    await Inventory.create({
      product_id: product.id,
      stock: stock || 0
    }, { transaction });

    // 4. Guardar Foto si existe
    if (req.file) {
      const fileData = fs.readFileSync(req.file.path);
      await ProductPhoto.create({
        product_id: product.id,
        format: req.file.mimetype,
        photo: fileData
      }, { transaction });
    }

    await transaction.commit();
    res.status(201).json({ message: 'Producto creado exitosamente', id: product.id });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: 'Error al crear producto', error: error.message });
  }
};

// @desc    Actualizar un producto
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { name, description, price, stock, category_id } = req.body;
    const product = await Product.findByPk(req.params.id, { transaction });

    if (!product) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    product.name = name || product.name;
    product.description = description !== undefined ? description : product.description;
    product.category_id = category_id !== undefined ? category_id : product.category_id;
    await product.save({ transaction });

    // Actualizar Precio
    if (price !== undefined) {
      const prodPrice = await Price.findByPk(product.price_id, { transaction });
      if (prodPrice) {
        prodPrice.base_amount = price;
        prodPrice.total_amount = price;
        await prodPrice.save({ transaction });
      }
    }

    // Actualizar Inventario
    if (stock !== undefined) {
      let inv = await Inventory.findOne({ where: { product_id: product.id }, transaction });
      if (inv) {
        inv.stock = stock;
        await inv.save({ transaction });
      } else {
        await Inventory.create({ product_id: product.id, stock }, { transaction });
      }
    }

    // Actualizar Foto
    if (req.file) {
      const fileData = fs.readFileSync(req.file.path);
      let photo = await ProductPhoto.findOne({ where: { product_id: product.id }, transaction });
      if (photo) {
        photo.photo = fileData;
        photo.format = req.file.mimetype;
        await photo.save({ transaction });
      } else {
        await ProductPhoto.create({
          product_id: product.id,
          format: req.file.mimetype,
          photo: fileData
        }, { transaction });
      }
    }

    await transaction.commit();
    res.json({ message: 'Producto actualizado' });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: 'Error al actualizar producto', error: error.message });
  }
};

// @desc    Eliminar un producto
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const product = await Product.findByPk(req.params.id, { transaction });

    if (!product) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    const price_id = product.price_id;

    await ProductPhoto.destroy({ where: { product_id: product.id }, transaction });
    await Inventory.destroy({ where: { product_id: product.id }, transaction });
    await product.destroy({ transaction });
    if (price_id) {
      await Price.destroy({ where: { id: price_id }, transaction });
    }

    await transaction.commit();
    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: 'Error al eliminar producto', error: error.message });
  }
};
