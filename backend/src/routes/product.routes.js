const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { protect, admin } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

router.route('/')
  .get(productController.getProducts)
  .post(protect, admin, upload.single('image'), productController.createProduct);

router.route('/:id')
  .get(productController.getProductById)
  .put(protect, admin, upload.single('image'), productController.updateProduct)
  .delete(protect, admin, productController.deleteProduct);

router.route('/:id/image')
  .get(productController.getProductImage);

module.exports = router;
