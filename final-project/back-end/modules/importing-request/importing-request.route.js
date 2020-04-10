const router = require('express').Router({});
const checkTokenMiddleware = require('../../middlewares/check-token.middleware');
const checkCashierRoleMiddleware = require('../../middlewares/check-cashier-role.middleware');
const importingRequestController = require('./importing-request.controller');

router.post('/', checkTokenMiddleware, checkCashierRoleMiddleware, importingRequestController.createImportingRequest);

module.exports = router;