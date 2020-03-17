const express = require('express');
const router = express.Router({});
const checkTokenMiddleware = require('../../middlewares/check-token.middleware');
const ProductController = require('./product.controller');

router.get('/', checkTokenMiddleware, ProductController.getProducts);
router.post('/', checkTokenMiddleware, ProductController.addProduct);

module.exports = router;
