const router = require('express').Router({});
const productActionLogController = require('./product-action-log.controller');
const checkTokenMiddleware = require('../../middlewares/check-token.middleware');
const checkImporterRoleMiddleware = require('../../middlewares/check-importer-role.middleware');

router.get('/', checkTokenMiddleware, checkImporterRoleMiddleware, productActionLogController.getProductActionLogs);

module.exports = router;