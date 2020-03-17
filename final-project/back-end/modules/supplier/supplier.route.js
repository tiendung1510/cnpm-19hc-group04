const express = require('express');
const router = express.Router({});
const SupplierController = require('./supplier.controller');
const checkTokenMiddleware = require('../../middlewares/check-token.middleware');

router.get('/', checkTokenMiddleware, SupplierController.getSuppliers);
router.post('/', checkTokenMiddleware, SupplierController.addSupplier);

module.exports = router;