const express = require('express');
const router = express.Router();
const { getParameters, getParameterById, createParameter, updateParameter, deleteParameter } = require('../controllers/parameter.controller');
const { protect, admin } = require('../middlewares/auth.middleware');

router.get('/', getParameters);
router.get('/:id', getParameterById);
router.post('/', protect, admin, createParameter);
router.put('/:id', protect, admin, updateParameter);
router.delete('/:id', protect, admin, deleteParameter);

module.exports = router;
