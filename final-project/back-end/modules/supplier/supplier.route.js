const express = require('express');
const router = express.Router({});
const SupplierController = require('./supplier.controller');
const checkTokenMiddleware = require('../../middlewares/check-token.middleware');
const checkImporterRoleMiddleware = require('../../middlewares/check-importer-role.middleware');

router.get('/', checkTokenMiddleware, SupplierController.getSuppliers);
router.post('/', checkTokenMiddleware, checkImporterRoleMiddleware, SupplierController.addSupplier);
router.put('/:supplierID', checkTokenMiddleware, checkImporterRoleMiddleware, SupplierController.updateSupplier);
router.delete('/:supplierID', checkTokenMiddleware, checkImporterRoleMiddleware, SupplierController.removeSupplier);

module.exports = router;